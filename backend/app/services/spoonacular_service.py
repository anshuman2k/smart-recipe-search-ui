import logging
import time
from typing import Any, Dict, List, Optional
import httpx
from ..core.config import settings
from ..core.exceptions import RecipeNotFoundError, SpoonacularAPIError

logger = logging.getLogger("recipemind.spoonacular")


class SpoonacularClient:
    """Reusable asynchronous client for Spoonacular Food API with TTL in-memory caching."""

    def __init__(self):
        self._client: Optional[httpx.AsyncClient] = None
        self._cache: Dict[str, Dict[str, Any]] = {}
        self._cache_ttl = 300  # 5 minutes TTL

    async def get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                base_url=settings.SPOONACULAR_BASE_URL,
                timeout=httpx.Timeout(settings.TIMEOUT_SECONDS, connect=5.0),
                headers={"Accept": "application/json"},
            )
        return self._client

    async def close(self):
        if self._client and not self._client.is_closed:
            await self._client.aclose()
            self._client = None

    def _get_cache(self, key: str) -> Optional[Any]:
        entry = self._cache.get(key)
        if entry:
            if time.time() - entry["timestamp"] < self._cache_ttl:
                return entry["data"]
            del self._cache[key]
        return None

    def _set_cache(self, key: str, data: Any):
        # Prevent cache unbounded growth
        if len(self._cache) > 200:
            oldest_key = min(self._cache.keys(), key=lambda k: self._cache[k]["timestamp"])
            del self._cache[oldest_key]
        self._cache[key] = {"data": data, "timestamp": time.time()}

    async def _request(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> Any:
        api_key = settings.SPOONACULAR_API_KEY.strip()
        if not api_key:
            raise SpoonacularAPIError(
                message="SPOONACULAR_API_KEY is not configured on the backend server.",
                status_code=500,
            )

        req_params = dict(params or {})
        req_params["apiKey"] = api_key

        # Cache key generation (exclude sensitive apiKey)
        safe_params = {k: v for k, v in req_params.items() if k != "apiKey"}
        cache_key = f"{endpoint}:{sorted(safe_params.items())}"

        cached = self._get_cache(cache_key)
        if cached is not None:
            return cached

        client = await self.get_client()

        try:
            response = await client.get(endpoint, params=req_params)
        except httpx.TimeoutException:
            logger.error(f"Timeout contacting Spoonacular on endpoint: {endpoint}")
            raise SpoonacularAPIError(
                message="Upstream recipe service timed out. Please try again shortly.",
                status_code=504,
            )
        except httpx.RequestError as exc:
            logger.error(f"Network error contacting Spoonacular: {exc}")
            raise SpoonacularAPIError(
                message="Unable to reach the recipe service. Please check network connectivity.",
                status_code=502,
            )

        if response.status_code == 200:
            data = response.json()
            self._set_cache(cache_key, data)
            return data

        if response.status_code == 404:
            raise RecipeNotFoundError(recipe_id=endpoint.split("/")[-1])

        if response.status_code == 401:
            logger.error("Spoonacular returned 401 Unauthorized - Invalid API key.")
            raise SpoonacularAPIError(
                message="Invalid Spoonacular API key. Please check your credentials.",
                status_code=401,
            )

        if response.status_code == 402:
            logger.warning("Spoonacular returned 402 Payment Required - Quota exhausted.")
            raise SpoonacularAPIError(
                message="Spoonacular daily API quota has been reached. Please try again tomorrow.",
                status_code=429,
                is_quota_exceeded=True,
            )

        if response.status_code == 429:
            logger.warning("Spoonacular returned 429 Too Many Requests.")
            raise SpoonacularAPIError(
                message="Rate limit reached. Please wait a moment before searching again.",
                status_code=429,
            )

        # Other status codes
        error_msg = f"Spoonacular error ({response.status_code}): {response.text[:200]}"
        logger.error(error_msg)
        raise SpoonacularAPIError(
            message="Recipe provider returned an unexpected error.",
            status_code=response.status_code,
        )

    async def search_recipes(
        self,
        query: Optional[str] = None,
        include_ingredients: Optional[List[str]] = None,
        cuisine: Optional[str] = None,
        diet: Optional[str] = None,
        max_ready_time: Optional[int] = None,
        meal_type: Optional[str] = None,
        sort: Optional[str] = None,
        number: int = 12,
        offset: int = 0,
    ) -> Dict[str, Any]:
        """Search recipes using Spoonacular's complexSearch endpoint."""
        params: Dict[str, Any] = {
            "addRecipeInformation": True,
            "fillIngredients": True,
            "number": min(number, 50),
            "offset": max(offset, 0),
        }

        if query and query.strip():
            params["query"] = query.strip()
        if include_ingredients:
            params["includeIngredients"] = ",".join(i.strip() for i in include_ingredients if i.strip())
        if cuisine and cuisine.strip():
            params["cuisine"] = cuisine.strip()
        if diet and diet.strip():
            params["diet"] = diet.strip()
        if max_ready_time and max_ready_time > 0:
            params["maxReadyTime"] = max_ready_time
        if meal_type and meal_type.strip():
            params["type"] = meal_type.strip()
        if sort and sort.strip():
            params["sort"] = sort.strip()

        return await self._request("/recipes/complexSearch", params)

    async def search_by_ingredients(
        self,
        ingredients: List[str],
        number: int = 12,
        ranking: int = 1,
    ) -> List[Dict[str, Any]]:
        """Search recipes by available pantry ingredients."""
        params: Dict[str, Any] = {
            "ingredients": ",".join(i.strip() for i in ingredients if i.strip()),
            "number": min(number, 50),
            "ranking": ranking,
            "ignorePantry": True,
        }
        return await self._request("/recipes/findByIngredients", params)

    async def get_recipe_information(
        self, recipe_id: int, include_nutrition: bool = True
    ) -> Dict[str, Any]:
        """Retrieve full recipe details including instructions and optional nutrition."""
        params = {"includeNutrition": include_nutrition}
        return await self._request(f"/recipes/{recipe_id}/information", params)

    async def get_random_recipes(
        self, number: int = 6, tags: Optional[str] = None
    ) -> Dict[str, Any]:
        """Fetch popular / discover recipes."""
        params: Dict[str, Any] = {"number": min(number, 20)}
        if tags and tags.strip():
            params["tags"] = tags.strip()

        try:
            return await self._request("/recipes/random", params)
        except SpoonacularAPIError as exc:
            # Fall back to complexSearch with popularity sort if /random is restricted
            logger.info("Random endpoint failed, falling back to complexSearch with popularity sort.")
            return await self.search_recipes(sort="popularity", number=number)


spoonacular_client = SpoonacularClient()

