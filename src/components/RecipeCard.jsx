const RecipeCard = ({ recipe, onDelete }) => {
  return (
    <div className="recipe-card">
      <div className="recipe-card-header">
        <h4 className="recipe-card-title">{recipe.title}</h4>
        {onDelete && (
          <button
            onClick={() => onDelete(recipe.objectId)}
            className="btn-icon btn-danger"
            title="Delete Recipe"
            style={{ padding: "6px", borderRadius: "8px" }}
          >
            <svg
              style={{ width: "16px", height: "16px" }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        )}
      </div>

      <div className="recipe-card-section">
        <span className="recipe-card-section-title">Ingredients</span>
        <div className="recipe-card-text">{recipe.ingredients}</div>
      </div>

      <div className="recipe-card-section">
        <span className="recipe-card-section-title">Instructions</span>
        <div className="recipe-card-text">{recipe.instructions}</div>
      </div>
    </div>
  );
};

export default RecipeCard;
