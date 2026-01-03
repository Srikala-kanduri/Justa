/* ---------------- LEVEL 1: SMART BUFFER ---------------- */

function getSmartBuffer(eventType, ageGroup) {
  if (eventType === "wedding") return 1.12;
  if (eventType === "college") return 1.05;
  if (eventType === "corporate") return 1.06;
  if (ageGroup === "children") return 1.03;
  return 1.08;
}

/* ---------------- LEVEL 2: MENU SHARE (CRITICAL FIX) ---------------- */

// How much of the base quantity is actually consumed
const MENU_SHARE = {
  rice: 0.45,
  roti: 0.6,
  dal: 0.7,
  curry: 0.5,
  dessert: 0.4,
};

/* ---------------- CONTEXT MULTIPLIERS ---------------- */

const EVENT_FACTOR = {
  wedding: 1.1,
  college: 0.85,
  corporate: 0.9,
  birthday: 1.0,
  community: 1.0,
};

const AGE_FACTOR = {
  children: 0.6,
  teenagers: 0.85,
  adults: 1.0,
  mixed: 0.9,
};

const MEAL_FACTOR = {
  breakfast: 0.7,
  lunch: 1.0,
  dinner: 0.95,
  snacks: 0.5,
};

/* ---------------- MAIN ESTIMATION FUNCTION ---------------- */

export function estimateFood({
  attendees,
  eventType,
  ageGroup,
  mealType,
  foodItems, // [{ name, perPersonQty, unit }]
}) {
  const results = [];

  if (!attendees || attendees <= 0) return results;

  foodItems.forEach((item) => {
    const perPersonQty = Number(item.perPersonQty);
    if (!perPersonQty || perPersonQty <= 0) return;

    const key = item.name.toLowerCase();

    const menuShare = MENU_SHARE[key] ?? 0.5;
    const eventFactor = EVENT_FACTOR[eventType] || 1;
    const ageFactor = AGE_FACTOR[ageGroup] || 1;
    const mealFactor = MEAL_FACTOR[mealType] || 1;
    const buffer = getSmartBuffer(eventType, ageGroup);

    const total =
      attendees *
      perPersonQty *
      menuShare *
      eventFactor *
      ageFactor *
      mealFactor *
      buffer;

    results.push({
      name: item.name,
      quantity: Math.round(total * 100) / 100,
      unit: item.unit,
    });
  });

  return results;
}

/* ---------------- LEVEL 3: LEARNING HOOK (FUTURE) ---------------- */

export function adjustBaseQuantity(baseQty, leftoverPercent) {
  if (leftoverPercent > 25) return baseQty * 0.9;
  if (leftoverPercent < 5) return baseQty * 1.05;
  return baseQty;
}
