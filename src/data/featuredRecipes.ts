import type { Recipe } from "../services/recipeApi";

export interface FeaturedRecipe extends Recipe {
  badge?: string;
  author?: string;
  rating?: number;
}

export const FEATURED_RECIPES: FeaturedRecipe[] = [
  {
    id: 101,
    title: "Paneer Butter Masala",
    description:
      "Tender cubes of fresh paneer simmered in a velvety tomato, butter, and cashew cream sauce infused with fragrant fenugreek and garam masala.",
    cuisine: "Indian",
    mealType: "Dinner",
    dietType: "Vegetarian",
    difficulty: "Medium",
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    servings: 4,
    imageUrl: "/images/paneer-butter-masala.jpg",
    createdAt: null,
    updatedAt: null,
    badge: "Chef's Choice",
    ingredients: [
      { name: "Paneer (cubed)", quantity: "250", unit: "g" },
      { name: "Ripe tomatoes (pureed)", quantity: "4", unit: "large" },
      { name: "Butter & Ghee", quantity: "2", unit: "tbsp" },
      { name: "Cashew paste", quantity: "3", unit: "tbsp" },
      { name: "Heavy cream", quantity: "2", unit: "tbsp" },
      { name: "Kasuri methi (dried fenugreek)", quantity: "1", unit: "tsp" },
      { name: "Garam masala & Kashmiri chili", quantity: "1.5", unit: "tsp" },
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction:
          "Heat butter in a heavy pan. Sauté ginger-garlic paste and fresh tomato puree until oil separates.",
      },
      {
        stepNumber: 2,
        instruction:
          "Stir in cashew paste, Kashmiri chili powder, and garam masala. Simmer on low flame for 5 minutes.",
      },
      {
        stepNumber: 3,
        instruction:
          "Gently fold in fresh paneer cubes and warm water to reach a silky consistency. Simmer for 4 minutes.",
      },
      {
        stepNumber: 4,
        instruction:
          "Crush kasuri methi between palms and sprinkle on top. Finish with a swirl of fresh cream and serve with hot naan.",
      },
    ],
  },
  {
    id: 102,
    title: "Creamy Garlic Mushroom Fettuccine",
    description:
      "Silky fettuccine ribbons tossed with sautéed wild cremini mushrooms, minced roasted garlic, fresh thyme, and shaved Parmigiano-Reggiano.",
    cuisine: "Italian",
    mealType: "Dinner",
    dietType: "Vegetarian",
    difficulty: "Easy",
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    servings: 2,
    imageUrl: "/images/creamy-pasta.jpg",
    createdAt: null,
    updatedAt: null,
    badge: "Popular",
    ingredients: [
      { name: "Fettuccine pasta", quantity: "250", unit: "g" },
      { name: "Cremini mushrooms (sliced)", quantity: "200", unit: "g" },
      { name: "Fresh garlic (minced)", quantity: "4", unit: "cloves" },
      { name: "Heavy cooking cream", quantity: "150", unit: "ml" },
      { name: "Parmigiano-Reggiano", quantity: "40", unit: "g" },
      { name: "Fresh thyme & cracked pepper", quantity: "1", unit: "tbsp" },
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction:
          "Boil fettuccine in generously salted water until al dente. Reserve half a cup of pasta water.",
      },
      {
        stepNumber: 2,
        instruction:
          "Sauté sliced mushrooms in olive oil and butter until deeply caramelized. Add minced garlic and thyme.",
      },
      {
        stepNumber: 3,
        instruction:
          "Pour in cream and reserved pasta water. Simmer until sauce coats the back of a spoon.",
      },
      {
        stepNumber: 4,
        instruction:
          "Toss in pasta and grated parmesan until glossy and emulsified. Garnish with cracked black pepper.",
      },
    ],
  },
  {
    id: 103,
    title: "Rainbow Mediterranean Veggie Bowl",
    description:
      "Fluffy tri-color quinoa layered with roasted spiced chickpeas, Persian cucumbers, heirloom cherry tomatoes, kalamata olives, and creamy tahini.",
    cuisine: "Healthy",
    mealType: "Lunch",
    dietType: "Vegan",
    difficulty: "Easy",
    prepTimeMinutes: 12,
    cookTimeMinutes: 8,
    servings: 2,
    imageUrl: "/images/mediterranean-veggie-bowl.jpg",
    createdAt: null,
    updatedAt: null,
    badge: "High Fiber",
    ingredients: [
      { name: "Cooked tri-color quinoa", quantity: "1.5", unit: "cups" },
      { name: "Crispy roasted chickpeas", quantity: "1", unit: "cup" },
      { name: "Persian cucumbers (sliced)", quantity: "2", unit: "medium" },
      { name: "Heirloom cherry tomatoes (halved)", quantity: "1", unit: "cup" },
      { name: "Kalamata olives & microgreens", quantity: "0.5", unit: "cup" },
      { name: "Lemon-herb tahini dressing", quantity: "3", unit: "tbsp" },
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction:
          "Fluff warm cooked quinoa with lemon zest and extra virgin olive oil as the nourishing base.",
      },
      {
        stepNumber: 2,
        instruction:
          "Arrange roasted spiced chickpeas, diced cucumbers, tomatoes, and olives in vibrant sections.",
      },
      {
        stepNumber: 3,
        instruction:
          "Drizzle generously with lemon-garlic tahini dressing and crown with purple microgreens and sesame seeds.",
      },
    ],
  },
  {
    id: 104,
    title: "Royal Vegetable Dum Biryani",
    description:
      "Aged fragrant basmati rice slow-cooked in sealed dum with marinated garden vegetables, saffron-infused milk, caramelized onions, and fresh mint.",
    cuisine: "Indian",
    mealType: "Dinner",
    dietType: "Vegetarian",
    difficulty: "Hard",
    prepTimeMinutes: 20,
    cookTimeMinutes: 30,
    servings: 4,
    imageUrl: "/images/vegetable-biryani.jpg",
    createdAt: null,
    updatedAt: null,
    badge: "Signature",
    ingredients: [
      { name: "Aged Basmati rice", quantity: "2", unit: "cups" },
      { name: "Mixed vegetables (carrots, beans, peas)", quantity: "2", unit: "cups" },
      { name: "Saffron strands soaked in milk", quantity: "2", unit: "tbsp" },
      { name: "Fried onions (birista)", quantity: "1", unit: "cup" },
      { name: "Greek yogurt & biryani spices", quantity: "0.5", unit: "cup" },
      { name: "Fresh mint and cilantro", quantity: "0.5", unit: "cup" },
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction:
          "Parboil basmati rice with whole spices (bay leaf, cloves, cardamom) until 70% cooked. Drain well.",
      },
      {
        stepNumber: 2,
        instruction:
          "Cook marinated vegetables in spiced yogurt sauce until fork-tender and fragrant.",
      },
      {
        stepNumber: 3,
        instruction:
          "Layer the vegetables and rice alternately. Crown with golden fried onions, saffron milk, and fresh herbs.",
      },
      {
        stepNumber: 4,
        instruction:
          "Seal the lid with dough or foil and cook on low dum flame for 20 minutes before serving with cucumber raita.",
      },
    ],
  },
  {
    id: 105,
    title: "Artisanal Sourdough Avocado Toast",
    description:
      "Thick-sliced toasted artisanal sourdough topped with citrus-smashed avocado, pasture-raised poached egg, everything seasoning, and micro-herbs.",
    cuisine: "Quick Meals",
    mealType: "Breakfast",
    dietType: "High Protein",
    difficulty: "Easy",
    prepTimeMinutes: 5,
    cookTimeMinutes: 5,
    servings: 1,
    imageUrl: "/images/avocado-toast.jpg",
    createdAt: null,
    updatedAt: null,
    badge: "10 Min Meal",
    ingredients: [
      { name: "Artisanal sourdough slices", quantity: "2", unit: "thick slices" },
      { name: "Ripe Haas avocado", quantity: "1", unit: "large" },
      { name: "Pasture-raised egg (poached/soft-boiled)", quantity: "1", unit: "egg" },
      { name: "Fresh lime juice", quantity: "1", unit: "tsp" },
      { name: "Crushed red chili flakes & Maldon salt", quantity: "1", unit: "pinch" },
      { name: "Hemp hearts & microgreens", quantity: "1", unit: "tbsp" },
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction:
          "Toast thick artisanal sourdough bread until deeply golden with crisp edges.",
      },
      {
        stepNumber: 2,
        instruction:
          "Coarsely mash ripe avocado with fresh lime juice, flaky sea salt, and extra virgin olive oil.",
      },
      {
        stepNumber: 3,
        instruction:
          "Spread generously over warm toast, top with a warm poached egg, and dust with chili flakes and micro-herbs.",
      },
    ],
  },
  {
    id: 106,
    title: "Creamy Palak Paneer",
    description:
      "Fresh Indian cottage cheese simmered in a spiced vibrant spinach puree gently perfumed with ginger, garlic, cumin, and a dash of cultured butter.",
    cuisine: "Indian",
    mealType: "Dinner",
    dietType: "High Protein",
    difficulty: "Medium",
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    servings: 3,
    imageUrl: "/images/palak-paneer.jpg",
    createdAt: null,
    updatedAt: null,
    badge: "Iron & Protein",
    ingredients: [
      { name: "Fresh baby spinach (blanched & pureed)", quantity: "400", unit: "g" },
      { name: "Fresh paneer (lightly golden)", quantity: "200", unit: "g" },
      { name: "Ginger & garlic (freshly pounded)", quantity: "2", unit: "tbsp" },
      { name: "Green chilies & cumin seeds", quantity: "1", unit: "tsp" },
      { name: "Garam masala & dry mango powder", quantity: "1", unit: "tsp" },
      { name: "Grass-fed butter / ghee", quantity: "2", unit: "tbsp" },
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction:
          "Blanch vibrant spinach leaves in salted boiling water for 2 minutes, then shock in ice bath to preserve green color.",
      },
      {
        stepNumber: 2,
        instruction:
          "Sauté cumin, garlic, and onions in ghee. Blend blanched spinach with green chilies into a velvety smooth puree.",
      },
      {
        stepNumber: 3,
        instruction:
          "Combine the spiced spinach reduction in pan, gently fold in paneer cubes, and simmer for 4 minutes with butter.",
      },
    ],
  },
];

