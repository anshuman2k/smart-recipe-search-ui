from fastapi import APIRouter
from ..core.config import settings
from ..schemas.search import HealthResponse

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthResponse)
async def get_health():
    """Health check endpoint displaying service health without exposing credentials."""
    return HealthResponse(
        status="healthy",
        service="RecipeMind Backend",
        environment=settings.ENVIRONMENT,
        spoonacular_configured=bool(settings.SPOONACULAR_API_KEY.strip()),
    )

