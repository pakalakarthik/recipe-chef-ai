# RecipeChef AI

RecipeChef AI is a full-stack AI mini-project that lets users register, log in, save recipes, and generate recipes and shopping lists using AI.

## Features

- User registration and login
- Protected dashboard
- Full CRUD operations (Create, Read, Update, Delete recipes)
- AI recipe generation (from raw ingredients input)
- AI shopping list generation (from custom generated recipes)
- Loading overlays with dynamic descriptions
- User-isolated recipe storage (owner filtering)
- Back4App database integration

## Tech Stack

- **Frontend**: React + Vite (Vanilla CSS design system)
- **Database/Auth**: Back4App / Parse REST API
- **AI Engine**: Trussed.ai Chat Completions (GPT-powered)
- **Hosting**: Netlify deployment

## Project Documentation

Detailed architecture, API schemas, cost analysis, and test suites can be found here:
- [API Documentation](docs/API_DOCUMENTATION.md) — Endpoint URLs, requests/responses.
- [Architecture Flow](docs/ARCHITECTURE.md) — High-level system interaction diagram.
- [Database Schema Design](docs/DATABASE_DESIGN.md) — ERD diagrams and field types.
- [Cost Analysis & Estimates](docs/COST_ANALYSIS.md) — Token projections and daily limits.
- [Test Cases Suite](docs/TEST_CASES.md) — Auth, CRUD, AI features, and error case validation.

## Environment Variables

Create `frontend/.env`:

```env
VITE_PARSE_APP_ID=
VITE_PARSE_JS_KEY=
VITE_PARSE_SERVER_URL=
VITE_OPENAI_API_KEY=
```

## Run Locally

```bash
cd frontend
npm install
npm run dev
```

## Usage

1. Register a new account.
2. Log in.
3. Add a recipe manually.
4. Generate a recipe using ingredients.
5. Generate a shopping list from the AI recipe.
6. Save or delete recipes.


## Live URL

https://generate-your-own-recipe.netlify.app

## Demo Video

https://www.loom.com/share/2b3f16222c2c43a88e2236d65e8406ca