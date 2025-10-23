# 🎯 Firebase Login Testing Guide

## ✅ App is Running!

Your Angular app is now running at: **http://localhost:4200**

---

## 🧪 Testing the Firebase Login

### Step 1: Open the App
1. Go to: `http://localhost:4200`
2. You should see the **Login Page** with:
   - "Welcome to PrimeLand!" heading
   - LRN (Username) field
   - Password field (same as LRN)
   - Login button

### Step 2: Test Login with First Student

**Credentials:**
- **LRN (Username):** `1234567890`
- **Password:** `1234567890`

**Steps:**
1. Enter LRN: `1234567890` in the Username field
2. Enter Password: `1234567890` in the Password field
3. Click **Sign In** button
4. **Expected Result:** ✅ Login succeeds and redirects to dashboard

### Step 3: Test Login with Second Student

**Credentials:**
- **LRN (Username):** `1234567891`
- **Password:** `1234567891`

**Expected Result:** ✅ Should see "Maria Cruz" logged in

### Step 4: Test Wrong Password (Error Handling)

**Credentials:**
- **LRN (Username):** `1234567890`
- **Password:** `wrong_password`

**Expected Result:** ❌ Should show error message "Unable to sign in"

---

## 🔍 What's Happening Behind the Scenes

```
Login Flow:
┌─────────────────────────────────────────────────────────────┐
│ 1. User enters LRN: 1234567890                             │
│ 2. User enters Password: 1234567890                        │
│ 3. Click Login button                                       │
│                                                              │
│ 4. AuthService validates input                             │
│ 5. Calls LmsAuthService.loginWithLRN()                    │
│                                                              │
│ 6. LmsAuthService:                                         │
│    - Creates email: "1234567890@lms.talakag"              │
│    - Calls Firebase Auth with email & password            │
│                                                              │
│ 7. Firebase Auth checks if user exists and password matches│
│                                                              │
│ 8. If auth successful, queries Firestore:                │
│    - Gets student document where lrn == "1234567890"      │
│    - Returns student profile (Juan Santos)                │
│                                                              │
│ 9. AuthService stores token & user data in localStorage    │
│ 10. App redirects to /dashboard                            │
│ 11. Dashboard displays: "Welcome, Juan Santos!"            │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 All Test Credentials

| LRN | Name | Password |
|-----|------|----------|
| 1234567890 | Juan Santos | 1234567890 |
| 1234567891 | Maria Cruz | 1234567891 |
| 1234567892 | Pedro Reyes | 1234567892 |
| 1234567893 | Angela Santos | 1234567893 |

---

## 🐛 Troubleshooting

### Issue: "Unable to sign in" error with correct credentials

**Possible causes:**
1. Student data not in Firestore
2. Auth account not created in Firebase
3. Email/Password mismatch between Firebase Auth and LRN

**Solution:**
1. Open Firebase Console
2. Check Firestore → students collection
3. Verify 4 students are there
4. Check Authentication → Users
5. Verify 4 auth accounts exist

### Issue: Blank page or error in console

**Solution:**
1. Press **F12** to open Developer Console
2. Look for any error messages
3. Check Network tab for failed requests
4. Verify Firebase credentials in `environment.ts`

### Issue: "Firebase is not initialized"

**Solution:**
1. Check `app.config.ts` has `FirebaseService` in providers
2. Verify `environment.ts` has correct Firebase config
3. Check browser console for errors

---

## ✅ Success Checklist

When you see these, Firebase login is working:

- ✅ App loads without errors
- ✅ Login page displays correctly
- ✅ Can enter LRN and password
- ✅ Clicking Login doesn't crash
- ✅ Successful login redirects to dashboard
- ✅ Student name appears in dashboard
- ✅ Wrong password shows error message
- ✅ Browser console shows no errors
- ✅ Network requests to Firebase succeed

---

## 📊 What We're Testing

### Authentication Flow (Firebase Auth)
- Email/Password authentication with format: `{LRN}@lms.talakag`
- Password equals LRN
- Session management with localStorage

### Data Retrieval (Firestore)
- Fetching student data from Firestore collection
- Linking auth account to student profile
- Displaying student information on successful login

---

## 🎓 Next Steps After Successful Login

Once login is working:

1. ✅ **Build Dashboard** - Display student profile
2. ✅ **Add Navigation** - Menu to other pages
3. ✅ **Add Logout** - Sign out functionality
4. ✅ **Add Courses** - Display enrolled courses
5. ✅ **Add Grades** - Show student grades
6. ✅ **Add Attendance** - Track attendance

---

## 💾 Data Location

### Student Data
- **Location:** Firestore → students collection
- **Fields:** LRN, name, email, sex, birthDate, address, barangay, municipality, province, contactNumber, learningModality

### Auth Accounts
- **Location:** Firebase Authentication → Users
- **Format:** Email = {LRN}@lms.talakag, Password = {LRN}

### Session Data
- **Location:** Browser localStorage
- **Keys:** auth_token, auth_user

---

## 🔗 Quick Links

| Resource | URL |
|----------|-----|
| App | http://localhost:4200 |
| Login Page | http://localhost:4200/auth/login |
| Firebase Console | https://console.firebase.google.com/project/lams-talakag |
| Firestore Database | https://console.firebase.google.com/project/lams-talakag/firestore/data |
| Auth Users | https://console.firebase.google.com/project/lams-talakag/authentication/users |

---

## 📝 Notes

- The app redirects unauthenticated users to `/auth/login`
- Once logged in, the auth guard allows access to `/dashboard`
- Login session persists in localStorage
- Logout clears session and returns to login page

---

**Ready to test? Go to http://localhost:4200 and try logging in! 🚀**
