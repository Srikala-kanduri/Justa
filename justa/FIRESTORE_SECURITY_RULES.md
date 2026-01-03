# Firestore Security Rules for JUSTA

Copy and paste these rules into your Firestore console to secure your database.

## Production-Ready Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check user ownership
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // ==================== ESTIMATIONS COLLECTION ====================
    
    // Allow users to read their own estimations
    match /estimations/{estimationId} {
      allow read: if isAuthenticated() && 
                      isOwner(resource.data.userId);
      
      // Allow authenticated users to create estimations
      allow create: if isAuthenticated() && 
                       isOwner(request.resource.data.userId) &&
                       request.resource.data.eventType != null &&
                       request.resource.data.attendees != null &&
                       request.resource.data.foodItems != null;
      
      // Allow users to update their own estimations
      allow update: if isAuthenticated() && 
                       isOwner(resource.data.userId);
      
      // Allow users to delete their own estimations
      allow delete: if isAuthenticated() && 
                       isOwner(resource.data.userId);
    }
    
    // ==================== FEEDBACK COLLECTION ====================
    
    // Allow users to read their own feedback
    match /feedback/{feedbackId} {
      allow read: if isAuthenticated() && 
                      isOwner(resource.data.userId);
      
      // Allow authenticated users to create feedback
      allow create: if isAuthenticated() && 
                       isOwner(request.resource.data.userId) &&
                       request.resource.data.estimationId != null &&
                       request.resource.data.sufficient != null &&
                       request.resource.data.leftoverLevel != null;
      
      // Allow users to update their own feedback
      allow update: if isAuthenticated() && 
                       isOwner(resource.data.userId);
      
      // Allow users to delete their own feedback
      allow delete: if isAuthenticated() && 
                       isOwner(resource.data.userId);
    }
    
    // ==================== DEFAULT DENY ====================
    
    // Deny all other access (default)
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## How to Apply These Rules

1. **Go to Firebase Console**
   - Navigate to your project: https://console.firebase.google.com
   - Select your JUSTA project

2. **Open Firestore Database**
   - Click on "Cloud Firestore" in the left menu
   - Click on "Rules" tab

3. **Replace Existing Rules**
   - Delete all existing content
   - Copy and paste the rules above
   - Click "Publish"

## Rules Explanation

### Authentication Check
- `isAuthenticated()` - Ensures only logged-in users can access data
- `isOwner(userId)` - Ensures users can only access their own data

### Estimations Collection Rules

| Operation | Permission | Conditions |
|-----------|-----------|-----------|
| **Read** | ✅ Allowed | User owns the estimation |
| **Create** | ✅ Allowed | User authenticated + has required fields |
| **Update** | ✅ Allowed | User owns the estimation |
| **Delete** | ✅ Allowed | User owns the estimation |

### Feedback Collection Rules

| Operation | Permission | Conditions |
|-----------|-----------|-----------|
| **Read** | ✅ Allowed | User owns the feedback |
| **Create** | ✅ Allowed | User authenticated + has required fields |
| **Update** | ✅ Allowed | User owns the feedback |
| **Delete** | ✅ Allowed | User owns the feedback |

## Data Validation

The rules enforce that required fields are present:

**For Estimations:**
- `eventType` - Must exist
- `attendees` - Must exist
- `foodItems` - Must exist
- `userId` - Must match current user

**For Feedback:**
- `estimationId` - Must exist (reference to estimation)
- `sufficient` - Must exist (yes/no)
- `leftoverLevel` - Must exist (none/low/high)
- `userId` - Must match current user

## Testing Rules

### In Firebase Console Rules Simulator

1. Click "Rules" tab in Firestore
2. Click "Simulate" button
3. Test different scenarios:

**Test 1: Authenticated user creating estimation**
- Authentication: Signed in as user ID "test_user_123"
- Operation: Create
- Resource: /estimations/test_estimation
- Document:
  ```json
  {
    "userId": "test_user_123",
    "eventType": "college",
    "attendees": 100,
    "foodItems": [...]
  }
  ```
- Expected: ✅ Allow

**Test 2: User trying to read another user's estimation**
- Authentication: Signed in as "user_A"
- Operation: Read
- Resource: /estimations/user_B_estimation
- Expected: ❌ Deny

**Test 3: Unauthenticated access**
- Authentication: Not signed in
- Operation: Any
- Expected: ❌ Deny

## Security Best Practices Implemented

1. ✅ **User Isolation** - Users can only access their own data
2. ✅ **Authentication Required** - All operations require login
3. ✅ **Field Validation** - Required fields are enforced
4. ✅ **Ownership Verification** - User ID must match request context
5. ✅ **Fail-Safe Default** - All undefined operations are denied
6. ✅ **Separation of Concerns** - Different rules for different collections

## Advanced Rules (Optional)

If you want to implement more advanced features:

### Rate Limiting
```javascript
// Limit document creation to 100 per day per user
match /estimations/{estimationId} {
  allow create: if isAuthenticated() && 
                   isOwner(request.resource.data.userId) &&
                   (request.time.toMillis() - 
                    get(/databases/$(database)/documents/users/$(request.auth.uid)/stats/usage).data.lastResetTime) 
                   < duration.value(24, 'h') &&
                   get(/databases/$(database)/documents/users/$(request.auth.uid)/stats/usage).data.createdToday < 100;
}
```

### Collection-Level Validation
```javascript
// Ensure estimations can only be created for existing users
match /estimations/{estimationId} {
  allow create: if exists(/databases/$(database)/documents/users/$(request.auth.uid));
}
```

## Troubleshooting

### Issue: "Missing or insufficient permissions"

**Cause:** Security rules are too restrictive

**Solution:** 
1. Check that user is authenticated
2. Verify userId matches in the document
3. Check required fields are present

### Issue: "Permission denied"

**Cause:** User trying to access another user's data

**Solution:** Data isolation is working correctly (this is expected behavior)

### Issue: Rules simulator shows "Allow" but app shows "Deny"

**Cause:** May be caching or session issues

**Solution:**
1. Clear browser cache
2. Log out and log back in
3. Check browser console for errors

## Firestore Best Practices

1. **Indexes** - Firestore automatically creates indexes for most queries
2. **Subcollections** - Consider subcollections for better scalability
3. **Denormalization** - Copy some data to avoid joins
4. **Batch Operations** - Use batch writes for multiple documents
5. **Listeners** - Use real-time listeners sparingly (costs more)

## Example: Production Deployment Checklist

- [ ] Update Firestore security rules
- [ ] Test all operations with simulator
- [ ] Enable authentication in Firebase Console
- [ ] Test authentication flow in app
- [ ] Set up Firebase billing alerts
- [ ] Enable Firestore backup
- [ ] Configure indexing for queries
- [ ] Monitor Firestore usage
- [ ] Document backup/recovery procedures
- [ ] Set up monitoring and alerts

## Support & Documentation

- Firestore Docs: https://firebase.google.com/docs/firestore
- Security Rules Guide: https://firebase.google.com/docs/firestore/security/start
- Rules Playground: https://firebase.google.com/docs/firestore/security/test-rules-in-console

---

**Important:** These rules provide data isolation but don't encrypt data at rest. For additional security, consider:
- Encrypting sensitive fields in your application code
- Using Firebase App Check to prevent API abuse
- Enabling VPC Service Controls for enterprise deployments
