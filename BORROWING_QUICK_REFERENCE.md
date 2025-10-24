# 📚 Book Borrowing System - Quick Reference

## 🚀 Getting Started

### Access the Borrowing System
1. Sidebar Menu → **Pages** → **Book Borrowing**
2. URL: `http://localhost:4200/pages/borrowing`

---

## 📊 Two Main Views

### **1. 📚 Borrowed Books Table**
Shows all borrowing records with details:
- Student Name
- Book Title
- Borrow Date
- Due Date
- Return Date
- Status (Borrowed/Overdue/Returned)
- Actions (Return/Delete)

### **2. ⚠️ Penalties Table**
Shows all penalties for overdue books:
- Student Name
- Book Title
- Days Overdue
- Penalty Amount (₱)
- Date Created
- Status (Pending/Paid)
- Actions (Mark as Paid/Delete)

---

## ⚡ Quick Actions

### **Borrow a Book**
```
Click "New Borrow" →
Select Student →
Select Book →
Verify Borrow Date →
Click "Borrow"
```
**Result**: Book status = "Borrowed", Due date = Today + 14 days

### **Return a Book**
```
Find book in "Borrowed Books" table →
Click "Return" button →
Confirm return
```
**If On Time**: ✅ "Book returned on time" (No penalty)
**If Late**: ⚠️ Penalty created automatically

### **Check for Overdue Books & Penalties**
```
Click "Check Penalties" button
```
**What it does**:
- Marks books past due date as "Overdue"
- Creates penalties (₱20/day)
- Updates penalty table

### **Mark Penalty as Paid**
```
Find penalty in "Penalties" table →
Click "Mark as Paid" →
Confirm
```
**Result**: Penalty status = "Paid"

---

## 💰 Penalty Calculation

### **Formula**
```
Days Overdue = Return Date - Due Date
Penalty Amount = Days Overdue × ₱20
```

### **Example**
```
Due Date: 2024-11-07
Return Date: 2024-11-12
Days Overdue: 5 days
Penalty: 5 × ₱20 = ₱100
```

---

## 📅 Key Dates

| Event | Duration |
|-------|----------|
| Borrow Period | 2 weeks (14 days) |
| Penalty Rate | ₱20 per day |
| Penalty Starts | Day after due date |

---

## 🎯 Status Colors

### **Borrowing Status**
| Status | Color | Icon | Meaning |
|--------|-------|------|---------|
| Borrowed | 🔵 Blue | ℹ️ | Currently borrowed |
| Overdue | 🔴 Red | ⚠️ | Past due date |
| Returned | 🟢 Green | ✓ | Successfully returned |

### **Penalty Status**
| Status | Color | Meaning |
|--------|-------|---------|
| Pending | 🔴 Red | Not yet paid |
| Paid | 🟢 Green | Payment received |

---

## 🔄 Complete Workflow

```
1. BORROW
   Student: John Doe
   Book: The Great Gatsby
   Borrow Date: Oct 24
   Due Date: Nov 7
   Status: Borrowed

   ↓

2. MONITOR
   Check if overdue →
   Click "Check Penalties"

   ↓

3. RETURN
   Return Date: Nov 12 (5 days late)
   Penalty: ₱100 created
   Status: Returned + Penalty Pending

   ↓

4. PAY PENALTY
   Click "Mark as Paid"
   Penalty Status: Paid
   Student record updated
```

---

## 📝 Database Structure (Overview)

### **Borrowing Collection**
```
{
  studentId: "ABC123",
  bookId: "XYZ789",
  borrowDate: "2024-10-24",
  dueDate: "2024-11-07",
  returnDate: "2024-11-12",
  status: "returned"
}
```

### **Penalties Collection**
```
{
  studentId: "ABC123",
  borrowingId: "BORROW001",
  amount: 100,
  daysOverdue: 5,
  dateCreated: "2024-11-12",
  status: "pending"
}
```

---

## 🛠️ Maintenance Tasks

### **Daily**
- ✓ Process book returns
- ✓ Monitor new borrowings

### **Weekly**
- ✓ Click "Check Penalties"
- ✓ Review overdue books
- ✓ Send reminders to students

### **Monthly**
- ✓ Process penalty payments
- ✓ Generate reports
- ✓ Archive old records

---

## ❓ FAQ

**Q: When is a penalty created?**
A: Automatically when a book is returned after the due date.

**Q: How much is the penalty?**
A: ₱20 per day overdue.

**Q: Can I change the borrow period?**
A: Currently fixed at 2 weeks. Contact developer to customize.

**Q: What if penalty is not showing?**
A: Click "Check Penalties" button to manually refresh.

**Q: Can I undo a payment?**
A: Currently not available. Contact admin to modify.

**Q: How do I export the data?**
A: Use PrimeNG table's export feature or download from Firestore console.

---

## 🔗 Related Features

- **Students Page**: Manage student information
- **CRUD (Books)**: Manage book inventory
- **Firestore Console**: View raw data and backups
- **Menu**: Navigate via sidebar

---

## 📞 Support

For issues or enhancements:
1. Check the main guide: `BORROWING_SYSTEM_GUIDE.md`
2. Contact system administrator
3. Check Firestore logs for errors

---

**Last Updated**: October 24, 2025
**Version**: 1.0
**Status**: ✅ Production Ready
