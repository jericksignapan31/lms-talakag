# LMS Talakag - Student Authentication & Database Setup Guide

## 🎯 Overview

This system links student accounts with their LRN (Learner Reference Number) in Firestore. Students login using:
- **Username (LRN):** Their Learner Reference Number
- **Password:** Same as their LRN
- **Email:** `{LRN}@lms.talakag`

---

## 📋 Architecture

### Database Schema (Firestore)

```
Firestore Collections:
├── students/
│   └── {documentId}
│       ├── lrn: string          (unique identifier)
│       ├── name: string
│       ├── email: string
│       ├── sex: string
│       ├── birthDate: string
│       ├── address: string
│       ├── barangay: string
│       ├── municipality: string
│       ├── province: string
│       ├── contactNumber: string
│       ├── learningModality: string
│       └── createdAt: timestamp
│
├── courses/
│   └── {documentId}
│       ├── code: string
│       ├── title: string
│       ├── teacherId: string
│       └── credits: number
│
├── enrollments/
│   └── {documentId}
│       ├── studentId: string
│       ├── courseId: string
│       ├── enrollmentDate: string
│       └── status: enum('active','inactive','completed')
│
└── users/ (for admin/teachers)
    └── {uid}
        ├── email: string
        ├── role: enum('admin','teacher','student')
        └── name: string
```

### Authentication Flow

```
Student Login Page
    ↓
User enters LRN + Password
    ↓
LmsAuthService validates
    ↓
Creates Firebase Auth account (email: {lrn}@lms.talakag)
    ↓
Queries student data from Firestore
    ↓
Returns AuthenticatedUser with student data
    ↓
Redirect to Dashboard
```

---

## 🔧 Services Created

### 1. **LmsAuthService** (`src/app/services/lms-auth.service.ts`)
Main authentication service with LRN-based login

**Key Methods:**
```typescript
// Login with LRN
loginWithLRN(lrn: string, password: string): Observable<AuthenticatedUser | null>

// Login with Email (for admin)
loginWithEmail(email: string, password: string): Observable<AuthenticatedUser | null>

// Logout
logout(): Observable<void>

// Get current user
getCurrentUser(): Observable<AuthenticatedUser | null>

// Check if logged in
isLoggedIn(): Observable<boolean>
```

### 2. **FirestoreStudentService** (`src/app/services/firestore-student.service.ts`)
CRUD operations for student records

**Key Methods:**
```typescript
// Create
addStudent(student: Student): Promise<string>

// Read
getStudents(): Promise<Student[]>
getStudent(id: string): Promise<Student | null>
getStudentByLRN(lrn: string): Promise<Student | null>
getStudentsByName(name: string): Promise<Student[]>

// Update
updateStudent(id: string, student: Partial<Student>): Promise<void>

// Delete
deleteStudent(id: string): Promise<void>
```

### 3. **FirestoreCourseService** (`src/app/services/firestore-course.service.ts`)
CRUD for courses

### 4. **FirestoreEnrollmentService** (`src/app/services/firestore-enrollment.service.ts`)
CRUD for student enrollments

---

## 📊 Components Created

### 1. **LmsLoginComponent** (`src/app/pages/auth/lms-login.component.ts`)
Beautiful login page with:
- Student login via LRN
- Admin login via email
- Error/success messages
- Responsive design

### 2. **StudentsTableComponent** (`src/app/components/students-table.component.ts`)
Admin interface to manage students with:
- List all students
- Add new student
- Edit student details
- Delete student
- Search & pagination

---

## 🚀 Setup Steps

### Step 1: Seed Initial Student Data

Option A - Using the Seed Component:
```typescript
// In app.component.ts
import { SeedDataComponent } from './components/seed-data.component';

export class AppComponent implements OnInit {
  private seedComponent = inject(SeedDataComponent);

  ngOnInit() {
    // Call once only!
    // this.seedComponent.seedStudentData();
  }
}
```

Option B - Manually Add to Firestore Console:
1. Go to Firebase Console → Firestore Database
2. Create collection: `students`
3. Add documents with student data

**Example Document:**
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
  "createdAt": "2025-10-23"
}
```

### Step 2: Create Firebase Auth Accounts

For each student, create auth account:
- Email: `{LRN}@lms.talakag`
- Password: Same as LRN

Can be done via:
- Firebase Console Admin SDKapi
- SeedDataComponent (automatic)
- Custom CLI script

### Step 3: Update App Routes

Add login route to `app.routes.ts`:
```typescript
{
  path: 'auth/login',
  component: LmsLoginComponent
}
```

### Step 4: Use Components in App

```typescript
// In parent component
import { LmsLoginComponent } from './pages/auth/lms-login.component';
import { StudentsTableComponent } from './components/students-table.component';

@Component({
  imports: [LmsLoginComponent, StudentsTableComponent]
})
export class AdminDashboardComponent {}
```

---

## 📱 Usage Examples

### Login Student
```typescript
// Student enters LRN: 1234567890, Password: 1234567890
// System:
// 1. Validates password === LRN
// 2. Creates email: 1234567890@lms.talakag
// 3. Logs in via Firebase
// 4. Fetches student data
// 5. Returns AuthenticatedUser with student info
```

### Get Current Student Data
```typescript
export class StudentProfileComponent {
  private authService = inject(LmsAuthService);
  student$ = this.authService.getCurrentUser();

  // In template:
  // <div>{{ (student$ | async)?.studentData?.name }}</div>
}
```

### Manage Students (Admin)
```typescript
// StudentsTableComponent provides full CRUD UI
// - List students
// - Add new student
// - Edit student details
// - Delete student
```

---

## 🔐 Security Rules (Firestore)

### Development Rules (Test Mode)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Production Rules (Recommended)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Students can read their own data
    match /students/{studentId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.admin == true;
    }
    
    // Courses - readable by all authenticated users
    match /courses/{courseId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.admin == true;
    }
    
    // Enrollments - students can read their own
    match /enrollments/{enrollmentId} {
      allow read: if request.auth != null && 
                     resource.data.studentId == request.auth.uid;
      allow write: if request.auth.token.admin == true;
    }
  }
}
```

---

## 🧪 Testing

### Test Login Flow
```typescript
// Test Student Data
LRN: 1234567890
Password: 1234567890
Email: 1234567890@lms.talakag

LRN: 1234567891
Password: 1234567891
Email: 1234567891@lms.talakag

LRN: 1234567892
Password: 1234567892
Email: 1234567892@lms.talakag
```

### Verify in Browser
1. Open Dev Console
2. Login with test LRN
3. Check `localStorage`:
   ```javascript
   localStorage.getItem('auth_token')
   localStorage.getItem('auth_user')
   ```

---

## ⚠️ Important Notes

1. **LRN = Password**: For initial login, password is same as LRN
   - ⚠️ Students should change password after first login
   - Implement password change feature in user profile

2. **Email Format**: `{LRN}@lms.talakag`
   - Not a real email, used for Firebase auth
   - Can be changed to real email later

3. **Data Consistency**:
   - LRN must be unique
   - Maintain sync between Firestore students and Firebase Auth

4. **Backup & Migration**:
   - Backup Firestore regularly
   - Plan migration strategy if LRN changes

---

## 📚 File Structure

```
src/app/
├── services/
│   ├── firebase.service.ts
│   ├── lms-auth.service.ts
│   ├── firestore-student.service.ts
│   ├── firestore-course.service.ts
│   └── firestore-enrollment.service.ts
├── components/
│   ├── students-table.component.ts
│   └── seed-data.component.ts
└── pages/
    └── auth/
        └── lms-login.component.ts
```

---

## 🎓 Next Steps

1. ✅ Create Firestore database & collections
2. ✅ Create Firebase Auth accounts for students
3. ✅ Add login page to app routes
4. ✅ Test login flow
5. ⏳ Implement dashboard for logged-in students
6. ⏳ Add course enrollment UI
7. ⏳ Add grades & attendance tracking
8. ⏳ Add password change functionality
9. ⏳ Deploy to production with security rules

---

**Ready to go! Your LMS authentication system is set up! 🎉**
