from typing import List, Optional
from pydantic import BaseModel, Field


class RecipeIngredient(BaseModel):
    id: Optional[int] = None
    name: str
    amount: Optional[float] = None
    unit: Optional[str] = ""
    original: Optional[str] = None


class RecipeInstruction(BaseModel):
    stepNumber: int
    instruction: str


class RecipeNutrition(BaseModel):
    calories: Optional[float] = None
    protein: Optional[str] = None
    carbohydrates: Optional[str] = None
    fat: Optional[str] = None
    fiber: Optional[str] = None


class RecipeSummary(BaseModel):
    id: int
    source: str = "spoonacular"
    title: str
    image: Optional[str] = None
    cuisines: List[str] = Field(default_factory=list)
    diets: List[str] = Field(default_factory=list)
    dishTypes: List[str] = Field(default_factory=list)
    readyInMinutes: Optional[int] = None
    servings: Optional[int] = None
    difficulty: Optional[str] = "Easy"
    summary: Optional[str] = None


class RecipeDetail(RecipeSummary):
    ingredients: List[RecipeIngredient] = Field(default_factory=list)
    instructions: List[RecipeInstruction] = Field(default_factory=list)
    nutrition: Optional[RecipeNutrition] = None

