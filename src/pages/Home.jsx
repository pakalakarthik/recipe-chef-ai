import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="page center">
      <h1>RecipeChef AI</h1>
      <p>Generate recipes and shopping lists using AI.</p>

      <div className="actions">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
}

export default Home;