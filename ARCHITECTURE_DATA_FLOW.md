# Architecture & Data Flow Diagram

## 🏗️ Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     LMS Application                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                     ┌────────────────────┐
                     │   App Component    │
                     └────────────────────┘
                              ↓
        ┌─────────────────────┬─────────────────────┐
        ↓                     ↓                     ↓
    ┌───────────┐        ┌──────────┐        ┌──────────────┐
    │ Topbar    │        │  Menu    │        │  Layout      │
    │Component  │        │Component │        │  Service     │
    └───────────┘        └──────────┘        └──────────────┘
        ↓
    ┌─────────────────────────────────────────┐
    │  User Menu (NEW: Account Settings)      │
    ├─────────────────────────────────────────┤
    │ 👤 Profile ────────┐                    │
    │ ⚙️  Account Settings│─────┐              │
    │ 🚪 Logout         │     │              │
    └─────────────────────────────────────────┘
             │                 │
             ↓                 ↓
        ┌──────────┐      ┌─────────────────┐
        │ Profile  │      │ Account Settings│
        │Component │      │   Component     │
        └──────────┘      └─────────────────┘
             ↓                 ↓
        Display Info      ┌────────────────┐
             ↓            │  Edit Profile  │
        View Details      │  Tab           │
                          └────────────────┘
                                 ↓
                          ┌──────────────────┐
                          │ Change Password  │
                          │  Tab             │
                          └──────────────────┘
```

---

## 📱 Page Layout Structure

### Profile Page
```
┌────────────────────────────────────────────────────────┐
│                    TOP NAVIGATION                      │
│                                                        │
│  [≡] Logo           [🌙] [⚙] [👤 User ▼]            │
└────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────┐
│  [← Back to Profile]                                   │
│                                                        │
│  ╔════════════════════════════════════════════════╗   │
│  ║  ████ John Doe                                 ║   │
│  ║       Student                                  ║   │
│  ║       john@lms.talakag                         ║   │
│  ║  [Edit Profile] [Back]                         ║   │
│  ╚════════════════════════════════════════════════╝   │
│                                                        │
│  PROFILE INFORMATION                                   │
│  ┌────────────────────────────────────────────────┐   │
│  │ Personal Information                           │   │
│  │ ├─ Full Name: John Doe                        │   │
│  │ ├─ Email: john@lms.talakag                    │   │
│  │ ├─ Birth Date: Jan 1, 2010                    │   │
│  │ └─ Contact: +63 912 345 6789                  │   │
│  └────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────┐   │
│  │ Address                                        │   │
│  │ ├─ Street: 123 Main Street                    │   │
│  │ ├─ Barangay: Barangay 1                       │   │
│  │ └─ Municipality: Talakag                      │   │
│  └────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────┐   │
│  │ Student Information                            │   │
│  │ ├─ LRN: 123456789                             │   │
│  │ ├─ Grade: 11                                  │   │
│  │ └─ Section: A                                 │   │
│  └────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────┘
```

### Account Settings Page
```
┌────────────────────────────────────────────────────────┐
│  [← Back to Profile]                                   │
│  Account Settings                                      │
│  Manage your account details and security settings     │
└────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────┐
│  ┌──────────────────┬──────────────────┐              │
│  │ 👤 Edit Profile  │ 🔐 Change Pass   │              │
│  └──────────────────┴──────────────────┘              │
│                                                        │
│  ═══════════════════════════════════════════════════  │
│                                                        │
│  ACTIVE TAB CONTENT                                   │
│  ┌────────────────────────────────────────────────┐  │
│  │ Personal Information                           │  │
│  │ ┌──────────────────────────────────────────┐  │  │
│  │ │ Full Name: [_____________________]       │  │  │
│  │ │ Birth Date: [_____________________]      │  │  │
│  │ │ Sex: [Male ▼]  Contact: [___________]    │  │  │
│  │ └──────────────────────────────────────────┘  │  │
│  │                                                │  │
│  │ Address                                       │  │
│  │ ┌──────────────────────────────────────────┐  │  │
│  │ │ Street: [_______________________]        │  │  │
│  │ │ Barangay: [___________________]          │  │  │
│  │ │ Municipality: [________________]         │  │  │
│  │ │ Province: [____________________]         │  │  │
│  │ └──────────────────────────────────────────┘  │  │
│  │                                                │  │
│  │ [Save Changes] [Cancel]                       │  │
│  └────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagram

### Loading User Profile
```
User Navigates to /pages/profile
        ↓
Profile Component ngOnInit()
        ↓
Get Current User from AuthService
        ↓
Branch by User Role:
    ├── Student? → Call FirestoreStudentService.getStudentByLRN()
    ├── Teacher? → Call FirestoreTeacherService.getTeacherByID()
    └── Admin? → Use auth data directly
        ↓
Fetch from Firestore
        ↓
Combine with AuthService user data
        ↓
Populate userProfile object
        ↓
Display in Template (one-way binding)
```

### Updating Profile
```
User Fills Form in Account Settings
        ↓
User Clicks "Save Changes"
        ↓
Form Validation
    ├── Valid? → Continue
    └── Invalid? → Show errors, stop
        ↓
Prepare Update Object (only changed fields)
        ↓
Branch by Role:
    ├── Student? → Call FirestoreStudentService.updateStudent()
    ├── Teacher? → Update Firestore teacher document
    └── Admin? → Update Firestore admin document
        ↓
Send to Firestore
        ↓
Firestore Updates Database
        ↓
Response Returns to Component
        ↓
Success? → Show success message, reset form
Fail? → Show error message, log error
```

### Changing Password
```
User Fills Password Form in Account Settings
        ↓
User Clicks "Change Password"
        ↓
Form Validation:
    ├── Current password required?
    ├── New password min 6 chars?
    └── Passwords match?
        ↓
If any validation fails → Show errors, stop
        ↓
Get Firebase Current User
        ↓
Create Credential with current password & email
        ↓
Reauthenticate User (verify identity)
        ↓
Reauthentication Success?
    ├── Yes → Continue
    └── No → Show "Current password incorrect" error, stop
        ↓
Call Firebase updatePassword(newPassword)
        ↓
Password Updated in Firebase
        ↓
Success? → Show success message, reset form
Fail? → Show error message, log error
```

---

## 🗄️ Firestore Database Integration

### Student Collection
```
Firestore: students
├── Document: student_id_1
│   ├── name: "John Doe"
│   ├── lrn: "123456789"
│   ├── email: "123456789@lms.talakag"
│   ├── birthDate: "2010-01-01"
│   ├── sex: "Male"
│   ├── contactNumber: "+63 912 345 6789"
│   ├── address: "123 Main Street"
│   ├── barangay: "Barangay 1"
│   ├── municipality: "Talakag"
│   ├── province: "Bukidnon"
│   ├── grade: "11"
│   ├── section: "A"
│   ├── learningModality: "Face-to-Face"
│   └── createdAt: "2024-01-01T00:00:00Z"
```

### Teacher Collection
```
Firestore: teachers
├── Document: teacher_id_1
│   ├── name: "Ms. Jane Smith"
│   ├── teacherID: "TEACHER001"
│   ├── email: "TEACHER001@lms.talakag"
│   ├── birthDate: "1985-05-15"
│   ├── department: "English"
│   ├── contactNumber: "+63 921 987 6543"
│   ├── role: "teacher"
│   └── createdAt: "2024-01-01T00:00:00Z"
```

### Firebase Auth
```
Firebase Authentication
├── User: uid_123
│   ├── email: "123456789@lms.talakag"
│   ├── password: (hashed by Firebase)
│   ├── displayName: "John Doe"
│   └── metadata: {...}
```

---

## 🔐 Authentication & Security Flow

```
User Clicks Profile Icon
        ↓
Check if User Logged In (AuthService.isLoggedIn)
        ↓
Logged In?
    ├── Yes → Show User Menu
    └── No → Redirect to Login
        ↓
User Clicks "Profile" or "Account Settings"
        ↓
Check RoleGuard (route protection)
        ↓
User Authenticated & Authorized?
    ├── Yes → Load component
    └── No → Redirect to login
        ↓
Component Loads
        ↓
RoleGuard Verified:
    ├── User has valid token? ✓
    ├── Token not expired? ✓
    └── User has required role? ✓
        ↓
Load User Data from AuthService
        ↓
Fetch Additional Data from Firestore
        ↓
Display Data in Component
```

### Password Change Security
```
User Enters Current Password
        ↓
Form Submits
        ↓
Get Firebase Current User (auth.currentUser)
        ↓
Create Email/Password Credential
        ↓
Call Firebase reauthenticateWithCredential()
        ↓
Firebase Verifies Password Against Auth Database
        ↓
Password Correct?
    ├── Yes → Proceed
    └── No → Show error "Incorrect password"
        ↓
Call Firebase updatePassword(newPassword)
        ↓
Firebase Updates Password in Auth Database
        ↓
Password Changed Successfully
        ↓
Show Success Message to User
```

---

## 📊 Component Communication

```
┌─────────────────────────────────────────────────────┐
│             AuthService (Shared Service)            │
│ • currentUser (subject)                             │
│ • isLoggedIn (property)                             │
│ • logout() / login()                                │
└─────────────────────────────────────────────────────┘
         ↑                          ↑
         │ Injected              Injected
         │                          │
    ┌─────────────┐          ┌──────────────┐
    │  Profile    │          │    Account   │
    │  Component  │          │   Settings   │
    └─────────────┘          └──────────────┘
         │                          │
         └──────────┬───────────────┘
                    │
              ┌──────────────────┐
              │  Router Service  │
              │  • navigate()    │
              │  • navigateByUrl │
              └──────────────────┘
```

---

## 🎯 User Interaction Flow

```
START
  ↓
User Views App
  ↓
User Clicks Profile Icon [👤]
  ↓
User Menu Opens
  ├─ Profile ─────→ Navigate to /pages/profile
  ├─ Account Settings → Navigate to /pages/account-settings
  └─ Logout ──→ Call logout(), redirect to /auth/login
  ↓
PATH 1: Profile Page
  ├─ Display user information
  ├─ Show role-specific data
  ├─ User clicks "Edit Profile"
  └─ Navigate to /pages/account-settings
      ↓
PATH 2: Account Settings
  ├─ Tab 1: Edit Profile
  │  ├─ Display form with user data
  │  ├─ User edits fields
  │  ├─ User clicks "Save Changes"
  │  └─ Update data in Firestore
  │     ├─ Success → Show message
  │     └─ Error → Show error
  │
  └─ Tab 2: Change Password
     ├─ Display password form
     ├─ User enters current & new password
     ├─ User clicks "Change Password"
     └─ Update password in Firebase Auth
        ├─ Success → Show message
        └─ Error → Show error
  ↓
END
```

---

## 🏢 System Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENT SIDE (Angular)                 │
│  ┌────────────────────────────────────────────────────┐ │
│  │              LMS Application                       │ │
│  │  ┌──────────────┐  ┌─────────────────────────────┐ │ │
│  │  │ Profile Page │  │ Account Settings Component  │ │ │
│  │  │              │  │  ├─ Edit Profile Tab       │ │ │
│  │  │  • Display   │  │  └─ Change Password Tab    │ │ │
│  │  │  • Load data │  │     • Form validation      │ │ │
│  │  │  • Navigate  │  │     • Firestore update     │ │ │
│  │  │              │  │     • Auth update          │ │ │
│  │  └──────────────┘  └─────────────────────────────┘ │ │
│  │         ↓                    ↓                      │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │           Service Layer                      │ │ │
│  │  │  • AuthService                               │ │ │
│  │  │  • FirestoreStudentService                   │ │ │
│  │  │  • FirestoreTeacherService                   │ │ │
│  │  │  • LmsAuthService                            │ │ │
│  │  │  • FirebaseService                           │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
            ↓              ↓
┌──────────────────┐  ┌──────────────────────────┐
│ Firebase Auth    │  │ Firestore Database       │
│                  │  │                          │
│ • User accounts  │  │ • students collection    │
│ • Passwords      │  │ • teachers collection    │
│ • Tokens         │  │ • admin collection       │
│ • Sessions       │  │                          │
└──────────────────┘  └──────────────────────────┘
```

---

## ✨ Request/Response Examples

### Get Student Profile
```
Request:
GET /pages/profile (authenticated user: student, LRN: 123456789)

Processing:
1. AuthService provides current user
2. FirestoreStudentService.getStudentByLRN("123456789")
3. Query: students WHERE lrn == "123456789"

Response (Firestore):
{
  id: "doc_id_123",
  name: "John Doe",
  lrn: "123456789",
  email: "123456789@lms.talakag",
  birthDate: "2010-01-01",
  sex: "Male",
  address: "123 Main Street",
  contactNumber: "+63 912 345 6789",
  grade: "11",
  section: "A",
  learningModality: "Face-to-Face"
}

Display: Profile page shows all user information
```

### Update Student Profile
```
Request:
POST /pages/account-settings (update student data)

Data:
{
  name: "John Doe Updated",
  birthDate: "2010-01-01",
  sex: "Male",
  contactNumber: "+63 912 345 6789",
  address: "456 New Street",
  barangay: "Barangay 2",
  municipality: "Talakag",
  province: "Bukidnon"
}

Processing:
1. Validate form
2. Get current student by LRN
3. Call FirestoreStudentService.updateStudent(student_id, data)
4. Firestore updates document

Response:
{
  success: true,
  message: "Profile updated successfully!"
}

Result: Firestore document updated, user sees success message
```

### Change Password
```
Request:
POST Change Password (in Account Settings)

Data:
{
  currentPassword: "123456789@123",
  newPassword: "newPass@123",
  confirmPassword: "newPass@123"
}

Processing:
1. Validate form (matching, min length)
2. Get Firebase current user
3. Create EmailAuthProvider credential
4. Call reauthenticateWithCredential(user, credential)
5. Firebase verifies password
6. If valid → Call updatePassword(user, newPassword)
7. Firebase updates password

Response:
{
  success: true,
  message: "Password changed successfully!"
}

Result: Firebase Auth password updated, user can login with new password
```

---

This architecture ensures:
✅ Secure authentication
✅ Data isolation by role
✅ Proper error handling
✅ Responsive UI
✅ Real-time updates
✅ User-friendly interface
