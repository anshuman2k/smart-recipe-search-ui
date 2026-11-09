import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .api import categories, health, recipes, search
from .core.config import settings
from .core.exceptions import RecipeNotFoundError, SpoonacularAPIError
from .services.spoonacular_service import spoonacular_client

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("recipemind")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("RecipeMind backend starting up...")
    logger.info(f"Allowed CORS origins: {settings.ALLOWED_ORIGINS}")
    yield
    logger.info("RecipeMind backend shutting down, closing HTTP client...")
    await spoonacular_client.close()


app = FastAPI(
    title="RecipeMind Backend API",
    description="FastAPI backend integrating Spoonacular Recipe API for AI-powered recipe discovery.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handlers
@app.exception_handler(SpoonacularAPIError)
async def spoonacular_api_exception_handler(request: Request, exc: SpoonacularAPIError):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.message,
            "quota_exceeded": exc.is_quota_exceeded,
        },
    )


@app.exception_handler(RecipeNotFoundError)
async def recipe_not_found_exception_handler(request: Request, exc: RecipeNotFoundError):
    return JSONResponse(
        status_code=404,
        content={"error": exc.message},
    )


# Include Routers
app.include_router(health.router, prefix="/api")
app.include_router(search.router, prefix="/api")
app.include_router(recipes.router, prefix="/api")
app.include_router(categories.router, prefix="/api")


@app.get("/")
async def root():
    return {
        "service": "RecipeMind Backend API",
        "status": "online",
        "documentation": "/docs",
        "health": "/api/health",
    }

