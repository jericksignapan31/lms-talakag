# LMS Talakag - Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [User Types & Roles](#user-types--roles)
3. [Login Instructions](#login-instructions)
4. [User Features & Functions](#user-features--functions)
5. [System Architecture](#system-architecture)
6. [Technology Stack](#technology-stack)
7. [Deployment Information](#deployment-information)

---

## 🎯 Project Overview

**LMS Talakag** is a Library Management System designed for Talakag schools/institutions. It provides a comprehensive platform for managing books, student/teacher borrowing records, and library operations.

**Key Features:**
- Book inventory management
- Student and teacher borrowing system
- Real-time borrowing tracking
- Dashboard with analytics
- User authentication and role-based access control

---

## 👥 User Types & Roles

The system has **3 main user types**:

### 1. **Admin**
- Full system access
- Manage all library operations
- Add/edit/delete books
- Manage users (students, teachers)
- View all borrowing records
- Generate reports

### 2. **Librarian** (if applicable)
- Manage book inventory
- Process borrowing requests
- Track returns
- Generate borrowing reports

### 3. **Student/Teacher**
- View available books
- Borrow and return books
- View their borrowing history
- Request books

---

## 🔐 Login Instructions

### **Login Page URL:**
```
https://lms-talakag.vercel.app/auth/login
```

### **3 Login Methods Available:**

#### **Method 1: Email & Password**
```
Email: user@example.com
Password: your_password
```

#### **Method 2: Teacher ID**
```
Teacher ID: e.g., T001, T002, etc.
Password: teacher_password
```

#### **Method 3: Student ID (LRN)**
```
Student LRN: e.g., 123456789
Password: student_password
```

### **Login Flow:**
1. Navigate to `/auth/login`
2. Enter credentials (email, teacher ID, or student LRN)
3. Click "Login"
4. System validates credentials via Firebase
5. Generates 60-minute session token
6. Redirects to `/pages/dashboard` on success

### **Session Management:**
- **Token Expiry:** 60 minutes
- **Auto-Refresh:** 10 minutes before expiry
- **Storage:** SessionStorage (primary) + LocalStorage (fallback)
- **Back Button:** Disabled after logout for security

---

## 🚀 User Features & Functions

### **STUDENT Users**

#### **Available Functions:**
| Function | Description | Route |
|----------|-------------|-------|
| **View Dashboard** | See borrowing statistics | `/pages/dashboard` |
| **Browse Books** | Search and view available books | `/pages/crud` |
| **Borrow Book** | Request to borrow a book | Dialog form on books page |
| **View My Borrowings** | See all my borrowed books | `/pages/borrowing` |
| **Return Book** | Mark book as returned | Books page or borrowing list |
| **View History** | See past borrowing records | `/pages/borrowing` (with filters) |

#### **Student Dashboard Shows:**
- Total books available
- Total students in system
- Total teachers in system
- Active borrowers count
- Monthly borrowing trends (chart)
- Borrowing breakdown by grade & section (chart + table)
- Active vs Returned borrowings (status chart)

---

### **TEACHER Users**

#### **Available Functions:**
| Function | Description | Route |
|----------|-------------|-------|
| **View Dashboard** | See teaching/borrowing statistics | `/pages/dashboard` |
| **Browse Books** | Search and view available books | `/pages/crud` |
| **Borrow Book** | Request to borrow a book | Dialog form on books page |
| **View My Borrowings** | See all my borrowed books | `/pages/borrowing` |
| **Return Book** | Mark book as returned | Books page or borrowing list |
| **View History** | See past borrowing records | `/pages/borrowing` (with filters) |

#### **Teacher Dashboard Shows:**
- Same as Student (system-wide statistics)
- Teacher borrowing records marked separately

---

### **ADMIN Users**

#### **Available Functions:**
| Function | Description | Route |
|----------|-------------|-------|
| **View Dashboard** | Complete system statistics | `/pages/dashboard` |
| **Manage Books** | Add/Edit/Delete books | `/pages/admin` or `/pages/crud` |
| **Manage Students** | Add/Edit/Delete student records | `/pages/students` |
| **Manage Teachers** | Add/Edit/Delete teacher records | `/pages/teacher` |
| **Manage Users** | Manage all user accounts | `/pages/users` |
| **View All Borrowings** | See all borrowing records | `/pages/borrowing` |
| **Process Returns** | Mark books as returned | `/pages/borrowing` |
| **Generate Reports** | Export data to CSV/Excel | Dashboard or reports page |
| **System Settings** | Configure system parameters | `/pages/admin/settings` |

#### **Admin Dashboard Shows:**
- Complete system statistics
- All books and inventory
- All students and teachers
- All borrowing transactions
- System analytics and reports

---

## 📊 Dashboard Components

### **1. Statistics Cards** (All Users)
- **Available Books**: Total count of books in inventory
- **Students**: Total count of registered students
- **Teachers**: Total count of registered teachers
- **Active Borrowers**: Count of users with currently borrowed books

### **2. Monthly Borrowing Trends Chart** (All Users)
- **Type**: Line Chart
- **Data**: Borrowing count per month (current year)
- **Purpose**: Show borrowing patterns over time
- **Color**: Blue line with gradient

### **3. Borrowing by Grade & Section Chart** (All Users)
- **Type**: Horizontal Bar Chart
- **Data**: Total borrowings grouped by grade and section
- **Categories**: 
  - Student grades (e.g., 7-A, 8-B, 9-C)
  - Teachers (separate category)
- **Color**: Blue bars

### **4. Borrowing Status Overview Chart** (All Users)
- **Type**: Stacked Horizontal Bar Chart
- **Data**: Active vs Returned borrowings by grade
- **Colors**: 
  - Green: Active/Currently borrowed
  - Orange: Returned/Completed
- **Purpose**: Show borrowing completion rate by grade

### **5. Grade & Section Details Table** (All Users)
- **Columns**:
  - Grade & Section (e.g., 7-A, 8-B)
  - Total Borrowings
  - Active (still borrowed)
  - Returned (completed)
  - Unique Students
  - Active % (percentage still borrowed)
- **Features**:
  - Sortable by any column
  - Color-coded badges
  - Responsive design

---

## 🏗️ System Architecture

### **Frontend Stack:**
- **Framework**: Angular 20 (Standalone Components)
- **Styling**: Tailwind CSS + SCSS
- **UI Components**: PrimeNG 20
- **Charts**: Chart.js via PrimeNG
- **State Management**: Angular Signals
- **HTTP**: RxJS Observables + Promises

### **Backend Services:**

#### **Authentication Service** (`AuthService`)
- Login/Logout functionality
- Token management (60-min expiry)
- Session management
- Role-based access control

#### **Firestore Services:**
- `FirestoreBookService` - Book management
- `FirestoreStudentService` - Student data
- `FirestoreTeacherService` - Teacher data
- `FirestoreBorrowingService` - Borrowing records
- `FirestoreCountryService` - Location data

#### **Route Guards:**
- `RoleGuard` - Protects routes based on authentication
- `AuthGuard` - Validates user session

### **Database:**
- **Platform**: Google Firebase Firestore
- **Real-time**: Yes, data syncs automatically
- **Collections**:
  - `books` - Book inventory
  - `students` - Student records
  - `teachers` - Teacher records
  - `borrowings` - Borrowing transactions
  - `users` - User accounts

---

## 💻 Technology Stack

### **Frontend:**
```
Angular 20
TypeScript 5.8.3
Tailwind CSS 4.1.11
PrimeNG 20
Chart.js 4.4.2
RxJS 7.8.2
```

### **Backend:**
```
Firebase 12.4.0
Firebase Authentication
Firestore Database
```

### **Build Tools:**
```
Angular CLI 20
Node.js (npm)
Webpack (Angular built-in)
```

### **Styling:**
```
Tailwind CSS with PrimeUI theme
SCSS/SASS
PostCSS 8.5.6
```

---

## 🚀 Deployment Information

### **Production Domain:**
```
https://lms-talakag.vercel.app
```

### **Hosting Platform:**
- **Vercel** (Edge network, auto-scaling)
- **Build Command**: `npm run build`
- **Output Directory**: `dist/sakai-ng`
- **Framework**: Angular 20

### **Environment Configuration:**
- **Production URL**: https://lms-talakag.vercel.app
- **API URL**: https://api.lms-talakag.com
- **Firebase Project**: lams-talakag

### **Build & Deploy Commands:**

**Local Build:**
```bash
npm run build
```

**Local Development:**
```bash
npm start
# or with API server
npm run start:dev
```

**Deploy to Vercel:**
```bash
vercel deploy --prod
```

---

## 📱 Responsive Design

- **Mobile**: Full-width layouts, stacked components
- **Tablet**: 2-column layouts for charts
- **Desktop**: Full dashboard with side-by-side components

---

## 🔒 Security Features

✅ **Authentication**
- Firebase Authentication with email/password, Teacher ID, Student ID
- Token-based session management

✅ **Session Management**
- 60-minute token expiry
- Automatic token refresh
- Secure storage (sessionStorage + localStorage)

✅ **Route Protection**
- RoleGuard on all protected routes
- Token validation before page access
- Automatic logout on token expiry

✅ **Data Privacy**
- Firestore security rules
- User-specific data access
- No back button after logout

---

## 📖 How to Use This Documentation

1. **For Login Issues**: See [Login Instructions](#login-instructions)
2. **For Feature Discovery**: See [User Features & Functions](#user-features--functions)
3. **For System Understanding**: See [System Architecture](#system-architecture)
4. **For Deployment**: See [Deployment Information](#deployment-information)

---

## 🤝 Support & Troubleshooting

### **Common Issues:**

**Q: Can't login?**
- Verify credentials are correct
- Check internet connection
- Clear browser cache
- Try different login method

**Q: Session expired?**
- Refresh the page
- Login again (token valid for 60 minutes)

**Q: Dashboard not loading?**
- Clear browser cache
- Check Firebase connection
- Verify user has proper role/permissions

**Q: Can't see borrowed books?**
- Ensure you're logged in with correct account
- Check borrowing history page
- Verify books are borrowed under your account

---

## 📞 Contact & Support

For technical support or issues:
- Contact: LMS Administrator
- Email: admin@lms-talakag.com
- Documentation: This file (PROJECT_DOCUMENTATION.md)

---

**Last Updated**: October 25, 2025
**Version**: 1.0.0
**Project**: LMS Talakag
