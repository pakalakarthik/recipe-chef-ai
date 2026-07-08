# Cost Analysis

RecipeChef AI uses the FAU Trussed.ai API for AI recipe generation and shopping list generation.

## AI Usage

The app has two AI-powered features:

1. Recipe generation
2. Shopping list generation

## Estimated Requests

For demo and testing:

- Recipe generation: 10–20 requests
- Shopping list generation: 10–20 requests
- Total estimated demo usage: 20–40 AI requests

## Estimated Token Usage

Average request:

- Input: 50–300 tokens
- Output: 200–600 tokens

Estimated total demo usage:

- 5,000–25,000 tokens

## Cost Notes

Actual cost depends on the model and pricing configured through Trussed.ai.

For production use, the app should add:

- Daily user limits
- Server-side API protection
- Request throttling
- Logging and monitoring
- Better abuse prevention