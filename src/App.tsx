
import { useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Clock,
  ChefHat,
  Sparkles,
  Leaf,
  ArrowRight,
  Heart,
} from "lucide-react";
import "./App.css";
import { searchRecipes } from "./services/recipeApi";
import type { SemanticSearchResult } from "./services/recipeApi";

function getRecipeEmoji(cuisine?: string, mealType?: string): string {
  const value = `${cuisine ?? ""} ${mealType ?? ""}`.toLowerCase();

  if (value.includes("indian")) return "🍛";
  if (value.includes("italian")) return "🍝";
  if (value.includes("breakfast")) return "🥞";
  if (value.includes("salad")) return "🥗";
  if (value.includes("dessert")) return "🍰";

  return "🍲";
}

function App() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [results, setResults] = useState<SemanticSearchResult[]>([]);
  const [saved, setSaved] = useState<number[]>([]);
  const [maxTime, setMaxTime] = useState("Any");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!submittedQuery) {
      setResults([]);
      setLoading(false);
      setError("");
      return;
    }

    const controller = new AbortController();

    async function loadRecipes() {
      setLoading(true);
      setError("");

      try {
        const data = await searchRecipes(submittedQuery, controller.signal);
        setResults(data);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while searching recipes."
        );
        setResults([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadRecipes();

    return () => controller.abort();
  }, [submittedQuery]);

  const filteredRecipes = results.filter(({ recipe }) => {
    const totalTime =
      (recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0);

    return maxTime === "Any" || totalTime <= Number(maxTime);
  });

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError("Enter an ingredient or describe what you want to eat.");
      setSubmittedQuery("");
      setResults([]);
      return;
    }

    setSubmittedQuery(trimmedQuery);
  }

  function searchFor(term: string) {
    setQuery(term);
    setSubmittedQuery(term.trim());
    setMaxTime("Any");
  }

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="/">
          <span className="brand-icon">
            <ChefHat size={23} />
          </span>
          <span>
            recipe<span className="brand-highlight">mind</span>
          </span>
        </a>

        <nav>
          <a className="nav-active" href="#discover">Discover</a>
          <a href="#discover">Find recipes</a>
          <a href="#about">About</a>
        </nav>

        <div className="nav-badge">
          <Sparkles size={15} />
          AI-powered discovery
        </div>
      </header>

      <main>
        <section className="hero" id="discover">
          <div className="hero-content">
            <span className="eyebrow">
              <Sparkles size={15} /> YOUR PERSONAL RECIPE DISCOVERY ENGINE
            </span>

            <h1>
              Find your next
              <br />
              <span>favorite meal.</span>
            </h1>

            <p>
              Search by ingredients, cravings, or a recipe you love.
              Discover meals that match your taste.
            </p>

            <form className="search-box" onSubmit={handleSearch}>
              <Search size={21} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try “creamy pasta” or “paneer”..."
                aria-label="Search recipes"
              />
              <button type="submit" disabled={loading}>
                {loading ? "Searching..." : "Find recipes"}
                <ArrowRight size={17} />
              </button>
            </form>

            <div className="popular-searches">
              <span>Popular:</span>
              {["Pasta", "Indian", "Healthy", "Quick"].map((term) => (
                <button key={term} onClick={() => searchFor(term)}>
                  {term}
                </button>
              ))}
            </div>
          </div>

          <div className="hero-art" aria-label="Food illustration">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="food-emoji">🥘</div>
            <div className="floating-card floating-top">
              <Sparkles size={16} />
              <span>
                <strong>Smart matches</strong>
                <small>Made for your taste</small>
              </span>
            </div>
            <div className="floating-card floating-bottom">
              <span className="match-score">AI</span>
              <span>
                <strong>Recipe match</strong>
                <small>Ranked by similarity</small>
              </span>
            </div>
          </div>
        </section>

        <section className="recipes-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">
                EXPLORE SOMETHING DELICIOUS
              </span>
              <h2>
                {submittedQuery
                  ? `Results for "${submittedQuery}"`
                  : "Discover recipes"}
              </h2>
              <p>
                {submittedQuery
                  ? "Recipes ranked by how closely they match your search."
                  : "Search for ingredients, cuisines, or meals to get started."}
              </p>
            </div>

            <label className="time-filter">
              <SlidersHorizontal size={17} />
              <select
                value={maxTime}
                onChange={(event) => setMaxTime(event.target.value)}
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
              <h3>Finding your next favorite meal...</h3>
              <p>Searching for recipes that match your taste.</p>
            </div>
          )}

          {!loading && error && (
            <div className="empty-state" role="alert">
              <span>⚠️</span>
              <h3>We couldn't complete your search</h3>
              <p>{error}</p>
              <button onClick={() => searchFor(submittedQuery || query)}>
                Try again
              </button>
            </div>
          )}

          {!loading && !error && submittedQuery && filteredRecipes.length > 0 && (
            <div className="recipe-grid">
              {filteredRecipes.map(({ recipe, similarity }) => {
                const totalTime =
                  (recipe.prepTimeMinutes ?? 0) +
                  (recipe.cookTimeMinutes ?? 0);
                const isSaved = saved.includes(recipe.id);
                const tags = [
                  recipe.cuisine,
                  recipe.dietType,
                  recipe.mealType,
                ].filter((tag): tag is string => Boolean(tag));

                return (
                  <article className="recipe-card" key={recipe.id}>
                    <div
                      className={`recipe-art recipe-art-${recipe.id % 3 + 1}`}
                    >
                      {recipe.imageUrl ? (
                        <img
                          className="recipe-image"
                          src={recipe.imageUrl}
                          alt={recipe.title}
                        />
                      ) : (
                        <span className="recipe-emoji">
                          {getRecipeEmoji(recipe.cuisine, recipe.mealType)}
                        </span>
                      )}

                      <button
                        type="button"
                        className={`save-button ${isSaved ? "saved" : ""}`}
                        onClick={() =>
                          setSaved((previous) =>
                            isSaved
                              ? previous.filter((id) => id !== recipe.id)
                              : [...previous, recipe.id]
                          )
                        }
                        aria-label={isSaved ? "Unsave recipe" : "Save recipe"}
                      >
                        <Heart
                          size={19}
                          fill={isSaved ? "currentColor" : "none"}
                        />
                      </button>

                      <span className="match-pill">
                        <Sparkles size={13} />
                        {`${Math.round(similarity * 100)}% match`}
                      </span>
                    </div>

                    <div className="recipe-info">
                      <div className="recipe-tags">
                        {tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>

                      <h3>{recipe.title}</h3>
                      <p>{recipe.description}</p>

                      <div className="recipe-footer">
                        <span>
                          <Clock size={16} />
                          {totalTime} min
                        </span>
                        <span>
                          <Leaf size={16} />
                          {recipe.difficulty || "Not specified"}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {!loading &&
            !error &&
            submittedQuery &&
            filteredRecipes.length === 0 && (
              <div className="empty-state">
                <span>🍳</span>
                <h3>No matching recipes found</h3>
                <p>
                  Try another search or choose a longer cooking-time limit.
                </p>
                <button
                  onClick={() => {
                    setQuery("");
                    setSubmittedQuery("");
                    setMaxTime("Any");
                  }}
                >
                  Clear search
                </button>
              </div>
            )}

          {!submittedQuery && !loading && !error && (
            <div className="empty-state">
              <span>🔎</span>
              <h3>What would you like to cook?</h3>
              <p>
                Search for something like “high protein vegetarian dinner”
                or “paneer with spinach”.
              </p>
            </div>
          )}
        </section>

        <section className="bottom-banner" id="about">
          <span className="banner-icon">
            <Sparkles size={22} />
          </span>
          <div>
            <h3>Not sure what to cook?</h3>
            <p>
              Tell us what you have in your kitchen. We’ll help you find a match.
            </p>
          </div>
          <button
            onClick={() => {
              document.querySelector<HTMLInputElement>(".search-box input")?.focus();
            }}
          >
            Explore recipes <ArrowRight size={17} />
          </button>
        </section>
      </main>

      <footer>
        <a className="brand footer-brand" href="/">
          <ChefHat size={20} /> recipemind
        </a>
        <span>Discover something delicious, every day.</span>
      </footer>
    </div>
  );
}

export default App;
