import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="page center">
      <div className="hero-container">
        {/* Gourmet Chef Hat Logo */}
        <svg
          className="brand-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 18H18" />
          <path d="M6 14H18" />
          <path d="M3 18C3 18 4 11 6 10C8 9 9 10 12 8C15 10 16 9 18 10C20 11 21 18 21 18" />
          <path d="M12 8v6M9 11h6" />
        </svg>

        <h1 className="hero-title">RecipeChef AI</h1>
        <p className="hero-description">
          Unlock culinary magic. Generate gourmet recipes, customize shopping lists, and organize your favorite meals with the power of artificial intelligence.
        </p>

        <div className="hero-actions">
          <Link to="/login" className="btn btn-primary" style={{ flex: 1 }}>
            Sign In
          </Link>
          <Link to="/register" className="btn btn-secondary" style={{ flex: 1 }}>
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;