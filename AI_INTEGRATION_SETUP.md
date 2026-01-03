# Gemini AI Integration Setup Guide

## Overview
The JUSTA dashboard now includes AI-powered food recognition using Google's Gemini API. This enables:
- Intelligent food item identification
- User-friendly quantity suggestions
- Support for multiple cuisines and regional foods
- Multilingual support (Hindi, Tamil, Telugu, Kannada, etc.)

## Features

### 1. Food Database
A comprehensive food database with regional variations is available in `src/utils/foodDatabase.js`. It includes:
- **Indian Cuisine**: Rice, Dal, Curry, Roti, Biryani, Dosa, Idli, Paneer, etc.
- **Global Cuisine**: Pizza, Burger, Sandwich, Pasta, Bread, etc.
- **Beverages & Snacks**: Tea, Coffee, Juice, Water, Snacks, etc.

Each food item has:
- Multiple language translations
- Meal-type specific quantities
- User-friendly descriptions (e.g., "3 slices of pizza" instead of "300g")

### 2. Delete Food Items
Users can now delete added food items with a trash icon button on the right side of each item.

### 3. Autocomplete Suggestions
As users type, they'll see food suggestions from the database, making it easier to find and select items.

### 4. AI-Powered Recognition (Optional)
If Gemini API is configured, the system will use AI to:
- Identify food items from user descriptions
- Suggest appropriate quantities based on meal type
- Handle regional and multilingual inputs

## Setup Instructions

### Step 1: Get Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API key" and create a new project
3. Enable the Google AI API
4. Copy your API key

### Step 2: Configure Environment Variables
Create a `.env.local` file in the project root:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

For Vite projects, environment variables must start with `VITE_` to be accessible in the browser.

### Step 3: Restart the Development Server
```bash
npm run dev
```

## Usage

### Without Gemini API (Database Mode)
The system will work perfectly fine using just the food database:
1. User types a food item
2. System shows autocomplete suggestions
3. User selects from suggestions
4. Database provides pre-configured quantities based on meal type

### With Gemini API (AI Mode)
1. User types any food description (in English or other languages)
2. AI analyzes and identifies the food item
3. AI suggests realistic quantities based on meal type
4. System falls back to database if AI is unavailable

## Food Database Features

### Query a Food
```javascript
import { getFoodSuggestion } from './utils/foodDatabase';

// Get suggestion for lunch
const suggestion = getFoodSuggestion("paneer curry", "lunch");
// Returns: { qty: 100, unit: "g", description: "100g" }
```

### Get All Food Names
```javascript
import { getAllFoodNames } from './utils/foodDatabase';

const names = getAllFoodNames();
// Returns array of all available food names
```

## Gemini Service Functions

### identifyFoodWithAI()
Identifies a food item and suggests quantity:
```javascript
const suggestion = await identifyFoodWithAI("chicken biryani", "lunch");
// Returns: { foodName: "Biryani", unit: "g", quantity: 300, description: "1 plate" }
```

### extractIngredientsWithAI()
Extract multiple ingredients from a recipe or menu:
```javascript
const ingredients = await extractIngredientsWithAI(
  "Serve rice, dal, curry, and rotis"
);
// Returns array of food items with quantities
```

### translateFoodName()
Translate food names to different languages:
```javascript
const translated = await translateFoodName("Rice", "hi");
// Returns: "चावल"
```

## Supported Languages in Database
- **Hindi (hi)**: हिंदी
- **Tamil (ta)**: தமிழ்
- **Telugu (te)**: తెలుగు
- **Kannada (kn)**: ಕನ್ನಡ
- **English (en)**: Default

## Error Handling
- If Gemini API is not configured, the system gracefully falls back to the food database
- If API fails during a request, a console warning is logged and database suggestions are used
- The user experience is seamless regardless of API availability

## Adding New Foods to Database
Edit `src/utils/foodDatabase.js` and add entries following this format:

```javascript
foodName: {
  name: "Display Name",
  translations: { hi: "हिंदी नाम", te: "తెలుగు పేరు", /* ... */ },
  defaultUnit: "g",
  quantities: {
    breakfast: { qty: 150, unit: "g", description: "1 cup" },
    lunch: { qty: 200, unit: "g", description: "1.5 cups" },
    dinner: { qty: 200, unit: "g", description: "1.5 cups" },
  },
}
```

## Future Enhancements
1. Image recognition for food items (upload photo of dish)
2. Recipe parsing from URLs
3. Nutrition information tracking
4. Regional recipe database
5. Multi-language UI

## Troubleshooting

### Autocomplete not showing
- Ensure `getAllFoodNames()` is working
- Check browser console for errors
- Food database should have entries

### AI suggestions not working
- Verify `VITE_GEMINI_API_KEY` is set correctly
- Check browser console for API errors
- Ensure Gemini API quota is available
- API calls should fall back to database gracefully

### Incorrect quantities suggested
- The database has pre-configured values; edit them as needed
- AI suggestions can be overridden by users
- Report new foods that need database entries

## API Costs
Google Gemini API has a free tier with rate limits. Check [Google AI Studio Pricing](https://ai.google.dev/pricing) for details.

## Files Modified
- `src/pages/dashboard/NewEstimation.jsx` - Added delete button, autocomplete, AI integration
- `src/utils/foodDatabase.js` - New comprehensive food database
- `src/services/geminiService.js` - New Gemini API integration service
