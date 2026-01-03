# JUSTA Dashboard Backend - Firebase Integration

This document describes the backend services created for the JUSTA dashboard using Firebase Firestore.

## Overview

The backend consists of three main service files that handle data persistence and retrieval for the dashboard components:

1. **dashboardService.js** - Dashboard metrics and statistics
2. **feedbackService.js** - Post-event feedback collection and analysis
3. **estimationService.js** - Event estimation creation and management

## Firestore Collections Structure

### 1. `estimations` Collection

Stores all event estimations created by users.

**Document Structure:**
```javascript
{
  userId: string,              // User ID from Firebase Auth
  eventType: string,           // wedding, college, corporate, birthday, community
  attendees: number,           // Number of attendees
  ageGroup: string,            // children, teenagers, adults, mixed
  mealType: string,            // breakfast, lunch, dinner, snacks
  foodItems: [                 // Array of food items with quantities
    {
      name: string,
      perPersonQty: number,
      unit: string             // g, kg, pcs, etc.
    }
  ],
  results: [                   // Calculated results from estimation
    {
      name: string,
      quantity: number,
      unit: string
    }
  ],
  estimatedCost: number,       // Optional: estimated total cost in ₹
  totalQuantity: number,       // Total calculated quantity in kg
  foodSavedKg: number,         // Estimated food waste reduction (kg)
  estimatedSavings: number,    // Estimated cost savings (₹)
  status: string,              // pending, completed, archived
  feedbackId: string,          // Reference to feedback document (if provided)
  createdAt: timestamp,        // Firebase server timestamp
  updatedAt: timestamp         // Firebase server timestamp
}
```

### 2. `feedback` Collection

Stores post-event feedback for completed estimations.

**Document Structure:**
```javascript
{
  userId: string,              // User ID from Firebase Auth
  estimationId: string,        // Reference to estimation document
  sufficient: string,          // yes, no - was food sufficient?
  leftoverLevel: string,       // none, low, high
  comments: string,            // Optional user comments
  improvementFactors: {        // Calculated improvement metrics
    adjustmentFactor: number,  // 0.9-1.1 adjustment for future estimates
    accuracy: string,          // good, underestimated, overestimated
    timestamp: string          // ISO timestamp
  },
  createdAt: timestamp         // Firebase server timestamp
}
```

## Service Functions

### dashboardService.js

#### `getUserEstimations()`
Fetches all estimations for the current user, ordered by creation date (newest first).

**Returns:** `Promise<Array>` - Array of estimation documents

```javascript
const estimations = await getUserEstimations();
```

#### `getRecentEstimations()`
Fetches the 5 most recent estimations for the current user.

**Returns:** `Promise<Array>` - Array of recent estimation documents

```javascript
const recent = await getRecentEstimations();
```

#### `getDashboardStats()`
Calculates dashboard statistics including total events, completed events, food saved, and money saved.

**Returns:** `Promise<Object>`
```javascript
{
  totalEvents: number,
  completedEvents: number,
  totalFoodSaved: number,              // in kg
  totalMoneySaved: number,             // in ₹
  averageFoodSavedPerEvent: number     // in kg
}
```

#### `getPendingFeedbackEvents()`
Fetches all completed estimations that don't have feedback yet.

**Returns:** `Promise<Array>` - Array of estimation documents awaiting feedback

```javascript
const pending = await getPendingFeedbackEvents();
```

### feedbackService.js

#### `submitFeedback(estimationId, feedbackData)`
Submits feedback for an estimation and updates the estimation status to "completed".

**Parameters:**
- `estimationId` (string) - ID of the estimation
- `feedbackData` (object):
  - `sufficient` (string) - "yes" or "no"
  - `leftoverLevel` (string) - "none", "low", or "high"
  - `comments` (string, optional) - Additional comments

**Returns:** `Promise<Object>` - Created feedback document

```javascript
await submitFeedback(estimationId, {
  sufficient: "yes",
  leftoverLevel: "low",
  comments: "Estimation was quite accurate"
});
```

#### `getUserFeedback()`
Fetches all feedback submitted by the current user.

**Returns:** `Promise<Array>` - Array of feedback documents

```javascript
const allFeedback = await getUserFeedback();
```

#### `getFeedbackByEstimationId(estimationId)`
Fetches feedback for a specific estimation.

**Returns:** `Promise<Object|null>` - Feedback document or null if not found

```javascript
const feedback = await getFeedbackByEstimationId(estimationId);
```

#### `getFeedbackAnalytics()`
Calculates feedback analytics including accuracy metrics.

**Returns:** `Promise<Object>`
```javascript
{
  totalFeedback: number,
  accuracyGood: number,
  accuracyUnderestimated: number,
  accuracyOverestimated: number,
  averageAccuracyRate: number         // percentage
}
```

### estimationService.js

#### `createEstimation(estimationData)`
Creates and saves a new estimation to Firebase.

**Parameters:**
- `estimationData` (object):
  - `eventType` (string) - Type of event
  - `attendees` (number) - Number of attendees
  - `ageGroup` (string) - Age group category
  - `mealType` (string) - Type of meal
  - `foodItems` (array) - Array of food items
  - `results` (array) - Calculated results
  - `estimatedCost` (number, optional) - Estimated cost

**Returns:** `Promise<Object>` - Created estimation with ID and metrics

```javascript
const estimation = await createEstimation({
  eventType: "college",
  attendees: 100,
  ageGroup: "teenagers",
  mealType: "lunch",
  foodItems: [...],
  results: [...],
  estimatedCost: 5000
});
```

#### `getUserEstimations()`
Fetches all estimations for the current user.

**Returns:** `Promise<Array>` - Array of estimation documents

```javascript
const estimations = await getUserEstimations();
```

#### `getEstimationById(estimationId)`
Fetches a specific estimation by ID.

**Parameters:**
- `estimationId` (string) - ID of the estimation

**Returns:** `Promise<Object>` - Estimation document

```javascript
const estimation = await getEstimationById(estimationId);
```

#### `updateEstimation(estimationId, updates)`
Updates an existing estimation.

**Parameters:**
- `estimationId` (string) - ID of the estimation
- `updates` (object) - Fields to update

**Returns:** `Promise<void>`

```javascript
await updateEstimation(estimationId, { status: "completed" });
```

#### `getEstimationHistory(filters)`
Fetches estimation history with optional filters.

**Parameters:**
- `filters` (object, optional):
  - `status` (string) - Filter by status
  - `eventType` (string) - Filter by event type

**Returns:** `Promise<Array>` - Filtered estimations

```javascript
const completed = await getEstimationHistory({ status: "completed" });
const weddings = await getEstimationHistory({ eventType: "wedding" });
```

#### `getEstimationStats()`
Calculates comprehensive estimation statistics.

**Returns:** `Promise<Object>`
```javascript
{
  totalEstimations: number,
  completedEstimations: number,
  pendingEstimations: number,
  totalFoodQuantity: number,
  totalFoodSaved: number,
  totalCostSavings: number,
  averageFoodSavedPerEstimation: number
}
```

## Component Integration

### DashboardHome.jsx
- Fetches stats using `getDashboardStats()`
- Loads recent estimations with `getRecentEstimations()`
- Shows pending feedback count with `getPendingFeedbackEvents()`
- Displays real-time metrics from Firebase

### Feedback.jsx
- Loads pending feedback events with `getPendingFeedbackEvents()`
- Allows selection from pending estimations
- Submits feedback with `submitFeedback()`
- Redirects to dashboard after submission

### NewEstimation.jsx
- Saves estimation with `createEstimation()`
- Automatically redirects to feedback form with estimation ID
- Calculates metrics including food saved and cost savings

## Authentication

All services require user authentication via Firebase Auth. The `auth.currentUser` is used to:
- Associate data with the logged-in user
- Ensure users can only access their own data
- Provide multi-user support

## Error Handling

All service functions include try-catch blocks and log errors to console. Components should handle errors gracefully and display user-friendly messages.

## Future Enhancements

1. **Machine Learning**: Use feedback data to improve estimation accuracy over time
2. **Analytics Dashboard**: Detailed analytics using aggregation queries
3. **Bulk Operations**: Batch imports and exports
4. **Real-time Sync**: Use Firestore listeners for real-time updates
5. **Export Reports**: Generate PDF/Excel reports of estimations and savings

## Best Practices

1. Always check for authenticated user before making requests
2. Handle loading and error states in components
3. Use Firestore timestamps for consistency
4. Implement proper cleanup of listeners when components unmount
5. Consider pagination for large datasets
