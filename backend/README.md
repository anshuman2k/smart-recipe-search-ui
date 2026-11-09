# RecipeMind FastAPI Backend

FastAPI backend providing recipe discovery, search, and detail retrieval using the official Spoonacular Food API.

## Requirements

- Python 3.10+
- Spoonacular API Key

## Setup & Running

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Spoonacular API key:
   ```env
   SPOONACULAR_API_KEY=your_actual_key_here
   ```

3. **Start the backend server:**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload
   ```

4. **Verify Health:**
   Visit `http://localhost:8080/api/health` or `http://localhost:8080/docs` for interactive Swagger documentation.

## Endpoints

- `GET /api/health` - Backend health and provider configuration check
- `POST /api/search` - Structured search (name, ingredients, cuisine, diet, max time)
- `GET /api/search` - Query-param search for browser linking
- `POST /api/search/ingredients` - Search by pantry ingredients
- `GET /api/recipes/{id}` - Full recipe details (ingredients, instructions, nutrition)
- `GET /api/recipes/{id}/nutrition` - Standalone nutrition information
- `GET /api/categories` - Supported cuisines, diets, and meal types
- `GET /api/discover` - Popular curated recipe discovery

