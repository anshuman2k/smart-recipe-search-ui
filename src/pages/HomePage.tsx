import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Clock,
  Heart,
  CheckCircle2,
  ChefHat,
  Search,
  Compass,
  Utensils,
  Leaf,
  Flame,
  Zap,
} from "lucide-react";
import { FEATURED_RECIPES } from "../data/featuredRecipes";
import { RECIPE_CATEGORIES } from "../data/categories";
import { getDiscoverRecipes } from "../services/recipeApi";
import type { RecipeSummary, RecipeDetail } from "../services/recipeApi";
import RecipeModal from "../components/RecipeModal";

export default function HomePage() {
  const navigate = useNavigate();

  const [aiQuery, setAiQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeSummary | RecipeDetail | null>(null);
  const [liveDiscoverRecipes, setLiveDiscoverRecipes] = useState<RecipeSummary[]>([]);
  const [isLiveApi, setIsLiveApi] = useState(false);

  const [saved, setSaved] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem("recipemind_saved");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Fetch real discover recipes on mount from FastAPI backend
  useEffect(() => {
    let mounted = true;
    getDiscoverRecipes(6)
      .then((data) => {
        if (mounted && data && data.length > 0) {
          setLiveDiscoverRecipes(data);
          setIsLiveApi(true);
        }
      })
      .catch(() => {
        if (mounted) setIsLiveApi(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  function toggleSaveRecipe(id: number) {
    setSaved((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      localStorage.setItem("recipemind_saved", JSON.stringify(next));
      return next;
    });
  }

  function handleAiSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clean = aiQuery.trim();
    if (clean) {
      navigate(`/find-recipes?query=${encodeURIComponent(clean)}`);
    } else {
      navigate("/find-recipes");
    }
  }

  const baseRecipes = isLiveApi && liveDiscoverRecipes.length > 0
    ? liveDiscoverRecipes
    : (FEATURED_RECIPES as any[]);

  const filteredFeatured = baseRecipes.filter((r) => {
    if (activeFilter === "All") return true;
    const cuisine = (r.cuisine || (r.cuisines && r.cuisines[0]) || "").toLowerCase();
    const diet = (r.dietType || (r.diets && r.diets[0]) || "").toLowerCase();
    const readyTime = r.readyInMinutes || 30;

    if (activeFilter === "Indian") return cuisine.includes("indian");
    if (activeFilter === "Italian") return cuisine.includes("italian");
    if (activeFilter === "Healthy") return diet.includes("vegan") || diet.includes("vegetarian") || cuisine.includes("mediterranean");
    if (activeFilter === "Quick") return readyTime <= 25;
    return true;
  });

  return (
    <div className="landing-page" id="discover">
      {/* ═══════════════════════════════════════════════
          1. HERO SECTION
          ═══════════════════════════════════════════════ */}
      <section className="hero-section">
        <div className="hero-grid">
          {/* Left Column: Copy & Actions */}
          <div className="hero-left">
            <div className="hero-eyebrow">
              <span className="eyebrow-dot" />
              <Sparkles size={14} />
              <span>YOUR PERSONAL RECIPE DISCOVERY ENGINE</span>
            </div>

            <h1 className="hero-title">
              Good food starts with{" "}
              <span className="hero-highlight">a little inspiration.</span>
            </h1>

            <p className="hero-description">
              Discover recipes that match your ingredients, cravings and lifestyle.
              Let AI help you find your next favourite meal.
            </p>

            <div className="hero-cta-group">
              <Link to="/sign-up" className="btn-hero-primary">
                <span>Get Started</span>
                <ArrowRight size={17} />
              </Link>
              <Link to="/find-recipes" className="btn-hero-secondary">
                <Compass size={17} />
                <span>Explore Recipes</span>
              </Link>
            </div>

            <div className="hero-benefits">
              <div className="benefit-item">
                <CheckCircle2 size={16} className="benefit-icon" />
                <span>Personalized discovery</span>
              </div>
              <div className="benefit-item">
                <Utensils size={16} className="benefit-icon" />
                <span>Ingredient-based search</span>
              </div>
              <div className="benefit-item">
                <Zap size={16} className="benefit-icon" />
                <span>Smart recipe matching</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Food Collage */}
          <div className="hero-right">
            <div className="hero-collage-wrap">
              {/* Background ambient glow */}
              <div className="hero-ambient-glow" />

              {/* Main prominent card: Paneer Butter Masala */}
              <div className="collage-card collage-card-main">
                <img
                  src="/images/paneer-butter-masala.jpg"
                  alt="Paneer Butter Masala with fresh naan"
                  className="collage-img"
                />
                <div className="card-overlay-tag top-left">
                  <Clock size={13} />
                  <span>35 min</span>
                </div>
                <div className="card-glass-footer">
                  <div>
                    <h4>Paneer Butter Masala</h4>
                    <p>North Indian Classic</p>
                  </div>
                  <span className="match-badge">
                    <Sparkles size={12} /> Featured Dish
                  </span>
                </div>
              </div>

              {/* Secondary overlapping card: Mediterranean Veggie Bowl */}
              <div className="collage-card collage-card-secondary">
                <img
                  src="/images/mediterranean-veggie-bowl.jpg"
                  alt="Rainbow Mediterranean Veggie Bowl"
                  className="collage-img"
                />
                <div className="card-overlay-tag top-left">
                  <Clock size={13} />
                  <span>20 min</span>
                </div>
                <div className="card-overlay-tag bottom-left-pill">
                  <Leaf size={13} />
                  <span>High Fiber Bowl</span>
                </div>
              </div>

              {/* Floating accent badge: Creamy Pasta */}
              <div className="collage-card collage-card-mini">
                <img
                  src="/images/creamy-pasta.jpg"
                  alt="Creamy Garlic Mushroom Fettuccine"
                  className="collage-img"
                />
                <div className="mini-card-text">
                  <strong>Italian Pasta</strong>
                  <small>Fresh inspiration</small>
                </div>
              </div>

              {/* Decorative floating badges */}
              <div className="floating-badge badge-taste">
                <div className="badge-icon-wrap">
                  <ChefHat size={16} />
                </div>
                <div>
                  <strong>Made for your taste</strong>
                  <small>Personalized palate</small>
                </div>
              </div>

              <div className="floating-badge badge-smart">
                <div className="badge-icon-wrap badge-spark">
                  <Sparkles size={16} />
                </div>
                <div>
                  <strong>Smart recipe matches</strong>
                  <small>Ranked by similarity</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2. FEATURED RECIPES SECTION
          ═══════════════════════════════════════════════ */}
      <section className="featured-section" id="recipes">
        <div className="section-head-wrap">
          <div>
            <span className="section-kicker">
              {isLiveApi ? "LIVE SPOONACULAR DISCOVERY" : "CURATED COLLECTION"}
            </span>
            <h2 className="section-title">Something delicious awaits.</h2>
            <p className="section-subtitle">
              {isLiveApi
                ? "Popular dishes discovered live from the recipe engine."
                : "Explore dishes worth making."}
            </p>
          </div>

          <div className="filter-pills-bar">
            {["All", "Indian", "Italian", "Healthy", "Quick"].map((filter) => (
              <button
                key={filter}
                type="button"
                className={`filter-pill ${activeFilter === filter ? "active" : ""}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter === "Quick" ? "Under 25 Mins" : filter}
              </button>
            ))}
          </div>
        </div>

        <div className="recipe-cards-grid">
          {filteredFeatured.map((recipe) => {
            const isSaved = saved.includes(recipe.id);
            const totalTime = recipe.readyInMinutes || 30;
            const displayImage = recipe.image || recipe.imageUrl || "/images/paneer-butter-masala.jpg";
            const cuisineTag = recipe.cuisine || (recipe.cuisines && recipe.cuisines[0]) || "Culinary";
            const dietTag = recipe.dietType || (recipe.diets && recipe.diets[0]) || "Healthy";

            return (
              <article className="food-recipe-card" key={recipe.id}>
                <div className="food-card-media">
                  <img
                    src={displayImage}
                    alt={recipe.title}
                    className="food-card-img"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/paneer-butter-masala.jpg";
                    }}
                  />
                  <div className="food-card-time-badge">
                    <Clock size={13} />
                    <span>{totalTime} min</span>
                  </div>

                  <button
                    type="button"
                    className={`card-save-btn ${isSaved ? "saved" : ""}`}
                    onClick={() => toggleSaveRecipe(recipe.id)}
                    aria-label={isSaved ? "Unsave recipe" : "Save recipe"}
                  >
                    <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
                  </button>
                </div>

                <div className="food-card-content">
                  <div className="food-card-meta">
                    <span className="cuisine-tag">{cuisineTag}</span>
                    <span className="diet-tag">{dietTag}</span>
                  </div>

                  <h3 className="food-card-title">{recipe.title}</h3>
                  <p className="food-card-desc">
                    {recipe.summary || recipe.description || "A delicious dish crafted for your kitchen."}
                  </p>

                  <div className="food-card-footer">
                    <div className="food-card-info">
                      <span>
                        <Flame size={14} />
                        {recipe.difficulty || "Easy"}
                      </span>
                      <span>
                        <Utensils size={14} />
                        {recipe.servings || 4} Servings
                      </span>
                    </div>

                    <button
                      type="button"
                      className="btn-view-recipe"
                      onClick={() => setSelectedRecipe(recipe)}
                    >
                      <span>View Recipe</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="featured-bottom-action">
          <Link to="/find-recipes" className="btn-explore-catalog">
            <span>Browse All Recipes in Catalog</span>
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          3. HOW IT WORKS SECTION
          ═══════════════════════════════════════════════ */}
      <section className="how-it-works-section">
        <div className="section-head-centered">
          <span className="section-kicker">EFFORTLESS EXPERIENCE</span>
          <h2 className="section-title">Your next favourite meal, in three simple steps.</h2>
          <p className="section-subtitle">
            Say goodbye to recipe fatigue. RecipeMind turns pantry chaos into dinner triumph.
          </p>
        </div>

        <div className="steps-grid">
          {/* Step 1 */}
          <div className="step-card">
            <div className="step-header">
              <span className="step-number">01</span>
              <div className="step-icon-box">
                <Search size={22} />
              </div>
            </div>
            <h3 className="step-title">Tell us what you're craving.</h3>
            <p className="step-desc">
              Describe a dish, list stray ingredients sitting in your fridge, or specify your cuisine and dietary preferences.
            </p>
          </div>

          {/* Step 2 */}
          <div className="step-card">
            <div className="step-header">
              <span className="step-number">02</span>
              <div className="step-icon-box">
                <Sparkles size={22} />
              </div>
            </div>
            <h3 className="step-title">Let RecipeMind explore.</h3>
            <p className="step-desc">
              Our semantic AI engine analyzes flavor combinations, pantry compatibility, and cooking techniques in real time.
            </p>
          </div>

          {/* Step 3 */}
          <div className="step-card">
            <div className="step-header">
              <span className="step-number">03</span>
              <div className="step-icon-box">
                <ChefHat size={22} />
              </div>
            </div>
            <h3 className="step-title">Discover your perfect match.</h3>
            <p className="step-desc">
              Receive beautifully ranked recipes with exact step-by-step instructions, prep times, and interactive ingredient checklists.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          4. EXPLORE BY CATEGORY SECTION
          ═══════════════════════════════════════════════ */}
      <section className="categories-section">
        <div className="section-head-wrap">
          <div>
            <span className="section-kicker">TASTE PROFILES</span>
            <h2 className="section-title">Explore by Category</h2>
            <p className="section-subtitle">
              Browse hand-picked collections crafted for every mood and lifestyle.
            </p>
          </div>
          <Link to="/find-recipes" className="link-see-all">
            <span>View All Categories</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="categories-grid">
          {RECIPE_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="category-card"
              onClick={() =>
                navigate(`/find-recipes?category=${encodeURIComponent(cat.slug)}`)
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate(`/find-recipes?category=${encodeURIComponent(cat.slug)}`);
                }
              }}
            >
              <div className="category-img-wrap">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="category-img"
                  loading="lazy"
                />
                <div className="category-img-overlay" />
                <span className="category-count">{cat.recipeCount}+ dishes</span>
              </div>
              <div className="category-content">
                <div className="category-title-row">
                  <h4>{cat.name}</h4>
                  <ArrowRight size={16} className="category-arrow" />
                </div>
                <p>{cat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          5. AI DISCOVERY PROMOTION SECTION
          ═══════════════════════════════════════════════ */}
      <section className="ai-discovery-section">
        <div className="ai-discovery-card">
          <div className="ai-card-content">
            <span className="eyebrow eyebrow-light">
              <Sparkles size={14} /> AI-POWERED INGREDIENT MATCHING
            </span>
            <h2 className="ai-discovery-title">
              Not sure what to cook? <br />
              <span>We've got ideas.</span>
            </h2>
            <p className="ai-discovery-desc">
              Tell us what's in your kitchen, describe what you're craving, and discover recipes that fit your preferences.
            </p>

            <form className="ai-search-form" onSubmit={handleAiSearchSubmit}>
              <Search size={22} className="ai-search-icon" />
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Try paneer, spinach and tomatoes..."
                aria-label="Ask RecipeMind AI"
              />
              <button type="submit" className="btn-ai-search">
                <span>Find Recipes</span>
                <ArrowRight size={17} />
              </button>
            </form>

            <div className="ai-prompt-chips">
              <span className="chips-label">Quick prompts:</span>
              {[
                "High protein dinner",
                "Creamy pasta",
                "Paneer with spinach",
                "Under 20 minutes",
                "Healthy vegetarian",
              ].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="prompt-chip"
                  onClick={() =>
                    navigate(`/find-recipes?query=${encodeURIComponent(prompt)}`)
                  }
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          6. FINAL CONVERSION SECTION
          ═══════════════════════════════════════════════ */}
      <section className="conversion-section">
        <div className="conversion-card">
          <div className="conversion-inner">
            <div className="conversion-icon-badge">
              <ChefHat size={32} />
            </div>

            <h2 className="conversion-title">
              Make every meal a little more inspiring.
            </h2>
            <p className="conversion-desc">
              Join RecipeMind and discover recipes tailored to the way you eat.
              Save your favorites, organize your kitchen, and fall in love with home cooking again.
            </p>

            <div className="conversion-actions">
              <Link to="/sign-up" className="btn-conversion-primary">
                <span>Create Your Free Account</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/sign-in" className="btn-conversion-secondary">
                <span>Already have an account? Sign In</span>
              </Link>
            </div>

            <div className="conversion-trust-row">
              <div className="trust-pill">
                <CheckCircle2 size={14} /> Free forever plan
              </div>
              <div className="trust-pill">
                <CheckCircle2 size={14} /> No credit card required
              </div>
              <div className="trust-pill">
                <CheckCircle2 size={14} /> Instant AI matching
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Detail Modal */}
      <RecipeModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        isSaved={selectedRecipe ? saved.includes(selectedRecipe.id) : false}
        onToggleSave={toggleSaveRecipe}
      />
    </div>
  );
}
