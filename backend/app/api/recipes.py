from fastapi import APIRouter, HTTPException, Path
from ..schemas.recipe import RecipeDetail, RecipeNutrition
from ..services.recipe_service import recipe_service

router = APIRouter(prefix="/recipes", tags=["Recipes"])


@router.get("/{recipe_id}", response_model=RecipeDetail)
async def get_recipe_by_id(
    recipe_id: int = Path(..., description="Spoonacular recipe ID")
):
    """Retrieve complete recipe details including ingredients, instructions, and nutrition."""
    return await recipe_service.get_recipe_detail(recipe_id)


@router.get("/{recipe_id}/nutrition", response_model=RecipeNutrition)
async def get_recipe_nutrition(
    recipe_id: int = Path(..., description="Spoonacular recipe ID")
):
    """Retrieve standalone nutritional information for a recipe."""
    nutrition = await recipe_service.get_recipe_nutrition(recipe_id)
    if not nutrition:
        raise HTTPException(
            status_code=404,
            detail=f"Nutrition data for recipe ID {recipe_id} is unavailable.",
        )
    return nutrition

