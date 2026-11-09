from typing import List, Optional
from fastapi import APIRouter, Query
from ..schemas.recipe import RecipeSummary
from ..schemas.search import (
    IngredientsSearchRequest,
    SearchRequest,
    SearchResponse,
)
from ..services.recipe_service import recipe_service

router = APIRouter(prefix="/search", tags=["Search"])


@router.post("", response_model=SearchResponse)
async def search_recipes_post(request: SearchRequest):
    """Execute structured search with query, ingredients, cuisine, diet, and time constraints."""
    return await recipe_service.search_recipes(request)


@router.get("", response_model=SearchResponse)
async def search_recipes_get(
    query: Optional[str] = Query(None, description="Recipe title or keywords"),
    ingredients: Optional[str] = Query(None, description="Comma-separated ingredients"),
    cuisine: Optional[str] = Query(None, description="Cuisine filter"),
    diet: Optional[str] = Query(None, description="Dietary filter"),
    maxReadyTime: Optional[int] = Query(None, description="Maximum cooking time in minutes"),
    type: Optional[str] = Query(None, description="Dish type"),
    sort: Optional[str] = Query(None, description="Sort parameter"),
    number: int = Query(12, ge=1, le=50, description="Result limit"),
    offset: int = Query(0, ge=0, description="Pagination offset"),
):
    """GET variant of search for simple query parameters and URL linking."""
    ing_list = [i.strip() for i in ingredients.split(",") if i.strip()] if ingredients else None

    req = SearchRequest(
        query=query,
        ingredients=ing_list,
        cuisine=cuisine,
        diet=diet,
        maxReadyTime=maxReadyTime,
        type=type,
        sort=sort,
        number=number,
        offset=offset,
    )
    return await recipe_service.search_recipes(req)


@router.post("/ingredients", response_model=List[RecipeSummary])
async def search_by_ingredients(request: IngredientsSearchRequest):
    """Search recipes by available pantry ingredients."""
    return await recipe_service.search_by_ingredients(request)

