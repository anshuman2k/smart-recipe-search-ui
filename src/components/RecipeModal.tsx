import { useEffect, useState } from "react";
import {
  X,
  Clock,
  Users,
  ChefHat,
  Heart,
  CheckCircle2,
  Sparkles,
  Activity,
  Loader2,
} from "lucide-react";
import { getRecipeDetails } from "../services/recipeApi";
import type { RecipeDetail, RecipeSummary } from "../services/recipeApi";

interface RecipeModalProps {
  recipe: RecipeSummary | RecipeDetail | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: number) => void;
}

export default function RecipeModal({
  recipe,
  onClose,
  isSaved,
  onToggleSave,
}: RecipeModalProps) {
  const [checkedIngredients, setCheckedIngredients] = useState<number[]>([]);
  const [detailedRecipe, setDetailedRecipe] = useState<RecipeDetail | null>(null);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (recipe) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      setCheckedIngredients([]);

      // Check if recipe already has ingredients & instructions
      const asDetail = recipe as RecipeDetail;
      if (
        asDetail.ingredients &&
        asDetail.ingredients.length > 0 &&
        asDetail.instructions &&
        asDetail.instructions.length > 0
      ) {
        setDetailedRecipe(asDetail);
        setLoadingDetails(false);
      } else {
        // Fetch full recipe details from backend
        setLoadingDetails(true);
        const controller = new AbortController();

        getRecipeDetails(recipe.id, controller.signal)
          .then((data) => {
            setDetailedRecipe(data);
            setLoadingDetails(false);
          })
          .catch((err) => {
            console.error("Failed to fetch full recipe details:", err);
            // Fall back to displaying summary
            setDetailedRecipe({
              ...recipe,
              ingredients: (recipe as any).ingredients || [],
              instructions: (recipe as any).instructions || [],
              nutrition: (recipe as any).nutrition || null,
            });
            setLoadingDetails(false);
          });

        return () => {
          controller.abort();
        };
      }
    } else {
      setDetailedRecipe(null);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [recipe, onClose]);

  if (!recipe) return null;

  const activeRecipe = detailedRecipe || (recipe as RecipeDetail);
  const readyTime = activeRecipe.readyInMinutes || 30;
  const ingredients = activeRecipe.ingredients || [];
  const instructions = activeRecipe.instructions || [];
  const nutrition = activeRecipe.nutrition;

  function toggleIngredient(idx: number) {
    setCheckedIngredients((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  }

  const imageUrl = activeRecipe.imageUrl || activeRecipe.image || "/images/paneer-butter-masala.jpg";

  return (
    <div
      className="recipe-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="recipe-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="recipe-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="recipe-modal-media">
          <img
            src={imageUrl}
            alt={activeRecipe.title}
            className="recipe-modal-img"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/paneer-butter-masala.jpg";
            }}
          />
          <div className="recipe-modal-gradient" />
          <button
            type="button"
            className={`recipe-modal-save ${isSaved ? "saved" : ""}`}
            onClick={() => onToggleSave(activeRecipe.id)}
            aria-label={isSaved ? "Unsave recipe" : "Save recipe"}
          >
            <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="recipe-modal-body">
          <div className="recipe-modal-tags">
            {activeRecipe.cuisine && <span className="modal-tag">{activeRecipe.cuisine}</span>}
            {activeRecipe.dietType && <span className="modal-tag">{activeRecipe.dietType}</span>}
            {activeRecipe.mealType && <span className="modal-tag">{activeRecipe.mealType}</span>}
            {activeRecipe.source && (
              <span className="modal-tag" style={{ background: "rgba(88, 183, 124, 0.15)" }}>
                Source: {activeRecipe.source}
              </span>
            )}
          </div>

          <h2 id="modal-title" className="recipe-modal-title">
            {activeRecipe.title}
          </h2>

          {activeRecipe.summary && (
            <p className="recipe-modal-desc">{activeRecipe.summary}</p>
          )}

          <div className="recipe-modal-metrics">
            <div className="metric-item">
              <Clock size={16} />
              <div>
                <strong>{readyTime} mins</strong>
                <small>Total Time</small>
              </div>
            </div>
            <div className="metric-item">
              <Users size={16} />
              <div>
                <strong>{activeRecipe.servings || 4} servings</strong>
                <small>Yield</small>
              </div>
            </div>
            <div className="metric-item">
              <ChefHat size={16} />
              <div>
                <strong>{activeRecipe.difficulty || "Easy"}</strong>
                <small>Skill Level</small>
              </div>
            </div>
            <div className="metric-item">
              <Sparkles size={16} />
              <div>
                <strong>Spoonacular Verified</strong>
                <small>Official API</small>
              </div>
            </div>
          </div>

          {/* Nutrition Facts block when available */}
          {nutrition && (
            <div className="modal-nutrition-block">
              <div className="nutrition-heading">
                <Activity size={16} />
                <span>Nutritional Information (per serving)</span>
              </div>
              <div className="nutrition-pills">
                {nutrition.calories !== null && nutrition.calories !== undefined && (
                  <div className="nutri-pill">
                    <strong>{Math.round(nutrition.calories)}</strong>
                    <small>Calories</small>
                  </div>
                )}
                {nutrition.protein && (
                  <div className="nutri-pill">
                    <strong>{nutrition.protein}</strong>
                    <small>Protein</small>
                  </div>
                )}
                {nutrition.carbohydrates && (
                  <div className="nutri-pill">
                    <strong>{nutrition.carbohydrates}</strong>
                    <small>Carbs</small>
                  </div>
                )}
                {nutrition.fat && (
                  <div className="nutri-pill">
                    <strong>{nutrition.fat}</strong>
                    <small>Fat</small>
                  </div>
                )}
                {nutrition.fiber && (
                  <div className="nutri-pill">
                    <strong>{nutrition.fiber}</strong>
                    <small>Fiber</small>
                  </div>
                )}
              </div>
            </div>
          )}

          {loadingDetails && (
            <div className="modal-loading-indicator">
              <Loader2 size={24} className="spin-animate" />
              <span>Loading complete recipe instructions and ingredients...</span>
            </div>
          )}

          <div className="recipe-modal-columns">
            <div className="modal-col ingredients-col">
              <h3>
                Ingredients <span>({ingredients.length})</span>
              </h3>
              <p className="col-subtext">Click to check off as you prep</p>

              {ingredients.length > 0 ? (
                <ul className="modal-ingredients-list">
                  {ingredients.map((ing, idx) => {
                    const isChecked = checkedIngredients.includes(idx);
                    const amountText = ing.amount
                      ? `${ing.amount} ${ing.unit || ""}`.trim()
                      : ing.quantity || "";

                    return (
                      <li
                        key={idx}
                        className={`ingredient-item ${isChecked ? "checked" : ""}`}
                        onClick={() => toggleIngredient(idx)}
                      >
                        <div className="ingredient-check">
                          {isChecked && <CheckCircle2 size={16} />}
                        </div>
                        <span className="ingredient-name">{ing.name}</span>
                        {amountText && (
                          <span className="ingredient-amount">{amountText}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="empty-subtext">Standard pantry ingredients required.</p>
              )}
            </div>

            <div className="modal-col instructions-col">
              <h3>Step-by-Step Instructions</h3>
              {instructions.length > 0 ? (
                <ol className="modal-steps-list">
                  {instructions.map((step) => (
                    <li key={step.stepNumber} className="step-item">
                      <span className="step-num">{step.stepNumber}</span>
                      <p>{step.instruction}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="empty-subtext">
                  Follow chef techniques for preparing this dish to perfection.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
