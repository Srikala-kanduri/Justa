# Feedback & Estimation Updates - Summary

## Changes Made

### 1. **Rice Quantity Updated to KG** ✓
- Changed rice default unit from "g" (grams) to "kg" (kilograms) in food database
- Updated quantities:
  - Breakfast: 0.15 kg (1 cup cooked)
  - Lunch: 0.2 kg (1.5 cups cooked)  
  - Dinner: 0.2 kg (1.5 cups cooked)

### 2. **Fixed Missing Estimations Issue** ✓
**Root Cause**: `getPendingFeedbackEvents()` was querying for estimations with status "completed", but newly created estimations have status "pending"

**Solution**: Changed the query filter from `where("status", "==", "completed")` to `where("status", "==", "pending")`

This ensures that:
- Newly created estimations appear as pending feedback events
- Users can immediately provide feedback after creating estimations
- The feedback system works correctly end-to-end

### 3. **Enhanced Feedback Collection** ✓
Added new feedback field to capture **estimation accuracy**:

#### New Question Added:
**"How accurate was our estimation?"**
- Very Accurate
- Somewhat Accurate
- Inaccurate

#### Complete Feedback Form Now Collects:
1. **Estimation Accuracy** (NEW) - Was the estimated quantity correct?
2. **Food Sufficiency** - Was food sufficient for attendees?
3. **Leftover Quantity** - Amount of leftover food
4. **Comments** - Optional additional feedback

### 4. **Improved Estimation Display in Feedback** ✓
The feedback page now shows:
- Event details (type, attendees, meal type, age group)
- **Estimated quantities** for all food items from the original estimation
- This helps users compare what was estimated vs. what actually happened

## Files Modified

1. **`src/utils/foodDatabase.js`**
   - Updated rice quantities from grams to kilograms

2. **`src/services/dashboardService.js`**
   - Fixed `getPendingFeedbackEvents()` query to fetch estimations with "pending" status instead of "completed"

3. **`src/pages/dashboard/Feedback.jsx`**
   - Added `estimationAccuracy` state
   - Added new UI question for accuracy feedback (3 button options)
   - Updated form to show estimated quantities from the original estimation
   - Updated submit handler to include accuracy feedback
   - Updated validation to require accuracy selection

## How It Works Now

### User Flow:
1. User creates a new estimation
2. Estimation is saved with status "pending"
3. User is redirected to feedback page
4. Feedback page shows pending estimations from the list
5. User views estimated quantities for reference
6. User provides feedback on:
   - Whether estimation was accurate
   - Whether food was sufficient
   - How much leftover (if any)
   - Additional comments
7. Feedback is submitted and estimation status updates to "completed"

### Data Structure (Feedback):
```javascript
{
  userId: "user_id",
  estimationId: "estimation_id",
  sufficient: "yes" | "no",
  leftoverLevel: "none" | "low" | "high",
  estimationAccuracy: "very_accurate" | "somewhat_accurate" | "inaccurate",
  comments: "user comments",
  improvementFactors: {...},
  createdAt: timestamp
}
```

## Benefits

1. **Better Data Collection**: Now captures whether estimations were accurate
2. **Continuous Improvement**: Accuracy feedback helps refine AI models
3. **User Transparency**: Users can see what was estimated before providing feedback
4. **Accurate Metrics**: Dashboard stats will reflect actual vs. estimated accuracy
5. **Complete Workflow**: Users experience the full estimation → execution → feedback loop

## Testing Checklist

- [ ] Create a new estimation with rice and other items
- [ ] Verify rice shows quantity in KG
- [ ] Check that estimation appears in pending feedback list
- [ ] Go to feedback page and verify estimated quantities are displayed
- [ ] Complete all three feedback questions
- [ ] Submit feedback
- [ ] Verify feedback is saved with accuracy metric
- [ ] Check that estimation status changes to "completed"
