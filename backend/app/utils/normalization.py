import re
from typing import Any, Dict, List, Optional
from ..schemas.recipe import (
    RecipeDetail,
    RecipeIngredient,
    RecipeInstruction,
    RecipeNutrition,
    RecipeSummary,
)

HTML_TAG_RE = re.compile(r"<[^>]+>")


def clean_html(text: Optional[str]) -> Optional[str]:
    """Strip HTML markup from Spoonacular summary/description text."""
    if not text:
        return None
    cleaned = HTML_TAG_RE.sub("", text)
    # Collapse multiple whitespaces
    return " ".join(cleaned.split()).strip()


def calculate_difficulty(
    ready_in_minutes: Optional[int], ingredients_count: int
) -> str:
    """Heuristic difficulty determination based on cooking duration and ingredient count."""
    time = ready_in_minutes or 30
    if time <= 20 and ingredients_count <= 6:
        return "Easy"
    if time <= 45 and ingredients_count <= 12:
        return "Medium"
    return "Hard"


def normalize_instructions(raw_recipe: Dict[str, Any]) -> List[RecipeInstruction]:
    """Extract step-by-step instructions in proper sequence from Spoonacular payload."""
    instructions: List[RecipeInstruction] = []

    # 1. Prefer analyzedInstructions structure
    analyzed = raw_recipe.get("analyzedInstructions")
    if analyzed and isinstance(analyzed, list) and len(analyzed) > 0:
        step_counter = 1
        for block in analyzed:
            for step in block.get("steps", []):
                instruction_text = step.get("step", "").strip()
                if instruction_text:
                    instructions.append(
                        RecipeInstruction(
                            stepNumber=step.get("number", step_counter),
                            instruction=instruction_text,
                        )
                    )
                    step_counter += 1
        if instructions:
            return instructions

    # 2. Fall back to raw instructions text string
    raw_text = raw_recipe.get("instructions")
    if raw_text and isinstance(raw_text, str):
        cleaned = clean_html(raw_text)
        if cleaned:
            # Try splitting by numbered patterns like "1. ", "2. "
            split_steps = re.split(r"(?:^|\n|\.\s+)(?=\d+\.)", cleaned)
            step_num = 1
            for chunk in split_steps:
                chunk = re.sub(r"^\d+\.\s*", "", chunk).strip()
                if chunk and len(chunk) > 5:
                    instructions.append(
                        RecipeInstruction(
                            stepNumber=step_num,
                            instruction=chunk,
                        )
                    )
                    step_num += 1

    return instructions


def normalize_ingredients(raw_recipe: Dict[str, Any]) -> List[RecipeIngredient]:
    """Extract normalized ingredients from extendedIngredients or ingredient lists."""
    ingredients: List[RecipeIngredient] = []
    seen_names = set()

    raw_ingredients = (
        raw_recipe.get("extendedIngredients")
        or raw_recipe.get("usedIngredients", []) + raw_recipe.get("missedIngredients", [])
    )

    if not raw_ingredients or not isinstance(raw_ingredients, list):
        return ingredients

    for item in raw_ingredients:
        name = item.get("nameClean") or item.get("name") or item.get("originalName") or ""
        name = name.strip()
        if not name or name.lower() in seen_names:
            continue

        seen_names.add(name.lower())
        amount = item.get("amount")
        unit = item.get("unit") or ""
        original = item.get("original")

        ingredients.append(
            RecipeIngredient(
                id=item.get("id"),
                name=name.title(),
                amount=round(float(amount), 2) if amount is not None else None,
                unit=unit.strip(),
                original=original.strip() if original else None,
            )
        )

    return ingredients


def normalize_nutrition(raw_recipe: Dict[str, Any]) -> Optional[RecipeNutrition]:
    """Extract standard macro nutrients from Spoonacular nutrition block."""
    nutrition_block = raw_recipe.get("nutrition")
    if not nutrition_block or not isinstance(nutrition_block, dict):
        return None

    nutrients = nutrition_block.get("nutrients", [])
    if not nutrients:
        return None

    cal: Optional[float] = None
    protein: Optional[str] = None
    carbs: Optional[str] = None
    fat: Optional[str] = None
    fiber: Optional[str] = None

    for item in nutrients:
        n_name = (item.get("name") or "").lower()
        amount = item.get("amount")
        unit = item.get("unit") or ""

        if "calories" in n_name and cal is None:
            cal = round(float(amount), 1) if amount is not None else None
        elif "protein" in n_name and protein is None:
            protein = f"{round(float(amount), 1)}{unit}" if amount is not None else None
        elif "carbohydrate" in n_name and carbs is None:
            carbs = f"{round(float(amount), 1)}{unit}" if amount is not None else None
        elif n_name == "fat" and fat is None:
            fat = f"{round(float(amount), 1)}{unit}" if amount is not None else None
        elif "fiber" in n_name and fiber is None:
            fiber = f"{round(float(amount), 1)}{unit}" if amount is not None else None

    if any(val is not None for val in [cal, protein, carbs, fat, fiber]):
        return RecipeNutrition(
            calories=cal,
            protein=protein,
            carbohydrates=carbs,
            fat=fat,
            fiber=fiber,
        )
    return None


def normalize_recipe_summary(raw: Dict[str, Any]) -> RecipeSummary:
    """Normalize a single recipe summary from search or discover endpoints."""
    ready_time = raw.get("readyInMinutes")
    cuisines = [c.title() for c in raw.get("cuisines", [])]
    diets = [d.title() for d in raw.get("diets", [])]
    dish_types = [dt.title() for dt in raw.get("dishTypes", [])]

    # Clean description or summary
    summary_text = clean_html(raw.get("summary"))

    ingredients_count = len(raw.get("extendedIngredients", [])) or len(
        raw.get("usedIngredients", [])
    )
    difficulty = calculate_difficulty(ready_time, ingredients_count)

    return RecipeSummary(
        id=raw.get("id"),
        source="spoonacular",
        title=raw.get("title", "Untitled Recipe"),
        image=raw.get("image"),
        cuisines=cuisines,
        diets=diets,
        dishTypes=dish_types,
        readyInMinutes=ready_time,
        servings=raw.get("servings"),
        difficulty=difficulty,
        summary=summary_text,
    )


def normalize_recipe_detail(raw: Dict[str, Any]) -> RecipeDetail:
    """Normalize full detailed recipe information."""
    summary = normalize_recipe_summary(raw)
    ingredients = normalize_ingredients(raw)
    instructions = normalize_instructions(raw)
    nutrition = normalize_nutrition(raw)

    return RecipeDetail(
        id=summary.id,
        source=summary.source,
        title=summary.title,
        image=summary.image,
        cuisines=summary.cuisines,
        diets=summary.diets,
        dishTypes=summary.dishTypes,
        readyInMinutes=summary.readyInMinutes,
        servings=summary.servings,
        difficulty=calculate_difficulty(summary.readyInMinutes, len(ingredients)),
        summary=summary.summary,
        ingredients=ingredients,
        instructions=instructions,
        nutrition=nutrition,
    )

