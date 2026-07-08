import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createRecipe, deleteRecipe, getRecipes, updateRecipe } from "../services/recipeService";
import { generateRecipe, generateShoppingList } from "../services/openai";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import RecipeCard from "../components/RecipeCard";

function Dashboard() {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  
  const [aiIngredients, setAiIngredients] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [shoppingList, setShoppingList] = useState("");
  const [checkedItems, setCheckedItems] = useState({});

  // Parse shopping list text into interactive list items when list text changes
  const shoppingListItems = shoppingList
    ? shoppingList
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.toLowerCase().includes("shopping list:"))
        .map((line, idx) => {
          // Strip out bullets (- * • 1. 2. etc.)
          const cleaned = line.replace(/^([-*•\d.\s]+(?:\[\s*\])?\s*)/, "");
          return { id: idx, text: cleaned, checked: !!checkedItems[idx] };
        })
    : [];

  async function loadRecipes() {
    try {
      setLoadingMsg("Fetching your recipes");
      setLoading(true);
      const data = await getRecipes(user?.objectId);
      setRecipes(data.results || []);
    } catch (err) {
      setError(err.message || "Failed to load recipes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  function handleEdit(recipe) {
    setError("");
    setEditingRecipeId(recipe.objectId);
    setTitle(recipe.title);
    setIngredients(recipe.ingredients);
    setInstructions(recipe.instructions);
    
    // Scroll smoothly to form
    const formElement = document.getElementById("add-recipe-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  }

  function handleCancelEdit() {
    setError("");
    setEditingRecipeId(null);
    setTitle("");
    setIngredients("");
    setInstructions("");
  }

  async function handleSave(e) {
    e.preventDefault();
    setError("");

    if (!title.trim() || !ingredients.trim() || !instructions.trim()) {
      setError("Title, ingredients, and instructions are required.");
      return;
    }

    try {
      setLoading(true);
      if (editingRecipeId) {
        setLoadingMsg("Updating recipe in cloud");
        await updateRecipe(editingRecipeId, {
          title,
          ingredients,
          instructions,
          owner: user.objectId,
        });
        setEditingRecipeId(null);
      } else {
        setLoadingMsg("Saving recipe to cloud");
        await createRecipe({
          title,
          ingredients,
          instructions,
          owner: user.objectId,
        });
      }

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
    if (!window.confirm("Are you sure you want to delete this recipe?")) {
      return;
    }
    
    try {
      setLoadingMsg("Removing recipe");
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
    setShoppingList("");

    if (!aiIngredients.trim()) {
      setError("Enter ingredients first.");
      return;
    }

    try {
      setLoadingMsg("Generating recipe via AI");
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
      setLoadingMsg("Building shopping list");
      setLoading(true);
      const result = await generateShoppingList(aiResult);
      setShoppingList(result);
    } catch (err) {
      setError(err.message || "Failed to generate shopping list.");
    } finally {
      setLoading(false);
    }
  }

  function handleToggleShoppingItem(id) {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  }

  // Parse AI-generated recipe into title, ingredients, instructions
  function handleImportAI() {
    if (!aiResult) return;
    setError("");

    const lines = aiResult.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    
    let parsedTitle = "";
    let parsedIngredients = [];
    let parsedInstructions = [];
    let currentSection = ""; // 'title', 'ingredients', 'steps'
    
    for (let line of lines) {
      const lowerLine = line.toLowerCase();
      
      if (lowerLine.startsWith("recipe title:") || lowerLine.startsWith("title:")) {
        parsedTitle = line.replace(/^(recipe title:|title:)\s*/i, "");
        currentSection = "title";
        continue;
      }
      
      if (lowerLine.startsWith("ingredients:") || lowerLine.startsWith("ingredients")) {
        currentSection = "ingredients";
        continue;
      }
      
      if (
        lowerLine.startsWith("steps:") || 
        lowerLine.startsWith("steps") || 
        lowerLine.startsWith("instructions:") || 
        lowerLine.startsWith("instructions") ||
        lowerLine.startsWith("cooking steps:")
      ) {
        currentSection = "instructions";
        continue;
      }
      
      if (
        lowerLine.startsWith("cooking time:") || 
        lowerLine.startsWith("time:") || 
        lowerLine.startsWith("difficulty:")
      ) {
        // Skip metadata lines or handle appropriately
        continue;
      }
      
      if (currentSection === "ingredients") {
        parsedIngredients.push(line);
      } else if (currentSection === "instructions") {
        parsedInstructions.push(line);
      } else if (!parsedTitle && parsedIngredients.length === 0 && parsedInstructions.length === 0) {
        // Default first non-header line as Title
        parsedTitle = line;
      }
    }

    // Set form fields with parsed content (fallback to raw blocks if parsing yields nothing)
    setTitle(parsedTitle || "AI Generated Recipe");
    setIngredients(parsedIngredients.length > 0 ? parsedIngredients.join("\n") : aiIngredients);
    setInstructions(parsedInstructions.length > 0 ? parsedInstructions.join("\n") : aiResult);

    // Scroll smoothly to form
    const formElement = document.getElementById("add-recipe-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Filter recipes based on search query
  const filteredRecipes = recipes.filter(recipe => {
    const query = searchQuery.toLowerCase();
    return (
      recipe.title.toLowerCase().includes(query) ||
      recipe.ingredients.toLowerCase().includes(query) ||
      recipe.instructions.toLowerCase().includes(query)
    );
  });

  return (
    <div className="page">
      <Navbar />

      {error && (
        <div className="error-alert">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {loading && <Loading message={loadingMsg} />}

      <div className="dashboard-grid">
        {/* Left Column: Generator and Manual Editor */}
        <div className="left-column">
          {/* AI Recipe Generator Card */}
          <section className="card">
            <div className="card-header">
              <h3>AI Recipe Generator</h3>
              <p>Type in ingredients and let the AI chef compile a custom meal plan.</p>
            </div>

            <div className="form-group">
              <label htmlFor="ai-ingredients-input">Available Ingredients</label>
              <textarea
                id="ai-ingredients-input"
                placeholder="e.g. salmon, broccoli, lemon, olive oil, garlic..."
                rows="3"
                value={aiIngredients}
                onChange={(e) => setAiIngredients(e.target.value)}
                disabled={loading}
              />
            </div>

            <button onClick={handleGenerateRecipe} disabled={loading || !aiIngredients.trim()} style={{ alignSelf: "flex-start" }}>
              <svg style={{ width: "18px", height: "18px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
              {loading ? "Generating..." : "Generate Gourmet Recipe"}
            </button>

            {aiResult && (
              <div className="ai-box">
                <h4>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Gourmet AI Output
                </h4>
                <pre className="ai-output-pre">{aiResult}</pre>

                <div className="ai-actions-row">
                  <button className="btn btn-outline" onClick={handleImportAI}>
                    <svg style={{ width: "16px", height: "16px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    Import to Form
                  </button>
                  <button className="btn" onClick={handleGenerateShoppingList} disabled={loading}>
                    <svg style={{ width: "16px", height: "16px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    Get Shopping List
                  </button>
                </div>
              </div>
            )}

            {shoppingListItems.length > 0 && (
              <div className="ai-box">
                <h4>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5.636 18.364a9 9 0 1 1 12.728 0M12 3v9" />
                  </svg>
                  Interactive Shopping List
                </h4>
                <p style={{ fontSize: "0.85rem", marginBottom: "0.5rem" }}>Click items to cross them off your list.</p>
                <div className="shopping-list-container">
                  {shoppingListItems.map((item) => (
                    <div
                      key={item.id}
                      className={`shopping-item ${item.checked ? "checked" : ""}`}
                      onClick={() => handleToggleShoppingItem(item.id)}
                    >
                      <div className="shopping-item-checkbox">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span className="shopping-item-text">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Add Recipe Manual Editor Form */}
          <section className="card" id="add-recipe-form">
            <div className="card-header">
              <h3>{editingRecipeId ? "Edit Recipe" : "Create Recipe"}</h3>
              <p>{editingRecipeId ? "Modify details of your saved recipe below." : "Add a new dish manually or customize an imported AI recipe."}</p>
            </div>

            <form onSubmit={handleSave} className="form">
              <div className="form-group">
                <label htmlFor="recipe-title-input">Recipe Title</label>
                <input
                  id="recipe-title-input"
                  placeholder="e.g. Garlic Butter Salmon"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="recipe-ingredients-input">Ingredients</label>
                <textarea
                  id="recipe-ingredients-input"
                  placeholder="Enter ingredients (one per line or comma-separated)"
                  rows="4"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="recipe-instructions-input">Instructions</label>
                <textarea
                  id="recipe-instructions-input"
                  placeholder="Enter cooking directions step-by-step..."
                  rows="5"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", alignSelf: "flex-start" }}>
                <button type="submit" disabled={loading}>
                  <svg style={{ width: "18px", height: "18px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  {editingRecipeId ? "Update Recipe" : "Save Recipe"}
                </button>
                {editingRecipeId && (
                  <button type="button" className="btn btn-secondary" onClick={handleCancelEdit} disabled={loading}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>
        </div>

        {/* Right Column: Recipe Repository Search and List */}
        <div className="right-column">
          <section className="card">
            <div className="card-header">
              <h3>Saved Recipes</h3>
              <p>Your personal collection of gourmet culinary ideas.</p>
            </div>

            {/* Dynamic Search Box */}
            <div className="search-container">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search by title, ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={loading && recipes.length === 0}
              />
            </div>

            {recipes.length === 0 && !loading && (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <svg style={{ width: "48px", height: "48px", color: "var(--text-muted)", opacity: 0.5 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                <p style={{ marginTop: "1rem" }}>No recipes saved yet. Create one manually or generate via AI!</p>
              </div>
            )}

            {recipes.length > 0 && filteredRecipes.length === 0 && (
              <p style={{ textAlign: "center", padding: "1rem 0" }}>No recipes matched your search query.</p>
            )}

            <div className="recipe-grid">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.objectId} recipe={recipe} onDelete={handleDelete} onEdit={handleEdit} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;