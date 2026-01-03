import { db, auth } from "../firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  getDoc,
  doc,
} from "firebase/firestore";

/**
 * Fetch all estimations for the current user
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
 * Fetch recent estimations (limit to last 5)
 * @returns {Promise<Array>} Array of recent estimation documents
 */
export async function getRecentEstimations() {
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
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    console.log("Recent estimations fetched:", {
      count: data.length,
      userId: user.uid,
      data: data,
    });
    
    return data;
  } catch (error) {
    console.error("Error fetching recent estimations:", error);
    return [];
  }
}

/**
 * Calculate dashboard statistics
 * @returns {Promise<Object>} Dashboard stats including totals and savings
 */
export async function getDashboardStats() {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log("User not authenticated");
      return {
        totalEvents: 0,
        completedEvents: 0,
        totalFoodSaved: 0,
        totalMoneySaved: 0,
        averageFoodSavedPerEvent: 0,
      };
    }

    // Get all estimations
    const estimationsRef = collection(db, "estimations");
    const estimationsQuery = query(
      estimationsRef,
      where("userId", "==", user.uid)
    );
    const estimationsSnapshot = await getDocs(estimationsQuery);
    const estimations = estimationsSnapshot.docs.map((doc) => doc.data());

    // Get all feedback
    const feedbackRef = collection(db, "feedback");
    const feedbackQuery = query(
      feedbackRef,
      where("userId", "==", user.uid)
    );
    const feedbackSnapshot = await getDocs(feedbackQuery);
    const feedbacks = feedbackSnapshot.docs.map((doc) => doc.data());

    // Calculate stats
    const totalEvents = estimations.length;
    const completedEvents = feedbacks.length;
    
    // Calculate food saved (kg)
    let totalFoodSaved = 0;
    estimations.forEach((est) => {
      if (est.foodSavedKg) {
        totalFoodSaved += est.foodSavedKg;
      }
    });

    // Calculate money saved (₹)
    let totalMoneySaved = 0;
    estimations.forEach((est) => {
      if (est.estimatedSavings) {
        totalMoneySaved += est.estimatedSavings;
      }
    });

    return {
      totalEvents,
      completedEvents,
      totalFoodSaved: Math.round(totalFoodSaved),
      totalMoneySaved: Math.round(totalMoneySaved),
      averageFoodSavedPerEvent: totalEvents > 0 ? Math.round(totalFoodSaved / totalEvents) : 0,
    };
  } catch (error) {
    console.error("Error calculating dashboard stats:", error);
    return {
      totalEvents: 0,
      completedEvents: 0,
      totalFoodSaved: 0,
      totalMoneySaved: 0,
      averageFoodSavedPerEvent: 0,
    };
  }
}

/**
 * Fetch pending feedback events
 * @returns {Promise<Array>} Array of estimations without feedback
 */
export async function getPendingFeedbackEvents() {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log("User not authenticated");
      return [];
    }

    // Get all estimations with pending status
    const estimationsRef = collection(db, "estimations");
    const estimationsQuery = query(
      estimationsRef,
      where("userId", "==", user.uid),
      where("status", "==", "pending")
    );
    const estimationsSnapshot = await getDocs(estimationsQuery);
    const estimations = estimationsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get all feedback
    const feedbackRef = collection(db, "feedback");
    const feedbackQuery = query(
      feedbackRef,
      where("userId", "==", user.uid)
    );
    const feedbackSnapshot = await getDocs(feedbackQuery);
    const feedbackEstimationIds = new Set(
      feedbackSnapshot.docs.map((doc) => doc.data().estimationId)
    );

    // Filter estimations without feedback (pending estimations that don't have feedback yet)
    return estimations.filter((est) => !feedbackEstimationIds.has(est.id));
  } catch (error) {
    console.error("Error fetching pending feedback events:", error);
    return [];
  }
}
