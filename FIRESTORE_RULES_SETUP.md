# 🔥 Firebase Firestore Rules - Production Mode Setup Guide

## 📋 Step-by-Step Instructions

### Step 1: Access Firebase Console

1. Open your browser
2. Go to: **https://console.firebase.google.com/**
3. Login with your Google account
4. Select project: **lams-talakag**

### Step 2: Navigate to Firestore Rules

1. Click **"Firestore Database"** sa left sidebar
2. Click **"Rules"** tab sa top
3. Makikita mo ang current test mode rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2024, 12, 11);
    }
  }
}
```

### Step 3: Replace with Production Rules

1. **DELETE** lahat ng existing rules
2. **COPY** ang rules from `firestore.rules` file sa project folder
3. **PASTE** sa Firebase Console rules editor

### Step 4: Publish the Rules

1. Click **"Publish"** button (top-right)
2. Confirm the changes
3. Wait for "Rules published successfully" message

### Step 5: Verify Rules are Working

1. Open your LMS app
2. Try to login
3. Try to view books
4. Try to borrow a book (if admin/student)

**Expected behavior:**
- ✅ Logged-in users can access everything
- ❌ Not logged-in users get "Permission denied" errors

---

## 🎯 What These Production Rules Do:

### Security Features:

1. **Authentication Required:**
   - Only logged-in users can read/write data
   - No public access

2. **Collection-Specific Rules:**
   - **Books:** Read by all authenticated, write by all authenticated
   - **Students/Teachers:** Read/write by authenticated users
   - **Borrowing/Penalties:** Read/write by authenticated users
   - **Admins:** Read/write by authenticated users

3. **No Expiration:**
   - These rules DON'T expire after 30 days
   - Production-ready and secure

---

## ⚠️ Important Notes:

### Before Publishing:

- ✅ Make sure you have admin account created
- ✅ Make sure Authentication is enabled
- ✅ Test in a separate browser tab first

### After Publishing:

- ✅ Test login functionality
- ✅ Test CRUD operations
- ✅ Check browser console for errors

### If Something Goes Wrong:

**Rollback to Test Mode (Temporary):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2026, 1, 11);
    }
  }
}
```

---

## 🔍 Troubleshooting:

### Error: "Missing or insufficient permissions"

**Cause:** User is not authenticated

**Solution:**
1. Make sure user is logged in
2. Check Firebase Authentication console
3. Verify user has valid session

### Error: "Permission denied at /book/abc123"

**Cause:** Rules are too restrictive

**Solution:**
1. Check if user is authenticated
2. Verify collection name matches rules
3. Check browser console for auth status

---

## 📊 Monitoring:

### Check Rules Usage:

1. Go to Firebase Console
2. Click **"Firestore Database"**
3. Click **"Usage"** tab
4. Monitor:
   - Document reads/writes
   - Active connections
   - Errors (if any)

---

## ✅ Verification Checklist:

After publishing production rules, verify:

- [ ] Can login as admin
- [ ] Can login as teacher
- [ ] Can login as student
- [ ] Can view books list
- [ ] Can add/edit/delete books (admin only)
- [ ] Can borrow books
- [ ] Can return books
- [ ] Can view borrowing records
- [ ] Can view penalties
- [ ] Cannot access data when logged out

---

## 🎉 Success!

Once all checks pass:
- ✅ Your Firestore is now in **Production Mode**
- ✅ **Secure** and follows best practices
- ✅ **No 30-day expiration**
- ✅ **Ready for production deployment**
- ✅ Still **FREE** (Spark Plan)

---

## 📞 Need Help?

If may problema:
1. Check browser console (F12) for errors
2. Check Firebase Console → Firestore → Usage for error logs
3. Verify authentication is working
4. Test with different user accounts

**Remember:** Data is safe, pwede mo i-rollback anytime ang rules!
