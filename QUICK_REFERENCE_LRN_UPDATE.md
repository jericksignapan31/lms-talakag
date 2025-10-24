# 🎯 Quick Reference - LRN & Accession Number Update

## What Changed? 
**Old → New**
- `studentId` → `studentLRN`
- `bookId` → `bookAccessionNumber`

---

## Database Structure

### Student (Use LRN)
```json
{
  "lrn": "202400001",  ← Use this
  "name": "Juan dela Cruz",
  "email": "juan@school.edu"
}
```

### Book (Use Accession Number)
```json
{
  "accessionNumber": "ACC-2024-001",  ← Use this
  "title": "Biology 10",
  "author": "John Smith"
}
```

### Borrowing Record (Now Creates With LRN & Accession Number)
```json
{
  "studentLRN": "202400001",        ✅ NEW
  "bookAccessionNumber": "ACC-2024-001",  ✅ NEW
  "borrowDate": "2025-10-24",
  "dueDate": "2025-11-07",
  "status": "borrowed"
}
```

---

## Files Changed

| File | What Changed |
|------|-------------|
| `firestore-borrowing.service.ts` | Interface & methods updated |
| `borrowing.ts` | Form & component methods updated |

---

## Status

```
✅ Service: No errors
✅ Component: No errors
✅ Ready to use: YES
```

---

## How to Use (Same as Before)

1. Sidebar → Pages → Book Borrowing
2. Click "New Borrow"
3. Select Student (shows name, uses LRN internally)
4. Select Book (shows title, uses accession number internally)
5. Click "Borrow"

**Everything works the same! Only internal field names changed.** ✅

---

## Firestore Queries

```typescript
// Get borrowings by student LRN
await borrowingService.getBorrowingsByStudent("202400001")

// Get penalties by student LRN  
await borrowingService.getPenaltiesByStudent("202400001")
```

---

**All Systems: ✅ Operational**
