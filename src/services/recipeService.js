import { parseRequest } from "./parse";

export async function createRecipe(recipe) {
  return parseRequest("/classes/Recipe", {
    method: "POST",
    body: JSON.stringify(recipe),
  });
}

export async function getRecipes() {
  return parseRequest("/classes/Recipe?order=-createdAt", {
    method: "GET",
  });
}

export async function deleteRecipe(id) {
  return parseRequest(`/classes/Recipe/${id}`, {
    method: "DELETE",
  });
}