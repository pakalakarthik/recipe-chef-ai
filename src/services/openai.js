const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_URL = "https://fauengtrussed.fau.edu/provider/generic/chat/completions";

async function callAI(prompt) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-5.4",
      messages: [
        {
          role: "system",
          content: "You are a helpful cooking assistant. Keep responses clear and practical."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("AI rate limit reached. Please wait and try again.");
    }
    throw new Error(data.error?.message || "AI request failed.");
  }

  return data.choices?.[0]?.message?.content || "No AI response returned.";
}

export async function generateRecipe(ingredients) {
  return callAI(`
Generate a simple recipe using these ingredients: ${ingredients}

Return:
Recipe Title
Ingredients
Steps
Cooking Time
Difficulty
`);
}

export async function generateShoppingList(recipeText) {
  return callAI(`
Create a shopping list for this recipe.

Recipe:
${recipeText}
`);
}