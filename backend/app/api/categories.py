from typing import Any, Dict, List
from fastapi import APIRouter, Query
from ..schemas.recipe import RecipeSummary
from ..services.recipe_service import recipe_service

router = APIRouter(tags=["Categories & Discovery"])


@router.get("/categories", response_model=Dict[str, List[str]])
async def get_categories():
    """Returns supported recipe discovery filters, cuisines, and dietary categories."""
    return recipe_service.get_categories()


@router.get("/discover", response_model=List[RecipeSummary])
async def get_discover_recipes(
    number: int = Query(6, ge=1, le=20, description="Number of discovery recipes")
):
    """Returns popular curated recipes for discovery."""
    return await recipe_service.get_discover_recipes(number=number)

