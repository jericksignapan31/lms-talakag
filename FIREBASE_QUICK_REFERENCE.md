# 🎯 Firebase Setup - Quick Reference Card

## Print This & Keep Handy!

---

## FIRESTORE DATABASE SETUP

### Step 1: Create Database
```
URL: https://console.firebase.google.com/
Project: lams-talakag
Location: Singapore (asia-southeast1)
Mode: Test Mode
```

### Step 2: Create Collection
```
Collection ID: students
(exactly lowercase, no spaces)
```

### Step 3: Add Fields for Each Student
```
lrn              → string → Student's Learner Reference Number
name             → string → Full name
email            → string → Email address
sex              → string → Male/Female
birthDate        → string → YYYY-MM-DD format
address          → string → Street address
barangay         → string → Barangay name
municipality     → string → Municipality (Talakag)
province         → string → Province (Bukidnon)
contactNumber    → string → Phone number
learningModality → string → Face-to-Face/Online/Hybrid
```

---

## FIREBASE AUTHENTICATION SETUP

### Step 1: Enable Email/Password
```
Build → Authentication → Get Started
Click: Email/Password
Toggle: Enable
Save
```

### Step 2: Add Users
```
Go to: Build → Authentication → Users tab
Click: Add User button (top right)
Email: {LRN}@lms.talakag
Password: {LRN}
Click: Add User button
```

---

## TEST CREDENTIALS

```
╔══════════╦════════════╦═════════════════════════════════╦════════════════╗
║ Student  ║ LRN        ║ Email                           ║ Password       ║
╠══════════╬════════════╬═════════════════════════════════╬════════════════╣
║ Juan     ║ 1234567890 ║ 1234567890@lms.talakag          ║ 1234567890     ║
║ Maria    ║ 1234567891 ║ 1234567891@lms.talakag          ║ 1234567891     ║
║ Pedro    ║ 1234567892 ║ 1234567892@lms.talakag          ║ 1234567892     ║
║ Angela   ║ 1234567893 ║ 1234567893@lms.talakag          ║ 1234567893     ║
╚══════════╩════════════╩═════════════════════════════════╩════════════════╝
```

---

## STUDENT DATA TEMPLATE

Copy & fill for each student:

```json
{
  "lrn": "1234567890",
  "name": "Juan Santos",
  "email": "juan@lms.com",
  "sex": "Male",
  "birthDate": "2008-05-15",
  "address": "123 Main Street",
  "barangay": "Tagumpay",
  "municipality": "Talakag",
  "province": "Bukidnon",
  "contactNumber": "09123456789",
  "learningModality": "Face-to-Face"
}
```

---

## QUICK CHECKLIST

### Firestore Setup
- [ ] Database created (Status: READY)
- [ ] Location: Southeast Asia ✓
- [ ] "students" collection created
- [ ] 4 student documents added
- [ ] All fields populated

### Authentication Setup
- [ ] Email/Password enabled
- [ ] 4 user accounts created
- [ ] Each user has password = LRN

### Testing
- [ ] App running: npm run start:dev
- [ ] Login page loads: /auth/login
- [ ] Test login works
- [ ] Student data displays

---

## TROUBLESHOOTING QUICK FIXES

| Problem | Solution |
|---------|----------|
| "User not found" | Email doesn't exist in Auth. Check exact spelling: {LRN}@lms.talakag |
| "Wrong password" | Password must equal LRN exactly |
| "Permission denied" | Change Firestore Rules to Test Mode |
| "Collection not found" | Name must be exactly "students" (lowercase) |
| "No student data" | Add document to Firestore students collection |
| Blank login page | Check app is running: npm run start:dev |
| Login infinitely loops | Check if dashboard route exists |

---

## FIREBASE CONSOLE LINKS

Bookmark these:

```
Firestore Database:
https://console.firebase.google.com/project/lams-talakag/firestore/data

Authentication:
https://console.firebase.google.com/project/lams-talakag/authentication/users

Project Settings:
https://console.firebase.google.com/project/lams-talakag/settings/general
```

---

## CODE EXAMPLES

### Login with LRN
```typescript
// In component
private authService = inject(LmsAuthService);

login(lrn: string, password: string) {
  this.authService.loginWithLRN(lrn, password).subscribe(
    user => {
      console.log('Welcome,', user?.studentData?.name);
      // Redirect to dashboard
    }
  );
}
```

### Get Current Student
```typescript
// In component
currentStudent$ = this.authService.getCurrentUser();

// In template
<div>{{ (currentStudent$ | async)?.studentData?.name }}</div>
```

### Fetch All Students
```typescript
private studentService = inject(FirestoreStudentService);

async loadStudents() {
  this.students = await this.studentService.getStudents();
}
```

---

## FIREBASE SECURITY RULES

### For Development (Test Mode)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### For Production
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /students/{studentId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.admin == true;
    }
  }
}
```

---

## EMAIL FORMAT RULES

```
Format: {LRN}@lms.talakag

✓ Correct:  1234567890@lms.talakag
✗ Wrong:    1234567890@gmail.com
✗ Wrong:    juan@lms.talakag
✗ Wrong:    1234567890 @lms.talakag (space)
```

---

## SETUP TIME

```
Task                              Time
─────────────────────────────────────
Create Database                   5 min
Create Collection                 5 min
Add 4 Students                    15 min
Setup Authentication              5 min
Create 4 Auth Accounts            8 min
Verify Everything                 5 min
Test Login                         5 min
─────────────────────────────────────
TOTAL                             48 min
```

---

## KEYBOARD SHORTCUTS

```
F12           Open Developer Console
Ctrl+Shift+I  Open DevTools (alternative)
F5            Refresh page
Ctrl+L        Focus address bar
```

---

## COMMON MISTAKES TO AVOID

❌ Using wrong collection name (e.g., "student" instead of "students")
✅ Use exactly: "students"

❌ Using wrong email format (e.g., juan@lms.com)
✅ Use exactly: {LRN}@lms.talakag

❌ Password ≠ LRN
✅ Password must equal LRN

❌ Missing fields in student document
✅ Fill all required fields

❌ Forgetting to enable Email/Password auth
✅ Enable it in Firebase Console

❌ Using Production Mode rules
✅ Start with Test Mode

---

## SUCCESS INDICATORS

```
✅ You know you're done when:

1. Firestore shows 4 students
2. Auth shows 4 users
3. Login page loads without errors
4. Student can login with LRN
5. Dashboard shows student name
6. Student data displays correctly
7. Wrong password shows error
```

---

## REFERENCE DOCUMENTS

| Document | Purpose |
|----------|---------|
| FIREBASE_SETUP_STEP_BY_STEP.md | Detailed step-by-step |
| FIREBASE_VISUAL_GUIDE.md | Visual diagrams |
| FIREBASE_TROUBLESHOOTING.md | Error solutions |
| LMS_AUTH_SETUP_GUIDE.md | Architecture |
| This document | Quick reference |

---

## DATABASE SCHEMA

```
Firestore
└── students/
    └── {auto-id}
        ├── lrn: "1234567890"
        ├── name: "Juan Santos"
        ├── email: "juan@lms.com"
        ├── sex: "Male"
        ├── birthDate: "2008-05-15"
        ├── address: "123 Main Street"
        ├── barangay: "Tagumpay"
        ├── municipality: "Talakag"
        ├── province: "Bukidnon"
        ├── contactNumber: "09123456789"
        └── learningModality: "Face-to-Face"
```

---

## AUTH FLOW

```
Enter LRN & Password
        ↓
LmsAuthService validates
        ↓
Firebase Auth checks email/password
        ↓
Firestore queries student data
        ↓
Returns combined user object
        ↓
Dashboard shows student info
```

---

**Print this page and keep it handy while setting up! 📋**

**Questions? Open the full guides in documentation/ folder**

**Ready? Go to FIREBASE_SETUP_STEP_BY_STEP.md! 🚀**
