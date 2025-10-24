# Teacher Account System

## Overview

The LMS Talakag now includes a complete teacher account management system that automatically creates Firebase accounts for teachers with their Teacher ID as both username and password.

## Features

### 1. **Automatic Account Creation**
- When a new teacher is added to the Teacher Users table, a Firebase account is automatically created
- Email format: `{teacherID}@lms.talakag`
- Username: `{teacherID}`
- Password: `{teacherID}` (same as username for easy access)

### 2. **Teacher Login**
- Teachers can log in using their Teacher ID and password
- Login page now includes a user type selector (Student or Teacher)
- Separate authentication paths for students (LRN) and teachers (Teacher ID)

### 3. **Automatic Account Deletion**
- When a teacher is deleted, their Firebase account is also deleted
- Confirmation dialog warns that the account will be deleted

## Implementation Details

### Files Modified/Created

#### 1. **`src/app/services/lms-auth.service.ts`** (Enhanced)
New methods:
```typescript
// Create teacher account with teacherID as username and password
async createTeacherAccount(teacherID: string): Promise<string | null>

// Login with teacherID
loginWithTeacherID(teacherID: string, password: string): Observable<AuthenticatedUser | null>

// Delete teacher account
async deleteTeacherAccount(teacherID: string): Promise<void>
```

#### 2. **`src/app/pages/auth/auth.service.ts`** (Enhanced)
- Added `teacherID` field to `AuthUser` interface
- New method: `loginWithTeacherID(teacherID, password)` for teacher login

#### 3. **`src/app/pages/auth/login.ts`** (Updated)
- Added user type selector dropdown (Student / Teacher)
- Dynamic labels based on selected user type
- Conditional login logic based on user type

Features:
```
- 👤 Student: Uses LRN as username
- 👨‍🏫 Teacher: Uses Teacher ID as username
```

#### 4. **`src/app/services/firestore-teacher.service.ts`** (Enhanced)
New methods:
```typescript
// Create teacher account in Firebase
async createTeacherAccount(teacher: Teacher): Promise<string | null>

// Delete teacher account from Firebase
async deleteTeacherAccount(teacherID: string): Promise<void>
```

#### 5. **`src/app/pages/teacher/teacher.ts`** (Updated)
- `saveTeacher()`: Automatically creates account for new teachers
- `deleteTeacher()`: Deletes account when teacher is removed
- Success messages display Teacher ID and password for reference

## User Workflows

### Adding a New Teacher

1. Click "New Teacher" button in Teacher Users page
2. Fill in teacher details:
   - Name
   - Teacher ID (unique identifier)
   - Birth Date
   - Department
   - Email
   - Contact Number
3. Click "Save"
4. System automatically creates Firebase account:
   - Email: `{teacherID}@lms.talakag`
   - Password: `{teacherID}`
5. Success message displays credentials

### Teacher Login

1. Go to login page (`/auth/login`)
2. Select "👨‍🏫 Teacher" from user type dropdown
3. Enter Teacher ID
4. Enter Password (same as Teacher ID)
5. Click "Sign In"

### Deleting a Teacher

1. Click trash icon next to teacher in Teacher Users table
2. Confirm deletion
3. System automatically:
   - Removes teacher from Firestore
   - Deletes Firebase account
4. Success message confirms deletion

### Editing a Teacher

1. Click edit icon next to teacher
2. Modify teacher details
3. Click "Save"
4. **Note:** If Teacher ID is changed, a new account will need to be created manually or teacher record updated

## Error Handling

### Account Creation Failures
- If account creation fails, teacher is still added to Firestore
- Warning message displayed: "Partial Success - Teacher Added but Account Creation Failed"
- Teacher can still be managed in the system

### Account Deletion Failures
- If account deletion fails, teacher record is still deleted from Firestore
- Warning logged to console
- Allows cascade deletion without blocking UI

## Security Considerations

### Current Implementation
- ✅ Teacher ID used as password for simplicity
- ✅ Email format follows pattern: `{teacherID}@lms.talakag`
- ✅ Firebase authentication secures credentials

### Recommended Enhancements
1. **Separate Password Field**: Allow teachers to set custom passwords
2. **Password Reset**: Implement password reset functionality
3. **Account Status**: Add active/inactive status for teachers
4. **Login Attempts**: Implement login attempt tracking
5. **Session Management**: Add session timeout and auto-logout

## Authentication Flow

### Student Authentication
```
Username (LRN) + Password (LRN or LRN@123)
                ↓
         login(lrn, password)
                ↓
    Email: {lrn}@lms.talakag
           Password Formats:
           - {lrn}@123 (new)
           - {lrn} (old, backward compatible)
                ↓
        Firebase Authentication
                ↓
        Role: "student"
```

### Teacher Authentication
```
Username (Teacher ID) + Password (Teacher ID)
                ↓
      loginWithTeacherID(teacherID, password)
                ↓
    Email: {teacherID}@lms.talakag
           Password: {teacherID}
                ↓
        Firebase Authentication
                ↓
        Role: "teacher"
```

## Data Structure

### Teacher Document in Firestore
```json
{
  "id": "doc-id",
  "name": "Juan Dela Cruz",
  "teacherID": "T001",
  "birthDate": "1990-05-15",
  "department": "Mathematics",
  "email": "juan@school.edu.ph",
  "contactNumber": "09123456789",
  "createdAt": "2025-10-24T10:30:00Z"
}
```

### Firebase Auth Account
```
Email: T001@lms.talakag
Password: T001
UID: (automatically generated by Firebase)
```

## Testing Checklist

- [ ] Add new teacher → Account created automatically
- [ ] Teacher login with Teacher ID → Success
- [ ] Teacher login with wrong password → Failure
- [ ] Delete teacher → Account and Firestore record removed
- [ ] Edit teacher details → Updates in Firestore
- [ ] CSV import teachers → Multiple accounts created
- [ ] Teacher borrowing → Teacher can borrow books
- [ ] Student login still works → No regression
- [ ] Multiple teachers login/logout → Sessions work correctly

## Database Collections

### `teachers` Collection
- Stores teacher information in Firestore
- Fields: id, name, teacherID, birthDate, department, email, contactNumber, createdAt

### Firebase Auth Users
- Automatically managed by Firebase Authentication
- Each teacher gets email + password credential
- UID linked to teacher records in borrowing system

## Integration with Other Features

### Teacher Borrowing
- Teachers use their Teacher ID when borrowing books
- Same 14-day borrow period as students
- Same penalty system (₱20/day)
- Borrowing records show "👨‍🏫 Teacher" indicator

### Teacher User Roles
- Role: "teacher" assigned during login
- Can be extended to include teacher-specific features:
  - Class management
  - Student attendance
  - Assignment grading
  - etc.

## API Reference

### LmsAuthService Methods

#### `createTeacherAccount(teacherID: string): Promise<string | null>`
Creates Firebase account for teacher
- **Parameters:**
  - `teacherID` (string): Teacher's ID
- **Returns:** Firebase UID or null on error
- **Throws:** Error if account creation fails

#### `loginWithTeacherID(teacherID: string, password: string): Observable<AuthenticatedUser | null>`
Authenticates teacher
- **Parameters:**
  - `teacherID` (string): Teacher's ID
  - `password` (string): Teacher's password
- **Returns:** Observable with authenticated user or null
- **Error Handling:** Caught in login component

#### `deleteTeacherAccount(teacherID: string): Promise<void>`
Deletes teacher's Firebase account
- **Parameters:**
  - `teacherID` (string): Teacher's ID to delete
- **Note:** Gracefully handles if account not found

### AuthService Methods

#### `loginWithTeacherID(teacherID: string, password: string): Observable<boolean>`
Public login method for teachers
- **Parameters:**
  - `teacherID` (string): Teacher's ID
  - `password` (string): Teacher's password
- **Returns:** Observable<boolean> - true if successful
- **Side Effects:**
  - Stores auth token in localStorage
  - Stores user data in localStorage
  - Sets role to "teacher"

### FirestoreTeacherService Methods

#### `createTeacherAccount(teacher: Teacher): Promise<string | null>`
Creates Firebase account for teacher (wrapper)
- **Parameters:**
  - `teacher` (Teacher): Teacher object with teacherID
- **Returns:** Firebase UID or null

#### `deleteTeacherAccount(teacherID: string): Promise<void>`
Deletes teacher's Firebase account (wrapper)
- **Parameters:**
  - `teacherID` (string): Teacher's ID

## Troubleshooting

### Issue: Account creation fails but teacher is added
**Solution:** Teacher record exists in Firestore but no auth account. Manually create account or delete and re-add teacher.

### Issue: Teacher cannot login
**Solution:**
1. Verify Teacher ID matches what's in database
2. Check password is same as Teacher ID
3. Confirm account exists in Firebase Console
4. Clear browser cache/localStorage

### Issue: Teacher can't borrow books
**Solution:**
1. Check teacher is added to Teacher Users
2. Verify teacher account exists in Firebase
3. Confirm borrowing permissions are set correctly

### Issue: Deleted teacher account still exists in Firebase
**Solution:** Manual deletion may be needed via Firebase Console

## Future Enhancements

### Phase 1: Security
- [ ] Custom password field for teachers
- [ ] Password strength requirements
- [ ] Password reset via email
- [ ] Change password functionality

### Phase 2: Account Management
- [ ] Active/Inactive status toggle
- [ ] Account lock after failed attempts
- [ ] Login history/audit trail
- [ ] Session management

### Phase 3: Role-Based Access
- [ ] Different roles (Librarian, Department Head, etc.)
- [ ] Role-based menu items
- [ ] Role-based permission checks
- [ ] Admin panel for account management

### Phase 4: Notifications
- [ ] Account creation email
- [ ] Password reset email
- [ ] Login notifications
- [ ] Account activity alerts

## Related Documentation

- [Student Authentication](./README.md)
- [Teacher Users Management](./IMPLEMENTATION_READY.md)
- [Book Borrowing System](./STUDENT_TEACHER_BORROWING.md)
- [Penalty System](./PENALTIES.md)

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review Firebase Console for account existence
3. Check browser console for error messages
4. Verify all services are properly injected

---

**Last Updated:** October 24, 2025
**Version:** 1.0
**Author:** LMS Development Team
