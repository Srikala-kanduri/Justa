# Quick Reference Guide - JUSTA Dashboard Backend

## File Locations

### Service Files (Backend)
- `src/services/dashboardService.js` - Dashboard statistics and metrics
- `src/services/feedbackService.js` - Feedback submission and analysis  
- `src/services/estimationService.js` - Estimation creation and management

### Component Files (Frontend)
- `src/pages/dashboard/DashboardHome.jsx` - Dashboard homepage (updated)
- `src/pages/dashboard/Feedback.jsx` - Feedback form (updated)
- `src/pages/dashboard/NewEstimation.jsx` - Estimation form (updated)

### Firebase Configuration
- `src/firebase/firebase.js` - Firebase initialization (already configured)

## Service Functions Quick Reference

### Dashboard Service
```javascript
import { 
  getDashboardStats,
  getRecentEstimations,
  getUserEstimations,
  getPendingFeedbackEvents 
} from '../../services/dashboardService';

// Get dashboard metrics
const stats = await getDashboardStats();
// Returns: { totalEvents, completedEvents, totalFoodSaved, totalMoneySaved, ... }

// Get recent 5 estimations
const recent = await getRecentEstimations();
// Returns: Array of estimation objects

// Get all pending feedback events
const pending = await getPendingFeedbackEvents();
// Returns: Array of estimations without feedback
```

### Feedback Service
```javascript
import { 
  submitFeedback,
  getUserFeedback,
  getFeedbackByEstimationId,
  getFeedbackAnalytics 
} from '../../services/feedbackService';

// Submit feedback for an estimation
await submitFeedback(estimationId, {
  sufficient: 'yes',
  leftoverLevel: 'low',
  comments: 'Optional comments'
});

// Get all user feedback
const feedback = await getUserFeedback();

// Get feedback for specific estimation
const est_feedback = await getFeedbackByEstimationId(estimationId);

// Get feedback analytics
const analytics = await getFeedbackAnalytics();
// Returns: { totalFeedback, accuracyGood, accuracyUnderestimated, ... }
```

### Estimation Service
```javascript
import { 
  createEstimation,
  getUserEstimations,
  getEstimationById,
  updateEstimation,
  getEstimationHistory,
  getEstimationStats 
} from '../../services/estimationService';

// Create new estimation
const est = await createEstimation({
  eventType: 'college',
  attendees: 100,
  ageGroup: 'teenagers',
  mealType: 'lunch',
  foodItems: [...],
  results: [...],
  estimatedCost: 5000
});

// Get all user estimations
const estimations = await getUserEstimations();

// Get specific estimation
const est = await getEstimationById(estimationId);

// Update estimation
await updateEstimation(estimationId, { status: 'completed' });

// Get filtered history
const completed = await getEstimationHistory({ status: 'completed' });
const weddings = await getEstimationHistory({ eventType: 'wedding' });

// Get statistics
const stats = await getEstimationStats();
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│                   User Actions                       │
└──────────┬─────────────────────────────────┬─────────┘
           │                                 │
           ▼                                 ▼
   ┌──────────────────┐            ┌─────────────────┐
   │ NewEstimation    │            │    Feedback     │
   │   Component      │            │   Component     │
   └────────┬─────────┘            └────────┬────────┘
            │                               │
            │ createEstimation()            │ submitFeedback()
            ▼                               ▼
   ┌─────────────────────────────────────────────────┐
   │           Firebase Firestore                    │
   │  ┌──────────────────┐   ┌─────────────────┐   │
   │  │  estimations     │   │    feedback     │   │
   │  │  collection      │   │   collection    │   │
   │  └──────────────────┘   └─────────────────┘   │
   └────────────┬──────────────────────────┬────────┘
                │                          │
      getDashboardStats()         getFeedbackAnalytics()
                │                          │
                └──────────┬───────────────┘
                           ▼
                ┌─────────────────────────┐
                │  DashboardHome          │
                │  Component              │
                │  (Displays Stats)       │
                └─────────────────────────┘
```

## Firestore Collection Design

### estimations
```json
{
  "id": "est_123",
  "userId": "user_456",
  "eventType": "college",
  "attendees": 100,
  "ageGroup": "teenagers",
  "mealType": "lunch",
  "foodItems": [
    { "name": "Rice", "perPersonQty": 200, "unit": "g" },
    { "name": "Curry", "perPersonQty": 100, "unit": "g" }
  ],
  "results": [
    { "name": "Rice", "quantity": 23600, "unit": "g" },
    { "name": "Curry", "quantity": 11800, "unit": "g" }
  ],
  "estimatedCost": 5000,
  "totalQuantity": 35.4,
  "foodSavedKg": 6.4,
  "estimatedSavings": 640,
  "status": "completed",
  "feedbackId": "feedback_123",
  "createdAt": "2025-01-03T10:30:00Z"
}
```

### feedback
```json
{
  "id": "feedback_123",
  "userId": "user_456",
  "estimationId": "est_123",
  "sufficient": "yes",
  "leftoverLevel": "low",
  "comments": "Estimation was quite accurate",
  "improvementFactors": {
    "adjustmentFactor": 1.0,
    "accuracy": "good",
    "timestamp": "2025-01-03T11:30:00Z"
  },
  "createdAt": "2025-01-03T11:30:00Z"
}
```

## Firestore Queries Used

### Dashboard Service
```javascript
// Get user's estimations, newest first
query(
  collection(db, "estimations"),
  where("userId", "==", user.uid),
  orderBy("createdAt", "desc"),
  limit(5)  // For recent estimations
)

// Get completed events without feedback
query(
  collection(db, "estimations"),
  where("userId", "==", user.uid),
  where("status", "==", "completed")
)
```

### Feedback Service
```javascript
// Get user's feedback, newest first
query(
  collection(db, "feedback"),
  where("userId", "==", user.uid),
  orderBy("createdAt", "desc")
)

// Find feedback for specific estimation
query(
  collection(db, "feedback"),
  where("estimationId", "==", estimationId)
)
```

## Component Usage Examples

### In DashboardHome
```jsx
const [stats, setStats] = useState(null);
const [recentEstimations, setRecentEstimations] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    const dashboardStats = await getDashboardStats();
    const recent = await getRecentEstimations();
    setStats(dashboardStats);
    setRecentEstimations(recent);
  };
  fetchData();
}, []);
```

### In Feedback
```jsx
const [pendingFeedbacks, setPendingFeedbacks] = useState([]);

useEffect(() => {
  const pending = await getPendingFeedbackEvents();
  setPendingFeedbacks(pending);
}, []);

const handleSubmit = async () => {
  await submitFeedback(estimationId, feedbackData);
  navigate('/dashboard');
};
```

### In NewEstimation
```jsx
const handleSaveEstimation = async () => {
  const saved = await createEstimation(estimationData);
  navigate(`/dashboard/feedback?estimationId=${saved.id}`);
};
```

## Error Handling Pattern

```javascript
try {
  const data = await someServiceFunction();
  // Use data
} catch (error) {
  console.error("Error:", error);
  setError("User-friendly error message");
  // Set fallback state
}
```

## Common Firestore Operations

### Document IDs
- Auto-generated by Firestore when using `addDoc()`
- Accessible via `doc.id` in queries
- Pass to other functions for updates/deletes

### Timestamps
- Use `serverTimestamp()` for consistency
- Convert to JS Date: `timestamp.toDate()`
- Format for display: `timestamp.toDate().toLocaleDateString()`

### Arrays
- Food items and results stored as arrays
- Update arrays using spread operator or `arrayUnion()`
- Index with number or filter with helper functions

## Next Steps

1. **Set Firestore Security Rules** - See BACKEND_DOCUMENTATION.md
2. **Test in Firebase Emulator** - Optional but recommended
3. **Deploy to Production** - Ensure rules are in place
4. **Monitor Firestore Usage** - Check billing and optimize as needed

---
For detailed documentation, see:
- `BACKEND_DOCUMENTATION.md` - Complete API reference
- `IMPLEMENTATION_SUMMARY.md` - Implementation details and testing guide
