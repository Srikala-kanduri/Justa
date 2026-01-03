/**
 * Comprehensive food database with intelligent quantity suggestions
 * Supports multiple cuisines, regions, and languages
 */

export const FOOD_DATABASE = {
  // Indian Cuisine
  rice: {
    name: "Rice",
    translations: { hi: "चावल", te: "బియ్యం", ta: "அரிசி", kn: "ಅಕ್ಕಿ" },
    defaultUnit: "kg",
    quantities: {
      breakfast: { qty: 0.15, unit: "kg", description: "1 cup cooked" },
      lunch: { qty: 0.2, unit: "kg", description: "1.5 cups cooked" },
      dinner: { qty: 0.2, unit: "kg", description: "1.5 cups cooked" },
    },
  },
  dal: {
    name: "Lentils/Dal",
    translations: { hi: "दाल", te: "తాలి", ta: "பருப்பு", kn: "ದಾಲ್" },
    defaultUnit: "g",
    quantities: {
      breakfast: { qty: 80, unit: "g", description: "1/2 bowl" },
      lunch: { qty: 120, unit: "g", description: "1 bowl" },
      dinner: { qty: 120, unit: "g", description: "1 bowl" },
    },
  },
  curry: {
    name: "Curry (Vegetable/Meat)",
    translations: { hi: "करी", te: "కూర", ta: "குழம்பு", kn: "ಕಾರಿ" },
    defaultUnit: "g",
    quantities: {
      lunch: { qty: 150, unit: "g", description: "1 bowl" },
      dinner: { qty: 150, unit: "g", description: "1 bowl" },
    },
  },
  roti: {
    name: "Roti/Chapati",
    translations: { hi: "रोटी", te: "రుచ్చి", ta: "சப்பாத்தி", kn: "ರೋಟಿ" },
    defaultUnit: "pcs",
    quantities: {
      breakfast: { qty: 2, unit: "pcs", description: "2 pieces" },
      lunch: { qty: 3, unit: "pcs", description: "3 pieces" },
      dinner: { qty: 3, unit: "pcs", description: "3 pieces" },
    },
  },
  naan: {
    name: "Naan",
    translations: { hi: "नान", te: "నాన్", ta: "நாൻ", kn: "ನಾನ್" },
    defaultUnit: "pcs",
    quantities: {
      lunch: { qty: 2, unit: "pcs", description: "2 pieces" },
      dinner: { qty: 2, unit: "pcs", description: "2 pieces" },
    },
  },
  biryani: {
    name: "Biryani",
    translations: { hi: "बिरयानी", te: "బిర్యానీ", ta: "பிரியாணி", kn: "ಬಿರ್ಯಾನಿ" },
    defaultUnit: "g",
    quantities: {
      lunch: { qty: 300, unit: "g", description: "1 plate" },
      dinner: { qty: 300, unit: "g", description: "1 plate" },
    },
  },
  dosa: {
    name: "Dosa",
    translations: { hi: "डोसा", te: "దోస", ta: "தோசை", kn: "ದೋಸೆ" },
    defaultUnit: "pcs",
    quantities: {
      breakfast: { qty: 1, unit: "pcs", description: "1 dosa" },
      lunch: { qty: 2, unit: "pcs", description: "2 dosas" },
    },
  },
  idli: {
    name: "Idli",
    translations: { hi: "इडली", te: "ఇడ్లీ", ta: "இட்லி", kn: "ಇಡ್ಲಿ" },
    defaultUnit: "pcs",
    quantities: {
      breakfast: { qty: 3, unit: "pcs", description: "3 pieces" },
    },
  },
  paneer: {
    name: "Paneer (Cottage Cheese)",
    translations: { hi: "पनीर", te: "పనీర", ta: "பனீர்", kn: "ಪನೀರ್" },
    defaultUnit: "g",
    quantities: {
      lunch: { qty: 100, unit: "g", description: "100g" },
      dinner: { qty: 100, unit: "g", description: "100g" },
    },
  },
  chicken: {
    name: "Chicken",
    translations: { hi: "चिकन", te: "చికెన్", ta: "கோழி", kn: "ಚಿಕೆನ್" },
    defaultUnit: "g",
    quantities: {
      lunch: { qty: 150, unit: "g", description: "150g (medium portion)" },
      dinner: { qty: 150, unit: "g", description: "150g (medium portion)" },
    },
  },
  mutton: {
    name: "Mutton/Goat Meat",
    translations: { hi: "मटन", te: "గొర్రె", ta: "ஆട்டு", kn: "ಮಟ್ಟನ್" },
    defaultUnit: "g",
    quantities: {
      lunch: { qty: 150, unit: "g", description: "150g" },
      dinner: { qty: 150, unit: "g", description: "150g" },
    },
  },
  fish: {
    name: "Fish",
    translations: { hi: "मछली", te: "చేప", ta: "மீன்", kn: "ಮೀನು" },
    defaultUnit: "g",
    quantities: {
      lunch: { qty: 150, unit: "g", description: "150g" },
      dinner: { qty: 150, unit: "g", description: "150g" },
    },
  },
  vegetable: {
    name: "Mixed Vegetables",
    translations: { hi: "सब्जी", te: "కూరలు", ta: "காய்கறிகள்", kn: "ತರಕಾರಿ" },
    defaultUnit: "g",
    quantities: {
      lunch: { qty: 150, unit: "g", description: "150g" },
      dinner: { qty: 150, unit: "g", description: "150g" },
    },
  },
  salad: {
    name: "Salad",
    translations: { hi: "सलाद", te: "సలాడ్", ta: "சாலட்", kn: "ಸಲಾಡ್" },
    defaultUnit: "g",
    quantities: {
      lunch: { qty: 100, unit: "g", description: "100g" },
      dinner: { qty: 100, unit: "g", description: "100g" },
    },
  },
  raita: {
    name: "Raita (Yogurt Side)",
    translations: { hi: "रायता", te: "రైతా", ta: "ரைதா", kn: "ರೈತ" },
    defaultUnit: "g",
    quantities: {
      lunch: { qty: 100, unit: "g", description: "1 bowl" },
      dinner: { qty: 100, unit: "g", description: "1 bowl" },
    },
  },
  pickle: {
    name: "Pickle",
    translations: { hi: "अचार", te: "ఊరగాయ", ta: "ஊறுகாய்", kn: "ಉಸಿರುಕಾಯಿ" },
    defaultUnit: "g",
    quantities: {
      lunch: { qty: 20, unit: "g", description: "small serving" },
      dinner: { qty: 20, unit: "g", description: "small serving" },
    },
  },
  dessert: {
    name: "Dessert/Sweets",
    translations: { hi: "मिठाई", te: "మిఠాయి", ta: "இனிப்பு", kn: "ಸಿಹಿ" },
    defaultUnit: "g",
    quantities: {
      lunch: { qty: 100, unit: "g", description: "1 piece" },
      dinner: { qty: 100, unit: "g", description: "1 piece" },
    },
  },
  kheer: {
    name: "Kheer (Rice Pudding)",
    translations: { hi: "खीर", te: "ఖీర్", ta: "பாயசம்", kn: "ಖೀರ್" },
    defaultUnit: "g",
    quantities: {
      lunch: { qty: 100, unit: "g", description: "1 bowl" },
      dinner: { qty: 100, unit: "g", description: "1 bowl" },
    },
  },

  // Western/Global Cuisine
  pizza: {
    name: "Pizza",
    translations: { hi: "पिज्जा", te: "పిజ్జా", ta: "பிட்சா", kn: "ಪಿಜ್ಜಾ" },
    defaultUnit: "slices",
    quantities: {
      lunch: { qty: 3, unit: "slices", description: "3 slices (1/3 of large pizza)" },
      dinner: { qty: 3, unit: "slices", description: "3 slices (1/3 of large pizza)" },
    },
  },
  burger: {
    name: "Burger",
    translations: { hi: "बर्गर", te: "బర్గర", ta: "பர்கர்", kn: "ಬರ್ಗರ್" },
    defaultUnit: "pcs",
    quantities: {
      breakfast: { qty: 1, unit: "pcs", description: "1 burger" },
      lunch: { qty: 2, unit: "pcs", description: "2 burgers" },
      dinner: { qty: 2, unit: "pcs", description: "2 burgers" },
    },
  },
  sandwich: {
    name: "Sandwich",
    translations: { hi: "सैंडविच", te: "సాండ్‌విచ్", ta: "சாண்ட்விச்", kn: "ಸ್ಯಾಂಡ್‌ವಿಚ್" },
    defaultUnit: "pcs",
    quantities: {
      breakfast: { qty: 1, unit: "pcs", description: "1 sandwich" },
      lunch: { qty: 2, unit: "pcs", description: "2 sandwiches" },
    },
  },
  pasta: {
    name: "Pasta",
    translations: { hi: "पास्ता", te: "పాస్టా", ta: "பாஸ்தா", kn: "ಪಾಸ್ತಾ" },
    defaultUnit: "g",
    quantities: {
      lunch: { qty: 200, unit: "g", description: "1 plate" },
      dinner: { qty: 200, unit: "g", description: "1 plate" },
    },
  },
  bread: {
    name: "Bread",
    translations: { hi: "ब्रेड", te: "బ్రెడ్", ta: "பிரெட்", kn: "ಬ್ರೆಡ್" },
    defaultUnit: "slices",
    quantities: {
      breakfast: { qty: 2, unit: "slices", description: "2 slices" },
      lunch: { qty: 3, unit: "slices", description: "3 slices" },
    },
  },

  // Beverages & Snacks
  tea: {
    name: "Tea",
    translations: { hi: "चाय", te: "చాయ", ta: "தேநீர்", kn: "ಚಾಯ" },
    defaultUnit: "cups",
    quantities: {
      breakfast: { qty: 1, unit: "cups", description: "1 cup" },
    },
  },
  coffee: {
    name: "Coffee",
    translations: { hi: "कॉफी", te: "కాఫీ", ta: "காபி", kn: "ಕಾಫಿ" },
    defaultUnit: "cups",
    quantities: {
      breakfast: { qty: 1, unit: "cups", description: "1 cup" },
    },
  },
  juice: {
    name: "Juice",
    translations: { hi: "जूस", te: "జ్యూస్", ta: "ஜூஸ்", kn: "ಜ್ಯೂಸ್" },
    defaultUnit: "ml",
    quantities: {
      breakfast: { qty: 200, unit: "ml", description: "1 glass" },
      lunch: { qty: 200, unit: "ml", description: "1 glass" },
      dinner: { qty: 200, unit: "ml", description: "1 glass" },
    },
  },
  water: {
    name: "Water",
    translations: { hi: "पानी", te: "నీరు", ta: "தண்ணீர்", kn: "ನೀರು" },
    defaultUnit: "liters",
    quantities: {
      breakfast: { qty: 0.5, unit: "liters", description: "500ml per person" },
      lunch: { qty: 0.5, unit: "liters", description: "500ml per person" },
      dinner: { qty: 0.5, unit: "liters", description: "500ml per person" },
    },
  },
  snacks: {
    name: "Snacks (Chips/Namkeen)",
    translations: { hi: "स्नैक्स", te: "స్నాక్‌లు", ta: "சிற்றுண்டி", kn: "ಜಲೇಬಿ" },
    defaultUnit: "g",
    quantities: {
      breakfast: { qty: 50, unit: "g", description: "small bowl" },
      lunch: { qty: 100, unit: "g", description: "1 bowl" },
      dinner: { qty: 100, unit: "g", description: "1 bowl" },
    },
  },
};

/**
 * Get food suggestion by name (with fuzzy matching)
 */
export function getFoodSuggestion(foodName, mealType = "lunch") {
  if (!foodName) return { qty: 100, unit: "g", description: "default" };

  const lowerName = foodName.toLowerCase().trim();

  // Exact match
  if (FOOD_DATABASE[lowerName]) {
    const food = FOOD_DATABASE[lowerName];
    return food.quantities[mealType] || food.quantities.lunch || { qty: 100, unit: "g" };
  }

  // Fuzzy match - check if any key contains the search term
  for (const [key, food] of Object.entries(FOOD_DATABASE)) {
    if (
      key.includes(lowerName) ||
      food.name.toLowerCase().includes(lowerName)
    ) {
      return food.quantities[mealType] || food.quantities.lunch || { qty: 100, unit: "g" };
    }
  }

  // Default
  return { qty: 100, unit: "g", description: "default quantity" };
}

/**
 * Get all food names for autocomplete
 */
export function getAllFoodNames() {
  return Object.values(FOOD_DATABASE).map((food) => food.name);
}
