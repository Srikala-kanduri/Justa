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
} from "firebase/firestore";

/**
 * Save feedback for an estimation
 * @param {string} estimationId - ID of the estimation to provide feedback for
 * @param {Object} feedbackData - Feedback data object
 * @param {string} feedbackData.sufficient - Whether food was sufficient ("yes" or "no")
 * @param {string} feedbackData.leftoverLevel - Level of leftover ("none", "low", "high")
 * @param {string} feedbackData.comments - Optional comments
 * @returns {Promise<Object>} Created feedback document
 */
export async function submitFeedback(estimationId, feedbackData) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const feedbackRef = collection(db, "feedback");
    
    // Calculate improvement factors based on feedback
    const improvementFactors = calculateImprovementFactors(feedbackData);

    const docRef = await addDoc(feedbackRef, {
      userId: user.uid,
      estimationId,
      sufficient: feedbackData.sufficient,
      leftoverLevel: feedbackData.leftoverLevel,
      comments: feedbackData.comments || "",
      improvementFactors,
      createdAt: serverTimestamp(),
    });

    // Update the estimation as completed
    const estimationRef = doc(db, "estimations", estimationId);
    await updateDoc(estimationRef, {
      status: "completed",
      feedbackId: docRef.id,
    });

    return {
      id: docRef.id,
      ...feedbackData,
      estimationId,
    };
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error;
  }
}

/**
 * Get all feedback for the current user
 * @returns {Promise<Array>} Array of feedback documents
 */
export async function getUserFeedback() {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log("User not authenticated");
      return [];
    }

    const feedbackRef = collection(db, "feedback");
    const q = query(
      feedbackRef,
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching user feedback:", error);
    return [];
  }
}

/**
 * Get feedback for a specific estimation
 * @param {string} estimationId - ID of the estimation
 * @returns {Promise<Object|null>} Feedback document or null if not found
 */
export async function getFeedbackByEstimationId(estimationId) {
  try {
    const feedbackRef = collection(db, "feedback");
    const q = query(
      feedbackRef,
      where("estimationId", "==", estimationId)
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    };
  } catch (error) {
    console.error("Error fetching feedback for estimation:", error);
    return null;
  }
}

/**
 * Calculate improvement factors based on feedback
 * This helps fine-tune future estimations
 * @param {Object} feedbackData - Feedback data
 * @returns {Object} Improvement factors for model refinement
 */
function calculateImprovementFactors(feedbackData) {
  let adjustmentFactor = 1.0;
  let accuracy = "good";

  if (feedbackData.sufficient === "no") {
    // Food was insufficient - estimate too low
    adjustmentFactor = 1.1; // Increase by 10%
    accuracy = "underestimated";
  } else if (feedbackData.leftoverLevel === "high") {
    // Too much leftover - estimate too high
    adjustmentFactor = 0.9; // Decrease by 10%
    accuracy = "overestimated";
  } else if (feedbackData.leftoverLevel === "low") {
    accuracy = "good";
  }

  return {
    adjustmentFactor,
    accuracy,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Get feedback analytics for the current user
 * @returns {Promise<Object>} Analytics including accuracy metrics
 */
export async function getFeedbackAnalytics() {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log("User not authenticated");
      return {
        totalFeedback: 0,
        accuracyGood: 0,
        accuracyUnderestimated: 0,
        accuracyOverestimated: 0,
        averageAccuracyRate: 0,
      };
    }

    const feedbacks = await getUserFeedback();

    if (feedbacks.length === 0) {
      return {
        totalFeedback: 0,
        accuracyGood: 0,
        accuracyUnderestimated: 0,
        accuracyOverestimated: 0,
        averageAccuracyRate: 0,
      };
    }

    const accuracyMetrics = {
      good: 0,
      underestimated: 0,
      overestimated: 0,
    };

    feedbacks.forEach((feedback) => {
      if (feedback.improvementFactors && feedback.improvementFactors.accuracy) {
        const acc = feedback.improvementFactors.accuracy;
        if (acc === "good") accuracyMetrics.good++;
        else if (acc === "underestimated") accuracyMetrics.underestimated++;
        else if (acc === "overestimated") accuracyMetrics.overestimated++;
      }
    });

    const totalFeedback = feedbacks.length;
    const accuracyRate = (accuracyMetrics.good / totalFeedback) * 100;

    return {
      totalFeedback,
      accuracyGood: accuracyMetrics.good,
      accuracyUnderestimated: accuracyMetrics.underestimated,
      accuracyOverestimated: accuracyMetrics.overestimated,
      averageAccuracyRate: Math.round(accuracyRate),
    };
  } catch (error) {
    console.error("Error calculating feedback analytics:", error);
    return {
      totalFeedback: 0,
      accuracyGood: 0,
      accuracyUnderestimated: 0,
      accuracyOverestimated: 0,
      averageAccuracyRate: 0,
    };
  }
}
