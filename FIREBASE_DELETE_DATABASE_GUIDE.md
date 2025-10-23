# 🗑️ How to Delete Firestore Database & See ID

## 📍 Where to Find Database ID

### Method 1: From Firestore Console (Easy)

1. **Open Firebase Console:**
   ```
   https://console.firebase.google.com/
   ```

2. **Select your project:** `lams-talakag`

3. **Click:** `Build` (left sidebar)

4. **Click:** `Firestore Database`

5. **Look at the top of the page:**
   ```
   Database ID will show as:
   (default)
   
   OR
   
   Full path: projects/lams-talakag/databases/(default)
   ```

---

## 🔍 Exact Location of ID

### Screenshot Location:
```
┌─────────────────────────────────────────┐
│  Firestore Database                     │
├─────────────────────────────────────────┤
│  Database ID: (default)     ← HERE      │
│  Status: READY              ← HERE      │
│  Location: asia-southeast1  ← HERE      │
│  Creation time: ...                     │
└─────────────────────────────────────────┘
```

**The ID is usually:** `(default)`

---

## ⚙️ How to Delete Database

### Step 1: Open Database Settings

1. Go to Firestore Database page
2. Look for **Settings icon** (gear ⚙️) in top right area
3. Click the **three-dot menu** (⋮) next to the database name
4. Select **Delete database**

### Step 2: Confirm Deletion

```
A dialog will appear:

┌───────────────────────────────────────┐
│ Delete database (default)?            │
│                                       │
│ This action CANNOT be undone.        │
│ All data will be permanently deleted. │
│                                       │
│ Type to confirm: (default)            │
│                                       │
│ [ Cancel ] [ Delete ]                 │
└───────────────────────────────────────┘
```

You'll need to **type the database ID** to confirm:
- Type: `(default)`
- Click: **Delete**

### Step 3: Wait for Deletion

```
Status will show: "Deleting..."

Then: "Database deleted"

This takes 5-30 seconds
```

---

## 📋 Step-by-Step Visual Guide

### Step 1: Navigate to Firestore
```
Firebase Console
    ↓
Select: lams-talakag
    ↓
Click: Build (left side)
    ↓
Click: Firestore Database
    ↓
You see: Database ID (default)
```

### Step 2: Delete Option
```
Look for the THREE-DOT MENU (⋮)
Usually located:
- Top right corner of database info
- OR next to database name
- OR in Settings area

Click: ⋮
Select: Delete database
```

### Step 3: Confirm Deletion
```
Dialog appears
See: "Delete database (default)?"
Type in box: (default)
Click: Delete button
```

---

## 🎯 What the ID Looks Like

### Primary Database (Most Common)
```
ID: (default)
```

### Named Database (If you created multiple)
```
ID: students-db
ID: production-db
```

### Full Database Path (Technical)
```
projects/lams-talakag/databases/(default)
```

---

## ⚠️ Important Before Deleting

| Check | Status |
|-------|--------|
| **Have you added important data?** | ❌ No → Safe to delete |
| **Did you test students login?** | ❌ Not yet → Safe to delete |
| **Do you have backups?** | ❌ No → Create one first |

---

## 🔄 If You've Already Added Data

### Option 1: Export Data First (Recommended)

```
Firebase Console
    ↓
Cloud Firestore
    ↓
Three-dot menu (⋮)
    ↓
Export collections
    ↓
Save to Google Cloud Storage
    ↓
Then delete database
```

### Option 2: Just Delete (Careful!)

If you haven't added important data yet:
```
Delete database directly
→ No backup needed
→ Start fresh with new region
```

---

## 🆘 Can't Find the Delete Option?

Try these alternative paths:

### Path 1: Settings Tab
1. Firestore Database page
2. Click **Settings** tab
3. Look for **Delete database** button

### Path 2: Menu Icon
1. Find the **⋮** (three dots) menu
2. Click it
3. Select **Delete database**

### Path 3: Direct URL (Advanced)
```
https://console.firebase.google.com/project/lams-talakag/firestore/databases
```

Then look for delete option in same place.

---

## 📱 Database ID Reference

### Your Project
```
Project Name: lams-talakag
Project ID: lams-talakag
Database ID: (default)

Full Path: projects/lams-talakag/databases/(default)
```

### After Deletion
```
Status: ❌ Deleted

Next Step:
→ Create new database with different region
→ Or recreate same region with fresh data
```

---

## ✅ Verification Checklist

After deletion, verify:
- [ ] Status says "Deleted"
- [ ] No data visible in console
- [ ] Can see "Create database" button again
- [ ] No collections listed
- [ ] No documents visible

---

## 🚀 Next Steps After Deletion

1. **Create New Database**
   ```
   Click: Create database
   ```

2. **Choose New Location**
   ```
   Select: Your desired region
   ```

3. **Select Test Mode**
   ```
   Security: Start in test mode
   ```

4. **Click: Create**
   ```
   Wait 2-3 minutes
   ```

---

## 💡 Pro Tip

**Screenshot the Database ID before deleting:**
- Take screenshot showing the ID
- Useful for documentation
- Good reference if you need support

---

## ❓ Common Questions

**Q: Will the ID change after recreation?**
A: No, it will still be `(default)` if you recreate the same database.

**Q: Can I recover deleted data?**
A: Only if you exported it first. Otherwise, it's gone permanently.

**Q: How long does deletion take?**
A: Usually 5-30 seconds. Sometimes up to 1-2 minutes.

**Q: Do I need to delete auth accounts too?**
A: No, Firebase Auth and Firestore are separate. Delete Auth separately if needed.

---

**Ready to delete? Scroll up and follow the step-by-step guide! 🗑️**

**Questions? Check FIREBASE_TROUBLESHOOTING.md**
