
export interface RecipeIngredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface RecipeInstruction {
  stepNumber: number;
  instruction: string;
}

export interface Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  cuisine: string;
  mealType: string;
  dietType: string;
  difficulty: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  imageUrl: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface SemanticSearchResult {
  recipe: Recipe;
  similarity: number;
}

export async function searchRecipes(
  query: string,
  signal?: AbortSignal
): Promise<SemanticSearchResult[]> {
  const response = await fetch(
    `/api/search?query=${encodeURIComponent(query)}`,
    { signal }
  );

  if (!response.ok) {
    throw new Error(
      `Recipe search failed (${response.status}). Please try again.`
    );
  }

  return response.json() as Promise<SemanticSearchResult[]>;
}
