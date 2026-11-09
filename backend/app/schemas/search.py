from typing import List, Optional
from pydantic import BaseModel, Field
from .recipe import RecipeSummary


class SearchRequest(BaseModel):
    query: Optional[str] = None
    ingredients: Optional[List[str]] = None
    cuisine: Optional[str] = None
    diet: Optional[str] = None
    maxReadyTime: Optional[int] = None
    type: Optional[str] = None
    sort: Optional[str] = None
    number: int = Field(default=12, ge=1, le=50)
    offset: int = Field(default=0, ge=0)


class SearchResponse(BaseModel):
    results: List[RecipeSummary]
    totalResults: int
    offset: int
    number: int


class IngredientsSearchRequest(BaseModel):
    ingredients: List[str] = Field(..., min_length=1)
    number: int = Field(default=12, ge=1, le=50)
    ranking: int = Field(default=1, ge=1, le=2)


class HealthResponse(BaseModel):
    status: str
    service: str = "RecipeMind Backend"
    environment: str
    spoonacular_configured: bool

