import { parseRequest } from "./parse";

export async function createRecipe(recipe) {
  return parseRequest("/classes/Recipe", {
    method: "POST",
    body: JSON.stringify(recipe),
  });
}

export async function getRecipes(userId) {
  if (!userId) return { results: [] };
  const query = { owner: userId };
  return parseRequest(`/classes/Recipe?where=${encodeURIComponent(JSON.stringify(query))}&order=-createdAt`, {
    method: "GET",
  });
}

export async function deleteRecipe(id) {
  return parseRequest(`/classes/Recipe/${id}`, {
    method: "DELETE",
  });
}

export async function updateRecipe(id, recipe) {
  return parseRequest(`/classes/Recipe/${id}`, {
    method: "PUT",
    body: JSON.stringify(recipe),
  });
}