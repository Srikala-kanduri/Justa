import { db, auth } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

/**
 * Get current user profile
 * @returns {Promise<Object|null>} User profile document or null if not found
 */
export async function getUserProfile() {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log("User not authenticated");
      return null;
    }

    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      console.log("User profile not found");
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}
