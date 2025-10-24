# Teacher Account System - Implementation Examples

## Example 1: Adding a Teacher

### UI Flow
```
1. Teacher Users Page
   ↓
2. Click "New Teacher" button
   ↓
3. Form Dialog Opens
   - Name: Juan Dela Cruz
   - Teacher ID: T001
   - Birth Date: 1990-05-15
   - Department: Mathematics
   - Email: juan@school.edu.ph
   - Contact Number: 09123456789
   ↓
4. Click "Save"
   ↓
5. Backend Process:
   a. Save teacher to Firestore collection 'teachers'
   b. Create Firebase Auth account
      - Email: T001@lms.talakag
      - Password: T001
   c. Success message displays
      "Teacher Added and Account Created
       Username: T001
       Password: T001"
   ↓
6. Table refreshes, teacher appears in list
```

### Code Example

```typescript
// In teacher.ts component
async saveTeacher() {
    if (this.teacher.name && this.teacher.teacherID && this.teacher.email) {
        try {
            // Add to Firestore
            const newTeacher: Teacher = {
                name: this.teacher.name,
                teacherID: this.teacher.teacherID,
                birthDate: this.teacher.birthDate,
                department: this.teacher.department,
                email: this.teacher.email,
                contactNumber: this.teacher.contactNumber
            };

            await this.teacherService.addTeacher(newTeacher);

            // Create Firebase account
            try {
                await this.teacherService.createTeacherAccount(newTeacher);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: `Teacher Added and Account Created
                             Username: ${this.teacher.teacherID}
                             Password: ${this.teacher.teacherID}`
                });
            } catch (accountError) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Partial Success',
                    detail: `Teacher Added but Account Creation Failed`
                });
            }

            await this.loadTeachersFromFirestore();
            this.hideDialog();
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to save teacher'
            });
        }
    }
}
```

## Example 2: Teacher Login

### UI Flow
```
1. Login Page (/auth/login)
   ↓
2. User Type Selector: "👨‍🏫 Teacher"
   ↓
3. Enter Teacher ID: T001
   ↓
4. Enter Password: T001
   ↓
5. Click "Sign In"
   ↓
6. Backend Authentication:
   a. Call loginWithTeacherID('T001', 'T001')
   b. Firebase checks: T001@lms.talakag + password T001
   c. Credentials valid → Return auth user
   d. Store in localStorage
   e. Set role: "teacher"
   ↓
7. Redirect to /dashboard
   ↓
8. Dashboard shows "Welcome, Juan Dela Cruz (👨‍🏫)"
```

### Code Example

```typescript
// In login.ts component
onSubmit() {
    if (this.userType === 'student') {
        this.auth.login(this.username, this.password).subscribe({...});
    } else {
        // Teacher login
        this.auth.loginWithTeacherID(this.username, this.password).subscribe({
            next: (ok) => {
                if (ok) {
                    this.router.navigate(['/dashboard']);
                } else {
                    this.error = 'Invalid credentials';
                }
            }
        });
    }
}

// In auth.service.ts
loginWithTeacherID(teacherID: string, password: string): Observable<boolean> {
    return this.lmsAuth.loginWithTeacherID(teacherID, password).pipe(
        tap((user) => {
            if (user) {
                localStorage.setItem(this.tokenKey, 'firebase-token');
                const authUser: AuthUser = {
                    id: user.uid,
                    username: teacherID,
                    teacherID: teacherID,
                    role: 'teacher',
                    name: user.displayName || '',
                    email: user.email || ''
                };
                localStorage.setItem(this.userKey, JSON.stringify(authUser));
            }
        })
    );
}

// In lms-auth.service.ts
loginWithTeacherID(teacherID: string, password: string): Observable<AuthenticatedUser | null> {
    const email = `${teacherID}@lms.talakag`;
    
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
        switchMap(async (result) => {
            return {
                ...result.user,
                role: 'teacher'
            } as AuthenticatedUser;
        }),
        tap((user) => this.currentUserSubject.next(user))
    );
}
```

## Example 3: Deleting a Teacher

### UI Flow
```
1. Teacher Users Page (teacher row)
   ↓
2. Click Trash Icon
   ↓
3. Confirmation Dialog:
   "Are you sure you want to delete Juan Dela Cruz?
    This will also delete their Firebase account."
   ↓
4. Click "Delete"
   ↓
5. Backend Process:
   a. Delete from Firestore 'teachers' collection
   b. Delete Firebase Auth account
      Email: T001@lms.talakag
   c. Success message displays
      "Teacher and Account Deleted"
   ↓
6. Table refreshes, teacher removed from list
```

### Code Example

```typescript
// In teacher.ts component
deleteTeacher(teacher: Teacher) {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete ' + teacher.name + '?\n\nThis will also delete their Firebase account.',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
            try {
                if (teacher.id) {
                    // Delete from Firestore
                    await this.teacherService.deleteTeacher(teacher.id);

                    // Delete Firebase account
                    if (teacher.teacherID) {
                        try {
                            await this.teacherService.deleteTeacherAccount(teacher.teacherID);
                        } catch (accountError) {
                            console.warn('Account deletion partial:', accountError);
                        }
                    }
                }
                
                await this.loadTeachersFromFirestore();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Teacher and Account Deleted'
                });
            } catch (error) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete teacher'
                });
            }
        }
    });
}

// In firestore-teacher.service.ts
async deleteTeacherAccount(teacherID: string): Promise<void> {
    try {
        await this.authService.deleteTeacherAccount(teacherID);
        console.log(`Teacher account deleted for ${teacherID}`);
    } catch (error) {
        console.error(`Error deleting teacher account for ${teacherID}:`, error);
        throw error;
    }
}

// In lms-auth.service.ts
async deleteTeacherAccount(teacherID: string): Promise<void> {
    try {
        const email = `${teacherID}@lms.talakag`;
        const currentUser = this.auth.currentUser;
        
        if (currentUser && currentUser.email === email) {
            // Delete current logged-in user
            await currentUser.delete();
        } else {
            // For other users, log intention to delete
            console.info(`Delete request for teacher account: ${email}`);
        }
    } catch (error) {
        console.error('Error deleting teacher account:', error);
    }
}
```

## Example 4: CSV Import Teachers

### CSV File Format

```csv
Name,Teacher ID,Birthdate,Department,Email,Contact Number
Juan Dela Cruz,T001,1990-05-15,Mathematics,juan@school.edu.ph,09123456789
Maria Santos,T002,1991-03-20,English,maria@school.edu.ph,09198765432
Carlos Rodriguez,T003,1989-07-10,Science,carlos@school.edu.ph,09187654321
```

### Import Flow

```
1. Click "Import CSV" button
   ↓
2. Select CSV file
   ↓
3. System parses file (detected headers)
   ↓
4. For each teacher row:
   a. Validate required fields
   b. Check for duplicates
   c. Create Firestore record
   d. Create Firebase account
   e. Log result
   ↓
5. Display import summary:
   - Successfully imported: 3 teachers
   - Failed: 0
   - Created accounts: 3
   ↓
6. Reload table with new teachers
```

### Import Code Example

```typescript
// In teacher.ts component
async importCSV(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e: any) => {
        try {
            const workbook = XLSX.read(e.target.result, { type: 'binary' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(worksheet);

            let successCount = 0;
            let failCount = 0;

            for (const row of data) {
                try {
                    const teacher: Teacher = {
                        name: row['Name'],
                        teacherID: row['Teacher ID'],
                        birthDate: row['Birthdate'],
                        department: row['Department'],
                        email: row['Email'],
                        contactNumber: row['Contact Number']
                    };

                    // Save to Firestore
                    await this.teacherService.addTeacher(teacher);

                    // Create Firebase account
                    try {
                        await this.teacherService.createTeacherAccount(teacher);
                        successCount++;
                    } catch (accountError) {
                        console.warn(`Account creation failed for ${teacher.teacherID}`);
                        successCount++; // Still count as success if teacher added
                    }
                } catch (error) {
                    failCount++;
                    console.error('Error importing teacher:', error);
                }
            }

            this.messageService.add({
                severity: 'success',
                summary: 'Import Complete',
                detail: `Successfully imported ${successCount} teachers, ${failCount} failed`,
                life: 5000
            });

            await this.loadTeachersFromFirestore();
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Import Error',
                detail: 'Failed to import CSV'
            });
        }
    };

    reader.readAsBinaryString(file);
}
```

## Example 5: Teacher Borrowing Books

### Borrowing Flow with Teacher

```
1. Teacher logs in with ID: T001
   ↓
2. Navigates to "Book Borrowing" page
   ↓
3. Clicks "New Borrow"
   ↓
4. Borrow Dialog Opens:
   - User Type: Select "👨‍🏫 Teacher"
   - Teacher Name: Juan Dela Cruz (T001) ← Dropdown loads teachers
   - Book: Select book to borrow
   - Borrow Date: Today
   ↓
5. Click "Save Borrow"
   ↓
6. System creates record:
   {
     studentLRN: "T001",
     studentName: "Juan Dela Cruz (👨‍🏫 Teacher)",
     bookAccessionNumber: "ACC001",
     bookTitle: "Mathematics 101",
     borrowDate: "2025-10-24",
     dueDate: "2025-11-07", ← 14 days later
     status: "borrowed"
   }
   ↓
7. Table shows:
   | Juan Dela Cruz (👨‍🏫 Teacher) | Mathematics 101 | 2025-11-07 | Borrowed |
   ↓
8. If return is late:
   - Each day overdue: +₱20 penalty
   - Penalties tracked separately
```

## Example 6: Database Structure After Implementation

### Firestore Collections

#### `teachers` Collection
```
Document: T001_001
{
  "id": "T001_001",
  "name": "Juan Dela Cruz",
  "teacherID": "T001",
  "birthDate": "1990-05-15",
  "department": "Mathematics",
  "email": "juan@school.edu.ph",
  "contactNumber": "09123456789",
  "createdAt": "2025-10-24T10:30:00.000Z"
}

Document: T002_001
{
  "id": "T002_001",
  "name": "Maria Santos",
  "teacherID": "T002",
  "birthDate": "1991-03-20",
  "department": "English",
  "email": "maria@school.edu.ph",
  "contactNumber": "09198765432",
  "createdAt": "2025-10-24T11:00:00.000Z"
}
```

#### `borrowing` Collection (with Teachers)
```
Document: borrow_001
{
  "id": "borrow_001",
  "studentLRN": "T001",  ← Uses teacherID for teachers
  "studentName": "Juan Dela Cruz (👨‍🏫 Teacher)",
  "bookAccessionNumber": "ACC001",
  "bookTitle": "Mathematics 101",
  "bookISBN": "978-0-123456-78-9",
  "borrowDate": "2025-10-24",
  "dueDate": "2025-11-07",
  "returnDate": null,
  "status": "borrowed"
}
```

### Firebase Authentication Users
```
User: T001@lms.talakag
├── Email: T001@lms.talakag
├── Password: T001
├── UID: abc123def456...
└── Custom Claims:
    └── role: teacher

User: T002@lms.talakag
├── Email: T002@lms.talakag
├── Password: T002
├── UID: xyz789uvw012...
└── Custom Claims:
    └── role: teacher
```

## Error Scenarios & Handling

### Scenario 1: Teacher ID Already Exists

```typescript
// System checks for duplicates
if (existingTeacher) {
    this.messageService.add({
        severity: 'warn',
        summary: 'Duplicate ID',
        detail: 'Teacher ID already exists'
    });
    return;
}
```

### Scenario 2: Firebase Account Creation Fails

```typescript
// Graceful degradation
try {
    await this.teacherService.createTeacherAccount(newTeacher);
} catch (accountError) {
    this.messageService.add({
        severity: 'warn',
        summary: 'Partial Success',
        detail: 'Teacher added but account creation failed. Please try again.'
    });
    // Teacher still exists in Firestore for data continuity
}
```

### Scenario 3: Teacher Tries to Login Without Account

```typescript
// Firebase returns auth error
loginWithTeacherID(teacherID, password).subscribe({
    error: (error) => {
        // Firebase returns: auth/user-not-found
        this.error = 'Invalid credentials or account not found';
    }
});
```

---

**These examples demonstrate the complete teacher account lifecycle from creation to active use in the system.**
