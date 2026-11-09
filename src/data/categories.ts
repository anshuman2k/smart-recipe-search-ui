export interface RecipeCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  recipeCount: number;
  imageUrl: string;
}

export const RECIPE_CATEGORIES: RecipeCategory[] = [
  {
    id: "indian",
    name: "Indian",
    slug: "Indian",
    description: "Rich curries, slow-cooked biryanis & warm spiced bread",
    recipeCount: 124,
    imageUrl: "/images/paneer-butter-masala.jpg",
  },
  {
    id: "italian",
    name: "Italian",
    slug: "Italian",
    description: "Handcrafted pasta, slow sauces & rustic Mediterranean herbs",
    recipeCount: 96,
    imageUrl: "/images/creamy-pasta.jpg",
  },
  {
    id: "healthy",
    name: "Healthy",
    slug: "Healthy",
    description: "Nutrient-dense grain bowls, vibrant salads & wholesome greens",
    recipeCount: 142,
    imageUrl: "/images/mediterranean-veggie-bowl.jpg",
  },
  {
    id: "high-protein",
    name: "High Protein",
    slug: "High Protein",
    description: "Macro-balanced power meals & lean satisfying fuel",
    recipeCount: 88,
    imageUrl: "/images/healthy-salad.jpg",
  },
  {
    id: "quick-meals",
    name: "Quick Meals",
    slug: "Quick",
    description: "Fresh, mouth-watering dinners ready in 25 minutes or less",
    recipeCount: 110,
    imageUrl: "/images/avocado-toast.jpg",
  },
  {
    id: "vegetarian",
    name: "Vegetarian",
    slug: "Vegetarian",
    description: "Plant-forward culinary creations bursting with natural flavor",
    recipeCount: 165,
    imageUrl: "/images/palak-paneer.jpg",
  },
];

