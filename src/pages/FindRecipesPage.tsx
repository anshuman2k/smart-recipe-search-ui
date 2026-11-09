import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  Clock,
  Sparkles,
  Leaf,
  ArrowRight,
  Heart,
  Eye,
  AlertCircle,
} from "lucide-react";
import { searchRecipes, searchByIngredients } from "../services/recipeApi";
import type { RecipeSummary, RecipeDetail } from "../services/recipeApi";
import { FEATURED_RECIPES } from "../data/featuredRecipes";
import RecipeModal from "../components/RecipeModal";

export default function FindRecipesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || searchParams.get("category") || "";

  const [query, setQuery] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);
  const [results, setResults] = useState<RecipeSummary[]>([]);
  const [saved, setSaved] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem("recipemind_saved");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [maxTime, setMaxTime] = useState("Any");
  const [loading, setLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeSummary | RecipeDetail | null>(null);
  const [isLiveApi, setIsLiveApi] = useState(false);

  // Sync search input if query param changes externally
  useEffect(() => {
    const q = searchParams.get("query") || searchParams.get("category") || "";
    if (q !== submittedQuery) {
      setQuery(q);
      setSubmittedQuery(q);
    }
  }, [searchParams]);

  useEffect(() => {
    localStorage.setItem("recipemind_saved", JSON.stringify(saved));
  }, [saved]);

  useEffect(() => {
    const activeSearch = submittedQuery.trim();
    const controller = new AbortController();

    async function executeSearch() {
      setLoading(true);
      setErrorNotice(null);

      // If no query specified, load initial curated dishes
      if (!activeSearch) {
        try {
          const res = await searchRecipes({ number: 12, sort: "popularity" }, controller.signal);
          if (res.results && res.results.length > 0) {
            setResults(res.results);
            setIsLiveApi(true);
          } else {
            setResults(FEATURED_RECIPES as any);
            setIsLiveApi(false);
          }
        } catch {
          setResults(FEATURED_RECIPES as any);
          setIsLiveApi(false);
        } finally {
          setLoading(false);
        }
        return;
      }

      try {
        // Detect if user entered comma-separated ingredients
        const isIngredientList = activeSearch.includes(",") && activeSearch.split(",").length > 1;

        if (isIngredientList) {
          const ingList = activeSearch.split(",").map((i) => i.trim()).filter(Boolean);
          const ingredientResults = await searchByIngredients(ingList, 15, controller.signal);
          setResults(ingredientResults);
          setIsLiveApi(true);
        } else {
          const parsedTime = maxTime !== "Any" ? Number(maxTime) : undefined;
          const searchData = await searchRecipes(
            {
              query: activeSearch,
              maxReadyTime: parsedTime,
              number: 15,
            },
            controller.signal
          );
          setResults(searchData.results);
          setIsLiveApi(true);
        }
      } catch (err: any) {
        if (controller.signal.aborted) return;

        // Graceful fallback: Filter curated backup list
        const lower = activeSearch.toLowerCase();
        const fallbackMatches = (FEATURED_RECIPES as any[]).filter((r) => {
          const matchTitle = (r.title || "").toLowerCase().includes(lower);
          const matchCuisine = (r.cuisine || "").toLowerCase().includes(lower);
          const matchDiet = (r.dietType || "").toLowerCase().includes(lower);
          const matchDesc = (r.description || "").toLowerCase().includes(lower);
          return matchTitle || matchCuisine || matchDiet || matchDesc;
        });

        if (fallbackMatches.length > 0) {
          setResults(fallbackMatches);
          setErrorNotice(
            `${err.message || "Live search unavailable."} Displaying curated dishes matching your search.`
          );
        } else {
          setResults([]);
          setErrorNotice(err.message || "No recipes found matching your search.");
        }
        setIsLiveApi(false);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void executeSearch();

    return () => controller.abort();
  }, [submittedQuery]);

  const filteredRecipes = useMemo(() => {
    return results.filter((recipe) => {
      const time = recipe.readyInMinutes ?? 30;
      return maxTime === "Any" || time <= Number(maxTime);
    });
  }, [results, maxTime]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clean = query.trim();
    setSubmittedQuery(clean);
    if (clean) {
      setSearchParams({ query: clean });
    } else {
      setSearchParams({});
    }
  }

  function toggleSaveRecipe(id: number) {
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  return (
    <div className="find-recipes-page">
      <div className="find-recipes-header">
        <span className="eyebrow">
          <Sparkles size={14} /> LIVE RECIPE DISCOVERY
        </span>
        <h1>
          Find exactly what you want <span>to cook.</span>
        </h1>
        <p>
          Search by whole ingredients in your kitchen, dietary preferences, or specific cravings. Powered by Spoonacular.
        </p>

        <form className="search-box search-box-large" onSubmit={handleSearchSubmit}>
          <Search size={22} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try 'paneer and tomatoes', 'pasta', or 'paneer, spinach, onion'..."
            aria-label="Search recipes"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Find recipes"}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="popular-searches">
          <span>Popular searches:</span>
          {["Pasta", "Paneer", "Indian", "Healthy", "Biryani", "Vegetarian"].map(
            (term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setQuery(term);
                  setSubmittedQuery(term);
                  setSearchParams({ query: term });
                }}
              >
                {term}
              </button>
            )
          )}
        </div>
      </div>

      {errorNotice && (
        <div className="notice-banner">
          <AlertCircle size={16} />
          <span>{errorNotice}</span>
        </div>
      )}

      <div className="recipes-section" style={{ borderTop: "none", paddingTop: 10 }}>
        <div className="section-heading">
          <div>
            <span className="section-kicker">
              {submittedQuery
                ? `RESULTS FOR "${submittedQuery}" (${filteredRecipes.length})`
                : `DISCOVER DISHES (${filteredRecipes.length})`}
            </span>
            <h2>
              {submittedQuery
                ? `Recipes matching "${submittedQuery}"`
                : "Explore Recommended Recipes"}
            </h2>
            <p>
              {isLiveApi
                ? "Live culinary results from Spoonacular Recipe API."
                : "Curated recipes tailored to inspire your cooking."}
            </p>
          </div>

          <label className="time-filter">
            <SlidersHorizontal size={17} />
            <select
              value={maxTime}
              onChange={(e) => setMaxTime(e.target.value)}
              aria-label="Maximum cooking time"
            >
              <option value="Any">Any cooking time</option>
              <option value="15">Under 15 minutes</option>
              <option value="30">Under 30 minutes</option>
              <option value="45">Under 45 minutes</option>
            </select>
          </label>
        </div>

        {loading && (
          <div className="empty-state" role="status">
            <span>🍳</span>
            <h3>Searching Spoonacular recipes...</h3>
            <p>Gathering fresh ingredients, preparation times, and culinary instructions.</p>
          </div>
        )}

        {!loading && filteredRecipes.length > 0 && (
          <div className="recipe-grid">
            {filteredRecipes.map((recipe) => {
              const readyTime = recipe.readyInMinutes ?? 30;
              const isSaved = saved.includes(recipe.id);
              const tags = [
                ...(recipe.cuisines || []),
                ...(recipe.diets || []),
                ...(recipe.dishTypes || []),
              ].filter(Boolean);

              const displayImage =
                recipe.image || recipe.imageUrl || "/images/paneer-butter-masala.jpg";

              return (
                <article className="recipe-card" key={recipe.id}>
                  <div className="recipe-art">
                    <img
                      className="recipe-image"
                      src={displayImage}
                      alt={recipe.title}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/images/paneer-butter-masala.jpg";
                      }}
                    />

                    <button
                      type="button"
                      className={`save-button ${isSaved ? "saved" : ""}`}
                      onClick={() => toggleSaveRecipe(recipe.id)}
                      aria-label={isSaved ? "Unsave recipe" : "Save recipe"}
                    >
                      <Heart
                        size={18}
                        fill={isSaved ? "currentColor" : "none"}
                      />
                    </button>

                    <span className="match-pill">
                      <Clock size={13} />
                      {`${readyTime} min`}
                    </span>
                  </div>

                  <div className="recipe-info">
                    <div className="recipe-tags">
                      {tags.slice(0, 3).map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>

                    <h3>{recipe.title}</h3>
                    <p>{recipe.summary || recipe.description || "Freshly curated recipe."}</p>

                    <div className="recipe-footer">
                      <span>
                        <Clock size={15} />
                        {readyTime} min
                      </span>
                      <span>
                        <Leaf size={15} />
                        {recipe.difficulty || "Easy"}
                      </span>
                      <button
                        type="button"
                        className="view-recipe-btn"
                        onClick={() => setSelectedRecipe(recipe)}
                      >
                        <Eye size={14} /> View
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!loading && filteredRecipes.length === 0 && (
          <div className="empty-state">
            <span>🍳</span>
            <h3>No matching recipes found</h3>
            <p>Try broadening your query, checking spelling, or extending the time limit.</p>
            <button
              onClick={() => {
                setQuery("");
                setSubmittedQuery("");
                setMaxTime("Any");
                setSearchParams({});
              }}
            >
              Clear search filters
            </button>
          </div>
        )}
      </div>

      <RecipeModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        isSaved={selectedRecipe ? saved.includes(selectedRecipe.id) : false}
        onToggleSave={toggleSaveRecipe}
      />
    </div>
  );
}
