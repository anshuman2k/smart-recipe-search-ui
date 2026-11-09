const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export interface RecipeIngredient {
  id?: number;
  name: string;
  amount?: number | null;
  unit?: string | null;
  original?: string | null;
  quantity?: string; // backwards compatibility
}

export interface RecipeInstruction {
  stepNumber: number;
  instruction: string;
}

export interface RecipeNutrition {
  calories?: number | null;
  protein?: string | null;
  carbohydrates?: string | null;
  fat?: string | null;
  fiber?: string | null;
}

export interface RecipeSummary {
  id: number;
  source?: string;
  title: string;
  image?: string | null;
  cuisines?: string[];
  diets?: string[];
  dishTypes?: string[];
  readyInMinutes?: number | null;
  servings?: number | null;
  difficulty?: string;
  summary?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  // UI helper getters
  cuisine?: string;
  dietType?: string;
  mealType?: string;
  imageUrl?: string | null;
  description?: string;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
}

export interface RecipeDetail extends RecipeSummary {
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  nutrition?: RecipeNutrition | null;
}

// Unified Recipe interface matching legacy and new usage
export type Recipe = RecipeDetail;

export interface SearchParams {
  query?: string;
  ingredients?: string[];
  cuisine?: string;
  diet?: string;
  maxReadyTime?: number;
  type?: string;
  sort?: string;
  number?: number;
  offset?: number;
}

export interface SearchResponse {
  results: RecipeSummary[];
  totalResults: number;
  offset: number;
  number: number;
}

export interface SemanticSearchResult {
  recipe: RecipeSummary;
  similarity?: number;
}

/**
 * Normalizes backend recipe payload to ensure all UI properties exist.
 */
export function normalizeClientRecipe(raw: any): RecipeSummary {
  const cuisines = Array.isArray(raw.cuisines) ? raw.cuisines : [];
  const diets = Array.isArray(raw.diets) ? raw.diets : [];
  const dishTypes = Array.isArray(raw.dishTypes) ? raw.dishTypes : [];
  const readyTime = raw.readyInMinutes ?? raw.prepTimeMinutes ?? 30;

  return {
    id: raw.id,
    source: raw.source || "spoonacular",
    title: raw.title || "Untitled Recipe",
    image: raw.image || raw.imageUrl || null,
    imageUrl: raw.image || raw.imageUrl || null,
    cuisines,
    diets,
    dishTypes,
    cuisine: cuisines[0] || raw.cuisine || "Various",
    dietType: diets[0] || raw.dietType || "General",
    mealType: dishTypes[0] || raw.mealType || "Main Course",
    readyInMinutes: readyTime,
    prepTimeMinutes: Math.round(readyTime * 0.4),
    cookTimeMinutes: Math.round(readyTime * 0.6),
    servings: raw.servings || 4,
    difficulty: raw.difficulty || (readyTime <= 25 ? "Easy" : readyTime <= 45 ? "Medium" : "Hard"),
    summary: raw.summary || raw.description || "",
    description: raw.summary || raw.description || "",
  };
}

/**
 * Searches recipes through the FastAPI backend.
 */
export async function searchRecipes(
  input: string | SearchParams,
  signal?: AbortSignal
): Promise<SearchResponse> {
  const isString = typeof input === "string";
  const params: SearchParams = isString ? { query: input } : input;

  const url = `${API_BASE_URL}/search`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
    signal,
  });

  if (!response.ok) {
    let errMessage = `Recipe search failed (${response.status}).`;
    try {
      const errData = await response.json();
      if (errData?.error) errMessage = errData.error;
    } catch {}
    throw new Error(errMessage);
  }

  const data: SearchResponse = await response.json();
  data.results = data.results.map(normalizeClientRecipe);
  return data;
}

/**
 * Searches recipes by pantry ingredients.
 */
export async function searchByIngredients(
  ingredients: string[],
  number: number = 12,
  signal?: AbortSignal
): Promise<RecipeSummary[]> {
  const url = `${API_BASE_URL}/search/ingredients`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredients, number }),
    signal,
  });

  if (!response.ok) {
    let errMessage = `Ingredient search failed (${response.status}).`;
    try {
      const errData = await response.json();
      if (errData?.error) errMessage = errData.error;
    } catch {}
    throw new Error(errMessage);
  }

  const data: RecipeSummary[] = await response.json();
  return data.map(normalizeClientRecipe);
}

/**
 * Retrieves complete recipe details by ID.
 */
export async function getRecipeDetails(
  recipeId: number,
  signal?: AbortSignal
): Promise<RecipeDetail> {
  const url = `${API_BASE_URL}/recipes/${recipeId}`;

  const response = await fetch(url, { signal });

  if (!response.ok) {
    let errMessage = `Failed to retrieve recipe details (${response.status}).`;
    try {
      const errData = await response.json();
      if (errData?.error) errMessage = errData.error;
    } catch {}
    throw new Error(errMessage);
  }

  const raw: RecipeDetail = await response.json();
  const summary = normalizeClientRecipe(raw);

  const ingredients: RecipeIngredient[] = (raw.ingredients || []).map((ing) => ({
    ...ing,
    quantity: ing.amount ? `${ing.amount} ${ing.unit || ""}`.trim() : ing.quantity || "",
  }));

  return {
    ...summary,
    ingredients,
    instructions: raw.instructions || [],
    nutrition: raw.nutrition || null,
  };
}

/**
 * Retrieves discover / popular recipes.
 */
export async function getDiscoverRecipes(
  number: number = 6,
  signal?: AbortSignal
): Promise<RecipeSummary[]> {
  const url = `${API_BASE_URL}/discover?number=${number}`;

  const response = await fetch(url, { signal });

  if (!response.ok) {
    let errMessage = `Failed to load discovery recipes (${response.status}).`;
    try {
      const errData = await response.json();
      if (errData?.error) errMessage = errData.error;
    } catch {}
    throw new Error(errMessage);
  }

  const data: RecipeSummary[] = await response.json();
  return data.map(normalizeClientRecipe);
}

/**
 * Checks backend API health.
 */
export async function checkBackendHealth(
  signal?: AbortSignal
): Promise<{ status: string; spoonacular_configured: boolean }> {
  const url = `${API_BASE_URL}/health`;
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error("Backend offline");
  return response.json();
}
