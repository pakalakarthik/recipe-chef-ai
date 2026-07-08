# PLAN.md

## Project Concept

RecipeChef AI is a full-stack AI recipe application. Users can register, log in, generate recipes with AI, create shopping lists with AI, and save personal recipes.

## Problem

Many users have ingredients at home but do not know what to cook. RecipeChef AI solves this by generating recipe ideas and shopping lists from user-provided ingredients.

## Scope

### Included
- User registration
- User login/logout
- Protected dashboard
- Create recipes
- View saved recipes
- Delete recipes
- AI recipe generation
- AI shopping list generation
- Deployed live application

### Not Included
- Payment system
- Nutrition tracking
- Social sharing
- Mobile app

## Data Model

### User
Back4App built-in `_User` class.

### Recipe
Custom `Recipe` class with:
- title
- ingredients
- instructions
- owner
- createdAt
- updatedAt

## Architecture

React frontend communicates with:
- Back4App REST API for authentication and recipe database
- Trussed.ai API for AI recipe and shopping list generation