# Firebase Integration Guide for LMS Talakag

## Step 1: Create Firebase Project

### 1.1 Go to Firebase Console
1. Visit https://console.firebase.google.com/
2. Click "Add project"
3. Enter project name: `lms-talakag` (or any name you prefer)
4. Follow the setup wizard
5. Finish creating the project


### 1.2 Get Firebase Configuration
1. In Firebase Console, go to Project Settings (gear icon)
2. Click "Your apps" or scroll to find your web app
3. Click "Add app" → "Web"
4. Copy the firebaseConfig object (you'll need this)

Example format:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 1.3 Enable Services in Firebase
1. Go to **Build** section → **Authentication**
   - Click "Get started"
   - Enable "Email/Password" provider
2. Go to **Build** section → **Firestore Database**
   - Click "Create database"
   - Start in **Test mode** (for development)
   - Choose a location (e.g., Southeast Asia)

---

## Step 2: Install Firebase Packages

Run these commands in your project terminal:

```bash
npm install firebase @angular/fire
```

This installs:
- `firebase` - Firebase SDK
- `@angular/fire` - Angular bindings for Firebase

---

## Step 3: Create Firebase Environment Configuration

Create a new file: `src/environments/firebase.config.ts`

```typescript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_AUTH_DOMAIN_HERE",
  projectId: "YOUR_PROJECT_ID_HERE",
  storageBucket: "YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "YOUR_APP_ID_HERE"
};
```

⚠️ **Important:** Add this file to `.gitignore` to keep your API keys secret!

---

## Step 4: Update app.config.ts with Firebase Providers

Update your `src/app.config.ts` to include Firebase providers.

---

## Step 5: Create Firebase Service

Create `src/services/firebase.service.ts` to manage Firebase operations:
- User authentication (login, logout, register)
- Firestore database operations (CRUD for students, courses, etc.)

---

## Step 6: Migrate Auth Service

Update `src/app/pages/auth/auth.service.ts` to use Firebase instead of JSON server.

---

## Step 7: Create Firestore Services

Create services for:
- **students.service.ts** - Manage student data
- **courses.service.ts** - Manage course data
- **enrollments.service.ts** - Manage enrollments

---

## Step 8: Test and Verify

1. Start your dev server: `npm start` or `ng serve`
2. Test login with Firebase credentials
3. Test CRUD operations on Firestore

---

## Database Structure (Firestore Collections)

```
Firestore/
├── users/
│   └── {uid}
│       ├── email: string
│       ├── role: 'admin' | 'teacher' | 'student'
│       └── name: string
│
├── students/
│   └── {studentId}
│       ├── lrn: string
│       ├── name: string
│       ├── email: string
│       ├── sex: string
│       ├── birthDate: date
│       ├── address: string
│       └── ...more fields
│
├── courses/
│   └── {courseId}
│       ├── code: string
│       ├── title: string
│       ├── teacherId: reference
│       └── description: string
│
└── enrollments/
    └── {enrollmentId}
        ├── studentId: reference
        ├── courseId: reference
        └── enrollmentDate: date
```

---

## Quick Reference

### Login with Firebase
```typescript
this.auth.signInWithEmailAndPassword(email, password)
```

### Read from Firestore
```typescript
this.firestore.collection('students').doc(id).get()
```

### Write to Firestore
```typescript
this.firestore.collection('students').doc(id).set(data)
```

### Delete from Firestore
```typescript
this.firestore.collection('students').doc(id).delete()
```

---

## Next Steps After This Guide

1. Set up your students in Firestore
2. Create user accounts with email/password
3. Link student records to user accounts
4. Set up Firestore security rules
5. Deploy to production

---

**Ready? Let's start! Follow the steps below.**
