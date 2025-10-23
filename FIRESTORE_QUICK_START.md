# 🚀 Firestore Database Setup - Quick Start Guide

## 1. Create Firestore Database

### Go to Firebase Console
1. Visit: https://console.firebase.google.com/
2. Select project: **lams-talakag**
3. Left sidebar → **Build** → **Firestore Database**
4. Click **Create database**

### Configure Database
- **Location:** Singapore (asia-southeast1)
- **Mode:** Start in test mode (for development)
- Click **Create**

---

## 2. Create Collections (Manually in Firebase Console)

After database is created, add these collections:

### Collection: `students`
Add test document with fields:
```
lrn: "1234567890"
name: "Juan Santos"
email: "juan@email.com"
sex: "Male"
birthDate: "2008-05-15"
address: "123 Main Street"
barangay: "Tagumpay"
municipality: "Talakag"
province: "Bukidnon"
contactNumber: "09123456789"
learningModality: "Face-to-Face"
```

### Collection: `courses`
```
code: "MATH101"
title: "Basic Mathematics"
description: "Introduction to basic math"
teacherId: "teacher001"
credits: 3
```

### Collection: `enrollments`
```
studentId: "std001"
courseId: "course001"
enrollmentDate: "2025-10-23"
status: "active"
```

### Collection: `users`
```
email: "admin@lms.com"
name: "Administrator"
role: "admin"
```

---

## 3. Firebase Services Ready to Use

### Available Services:
✅ `FirebaseService` - Main Firebase setup
✅ `FirebaseAuthService` - Authentication (login, register, logout)
✅ `FirestoreStudentService` - Student CRUD operations
✅ `FirestoreCourseService` - Course CRUD operations
✅ `FirestoreEnrollmentService` - Enrollment CRUD operations

---

## 4. Usage Examples in Components

### Get All Students
```typescript
import { Component, inject, OnInit } from '@angular/core';
import { FirestoreStudentService } from './services/firestore-student.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html'
})
export class StudentsComponent implements OnInit {
  private studentService = inject(FirestoreStudentService);
  students: any[] = [];

  ngOnInit() {
    this.loadStudents();
  }

  async loadStudents() {
    this.students = await this.studentService.getStudents();
  }

  async addStudent(data: any) {
    const id = await this.studentService.addStudent(data);
    console.log('Student added with ID:', id);
    this.loadStudents();
  }

  async deleteStudent(id: string) {
    await this.studentService.deleteStudent(id);
    this.loadStudents();
  }
}
```

### Login with Firebase Auth
```typescript
import { Component, inject } from '@angular/core';
import { FirebaseAuthService } from './services/firebase-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private authService = inject(FirebaseAuthService);
  private router = inject(Router);

  login(email: string, password: string) {
    this.authService.login(email, password).subscribe(
      user => {
        if (user) {
          console.log('Logged in:', user.email);
          this.router.navigate(['/dashboard']);
        }
      },
      error => console.error('Login error:', error)
    );
  }
}
```

### Get Current User
```typescript
async getCurrentUser() {
  const user = await this.authService.getCurrentUser().toPromise();
  console.log('Current user:', user);
}
```

---

## 5. Firestore Security Rules (Test Mode)

Current configuration allows all read/write access to authenticated users:

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

### For Production, use stricter rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Students can only read/write their own data
    match /students/{studentId} {
      allow read, write: if request.auth.uid == studentId;
    }
    
    // Teachers can read courses they own
    match /courses/{courseId} {
      allow read: if true;
      allow write: if request.auth.uid == resource.data.teacherId;
    }
    
    // Enrollments
    match /enrollments/{enrollmentId} {
      allow read: if request.auth.uid == resource.data.studentId;
      allow write: if request.auth.token.admin == true;
    }
  }
}
```

---

## 6. Test Your Setup

### In Component:
```typescript
async testFirebase() {
  // Test 1: Get all students
  const students = await this.studentService.getStudents();
  console.log('Students:', students);

  // Test 2: Get student by LRN
  const student = await this.studentService.getStudentByLRN('1234567890');
  console.log('Student by LRN:', student);

  // Test 3: Add new student
  const newId = await this.studentService.addStudent({
    lrn: '9999999999',
    name: 'Test Student',
    sex: 'Male',
    birthDate: '2008-01-01',
    address: 'Test Address',
    barangay: 'Test',
    municipality: 'Talakag',
    province: 'Bukidnon',
    contactNumber: '09000000000',
    learningModality: 'Online'
  });
  console.log('New student added:', newId);
}
```

---

## 7. Troubleshooting

### Error: "Permission denied"
- Make sure you're in **Test Mode** or have proper authentication rules
- Check if Firestore database is created successfully

### Error: "Collection not found"
- Collection is created automatically when you add first document
- Or manually create in Firebase Console

### Error: "Firebase is not initialized"
- Check `app.config.ts` has `FirebaseService` in providers
- Verify Firebase credentials in `environment.ts` and `environment.development.ts`

---

## 📚 Full Documentation

See complete guide: `FIRESTORE_DATABASE_SETUP.md`

---

## ✅ Checklist

- [ ] Create Firestore Database sa Firebase Console
- [ ] Create collections (students, courses, enrollments, users, announcements)
- [ ] Set security rules
- [ ] Test services in component
- [ ] Update authentication flow to use Firebase
- [ ] Deploy to production with proper security rules

**You're ready! Start adding data sa Firebase Firestore! 🎉**
