# BUILD_STEPS.md

## Step 1: Initialize Project
- Created GitHub Classroom repository
- Set up React + Vite app
- Verified local development server

Verify:
- App loads at localhost:5173

Commit:
- chore: initialize React app

## Step 2: Authentication
- Added registration page
- Added login page
- Stored user session token
- Protected dashboard route

Verify:
- User can register
- User can log in
- Dashboard is protected

Commit:
- feat: add authentication

## Step 3: Recipe CRUD
- Added Recipe class through Back4App REST API
- Implemented create recipe
- Implemented read saved recipes
- Implemented delete recipe

Verify:
- Saved recipes persist after refresh
- Deleted recipes are removed

Commit:
- feat: add recipe crud

## Step 4: AI Integration
- Connected Trussed.ai API
- Added AI recipe generator
- Added AI shopping list generator
- Added loading and error handling

Verify:
- AI recipe generates from ingredients
- Shopping list generates from AI recipe

Commit:
- feat: add ai recipe and shopping list generation

## Step 5: UI Polish
- Improved dashboard layout
- Added styled cards
- Improved readability and user flow

Verify:
- App is usable on browser
- Main actions are easy to find

Commit:
- style: polish RecipeChef AI dashboard UI

## Step 6: Deployment
- Created public deployment mirror repository
- Connected Netlify to GitHub
- Added environment variables
- Deployed production app

Verify:
- Live URL loads
- Register/login works
- CRUD works
- AI generation works

Commit:
- docs: add deployed application URL