import { db, auth } from "../firebase/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";

/**
 * Create and save a new estimation
 * @param {Object} estimationData - Estimation data object
 * @param {string} estimationData.eventType - Type of event
 * @param {number} estimationData.attendees - Number of attendees
 * @param {string} estimationData.ageGroup - Age group category
 * @param {string} estimationData.mealType - Type of meal
 * @param {Array} estimationData.foodItems - Array of food items with quantities
 * @param {Array} estimationData.results - Calculated results from estimation
 * @param {number} estimationData.estimatedCost - Estimated cost
 * @returns {Promise<Object>} Created estimation document
 */
export async function createEstimation(estimationData) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const estimationsRef = collection(db, "estimations");

    // Calculate additional metrics
    const metrics = calculateEstimationMetrics(estimationData);

    console.log("Creating estimation for user:", user.uid);
    
    const docRef = await addDoc(estimationsRef, {
      userId: user.uid,
      eventType: estimationData.eventType,
      attendees: estimationData.attendees,
      ageGroup: estimationData.ageGroup,
      mealType: estimationData.mealType,
      foodItems: estimationData.foodItems,
      results: estimationData.results,
      estimatedCost: estimationData.estimatedCost || 0,
      totalQuantity: metrics.totalQuantity,
      foodSavedKg: metrics.foodSavedKg,
      estimatedSavings: metrics.estimatedSavings,
      status: "pending", // pending, completed, archived
      createdAt: serverTimestamp(),
    });

    console.log("Estimation created with ID:", docRef.id, "for user:", user.uid);

    return {
      id: docRef.id,
      ...estimationData,
      ...metrics,
    };
  } catch (error) {
    console.error("Error creating estimation:", error);
    throw error;
  }
}

/**
 * Get all estimations for the current user
 * @returns {Promise<Array>} Array of estimation documents
 */
export async function getUserEstimations() {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log("User not authenticated");
      return [];
    }

    const estimationsRef = collection(db, "estimations");
    const q = query(
      estimationsRef,
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching estimations:", error);
    return [];
  }
}

/**
 * Get a specific estimation by ID
 * @param {string} estimationId - ID of the estimation
 * @returns {Promise<Object>} Estimation document
 */
export async function getEstimationById(estimationId) {
  try {
    const estimationRef = doc(db, "estimations", estimationId);
    const docSnap = await getDoc(estimationRef);

    if (!docSnap.exists()) {
      console.log("Estimation not found");
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
    };
  } catch (error) {
    console.error("Error fetching estimation:", error);
    return null;
  }
}

/**
 * Update an existing estimation
 * @param {string} estimationId - ID of the estimation to update
 * @param {Object} updates - Updates to apply
 * @returns {Promise<void>}
 */
export async function updateEstimation(estimationId, updates) {
  try {
    const estimationRef = doc(db, "estimations", estimationId);
    await updateDoc(estimationRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating estimation:", error);
    throw error;
  }
}

/**
 * Calculate additional metrics for estimation
 * @param {Object} estimationData - Estimation data
 * @returns {Object} Calculated metrics
 */
function calculateEstimationMetrics(estimationData) {
  // Calculate total quantity across all food items
  let totalQuantity = 0;
  if (estimationData.results && Array.isArray(estimationData.results)) {
    estimationData.results.forEach((item) => {
      if (item.unit === "g" || item.unit === "kg") {
        const quantity = item.unit === "kg" ? item.quantity * 1000 : item.quantity;
        totalQuantity += quantity;
      }
    });
  }

  // Convert grams to kg
  const totalQuantityKg = totalQuantity / 1000;

  // Estimate food saved (assuming 15-20% reduction through better estimation)
  const wasteReductionRate = 0.18; // 18% waste reduction
  const foodSavedKg = Math.round(totalQuantityKg * wasteReductionRate * 100) / 100;

  // Estimate cost savings (assuming ₹100 per kg typical food cost)
  const costPerKg = 100;
  const estimatedSavings = Math.round(foodSavedKg * costPerKg);

  return {
    totalQuantity: Math.round(totalQuantityKg * 100) / 100,
    foodSavedKg,
    estimatedSavings,
  };
}

/**
 * Get estimation history with filters
 * @param {Object} filters - Filter options
 * @param {string} filters.status - Filter by status (pending, completed, archived)
 * @param {string} filters.eventType - Filter by event type
 * @returns {Promise<Array>} Filtered estimations
 */
export async function getEstimationHistory(filters = {}) {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log("User not authenticated");
      return [];
    }

    let estimationsRef = collection(db, "estimations");
    let queryConditions = [
      where("userId", "==", user.uid),
    ];

    if (filters.status) {
      queryConditions.push(where("status", "==", filters.status));
    }

    if (filters.eventType) {
      queryConditions.push(where("eventType", "==", filters.eventType));
    }

    queryConditions.push(orderBy("createdAt", "desc"));

    const q = query(estimationsRef, ...queryConditions);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching estimation history:", error);
    return [];
  }
}

/**
 * Get estimation statistics for the current user
 * @returns {Promise<Object>} Estimation statistics
 */
export async function getEstimationStats() {
  try {
    const estimations = await getUserEstimations();

    if (estimations.length === 0) {
      return {
        totalEstimations: 0,
        completedEstimations: 0,
        pendingEstimations: 0,
        totalFoodQuantity: 0,
        totalFoodSaved: 0,
        totalCostSavings: 0,
      };
    }

    let completedCount = 0;
    let pendingCount = 0;
    let totalFoodQty = 0;
    let totalFoodSavedKg = 0;
    let totalSavings = 0;

    estimations.forEach((est) => {
      if (est.status === "completed") completedCount++;
      if (est.status === "pending") pendingCount++;
      if (est.totalQuantity) totalFoodQty += est.totalQuantity;
      if (est.foodSavedKg) totalFoodSavedKg += est.foodSavedKg;
      if (est.estimatedSavings) totalSavings += est.estimatedSavings;
    });

    return {
      totalEstimations: estimations.length,
      completedEstimations: completedCount,
      pendingEstimations: pendingCount,
      totalFoodQuantity: Math.round(totalFoodQty * 100) / 100,
      totalFoodSaved: Math.round(totalFoodSavedKg * 100) / 100,
      totalCostSavings: Math.round(totalSavings),
      averageFoodSavedPerEstimation: Math.round((totalFoodSavedKg / estimations.length) * 100) / 100,
    };
  } catch (error) {
    console.error("Error calculating estimation stats:", error);
    return {
      totalEstimations: 0,
      completedEstimations: 0,
      pendingEstimations: 0,
      totalFoodQuantity: 0,
      totalFoodSaved: 0,
      totalCostSavings: 0,
    };
  }
}
