# TEST_CASES.md

## Authentication Tests

| Test | Steps | Expected Result | Status |
|---|---|---|---|
| Register user | Enter username, email, password and submit | User account is created and dashboard opens | Pass |
| Login user | Enter valid username and password | User is logged in and dashboard opens | Pass |
| Invalid login | Enter wrong credentials | Friendly error message appears | Pass |
| Logout | Click logout button | User returns to home/login page | Pass |

## Recipe CRUD Tests

| Test | Steps | Expected Result | Status |
|---|---|---|---|
| Create recipe | Enter title, ingredients, instructions and save | Recipe appears in saved recipes | Pass |
| Read recipes | Refresh dashboard | Saved recipes still appear | Pass |
| Edit recipe | Click Edit (pencil icon) on a recipe card | Form fields pre-fill, form title updates to "Edit Recipe", "Update" and "Cancel" buttons appear | Pass |
| Update recipe | Modify pre-filled fields and click Update | Changes are updated in the cloud and instantly refresh in the saved list | Pass |
| Cancel edit | Click Cancel during an active edit | Form clears and resets back to "Create Recipe" mode | Pass |
| Delete recipe | Click delete (trash icon) button | Confirmation warning appears; on OK, recipe is deleted | Pass |
| Empty fields | Try saving with missing fields | Validation error message appears | Pass |

## AI Feature Tests

| Test | Steps | Expected Result | Status |
|---|---|---|---|
| Generate recipe | Enter ingredients and click Generate Recipe | AI-generated recipe appears in a box | Pass |
| Import AI recipe | Click "Import to Form" on a generated recipe | AI title, ingredients, instructions parse and auto-fill manual form | Pass |
| Generate shopping list | Click Generate Shopping List after recipe generation | Clean list of ingredients appears | Pass |
| Check off shopping items | Click on items in the generated shopping list | Items strike out and turn green as checked | Pass |
| Empty AI input | Click generate with no ingredients | Input validation alert appears | Pass |
| API failure/rate limit | Simulate failed AI request (or 429 status) | User-friendly "AI rate limit reached" error message displays | Pass |

## Deployment Smoke Test

| Test | Steps | Expected Result | Status |
|---|---|---|---|
| Open live site | Visit Netlify URL | App loads successfully | Pass |
| Production auth | Register/login on live URL | Auth works | Pass |
| Production CRUD | Create/Edit/Update/Delete recipe on live URL | Full CRUD works | Pass |
| Production AI | Generate recipe & shopping list on live URL | AI works | Pass |
