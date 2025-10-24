# 📚 Book Borrowing System - Complete Setup Guide

## Overview
This guide walks you through the complete book borrowing system with penalty tracking for late returns.

---

## **Database Structure**

### **1. Borrowing Collection** (`borrowing`)
Stores all book borrowing records.

```
borrowing/
├── documentId (auto-generated)
├── studentId (reference to student)
├── studentName (for display)
├── bookId (reference to book)
├── bookTitle (for display)
├── bookISBN (for reference)
├── borrowDate (YYYY-MM-DD)
├── dueDate (YYYY-MM-DD) - 2 weeks from borrowDate
├── returnDate (YYYY-MM-DD) - null until returned
├── status ('borrowed' | 'returned' | 'overdue')
├── issuedBy (librarian/admin name)
└── createdAt (timestamp)
```

**Example:**
```json
{
  "studentId": "student123",
  "studentName": "John Doe",
  "bookId": "book456",
  "bookTitle": "The Great Gatsby",
  "bookISBN": "978-0743273565",
  "borrowDate": "2024-10-24",
  "dueDate": "2024-11-07",
  "returnDate": null,
  "status": "borrowed",
  "createdAt": "2024-10-24T10:30:00Z"
}
```

### **2. Penalties Collection** (`penalties`)
Tracks penalties for overdue books.

```
penalties/
├── documentId (auto-generated)
├── studentId (reference to student)
├── studentName (for display)
├── borrowingId (reference to borrowing record)
├── bookId (reference to book)
├── bookTitle (for display)
├── amount (in pesos) - 20 per day
├── daysOverdue (number)
├── dateCreated (YYYY-MM-DD)
├── paidDate (YYYY-MM-DD) - null until paid
├── status ('pending' | 'paid')
└── createdAt (timestamp)
```

**Example:**
```json
{
  "studentId": "student123",
  "studentName": "John Doe",
  "borrowingId": "borrowing789",
  "bookId": "book456",
  "bookTitle": "The Great Gatsby",
  "amount": 100,
  "daysOverdue": 5,
  "dateCreated": "2024-11-12",
  "paidDate": null,
  "status": "pending",
  "createdAt": "2024-11-12T09:00:00Z"
}
```

---

## **Key Features**

### **1. Borrowing Process**
1. Admin/Librarian clicks **"New Borrow"** button
2. Selects Student and Book from dropdowns
3. System automatically calculates Due Date (2 weeks from Borrow Date)
4. Book status changes to **"Borrowed"**

### **2. Return Process**
1. Admin clicks **"Return"** button on the borrowed book
2. System checks if return is on time or overdue:
   - ✅ **On Time**: Status changes to "Returned", no penalty
   - ❌ **Overdue**: Status changes to "Returned", penalty is created
3. Penalty amount = Days Overdue × ₱20

### **3. Penalty Calculation**
- **Due Date**: 2 weeks (14 days) from borrow date
- **Penalty Rate**: ₱20 per day
- **Example**: 
  - Due: 2024-11-07
  - Returned: 2024-11-12 (5 days late)
  - Penalty: 5 × ₱20 = ₱100

### **4. Automatic Overdue Checking**
- Click **"Check Penalties"** button to:
  - Mark borrowed books past due date as "Overdue"
  - Auto-calculate and create penalties
  - Update penalty table

---

## **How to Use**

### **Step 1: Navigate to Book Borrowing**
1. Go to sidebar menu → **Pages** → **Book Borrowing**
2. You'll see two tables:
   - 📚 **Borrowed Books** - Active borrowing records
   - ⚠️ **Penalties** - Student penalties

### **Step 2: Create a Borrowing Record**
1. Click **"New Borrow"** button
2. Select:
   - **Student**: Choose student from dropdown
   - **Book**: Choose book to borrow
   - **Borrow Date**: Defaults to today (change if needed)
3. Click **"Borrow"**
4. System shows: "Book borrowed successfully. Due date: YYYY-MM-DD"

### **Step 3: Return a Book**
1. Find the borrowed book in the table
2. Click the ✅ **"Return"** button
3. Confirm the return
4. If on time: ✅ "Book returned on time"
5. If late: ⚠️ Shows penalty amount and days overdue

### **Step 4: Check Overdue Books and Penalties**
1. Click **"Check Penalties"** button
2. System automatically:
   - Marks overdue books as "Overdue"
   - Creates penalties for each overdue book
   - Updates penalty table
3. Shows: "Penalties checked and updated"

### **Step 5: Mark Penalty as Paid**
1. Find the penalty in the **Penalties** table
2. Click ✅ **"Mark as Paid"** button
3. Confirm payment
4. Penalty status changes to **"Paid"**

---

## **Service Methods**

### **FirestoreBorrowingService**

#### **Borrowing Methods**
```typescript
// Create borrowing record
borrowBook(borrowing: Borrowing): Promise<string>

// Get all borrowings
getBorrowings(): Promise<Borrowing[]>

// Get borrowings by student
getBorrowingsByStudent(studentId: string): Promise<Borrowing[]>

// Get active borrowings (not returned)
getActiveBorrowings(): Promise<Borrowing[]>

// Get overdue borrowings
getOverdueBorrowings(): Promise<Borrowing[]>

// Return a book
returnBook(id: string, returnDate: string): Promise<void>

// Mark as overdue
markAsOverdue(id: string): Promise<void>
```

#### **Penalty Methods**
```typescript
// Record a penalty
recordPenalty(penalty: Penalty): Promise<string>

// Get penalties by student
getPenaltiesByStudent(studentId: string): Promise<Penalty[]>

// Get pending penalties
getPendingPenalties(): Promise<Penalty[]>

// Mark penalty as paid
markPenaltyAsPaid(id: string, paidDate: string): Promise<void>

// Calculate penalty
calculatePenalty(dueDate: string, returnDate: string): 
  { daysOverdue: number; penaltyAmount: number }

// Auto-check overdue books
checkAndMarkOverdue(): Promise<void>

// Auto-calculate penalties
autoCalculatePenalties(): Promise<void>
```

---

## **Status Indicators**

### **Borrowing Status**
| Status | Color | Meaning |
|--------|-------|---------|
| Borrowed | 🔵 Blue | Book is currently borrowed |
| Overdue | 🔴 Red | Book is past due date |
| Returned | 🟢 Green | Book has been returned |

### **Penalty Status**
| Status | Color | Meaning |
|--------|-------|---------|
| Pending | 🔴 Red | Penalty not yet paid |
| Paid | 🟢 Green | Penalty has been paid |

---

## **Workflow Example**

### **Scenario: Student borrows book**

**Oct 24** - John Doe borrows "The Great Gatsby"
- Borrow Date: Oct 24, 2024
- Due Date: Nov 7, 2024 (14 days later)
- Status: **Borrowed**

**Nov 5** - John returns the book **ON TIME**
- Return Date: Nov 5, 2024
- Days Overdue: 0
- Penalty: None ✅
- Status: **Returned**

---

### **Scenario: Student returns book LATE**

**Oct 24** - Jane Doe borrows "1984"
- Borrow Date: Oct 24, 2024
- Due Date: Nov 7, 2024
- Status: **Borrowed**

**Nov 12** - Jane returns the book **LATE**
- Return Date: Nov 12, 2024
- Days Overdue: 5 days
- Penalty: 5 × ₱20 = **₱100**
- Status: **Returned** (with Penalty: **Pending**)

**Nov 14** - Jane pays the penalty
- Mark as Paid: ✅
- Penalty Status: **Paid**

---

## **Admin Tasks Checklist**

### **Daily**
- [ ] Monitor new borrowing requests
- [ ] Process book returns
- [ ] Check for any overdue books

### **Weekly**
- [ ] Click "Check Penalties" to update overdue status
- [ ] Review pending penalties
- [ ] Follow up on students with overdue books

### **As Needed**
- [ ] Mark penalties as paid when students settle
- [ ] Delete old borrowing records (if needed)
- [ ] Generate reports from the table

---

## **Integration Points**

### **Connected to Existing System**
1. **Students** - Pulled from Student collection
2. **Books** - Pulled from Book collection
3. **Menu** - Added "Book Borrowing" in sidebar
4. **Firestore** - All data stored in Firebase

### **Future Enhancements**
- Email notifications to students with overdue books
- SMS reminders before due date
- Borrowing history reports
- Student discipline records based on penalties
- Book reservation system

---

## **Troubleshooting**

### **Issue: Books don't appear in dropdown**
- Ensure books exist in the CRUD/Book table
- Books must be added to Firestore first

### **Issue: Students don't appear in dropdown**
- Ensure students exist in the Students table
- Students must be added to Firestore first

### **Issue: Penalty not created on return**
- Click "Check Penalties" to manually trigger penalty calculation
- Ensure return date is after due date

### **Issue: Overdue books not showing**
- Click "Check Penalties" button to refresh status
- Verify due date format is correct (YYYY-MM-DD)

---

## **Database Setup Confirmation**

✅ Firestore Collections Created:
- `borrowing` collection for borrowing records
- `penalties` collection for penalty tracking

✅ Component Features:
- New Borrow dialog with student/book selection
- Borrowed Books table with status indicators
- Penalties table with payment tracking
- Automatic penalty calculation
- Check Penalties button for manual updates

✅ Routes Added:
- `/pages/borrowing` - Main borrowing page

✅ Menu Item Added:
- "Book Borrowing" in Pages menu

---

**System Ready! You can now start managing book borrowings with automatic penalty tracking.** 🎉
