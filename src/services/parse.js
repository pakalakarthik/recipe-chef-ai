const APP_ID = import.meta.env.VITE_PARSE_APP_ID;
const JS_KEY = import.meta.env.VITE_PARSE_JS_KEY;
const SERVER_URL = import.meta.env.VITE_PARSE_SERVER_URL;

export async function parseRequest(path, options = {}) {
  const sessionToken = localStorage.getItem("sessionToken");

  const response = await fetch(`${SERVER_URL}${path}`, {
    ...options,
    headers: {
      "X-Parse-Application-Id": APP_ID,
      "X-Parse-JavaScript-Key": JS_KEY,
      "Content-Type": "application/json",
      ...(sessionToken ? { "X-Parse-Session-Token": sessionToken } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}