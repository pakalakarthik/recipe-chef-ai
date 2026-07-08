import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createRecipe, deleteRecipe, getRecipes } from "../services/recipeService";
import { generateRecipe, generateShoppingList } from "../services/openai";

function Dashboard() {
  const { user, logout } = useAuth();

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiIngredients, setAiIngredients] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [shoppingList, setShoppingList] = useState("");

  async function loadRecipes() {
    try {
      setLoading(true);
      const data = await getRecipes();
      setRecipes(data.results || []);
    } catch (err) {
      setError(err.message || "Failed to load recipes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecipes();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setError("");

    if (!title.trim() || !ingredients.trim() || !instructions.trim()) {
      setError("Title, ingredients, and instructions are required.");
      return;
    }

    try {
      setLoading(true);
      await createRecipe({
        title,
        ingredients,
        instructions,
        owner: user.objectId,
      });

      setTitle("");
      setIngredients("");
      setInstructions("");
      await loadRecipes();
    } catch (err) {
      setError(err.message || "Failed to save recipe.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    try {
      setLoading(true);
      await deleteRecipe(id);
      await loadRecipes();
    } catch (err) {
      setError(err.message || "Failed to delete recipe.");
    } finally {
      setLoading(false);
    }
  }


  async function handleGenerateRecipe() {
  setError("");
  setAiResult("");

  if (!aiIngredients.trim()) {
    setError("Enter ingredients first.");
    return;
  }

  try {
    setLoading(true);
    const result = await generateRecipe(aiIngredients);
    setAiResult(result);
  } catch (err) {
    setError(err.message || "Failed to generate recipe.");
  } finally {
    setLoading(false);
  }
}

async function handleGenerateShoppingList() {
  setError("");
  setShoppingList("");

  if (!aiResult.trim()) {
    setError("Generate a recipe first.");
    return;
  }

  try {
    setLoading(true);
    const result = await generateShoppingList(aiResult);
    setShoppingList(result);
  } catch (err) {
    setError(err.message || "Failed to generate shopping list.");
  } finally {
    setLoading(false);
  }
}

  function handleLogout() {
    logout();
    window.location.href = "/";
  }

  return (
    <div className="page">
      <nav className="navbar">
        <h2>RecipeChef AI</h2>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <section className="card">
        <h3>Welcome, {user?.username}</h3>
        <p>Create and save your recipes.</p>
      </section>

      <section className="card">
        <section className="card">
  <h3>AI Recipe Generator</h3>

  <textarea
    placeholder="Enter ingredients: chicken, rice, onion..."
    rows="3"
    value={aiIngredients}
    onChange={(e) => setAiIngredients(e.target.value)}
  />

  <br /><br />

  <button onClick={handleGenerateRecipe} disabled={loading}>
    {loading ? "Generating..." : "Generate Recipe"}
  </button>

  {aiResult && (
    <div className="ai-box">
      <h4>Generated Recipe</h4>
      <pre>{aiResult}</pre>

      <button onClick={handleGenerateShoppingList} disabled={loading}>
        Generate Shopping List
      </button>
    </div>
  )}

  {shoppingList && (
    <div className="ai-box">
      <h4>Shopping List</h4>
      <pre>{shoppingList}</pre>
    </div>
  )}
</section>
        <h3>Add Recipe</h3>

        <form onSubmit={handleSave} className="form wide">
          <input
            placeholder="Recipe title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Ingredients"
            rows="4"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />

          <textarea
            placeholder="Instructions"
            rows="5"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />

          <button disabled={loading}>
            {loading ? "Working..." : "Save Recipe"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}
      </section>

      <section className="card">
        <h3>Saved Recipes</h3>

        {loading && <p>Loading...</p>}

        {recipes.length === 0 && !loading && <p>No recipes saved yet.</p>}

        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <div className="recipe-card" key={recipe.objectId}>
              <h4>{recipe.title}</h4>
              <p><strong>Ingredients:</strong></p>
              <p>{recipe.ingredients}</p>
              <p><strong>Instructions:</strong></p>
              <p>{recipe.instructions}</p>
              <button onClick={() => handleDelete(recipe.objectId)}>Delete</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;