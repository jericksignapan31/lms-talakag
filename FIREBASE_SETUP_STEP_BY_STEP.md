# 🚀 Complete Firebase Setup Guide - Step by Step

## 📌 What We'll Do

1. Create Firestore Database
2. Create Students Collection
3. Add Student Documents
4. Create Firebase Auth Accounts linked to LRN
5. Test the entire flow

---

## STEP 1: Create Firestore Database

### 1.1 Go to Firebase Console
1. Open: https://console.firebase.google.com/
2. Select project: **lams-talakag**
3. Click **Build** in left sidebar
4. Select **Firestore Database**

### 1.2 Create Database
1. Click **Create database**
2. Choose location:
   - 🌍 Select: **Singapore (asia-southeast1)**
   - Closest available region to Philippines
3. Choose security mode:
   - ✅ Select: **Start in test mode**
   - ℹ️ For development only (allows all reads/writes)
4. Click **Create**
5. Wait 2-3 minutes for initialization

### 1.3 Verify Database Created
- You should see: "Firestore Database"
- Status: "READY"
- Location: "asia-southeast1" (Singapore)

---

## STEP 2: Create Students Collection

### 2.1 Create Collection
1. In Firestore console, click **Start collection**
2. Collection ID: `students` (exactly this)
3. Click **Next**

### 2.2 Add First Document
1. Click **Auto ID** (Firestore generates ID)
2. Click **Create**

Now you'll see field editor. Add these fields:

```
Field Name    Type        Value
-----------   ---------   --------------------------------
lrn           string      1234567890
name          string      Juan Santos
email         string      juan@lms.com
sex           string      Male
birthDate     string      2008-05-15
address       string      123 Main Street
barangay      string      Tagumpay
municipality  string      Talakag
province      string      Bukidnon
contactNumber string      09123456789
learningModality string    Face-to-Face
createdAt     timestamp   (current date/time)
```

### 2.3 Save Document
1. Click **Save**
2. You should see document ID generated

---

## STEP 3: Add More Student Documents

### Method: Add via Firebase Console

Repeat Step 2.2 for each student. Here are sample students:

### Student 2: Maria Cruz
```
lrn           1234567891
name          Maria Cruz
email         maria@lms.com
sex           Female
birthDate     2008-08-20
address       456 Oak Avenue
barangay      Sumasama
municipality  Talakag
province      Bukidnon
contactNumber 09234567890
learningModality Online
createdAt     (current date/time)
```

### Student 3: Pedro Reyes
```
lrn           1234567892
name          Pedro Reyes
email         pedro@lms.com
sex           Male
birthDate     2007-12-10
address       789 Pine Road
barangay      Poblacion
municipality  Talakag
province      Bukidnon
contactNumber 09345678901
learningModality Hybrid
createdAt     (current date/time)
```

### Student 4: Angela Santos
```
lrn           1234567893
name          Angela Santos
email         angela@lms.com
sex           Female
birthDate     2009-03-25
address       321 Maple Lane
barangay      Tagumpay
municipality  Talakag
province      Bukidnon
contactNumber 09456789012
learningModality Face-to-Face
createdAt     (current date/time)
```

---

## STEP 4: Create Firebase Auth Accounts

### 4.1 Go to Authentication
1. In Firebase Console, click **Build**
2. Select **Authentication**
3. Click **Get Started**

### 4.2 Enable Email/Password Provider
1. Click **Email/Password** option
2. Toggle **Enable**
3. Keep "Password required" checked
4. Click **Save**

---

## STEP 5: Create User Accounts Manually

After enabling Email/Password, you'll see a **Users** section appear on the same Authentication page.

For each student, create auth account with:
- **Email:** `{LRN}@lms.talakag`
- **Password:** `{LRN}` (same as email prefix)

### Account 1: Juan Santos
1. In the **Users** section, click the **Add user** button (top right)
2. Email: `1234567890@lms.talakag`
3. Password: `1234567890`
4. Click **Add user**
5. ✅ User created

### Account 2: Maria Cruz
1. Click **Add user** button again
2. Email: `1234567891@lms.talakag`
3. Password: `1234567891`
4. Click **Add user**

### Account 3: Pedro Reyes
1. Click **Add user** button again
2. Email: `1234567892@lms.talakag`
3. Password: `1234567892`
4. Click **Add user**

### Account 4: Angela Santos
1. Click **Add user** button again
2. Email: `1234567893@lms.talakag`
2. Password: `1234567893`
3. Click **Add user**

---

## STEP 6: Verify Everything

### 6.1 Check Firestore Students Collection
1. Go to Firestore Database
2. Click **students** collection
3. Should see 4 documents:
   - Document 1: Juan Santos (LRN: 1234567890)
   - Document 2: Maria Cruz (LRN: 1234567891)
   - Document 3: Pedro Reyes (LRN: 1234567892)
   - Document 4: Angela Santos (LRN: 1234567893)

### 6.2 Check Firebase Auth Users
1. Go to Authentication
2. Click **Users** tab
3. Should see 4 users:
   - 1234567890@lms.talakag
   - 1234567891@lms.talakag
   - 1234567892@lms.talakag
   - 1234567893@lms.talakag

---

## STEP 7: Test Login in Your App

### 7.1 Start Your App
```bash
npm run start:dev
```

### 7.2 Navigate to Login
- URL: `http://localhost:4200/auth/login`

### 7.3 Test Login with Student 1
1. **LRN Field:** `1234567890`
2. **Password Field:** `1234567890`
3. Click **Login**
4. ✅ Should show success message
5. Should redirect to dashboard

### 7.4 Test Login with Student 2
1. **LRN Field:** `1234567891`
2. **Password Field:** `1234567891`
3. Click **Login**
4. ✅ Should show success message with "Maria Cruz"

### 7.5 Test Wrong Password
1. **LRN Field:** `1234567890`
2. **Password Field:** `wrong_password`
3. Click **Login**
4. ✅ Should show error "Invalid LRN or password"

---

## 🗂️ Database Structure Summary

### Firestore Collections Created:
```
Firestore/
└── students/ (collection)
    ├── auto-id-1/ (document)
    │   ├── lrn: "1234567890"
    │   ├── name: "Juan Santos"
    │   ├── email: "juan@lms.com"
    │   └── ... (other fields)
    │
    ├── auto-id-2/ (document)
    │   ├── lrn: "1234567891"
    │   ├── name: "Maria Cruz"
    │   └── ... (other fields)
    │
    └── ... (more documents)
```

### Firebase Auth Users:
```
Firebase Auth/
├── 1234567890@lms.talakag (Password: 1234567890)
├── 1234567891@lms.talakag (Password: 1234567891)
├── 1234567892@lms.talakag (Password: 1234567892)
└── 1234567893@lms.talakag (Password: 1234567893)
```

---

## 🔗 How the Link Works

```
Student Login Page
    ↓
User enters:
- LRN: 1234567890
- Password: 1234567890
    ↓
LmsAuthService processes:
1. Validates password === LRN ✓
2. Creates email: "1234567890@lms.talakag"
3. Calls Firebase Auth login with this email & password
    ↓
Firebase Auth verifies:
- Email: "1234567890@lms.talakag" exists? ✓
- Password: "1234567890" matches? ✓
- User authenticated ✓
    ↓
LmsAuthService then:
1. Gets LRN from email
2. Queries Firestore students collection: where lrn == "1234567890"
3. Finds document with all student details
    ↓
Returns AuthenticatedUser:
{
  uid: "...",
  email: "1234567890@lms.talakag",
  studentData: {
    lrn: "1234567890",
    name: "Juan Santos",
    sex: "Male",
    birthDate: "2008-05-15",
    ... (all other fields)
  },
  role: "student"
}
    ↓
Dashboard shows:
- Welcome, Juan Santos!
- Student Profile with all data
```

---

## 📸 Screenshots of Steps

### After Step 1: Database Created
```
Firestore Database
├── Status: READY
├── Location: asia-southeast1 (Southeast Asia)
└── Database ID: (default)
```

### After Step 2: Students Collection with Data
```
students collection
├── Document 1
│   ├── lrn: "1234567890"
│   ├── name: "Juan Santos"
│   └── ... (all fields visible in table)
├── Document 2
├── Document 3
└── Document 4
```

### After Step 4: Auth Accounts Created
```
Authentication / Users
├── 1234567890@lms.talakag
│   └── Created: [timestamp]
├── 1234567891@lms.talakag
├── 1234567892@lms.talakag
└── 1234567893@lms.talakag
```

---

## ⚙️ Firestore Security Rules (Test Mode)

Current rules allow all access (for development):

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

### Later for Production, use:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read
    match /students/{studentId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.admin == true;
    }
  }
}
```

---

## ✅ Checklist

- [ ] Opened Firebase Console
- [ ] Created Firestore Database in Southeast Asia
- [ ] Created "students" collection
- [ ] Added 4 student documents with all fields
- [ ] Enabled Email/Password in Authentication
- [ ] Created 4 auth accounts (LRN format)
- [ ] Verified students in Firestore
- [ ] Verified users in Auth
- [ ] Started app and tested login
- [ ] Verified successful login redirects

---

## 🆘 Troubleshooting

### Problem: "Collection not found"
**Solution:**
1. Make sure collection name is exactly: `students`
2. Check Firestore database is "READY"
3. Refresh page

### Problem: "Invalid LRN or password"
**Solution:**
1. Verify email exists: `{LRN}@lms.talakag`
2. Verify password matches LRN exactly
3. Check both in Firebase Auth console

### Problem: Login works but student data not showing
**Solution:**
1. Verify student document exists in Firestore
2. Check LRN field matches auth email prefix
3. Verify all required fields are in document

### Problem: "Permission denied" error
**Solution:**
1. Check Firestore Rules are in "Test Mode"
2. Or allow authenticated users to read:
   ```javascript
   allow read: if request.auth != null;
   ```

---

## 📱 Test Credentials

| LRN | Name | Email | Password |
|-----|------|-------|----------|
| 1234567890 | Juan Santos | 1234567890@lms.talakag | 1234567890 |
| 1234567891 | Maria Cruz | 1234567891@lms.talakag | 1234567891 |
| 1234567892 | Pedro Reyes | 1234567892@lms.talakag | 1234567892 |
| 1234567893 | Angela Santos | 1234567893@lms.talakag | 1234567893 |

---

## 🎓 Next Steps

After this setup is complete:

1. ✅ Students data in Firestore
2. ✅ Auth accounts created
3. ⏳ Add Courses collection
4. ⏳ Add Enrollments collection
5. ⏳ Build student dashboard
6. ⏳ Add course enrollment UI
7. ⏳ Add attendance tracking
8. ⏳ Add grades management
9. ⏳ Deploy to production

---

## 📞 Need Help?

If something doesn't work:
1. Check Firebase Console status
2. Verify all steps completed
3. Check browser console for errors (F12)
4. Verify internet connection

---

**You're all set! Your Firebase is now configured! 🎉**
