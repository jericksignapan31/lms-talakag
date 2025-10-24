# 📺 Visual Guide - Book Already Borrowed Feature

## 🎬 Screen Mockups

### **Screen 1: Borrow Dialog (Normal)**
```
┌─────────────────────────────────────────────┐
│  📚 Borrow Book                      [X]    │
├─────────────────────────────────────────────┤
│                                             │
│  Student *                                  │
│  ┌─────────────────────────────────────┐   │
│  │ Juan dela Cruz             ↓        │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Book *                                     │
│  ┌─────────────────────────────────────┐   │
│  │ Introduction to Biology ↓           │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Borrow Date                                │
│  ┌─────────────────────────────────────┐   │
│  │ 2025-10-24                          │   │
│  └─────────────────────────────────────┘   │
│                                             │
│        [Cancel]           [Borrow]          │
└─────────────────────────────────────────────┘
```

---

### **Screen 2: Success - Book Available** ✅
```
After clicking [Borrow]:

┌──────────────────────────────────────┐
│  ✅ Success                          │
├──────────────────────────────────────┤
│  Book borrowed successfully.         │
│  Due date: 2025-11-07               │
└──────────────────────────────────────┘

(Dialog closes, table refreshes with new borrowing record)
```

---

### **Screen 3: Error - Book Already Borrowed** ❌
```
After clicking [Borrow] with already-borrowed book:

┌──────────────────────────────────────────────────┐
│  ❌ Book Already Borrowed                        │
├──────────────────────────────────────────────────┤
│  This book is currently borrowed by:             │
│  Juan dela Cruz                                  │
│  (Due: 2025-11-07)                              │
└──────────────────────────────────────────────────┘

(Dialog stays open, user can select different book or cancel)
```

---

## 📊 Step-by-Step Flow

### **Scenario: Try to Borrow Already-Borrowed Book**

```
STEP 1: View Borrowed Books
┌────────────────────────────────────────────┐
│ 📚 Borrowed Books                           │
├─────────────┬───────────┬─────────────────┤
│ Student     │ Book      │ Status          │
├─────────────┼───────────┼─────────────────┤
│ Juan        │ Biology   │ 🔵 borrowed     │  ← This book is borrowed!
│ Maria       │ History   │ 🔵 borrowed     │
└─────────────┴───────────┴─────────────────┘

       ↓ User clicks "New Borrow"

STEP 2: Open Borrow Dialog
┌─────────────────────────────────────────────┐
│  📚 Borrow Book                      [X]    │
├─────────────────────────────────────────────┤
│  Student: [Any Student]                     │
│  Book: [Biology 10]  ← Same book!          │
│  Date: 2025-10-24                           │
│                                             │
│        [Cancel]          [Borrow]           │
└─────────────────────────────────────────────┘

       ↓ User clicks [Borrow]

STEP 3: System Checks
System checks: "Is Biology 10 already borrowed?"
       ↓
Found: Biology 10 is borrowed by Juan (status: borrowed)
       ↓
Block the borrow!

STEP 4: Show Error
┌────────────────────────────────────────────┐
│ ❌ Book Already Borrowed                   │
├────────────────────────────────────────────┤
│ This book is currently borrowed by:         │
│ Juan dela Cruz                              │
│ (Due: 2025-11-07)                          │
└────────────────────────────────────────────┘

       ↓ User must select different book or cancel
```

---

## 🎨 Error Message Components

```
┌────────────────────────────────────────────────┐
│ ❌ Book Already Borrowed                       │ ← Red header
│                                                │    Severity: error
│ This book is currently borrowed by:            │ ← Main message
│ Juan dela Cruz                                 │ ← Who has it
│ (Due: 2025-11-07)                              │ ← When it's due
└────────────────────────────────────────────────┘
 ↑
 Sticky message (doesn't auto-close)
```

---

## 📱 Responsive Design

### **Desktop** 💻
```
Full width message displays at top of form
┌────────────────────────────────────────────┐
│ ❌ Book Already Borrowed                   │
│ This book is currently borrowed by:         │
│ Juan dela Cruz (Due: 2025-11-07)            │
└────────────────────────────────────────────┘
```

### **Tablet** 📱
```
Same as desktop, responsive width
```

### **Mobile** 📞
```
Wraps text, still readable
┌─────────────────────────────┐
│ ❌ Book Already Borrowed    │
├─────────────────────────────┤
│ This book is currently      │
│ borrowed by:                │
│ Juan dela Cruz              │
│ (Due: 2025-11-07)          │
└─────────────────────────────┘
```

---

## 🔄 Complete User Flow Diagram

```
START: Borrow Dialog
   │
   ├─→ Fill Form (Student, Book, Date)
   │
   ├─→ Click [Borrow]
   │
   ├─→ System Validates Form
   │   ├─ Student selected? YES/NO
   │   ├─ Book selected? YES/NO
   │   └─ Valid date? YES/NO
   │
   ├─→ If form invalid: Show error, stay in dialog
   │
   ├─→ If form valid: Check if book borrowed
   │   │
   │   ├─→ Book status = 'borrowed'? YES/NO
   │   ├─→ Book status = 'overdue'? YES/NO
   │   │
   │   ├─→ If YES: Show error "Book Already Borrowed"
   │   │          ├─ Show borrower name
   │   │          ├─ Show due date
   │   │          └─ Stay in dialog (allow retry)
   │   │
   │   └─→ If NO: Proceed with borrow
   │
   ├─→ Create borrowing record in Firestore
   │
   ├─→ Show success message
   │
   ├─→ Refresh borrowed books table
   │
   └─→ Close dialog
       │
       END: Borrowing complete
```

---

## 💬 Message Variations

### **Variation 1: Book Borrowed**
```
❌ Book Already Borrowed
This book is currently borrowed by: Maria Santos (Due: 2025-11-10)
```

### **Variation 2: Book Overdue**
```
❌ Book Already Borrowed
This book is currently borrowed by: Juan dela Cruz (Due: 2025-10-20)
```

### **Variation 3: Success**
```
✅ Success
Book borrowed successfully. Due date: 2025-11-07
```

---

## 🎯 Table Status Indicators

```
Borrowed Books Table:

┌──────────┬──────────┬──────────┬──────────┐
│ Student  │ Book     │ Due Date │ Status   │
├──────────┼──────────┼──────────┼──────────┤
│ Juan     │ Biology  │ 2025-11-7│ 🔵 Borrow│  ← When trying to
│ Maria    │ History  │ 2025-11-5│ 🔵 Borrow│     borrow "Biology",
│ Pedro    │ Science  │ 2025-11-3│ 🔴 Overdue│    system blocks it
└──────────┴──────────┴──────────┴──────────┘

🔵 = blocked (borrowed or overdue)
🟢 = allowed (returned)
```

---

## 📊 Decision Tree

```
User wants to borrow a book
│
├─ Is the selected book in the Borrowed Books table?
│  │
│  ├─ YES → Is the status "borrowed" or "overdue"?
│  │  │
│  │  ├─ YES → ❌ BLOCK (show error with details)
│  │  │         Show who has it and when due
│  │  │
│  │  └─ NO → ✅ ALLOW (status is "returned")
│  │
│  └─ NO → ✅ ALLOW (book never borrowed)
│
└─ Proceed based on decision above
```

---

## 🎬 Animation/Interaction

```
Timeline of Events:

[0ms] User clicks [Borrow]
      ↓
[100ms] Form validates
        ↓
[150ms] Check if book borrowed
        ↓
[200ms] Decision made
        ├─ If NO: Create record
        │         ↓
        │ [300ms] Show success
        │         ↓
        │ [500ms] Fade out message
        │         ↓
        │ [600ms] Close dialog
        │
        └─ If YES: Show error
                   ↓
           [300ms] Message visible
                   ↓
           [∞] Message stays (sticky)
                   ↓
           [click] User dismisses or retries
```

---

## 🔴 When Error Shows

```
You will see the error when:

1. ✅ Selecting a book that exists
2. ✅ That book has been borrowed
3. ✅ And hasn't been returned yet
4. ✅ And clicking [Borrow]

You WON'T see error when:

1. ❌ Selecting a book that's never been borrowed
2. ❌ Selecting a book that was returned
3. ❌ Selecting a non-existent book
4. ❌ When form validation fails (missing student/book)
```

---

## 🎨 Colors & Styling

```
Error Message Color Scheme:

┌────────────────────────────────────────────┐
│ ❌ Red Header (Severity: error)            │
│                                            │
│ Black text                                 │
│ (Clear, readable)                          │
│                                            │
│ Date info shown clearly                    │
└────────────────────────────────────────────┘

Dialog: Stays open (allows user to change selection)
Message: Sticky (doesn't auto-close)
Icon: ❌ Error indicator
```

---

## 📲 Real Device Testing

### **Desktop Browser**
```
Message displays clearly at top
Full details visible
Easy to read and dismiss
```

### **Mobile Browser**
```
Message responsive
Text wraps properly
Still readable on small screens
Touch-friendly dismiss button (if any)
```

### **Tablet**
```
Message properly sized
Not too large
Not too small
Readable at a glance
```

---

## ✨ User Experience Features

```
✅ Clear error message
   └─ User knows exactly what went wrong

✅ Shows who has the book
   └─ User can contact them or wait

✅ Shows due date
   └─ User knows when it will be available

✅ Dialog stays open
   └─ User can try another book without re-opening

✅ Message is sticky
   └─ User doesn't miss it

✅ Easy to understand
   └─ No technical jargon
   └─ Simple, clear language
```

---

## 🎯 Test Checklist (Visual)

```
☑ Error message appears
   └─ Correct text displayed?
   └─ Correct student name shown?
   └─ Correct due date shown?

☑ Dialog behavior
   └─ Dialog stays open?
   └─ Can select different book?
   └─ Can click [Cancel]?

☑ Message styling
   └─ Red color shows?
   └─ Icon displays?
   └─ Text readable?

☑ Responsive
   └─ Mobile looks good?
   └─ Tablet looks good?
   └─ Desktop looks good?
```

---

## 🎉 Summary

When a user tries to borrow an already-borrowed book:

1. **System detects** the book is unavailable
2. **Error message appears** at top of dialog
3. **Shows borrower details**:
   - Who currently has it
   - When it's due back
4. **User can** select different book or cancel
5. **Message is sticky** (doesn't disappear)
6. **Dialog stays open** for easy retry

---

**Status**: ✅ Complete and Ready
**Quality**: Professional Grade
**Testing**: Visual Verified

Happy Borrowing! 📚✨

Salamat! 🙏
