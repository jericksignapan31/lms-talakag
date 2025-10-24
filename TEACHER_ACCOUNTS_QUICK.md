# Teacher Account System - Quick Reference

## Teacher Account Creation & Login

### How It Works

When you add a teacher in the Teacher Users page:
1. Teacher info is saved to Firestore
2. Firebase account is automatically created with:
   - **Email:** `{teacherID}@lms.talakag`
   - **Username (Teacher ID):** `{teacherID}`
   - **Password:** `{teacherID}` (same as username)

### Teacher Login

1. Go to login page: `/auth/login`
2. Select **👨‍🏫 Teacher** from dropdown
3. Enter **Teacher ID** (username)
4. Enter **Teacher ID** (password)
5. Click **Sign In**

### Example

Teacher: Juan Dela Cruz
- Teacher ID: `T001`

**Login Credentials:**
- Username: `T001`
- Password: `T001`
- Email: `T001@lms.talakag`

## Managing Teacher Accounts

### Adding a Teacher

1. Navigate to **Teacher Users** menu
2. Click **New Teacher**
3. Fill in details:
   - Name: Juan Dela Cruz
   - Teacher ID: T001 ← **Used as password!**
   - Birth Date: 1990-05-15
   - Department: Mathematics
   - Email: juan@school.edu.ph
   - Contact Number: 09123456789
4. Click **Save**
5. Firebase account created automatically ✅
6. Success message shows credentials

### Editing a Teacher

1. Click **Edit** icon (pencil) on teacher row
2. Update details
3. Click **Save**
4. Changes saved to Firestore
5. **Note:** Teacher ID cannot be changed (for account continuity)

### Deleting a Teacher

1. Click **Delete** icon (trash) on teacher row
2. Confirm deletion
3. System removes:
   - Firestore record
   - Firebase account
4. Confirmation message ✅

## Features & Capabilities

### Teacher Borrow Books ✅
- Teachers can borrow books just like students
- Same 14-day borrow period
- Same ₱20/day penalty for overdue
- Records show "👨‍🏫 Teacher" indicator

### Teacher Login ✅
- Dedicated login path for teachers
- Separate from student login
- Maintains user role: "teacher"

### Account Auto-Deletion ✅
- When teacher deleted, account removed too
- Prevents orphaned accounts
- Clean cascade deletion

## Security Notes

- Teacher ID is simple password for easy access
- Can be changed to custom password in future
- Firebase handles encryption
- Each teacher has unique Teacher ID

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Teacher can't login | Verify Teacher ID matches database exactly |
| Account creation failed | Teacher still added to database, manual account creation needed |
| Need to change Teacher ID | Not supported yet - delete and re-add with new ID |
| Forgot password | Password = Teacher ID |
| Teacher login not working | Check user type dropdown set to "👨‍🏫 Teacher" |

## System Architecture

### Firebase Authentication (Auth)
```
Teacher credentials stored
├── Email: {teacherID}@lms.talakag
├── Password: {teacherID}
└── Role: teacher
```

### Firestore Database (Data)
```
teachers collection
├── id: document ID
├── name: Juan Dela Cruz
├── teacherID: T001
├── department: Mathematics
├── email: juan@school.edu.ph
├── birthDate: 1990-05-15
├── contactNumber: 09123456789
└── createdAt: timestamp
```

### Borrowing Records (Links)
```
borrowing collection
├── studentName: Juan Dela Cruz (👨‍🏫 Teacher)
├── studentLRN: T001 (uses teacherID)
├── bookAccessionNumber: ACC001
├── borrowDate, dueDate, returnDate, etc.
```

## User Roles in System

### Student
- Login with: LRN
- Password: LRN or LRN@123
- Can: Borrow books, view own borrowing history, pay penalties

### Teacher
- Login with: Teacher ID
- Password: Teacher ID
- Can: Borrow books, access teacher dashboard, manage classes (future)

### Admin
- Login with: Email + custom password
- Can: Manage all users, settings, reports

## CSV Import Teacher Accounts

When importing teachers via CSV:
1. Upload CSV with teacher data
2. System creates each teacher record
3. Firebase account automatically created for each
4. Status messages show success/failure per teacher
5. Partial success possible (if some accounts fail)

### CSV Template

```
Name,Teacher ID,Birthdate,Department,Email,Contact Number
Juan Dela Cruz,T001,1990-05-15,Mathematics,juan@school.edu.ph,09123456789
Maria Santos,T002,1991-03-20,English,maria@school.edu.ph,09198765432
```

## Related Features

- **Borrowing System:** Teachers can borrow books like students
- **Penalties:** Teachers charged ₱20/day for overdue books
- **Dual User Type:** System supports both Student and Teacher borrowers
- **Table Filtering:** Filter borrowing records by Student or Teacher

## API Endpoints Used

### For Account Creation
```typescript
createTeacherAccount(teacherID: string): Promise<string>
```

### For Login
```typescript
loginWithTeacherID(teacherID: string, password: string): Observable<AuthenticatedUser>
```

### For Account Deletion
```typescript
deleteTeacherAccount(teacherID: string): Promise<void>
```

## Next Steps

1. ✅ Add teachers in Teacher Users page
2. ✅ Teachers receive their credentials (ID = password)
3. ✅ Teachers login with their ID
4. ✅ Teachers can borrow and return books
5. ⏳ Teachers pay penalties if overdue

---

**Quick Links:**
- Login Page: `/auth/login`
- Teacher Users: `/pages/teacher`
- Book Borrowing: `/pages/borrowing`

**Credentials Format:**
- Pattern: `{teacherID}@lms.talakag` (email)
- Username: `{teacherID}`
- Password: `{teacherID}`
