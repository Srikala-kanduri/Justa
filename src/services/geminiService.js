/**
 * Gemini AI Integration for intelligent food recognition
 * Requires GEMINI_API_KEY environment variable
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

/**
 * Call Gemini API to identify food item and suggest quantities
 * @param {string} foodDescription - User's food description (e.g., "chicken biryani")
 * @param {string} mealType - Type of meal (breakfast, lunch, dinner, snacks)
 * @returns {Promise<Object>} Food suggestion with name, unit, and quantity
 */
export async function identifyFoodWithAI(foodDescription, mealType = "lunch") {
  if (!GEMINI_API_KEY) {
    console.warn("Gemini API key not configured. Using default quantities.");
    return null;
  }

  try {
    const prompt = `You are a food quantity estimation expert. A user has entered: "${foodDescription}" for a ${mealType}.

Please respond in JSON format ONLY (no markdown, no extra text):
{
  "foodName": "standardized food name",
  "unit": "g or pcs or ml or cups or slices",
  "quantity": number,
  "description": "user-friendly quantity description (e.g., '1 cup cooked' or '3 slices')",
  "cuisine": "cuisine type",
  "confidence": 0 to 1
}

Consider:
- Regional/international cuisines
- Multiple languages (the user might describe in any language)
- Realistic portion sizes for the meal type
- Standard measurement units for the food type`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 200,
        },
      }),
    });

    if (!response.ok) {
      console.error("Gemini API error:", response.status);
      return null;
    }

    const data = await response.json();
    const content = data?.contents?.[0]?.parts?.[0]?.text;

    if (!content) return null;

    // Parse the JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const suggestion = JSON.parse(jsonMatch[0]);
    return suggestion.confidence > 0.5 ? suggestion : null;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return null;
  }
}

/**
 * Extract ingredients and quantities from a recipe description using AI
 * @param {string} recipeDescription - Full recipe or menu description
 * @returns {Promise<Array>} Array of {name, unit, quantity, description}
 */
export async function extractIngredientsWithAI(recipeDescription) {
  if (!GEMINI_API_KEY) {
    console.warn("Gemini API key not configured.");
    return null;
  }

  try {
    const prompt = `You are a food extraction expert. Extract all food items from this description: "${recipeDescription}"

Respond in JSON format ONLY (no markdown):
{
  "foodItems": [
    {"name": "food name", "unit": "measurement unit", "quantity": number, "description": "readable format"},
    ...
  ]
}

For each item, use standard units (g, ml, pcs, cups, slices, etc.) and realistic quantities.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!response.ok) {
      console.error("Gemini API error:", response.status);
      return null;
    }

    const data = await response.json();
    const content = data?.contents?.[0]?.parts?.[0]?.text;

    if (!content) return null;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const result = JSON.parse(jsonMatch[0]);
    return result.foodItems || null;
  } catch (error) {
    console.error("Error extracting ingredients:", error);
    return null;
  }
}

/**
 * Translate food name to user's preferred language
 * @param {string} foodName - English food name
 * @param {string} language - Target language code (hi, te, ta, kn, etc.)
 * @returns {Promise<string>} Translated food name
 */
export async function translateFoodName(foodName, language = "hi") {
  if (!GEMINI_API_KEY) return foodName;

  try {
    const prompt = `Translate the food item "${foodName}" to ${getLanguageName(language)}. 
Respond with ONLY the translated word, nothing else.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 50,
        },
      }),
    });

    if (!response.ok) return foodName;

    const data = await response.json();
    const translated = data?.contents?.[0]?.parts?.[0]?.text?.trim();
    return translated || foodName;
  } catch (error) {
    console.error("Translation error:", error);
    return foodName;
  }
}

function getLanguageName(code) {
  const languages = {
    hi: "Hindi",
    te: "Telugu",
    ta: "Tamil",
    kn: "Kannada",
    ml: "Malayalam",
    en: "English",
  };
  return languages[code] || "English";
}
