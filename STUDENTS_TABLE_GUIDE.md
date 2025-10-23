# 📋 Viewing Students Data - Guide

## ✅ Students Table is Now Available!

You can now view all students from Firestore in a table format!

---

## 🎯 How to Access Students Table

### Option 1: Direct URL
```
http://localhost:4200/students
```

### Option 2: Navigate from Dashboard
1. Login with your LRN credentials
2. You'll see the dashboard
3. Look for "Students" link in the sidebar menu (if available)
4. Click to view students table

---

## 📊 What You'll See

### Students Table Displays:
- ✅ **LRN** - Learner Reference Number
- ✅ **Name** - Full name of student
- ✅ **Email** - Student email
- ✅ **Sex** - Male/Female
- ✅ **Barangay** - Barangay location
- ✅ **Learning Mode** - Face-to-Face/Online/Hybrid
- ✅ **Actions** - Edit and Delete buttons

### Features:
- 📑 **Pagination** - 10 students per page
- 🔍 **Search** - Filter by LRN, Name, or Email
- 📈 **Sorting** - Click column headers to sort
- ✏️ **Edit** - Click pencil icon to edit student
- 🗑️ **Delete** - Click trash icon to delete student
- ➕ **Add New** - Add new student button at top

---

## 🧪 Test the Table

### Step 1: Login First
```
LRN: 1234567890
Password: 1234567890
```

### Step 2: Navigate to Students
```
http://localhost:4200/students
```

### Step 3: You Should See
- Students table with your 4 test students:
  1. Juan Santos (LRN: 1234567890)
  2. Maria Cruz (LRN: 1234567891)
  3. Pedro Reyes (LRN: 1234567892)
  4. Angela Santos (LRN: 1234567893)

---

## 🎨 Table Capabilities

### View All Students
- Table automatically loads all students from Firestore
- Data updates in real-time

### Add New Student
1. Click "Add New Student" button (top left)
2. Fill in all fields:
   - LRN (required)
   - Name (required)
   - Email, Sex, Birth Date
   - Address, Barangay, Municipality, Province
   - Contact Number
   - Learning Modality
3. Click "Save" button
4. New student appears in table

### Edit Student
1. Click pencil icon (✏️) in Actions column
2. Dialog opens with student data
3. Edit any field (except LRN)
4. Click "Save" button
5. Table updates with changes

### Delete Student
1. Click trash icon (🗑️) in Actions column
2. Confirm deletion in popup
3. Student removed from table and Firestore

### Search Students
1. At top of table, there's a search field
2. Type student LRN, Name, or Email
3. Table filters instantly

### Sort Students
1. Click any column header (LRN, Name, Email, etc.)
2. Data sorts ascending/descending

---

## 📱 Data Is Stored In:

### Firestore Database
- **Collection:** students
- **Location:** Firebase Console → Firestore Database
- **Access:** https://console.firebase.google.com/project/lams-talakag/firestore/data

### Every student has:
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
  "learningModality": "Face-to-Face",
  "createdAt": "2025-10-23T..."
}
```

---

## 🔐 Access Requirements

### You Must Be Logged In
- ✅ Student can view and edit their own data
- ✅ Admin/Teacher can view all students
- ❌ Anonymous users redirected to login

### Firestore Rules
- Currently in **Test Mode** (all authenticated users can read/write)
- Should be restricted in production

---

## 🆘 Troubleshooting

### Problem: No students showing in table
**Solutions:**
1. Check Firestore database has students collection
2. Verify 4 student documents exist
3. Check you're logged in
4. Try refreshing page
5. Check browser console for errors (F12)

### Problem: Cannot click Add/Edit buttons
**Solutions:**
1. Make sure you're logged in first
2. Check if you have permission
3. Verify Firestore is in Test Mode

### Problem: Changes not showing
**Solutions:**
1. Wait a moment for sync
2. Click "Refresh" button
3. Try reloading page (F5)
4. Check Firebase Console to verify changes saved

### Problem: Getting permission error
**Solutions:**
1. Go to Firestore Database
2. Click "Rules" tab
3. Make sure you see:
   ```javascript
   allow read, write: if true;
   ```
4. If not, update to Test Mode rules

---

## 📞 Direct Links

| Page | URL |
|------|-----|
| Students Table | http://localhost:4200/students |
| Dashboard | http://localhost:4200/dashboard |
| Login | http://localhost:4200/auth/login |
| Firebase Firestore | https://console.firebase.google.com/project/lams-talakag/firestore/data |

---

## 🎯 Next Steps

After viewing students:

1. ✅ View students in table
2. ✅ Add new students
3. ✅ Edit existing students
4. ✅ Delete students
5. ⏳ Add Courses table
6. ⏳ Add Enrollments table
7. ⏳ Build student dashboard
8. ⏳ Add grades display
9. ⏳ Add attendance tracking

---

## 📝 Notes

- All changes are **saved to Firestore immediately**
- Data persists across page refreshes
- Multiple users can view the table simultaneously
- Real-time updates if using Firestore listeners (future enhancement)

---

**Ready to view students? Go to http://localhost:4200/students! 🚀**
