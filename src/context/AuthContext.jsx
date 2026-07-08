/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { parseRequest } from "../services/parse";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  async function register(username, email, password) {
    const data = await parseRequest("/users", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });

    localStorage.setItem("sessionToken", data.sessionToken);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  }

  async function login(username, password) {
    const data = await parseRequest(
      `/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
      { method: "GET" }
    );

    localStorage.setItem("sessionToken", data.sessionToken);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  }

  function logout() {
    localStorage.removeItem("sessionToken");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}