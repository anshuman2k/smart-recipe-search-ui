from typing import Any, Dict, List, Optional
from ..schemas.recipe import RecipeDetail, RecipeNutrition, RecipeSummary
from ..schemas.search import (
    IngredientsSearchRequest,
    SearchRequest,
    SearchResponse,
)
from ..utils.normalization import (
    normalize_nutrition,
    normalize_recipe_detail,
    normalize_recipe_summary,
)
from .spoonacular_service import spoonacular_client

# Curated supported discovery filters for the categories endpoint
SUPPORTED_CUISINES = [
    "Indian",
    "Italian",
    "Mexican",
    "Mediterranean",
    "Chinese",
    "Japanese",
    "Thai",
    "French",
    "Greek",
    "American",
]

SUPPORTED_DIETS = [
    "Vegetarian",
    "Vegan",
    "Gluten Free",
    "Ketogenic",
    "Lacto-Vegetarian",
    "Ovo-Vegetarian",
    "Pescetarian",
    "Paleo",
]

SUPPORTED_MEAL_TYPES = [
    "Main Course",
    "Side Dish",
    "Dessert",
    "Appetizer",
    "Salad",
    "Bread",
    "Breakfast",
    "Soup",
    "Beverage",
    "Sauce",
    "Marinade",
    "Fingerfood",
    "Snack",
    "Drink",
]


class RecipeService:
    """Business service coordinating Spoonacular operations and data normalization."""

    async def search_recipes(self, request: SearchRequest) -> SearchResponse:
        raw_data = await spoonacular_client.search_recipes(
            query=request.query,
            include_ingredients=request.ingredients,
            cuisine=request.cuisine,
            diet=request.diet,
            max_ready_time=request.maxReadyTime,
            meal_type=request.type,
            sort=request.sort,
            number=request.number,
            offset=request.offset,
        )

        raw_results = raw_data.get("results", [])
        total_results = raw_data.get("totalResults", len(raw_results))

        normalized_results = [
            normalize_recipe_summary(item) for item in raw_results
        ]

        return SearchResponse(
            results=normalized_results,
            totalResults=total_results,
            offset=raw_data.get("offset", request.offset),
            number=raw_data.get("number", request.number),
        )

    async def search_by_ingredients(
        self, request: IngredientsSearchRequest
    ) -> List[RecipeSummary]:
        raw_results = await spoonacular_client.search_by_ingredients(
            ingredients=request.ingredients,
            number=request.number,
            ranking=request.ranking,
        )

        return [normalize_recipe_summary(item) for item in raw_results]

    async def get_recipe_detail(self, recipe_id: int) -> RecipeDetail:
        raw_data = await spoonacular_client.get_recipe_information(
            recipe_id=recipe_id, include_nutrition=True
        )
        return normalize_recipe_detail(raw_data)

    async def get_recipe_nutrition(
        self, recipe_id: int
    ) -> Optional[RecipeNutrition]:
        raw_data = await spoonacular_client.get_recipe_information(
            recipe_id=recipe_id, include_nutrition=True
        )
        return normalize_nutrition(raw_data)

    async def get_discover_recipes(self, number: int = 6) -> List[RecipeSummary]:
        raw_data = await spoonacular_client.get_random_recipes(
            number=number, tags="vegetarian,dinner"
        )
        # /recipes/random returns recipes under "recipes" key; complexSearch returns "results"
        raw_list = raw_data.get("recipes") or raw_data.get("results") or []
        return [normalize_recipe_summary(item) for item in raw_list]

    def get_categories(self) -> Dict[str, List[str]]:
        return {
            "cuisines": SUPPORTED_CUISINES,
            "diets": SUPPORTED_DIETS,
            "mealTypes": SUPPORTED_MEAL_TYPES,
        }


recipe_service = RecipeService()

