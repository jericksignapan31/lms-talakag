# 🐛 Firebase Setup - Troubleshooting & FAQs

## ❓ Frequently Asked Questions

### Q1: What is LRN?
**A:** LRN = Learner Reference Number
- Unique identifier for each student
- Used as username and password
- Example: `1234567890`

### Q2: Why use LRN as password?
**A:** 
- Simple initial login
- Students memorize their LRN anyway
- Can be changed later after first login
- Matches existing student record system

### Q3: What is the email format?
**A:** `{LRN}@lms.talakag`
- Example: `1234567890@lms.talakag`
- Not a real email address
- Used only for Firebase authentication
- Can be updated to real email later

### Q4: Can I change the password?
**A:** Yes, implement password reset functionality:
```typescript
// After first login, students can change password
resetUserPassword(newPassword: string) {
  const user = this.auth.currentUser;
  if (user) {
    return updatePassword(user, newPassword);
  }
}
```

### Q5: What if a student forgets their password?
**A:** Password is their LRN. If they don't remember:
1. Check your student records
2. They should know their own LRN
3. Implement "Password Reset" email feature

### Q6: Can I add more students later?
**A:** Yes, anytime! Just:
1. Add document in Firestore `students` collection
2. Create user in Firebase Authentication
3. Done!

### Q7: What about multiple people with same LRN?
**A:** Should not happen. LRN must be unique:
1. Before adding student, check LRN doesn't exist
2. Add validation in your form
3. Check during import

### Q8: How do I backup the data?
**A:** Firebase has backup options:
1. Go to Firebase Console
2. Settings → Backups
3. Enable automatic backups
4. Or export data manually

### Q9: Can I migrate from another system?
**A:** Yes:
1. Export student data from old system
2. Import to Firestore (batch import)
3. Create auth accounts programmatically
4. Test thoroughly

### Q10: How much does this cost?
**A:** Firebase has free tier:
- First 50K reads/day free
- First 20K writes/day free
- First 1GB storage free
- Perfect for small LMS

---

## 🚨 COMMON ERRORS & SOLUTIONS

### ERROR 1: "user-not-found"
```
Message: User not found in Firebase Authentication

❌ What went wrong:
- Email doesn't exist in Auth
- Example: typed 1234567891 but account is 1234567890

✅ How to fix:
1. Go to Firebase Authentication
2. Check exact email spelling
3. Verify it exists in your user list
4. Try creating account again if missing
```

### ERROR 2: "wrong-password"
```
Message: The password is invalid or the user does not have a password

❌ What went wrong:
- Password doesn't match LRN
- Example: entered password "wrong123" but should be "1234567890"

✅ How to fix:
1. Verify password equals LRN
2. Check for spaces before/after
3. Verify correct caps (should be lowercase numbers)
4. Try Password Reset if forgotten
```

### ERROR 3: "invalid-email"
```
Message: The email address is badly formatted

❌ What went wrong:
- Email format is incorrect
- Example: typed "1234567890@gmail.com" but should be "1234567890@lms.talakag"

✅ How to fix:
1. Use exact format: {LRN}@lms.talakag
2. No spaces
3. Lowercase only
4. Exactly 13 characters (10 digits + @lms.talakag)
```

### ERROR 4: "email-already-in-use"
```
Message: The email address is already in use by another account

❌ What went wrong:
- Tried to create account with existing email
- Already created this user before

✅ How to fix:
1. Go to Firebase Authentication
2. Check if user already exists
3. If yes, don't create again
4. If duplicate, delete old one first
```

### ERROR 5: "Permission denied" (Firestore)
```
Message: Missing or insufficient permissions

❌ What went wrong:
- Firestore Rules are in Production Mode
- Rules don't allow reading student data
- User not authenticated

✅ How to fix:
1. Go to Firestore Database → Rules
2. Change to Test Mode (allow all):
   match /{document=**} { allow read, write: if true; }
3. Or add authenticated user rule:
   allow read, write: if request.auth != null;
4. Click PUBLISH
5. Wait a few seconds
6. Try login again
```

### ERROR 6: "Database not initialized"
```
Message: Firestore database is not initialized or not READY

❌ What went wrong:
- Tried to use database before it finished creating
- Database creation still in progress
- Firestore instance not loaded

✅ How to fix:
1. Go to Firestore Database
2. Check status at top
3. Should say "READY" (not "Creating")
4. Wait 2-3 minutes if still creating
5. Refresh page after it's ready
6. Try again
```

### ERROR 7: "LMS Auth Service not found"
```
Message: Cannot find module '...lms-auth.service'

❌ What went wrong:
- Component trying to import auth service
- File doesn't exist or path is wrong

✅ How to fix:
1. Verify file exists: src/app/services/lms-auth.service.ts
2. Check import path is correct
3. Example correct import:
   import { LmsAuthService } from '../services/lms-auth.service';
4. Check spelling and capitalization
```

### ERROR 8: "Firestore collection empty"
```
Message: When login works but student data is blank

❌ What went wrong:
- Student document not found in Firestore
- LRN doesn't match between Firestore and Auth
- Collection name is wrong

✅ How to fix:
1. Go to Firestore → students collection
2. Check if document exists with this LRN
3. If missing, add it manually
4. Verify LRN field exactly matches login LRN
5. Verify all fields have data (not empty)
```

### ERROR 9: "CORS error"
```
Message: Access to XMLHttpRequest blocked by CORS policy

❌ What went wrong:
- Frontend and backend on different ports
- Security headers not configured
- Usually won't happen with Firebase

✅ How to fix:
1. Check if using correct proxy configuration
2. See proxy.conf.json file
3. Usually Firebase handles CORS automatically
4. Check browser console for exact error
```

### ERROR 10: "Timestamp error"
```
Message: Error with createdAt timestamp field

❌ What went wrong:
- Trying to set timestamp as string
- Firebase expects Timestamp type, not string

✅ How to fix:
1. In Firestore console, createdAt should be "timestamp" type
2. Click field, select "timestamp" from dropdown
3. Or in code:
   createdAt: serverTimestamp()
```

---

## 🔍 DEBUGGING TIPS

### Tip 1: Check Browser Console
```
1. Open app: http://localhost:4200
2. Press F12 (open Developer Tools)
3. Go to Console tab
4. Try login
5. Look for red error messages
6. Copy error and search online
```

### Tip 2: Check Firebase Console Logs
```
1. Go to Firebase Console
2. Click "Build" → "Functions" 
3. Or go to Authentication → "Logs" tab
4. Check for failed login attempts
5. Shows error messages
```

### Tip 3: Verify Data Exists
```
1. Firestore Console
2. Click "students" collection
3. See if document is there
4. Check if all fields are populated
5. No empty fields

In Auth:
1. Authentication → Users
2. See if user email exists
3. Check user was created successfully
```

### Tip 4: Enable Debug Logging
```typescript
// In your app, enable Firebase debug:
import { getAuth, enableLogging } from 'firebase/auth';
enableLogging(true); // Shows Firebase auth logs

// In console you'll see:
// [AUTH] Sign in with email and password
// [AUTH] User authenticated: {...}
```

### Tip 5: Test with Console
```javascript
// Open browser console and test manually:

// Test 1: Check if Firestore loaded
console.log(db) // Should show Firestore instance

// Test 2: Query students
db.collection("students").get().then(snap => {
  console.log("Students found:", snap.size);
  snap.forEach(doc => console.log(doc.data()));
});

// Test 3: Check authenticated user
console.log(auth.currentUser); // Current user or null
```

---

## ✅ VERIFICATION STEPS

### Before Testing Login:

```
CHECKLIST:

Firebase Console:
[ ] Firestore Database exists and is READY
[ ] Location is Southeast Asia
[ ] "students" collection exists
[ ] See 4 student documents in collection
[ ] Each document has all required fields:
    [ ] lrn (string)
    [ ] name (string)
    [ ] email (string)
    [ ] sex (string)
    [ ] birthDate (string)
    [ ] address (string)
    [ ] barangay (string)
    [ ] municipality (string)
    [ ] province (string)
    [ ] contactNumber (string)
    [ ] learningModality (string)

Authentication:
[ ] Email/Password provider is ENABLED
[ ] See 4 users in Users list
[ ] Each user has:
    [ ] Email: {LRN}@lms.talakag
    [ ] Password set
    [ ] User ID assigned

Your App:
[ ] npm run start:dev is running
[ ] No errors in terminal
[ ] App loads at http://localhost:4200
[ ] Login page accessible at /auth/login
```

---

## 🔒 SECURITY CHECKLIST

### Before Going to Production:

```
Security Rules:
[ ] Update Firestore Rules to production mode
[ ] Students can only read their own data
[ ] Teachers can read all but only write their courses
[ ] Admin only can delete or modify

Environment Variables:
[ ] Move Firebase config to environment variables
[ ] Don't commit config to Git
[ ] Use .env file for sensitive data

Authentication:
[ ] Password reset email enabled
[ ] 2FA optional
[ ] Login rate limiting (prevent brute force)
[ ] HTTPS only

Database:
[ ] Backups enabled
[ ] Data encryption at rest
[ ] Regular backups scheduled
[ ] Test restore process

API:
[ ] Rate limiting on API calls
[ ] Input validation
[ ] Output sanitization
[ ] Error messages don't leak info
```

---

## 📞 GET HELP

### If still stuck:

1. **Check Documentation:**
   - Firebase Docs: https://firebase.google.com/docs
   - Firestore Guide: https://firebase.google.com/docs/firestore
   - Auth Guide: https://firebase.google.com/docs/auth

2. **Search Issues:**
   - Stack Overflow: firebase + your error
   - GitHub Issues: firebase-js-sdk
   - Firebase Community: firebasecommunity.slack.com

3. **Contact Support:**
   - Firebase Support: https://firebase.google.com/support/contact
   - Google Cloud Support (for paid projects)

---

## 📊 Quick Health Check

Run this to verify everything is working:

```typescript
import { inject } from '@angular/core';
import { FirestoreStudentService } from './services/firestore-student.service';
import { LmsAuthService } from './services/lms-auth.service';

export class HealthCheckComponent {
  private studentService = inject(FirestoreStudentService);
  private authService = inject(LmsAuthService);

  async checkHealth() {
    console.log('🔍 Performing health check...');
    
    try {
      // Check 1: Can we read students?
      const students = await this.studentService.getStudents();
      console.log(`✅ Firestore: ${students.length} students found`);
      
      // Check 2: Can we query by LRN?
      const student = await this.studentService.getStudentByLRN('1234567890');
      console.log(`✅ Query: Student found - ${student?.name}`);
      
      // Check 3: Is auth service ready?
      console.log(`✅ Auth: Service initialized`);
      
      console.log('✅ All systems operational!');
    } catch (error) {
      console.error('❌ Health check failed:', error);
    }
  }
}

// Usage: Call checkHealth() after app loads
```

---

**🎓 Now you're equipped to troubleshoot! Good luck! 🚀**
