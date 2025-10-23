# Firebase Firestore Database Setup Guide para sa LMS Talakag

## Step 1: Setup Firestore Database sa Firebase Console

### 1.1 Go to Firebase Console
1. Buksan: https://console.firebase.google.com/
2. Piliin ang project: **lams-talakag**
3. Sa left sidebar, click **Build** → **Firestore Database**

### 1.2 Create Database
1. Click **Create database**
2. Piliin ang location: **Singapore (asia-southeast1)**
3. Choose security mode: **Start in test mode** (para sa development)
   - ⚠️ TEST MODE: Accessible sa lahat (dev only)
   - 🔒 PRODUCTION MODE: Kailangan ng security rules
4. Click **Create**

### 1.3 Wait for Database Creation
- Maghintay ng 1-2 minuto para ma-initialize

---

## Step 2: Create Firestore Collections & Documents

After database is created, create ang collections:

### Collections to Create:

#### 1. **users** Collection
```json
{
  "id": "user001",
  "email": "admin@lms.com",
  "name": "Administrator",
  "role": "admin",
  "createdAt": "2025-10-23"
}
```

#### 2. **students** Collection
```json
{
  "id": "std001",
  "lrn": "1234567890",
  "name": "Juan Santos",
  "email": "juan@email.com",
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

#### 3. **courses** Collection
```json
{
  "id": "course001",
  "code": "MATH101",
  "title": "Basic Mathematics",
  "description": "Introduction to basic math concepts",
  "teacherId": "teacher001",
  "credits": 3,
  "createdAt": "2025-10-23"
}
```

#### 4. **enrollments** Collection
```json
{
  "id": "enroll001",
  "studentId": "std001",
  "courseId": "course001",
  "enrollmentDate": "2025-10-23",
  "status": "active"
}
```

#### 5. **announcements** Collection
```json
{
  "id": "announce001",
  "title": "Welcome to LMS",
  "body": "Welcome sa LMS Talakag Platform!",
  "date": "2025-10-23",
  "createdBy": "admin"
}
```

---

## Step 3: Set Firestore Security Rules (Important!)

1. In Firebase Console, go to **Firestore Database** → **Rules** tab
2. Replace the default rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access on all documents for authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // For development/testing only - allow all access
    // ⚠️ Remove this in production!
    // match /{document=**} {
    //   allow read, write: if true;
    // }
  }
}
```

3. Click **Publish**

---

## Step 4: Angular Service to Interact with Firestore

Create file: `src/app/services/student.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { inject } from '@angular/core';

export interface Student {
  id?: string;
  lrn: string;
  name: string;
  email: string;
  sex: string;
  birthDate: string;
  address: string;
  barangay: string;
  municipality: string;
  province: string;
  contactNumber: string;
  learningModality: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private firestore = inject(Firestore);
  private collectionName = 'students';

  // CREATE
  async addStudent(student: Student): Promise<string> {
    const docRef = await addDoc(collection(this.firestore, this.collectionName), {
      ...student,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  }

  // READ ALL
  async getStudents(): Promise<Student[]> {
    const querySnapshot = await getDocs(collection(this.firestore, this.collectionName));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Student
    }));
  }

  // READ ONE
  async getStudent(id: string): Promise<Student | null> {
    const docRef = doc(this.firestore, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() as Student } : null;
  }

  // UPDATE
  async updateStudent(id: string, student: Partial<Student>): Promise<void> {
    const docRef = doc(this.firestore, this.collectionName, id);
    await updateDoc(docRef, student);
  }

  // DELETE
  async deleteStudent(id: string): Promise<void> {
    const docRef = doc(this.firestore, this.collectionName, id);
    await deleteDoc(docRef);
  }

  // SEARCH BY LRN
  async getStudentByLRN(lrn: string): Promise<Student | null> {
    const q = query(collection(this.firestore, this.collectionName), where('lrn', '==', lrn));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length > 0) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() as Student };
    }
    return null;
  }
}
```

---

## Step 5: Use Sa Components

```typescript
import { StudentService } from './services/student.service';
import { inject } from '@angular/core';

export class StudentListComponent {
  private studentService = inject(StudentService);
  students: any[] = [];

  async ngOnInit() {
    this.students = await this.studentService.getStudents();
  }

  async addStudent(data: any) {
    const id = await this.studentService.addStudent(data);
    console.log('Student added:', id);
  }
}
```

---

## Step 6: Firestore Authentication Service

Create file: `src/app/services/firebase-auth.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  private auth = inject(Auth);

  // LOGIN
  async login(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      return result.user;
    } catch (error) {
      throw error;
    }
  }

  // REGISTER
  async register(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      return result.user;
    } catch (error) {
      throw error;
    }
  }

  // LOGOUT
  async logout() {
    try {
      await signOut(this.auth);
    } catch (error) {
      throw error;
    }
  }

  // GET CURRENT USER
  getCurrentUser() {
    return this.auth.currentUser;
  }
}
```

---

## Troubleshooting

### Error: "Firebase is not initialized"
- Make sure `FirebaseService` ay initialized sa `app.config.ts`

### Error: "Permission denied"
- Check ang Firestore Rules sa Firebase Console
- Make sure user is authenticated

### Error: "Collection not found"
- Create ang collection sa Firebase Console first
- Or use `addDoc()` na mag-create automatically

---

## Testing Commands sa Console

Open browser console at i-test:

```javascript
// Get all students
db.collection("students").get().then(snapshot => {
  snapshot.forEach(doc => console.log(doc.data()));
});

// Add new student
db.collection("students").add({
  lrn: "1234567890",
  name: "Test Student"
})

// Query by LRN
db.collection("students").where("lrn", "==", "1234567890").get()
```

---

## Next Steps

1. ✅ Create Firestore database
2. ✅ Create collections
3. ✅ Create services
4. ✅ Update authentication
5. ✅ Test CRUD operations
6. ✅ Deploy sa production with proper security rules

**Ready? Start sa Firebase Console!**
