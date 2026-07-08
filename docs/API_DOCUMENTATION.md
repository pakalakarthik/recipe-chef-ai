# API / Data Access Documentation

## Authentication

### Register User

Back4App REST endpoint:

```http
POST /users
```

Request:

```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "objectId": "abc123",
  "sessionToken": "session_token_here"
}
```

### Login User

```http
GET /login?username=testuser&password=password123
```

Response:

```json
{
  "objectId": "abc123",
  "username": "testuser",
  "sessionToken": "session_token_here"
}
```

## Recipe CRUD

### Create Recipe

```http
POST /classes/Recipe
```

Request:

```json
{
  "title": "Chicken Rice",
  "ingredients": "chicken, rice, onion",
  "instructions": "Cook rice, cook chicken, mix together."
}
```

### Get Recipes

```http
GET /classes/Recipe?order=-createdAt
```

### Delete Recipe

```http
DELETE /classes/Recipe/{objectId}
```

### Update Recipe

```http
PUT /classes/Recipe/{objectId}
```

Request:

```json
{
  "title": "Updated Chicken Rice",
  "ingredients": "chicken, rice, onion, garlic",
  "instructions": "Cook rice, cook chicken, mix together with garlic."
}
```

Response:

```json
{
  "updatedAt": "2026-07-08T20:30:00.000Z"
}
```


## AI Features

### Generate Recipe

Uses Trussed.ai chat completions API.

Input:

```json
{
  "ingredients": "goat, rice, chilli"
}
```

Output:

```text
Recipe title, ingredients, cooking steps, cooking time, and difficulty.
```

### Generate Shopping List

Input:

```json
{
  "recipeText": "Generated recipe text"
}
```

Output:

```text
Shopping list for missing or useful ingredients.
```

## Error Cases Tested

- Empty recipe fields
- Invalid login
- Unauthorized user
- AI API failure
- AI rate limit message