# 👁️🔑 Admin Profile & Password Reset - Quick Guide

## 🎬 Quick Demo

### View Student Profile
```
STUDENTS PAGE
     ↓
[LRN] [Name] [Grade] ... [Actions]
                          ↓
                   [👁️] [🔑] [✏️] [🗑️]
                    ↓
                   CLICK
                    ↓
        ┌──────────────────────┐
        │ John Student         │  ← Student Profile Modal
        │ - Student Profile    │
        ├──────────────────────┤
        │ Personal Info:       │
        │ • LRN: 123456789     │
        │ • Name: John Student │
        │ • Sex: Male          │
        │ • Birth Date: 2008   │
        │                      │
        │ Academic Info:       │
        │ • Grade: 10          │
        │ • Section: A         │
        │ • Modality: F2F      │
        │                      │
        │ Contact Info:        │
        │ • Email: 123456789.. │
        │ • Phone: +63 9XX...  │
        │                      │
        │ Address Info:        │
        │ • Address: 123 Main  │
        │ • Barangay: San...   │
        │ • Municipality: ...  │
        │ • Province: ...      │
        ├──────────────────────┤
        │       [Close]        │
        └──────────────────────┘
```

### Reset Student Password
```
STUDENTS PAGE
     ↓
[LRN] [Name] [Grade] ... [Actions]
                          ↓
                   [👁️] [🔑] [✏️] [🗑️]
                          ↓
                       CLICK
                          ↓
        ┌──────────────────────────┐
        │   RESET PASSWORD?        │  ← Confirmation
        ├──────────────────────────┤
        │ Are you sure you want    │
        │ to reset password for    │
        │ John Student?            │
        │                          │
        │ A password reset email   │
        │ will be sent to:         │
        │ john@student.email.com   │
        ├──────────────────────────┤
        │  [No]  ✅ [Yes]         │
        └──────────────────────────┘
                    ↓
            EMAIL SENT ✅
                    ↓
        ┌──────────────────────────┐
        │ SUCCESS                  │
        ├──────────────────────────┤
        │ Password reset email     │
        │ sent to john@...         │
        └──────────────────────────┘
```

---

## 🎯 Action Buttons Reference

### Students Table
```
Position: Actions Column (Last Column)

[👁️] = View Profile (Blue Eye Icon)
       → Opens modal with all student info
       → Read-only view
       → Click Close to dismiss

[🔑] = Reset Password (Gray Key Icon)
       → Sends password reset email
       → Requires confirmation
       → Shows success message

[✏️] = Edit (Green Pencil Icon)
       → Edit student information
       → Existing functionality

[🗑️] = Delete (Red Trash Icon)
       → Delete student from system
       → Existing functionality
```

### Teachers Table
```
Position: Actions Column (Last Column)

[👁️] = View Profile (Blue Eye Icon)
       → Opens modal with all teacher info
       → Read-only view
       → Click Close to dismiss

[🔑] = Reset Password (Gray Key Icon)
       → Sends password reset email
       → Requires confirmation
       → Shows success message

[✏️] = Edit (Green Pencil Icon)
       → Edit teacher information
       → Existing functionality

[🗑️] = Delete (Red Trash Icon)
       → Delete teacher from system
       → Existing functionality
```

---

## 🚀 Step-by-Step Usage

### Scenario 1: Admin wants to view student's profile

**Steps:**
```
1. Navigate to Students page
2. Find student in table
3. Look at last column (Actions)
4. Click EYE ICON (👁️)
5. Modal opens with profile
6. Read all information
7. Click Close button
8. Modal closes
```

**Expected Result:**
✅ Student profile displayed in organized sections  
✅ All fields visible and readable  
✅ Modal closes when clicking Close  

---

### Scenario 2: Admin wants to reset a student's password

**Steps:**
```
1. Navigate to Students page
2. Find student in table
3. Look at last column (Actions)
4. Click KEY ICON (🔑)
5. Confirmation dialog appears
6. Read the message carefully
7. Click YES to confirm
8. Success message shows
9. Email sent to student's email
```

**Expected Result:**
✅ Confirmation dialog shows before action  
✅ Success message appears  
✅ Student receives password reset email  
✅ Student can click link and set new password  

---

### Scenario 3: Admin wants to reset a teacher's password

**Steps:**
```
1. Navigate to Teachers page
2. Find teacher in table
3. Look at last column (Actions)
4. Click KEY ICON (🔑)
5. Confirmation dialog appears
6. Read the message carefully
7. Click YES to confirm
8. Success message shows
9. Email sent to teacher's email
```

**Expected Result:**
✅ Confirmation dialog shows before action  
✅ Success message appears  
✅ Teacher receives password reset email  
✅ Teacher can click link and set new password  

---

## 📱 Visual Layout

### Profile Modal Layout
```
┌─────────────────────────────────────┐
│ John Student - Student Profile      │ ← Header
├─────────────────────────────────────┤
│ Personal Information                 │ ← Section Title
│ ┌─────────────────┬─────────────────┐│
│ │ LRN: 123456789  │ Name: John...   ││ ← Grid 2 columns
│ ├─────────────────┼─────────────────┤│
│ │ Sex: Male       │ Birth Date: ...  ││
│ └─────────────────┴─────────────────┘│
│ ──────────────────────────────────────┤ ← Section divider
│ Academic Information                 │
│ ┌─────────────────┬─────────────────┐│
│ │ Grade: 10       │ Section: A      ││
│ ├─────────────────┼─────────────────┤│
│ │ Modality: F2F   │                 ││
│ └─────────────────┴─────────────────┘│
│ ──────────────────────────────────────┤
│ Contact Information                  │
│ ┌─────────────────┬─────────────────┐│
│ │ Email: ...      │ Phone: ...      ││
│ └─────────────────┴─────────────────┘│
│ ──────────────────────────────────────┤
│ Address Information                  │
│ ┌─────────────────┬─────────────────┐│
│ │ Address: ...    │ Barangay: ...   ││
│ ├─────────────────┼─────────────────┤│
│ │ Municipality: ...│ Province: ...   ││
│ └─────────────────┴─────────────────┘│
├─────────────────────────────────────┤
│               [Close]               │ ← Footer
└─────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagram

### View Profile Flow
```
User Click Eye Icon
    │
    ↓
Component Method Called: openProfileDialog()
    │
    ├→ Store selected student/teacher
    ├→ Set displayProfileDialog = true
    │
    ↓
Modal Opens with Data
    │
    ├→ Component reads selectedStudent/Teacher
    ├→ Template renders all fields
    ├→ Organizes into 4 sections
    │
    ↓
User Reads Profile
    │
    ↓
User Clicks Close
    │
    ├→ Set displayProfileDialog = false
    │
    ↓
Modal Closes
```

### Reset Password Flow
```
User Clicks Key Icon
    │
    ↓
Component Method Called: resetPassword()
    │
    ├→ Show Confirmation Dialog
    │
    ↓
Confirmation Dialog
    │
    ├→ Message: "Reset password for {name}?"
    ├→ Shows: {email}
    ├→ User Chooses: Yes or No
    │
    ├─→ If No: Cancel and close
    │
    └─→ If Yes: Continue...
         │
         ↓
    Build Email Address
    │
    ├→ Format: {LRN}@lms.talakag
    ├→ OR: {TeacherID}@lms.talakag
    │
    ↓
Call Firebase Service
    │
    ├→ Send password reset email
    ├→ Firebase generates reset link
    ├→ Link sent to email address
    │
    ↓
Show Success Message
    │
    ├→ "Password reset email sent to {email}"
    │
    ↓
User Receives Email
    │
    ├→ Email contains reset link
    ├→ Link valid for 1 hour
    ├→ User clicks link
    │
    ↓
Firebase Reset Page
    │
    ├→ User enters new password
    ├→ User confirms password
    │
    ↓
Password Updated
    │
    └→ User can log in with new password
```

---

## ⚙️ System Compatibility

### Browsers
✅ Chrome / Chromium
✅ Firefox
✅ Safari
✅ Edge
✅ Mobile Browsers

### Devices
✅ Desktop
✅ Tablet
✅ Mobile Phone

### Responsive
✅ Profile modal adapts to screen size
✅ Touch-friendly on mobile
✅ Readable on all sizes

---

## 🔐 Security Checklist

When resetting passwords:
- ✅ Verify you're logged in as Admin/Super Admin
- ✅ Verify the email address before confirming
- ✅ Ask user permission if possible
- ✅ Inform user that reset email will be sent
- ✅ Tell user to check spam folder
- ✅ Only reset if really needed

When viewing profiles:
- ✅ Information is read-only (cannot modify)
- ✅ View only if you have legitimate reason
- ✅ Don't share sensitive information
- ✅ Respect user privacy

---

## 📊 Status Check

| Feature | Status | Works On |
|---------|--------|----------|
| View Profile | ✅ | Students & Teachers |
| Reset Password | ✅ | Students & Teachers |
| Confirmation | ✅ | Security layer |
| Email Sending | ✅ | Firebase |
| Modal Display | ✅ | All browsers |
| Responsive | ✅ | All devices |
| Errors | ✅ | Zero TypeScript |

---

## 🆘 Quick Help

**"I can't see the Eye or Key buttons"**
→ Make sure you're logged in as Admin/Super Admin
→ Refresh the page
→ Clear browser cache

**"Eye button works but profile doesn't show"**
→ Check browser console (F12)
→ Verify data loaded from Firestore
→ Try refreshing page

**"Key button works but email not received"**
→ Check spam/junk folder
→ Verify email address is correct
→ Try again after 5 minutes
→ Check if email service is working

**"Modal looks wrong or cut off"**
→ Try different browser
→ Clear CSS cache
→ Resize window
→ Refresh page

---

**Quick Reference:**  
👁️ = View Profile (Eye Icon)  
🔑 = Reset Password (Key Icon)  
✏️ = Edit (Pencil Icon)  
🗑️ = Delete (Trash Icon)  

**Remember:**  
Always confirm before resetting passwords!  
