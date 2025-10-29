import { Injectable, inject } from '@angular/core';
import { FirestoreBorrowingService, Borrowing } from './firestore-borrowing.service';
import { FirestoreStudentService, Student } from './firestore-student.service';
import { FirestoreTeacherService, Teacher } from './firestore-teacher.service';
import { FirestoreBookService, Book } from './firestore-book.service';
import * as XLSX from 'xlsx';

export interface BorrowingHistoryReport {
    borrowerName: string;
    borrowerType: 'student' | 'teacher';
    borrowerLRN: string;
    bookTitle: string;
    bookAccessionNumber: string;
    borrowDate: string;
    dueDate: string;
    returnDate?: string;
    status: string;
    daysOverdue?: number;
}

export interface BookPopularityReport {
    bookTitle: string;
    bookAccessionNumber: string;
    author: string;
    isbn: string;
    totalBorrows: number;
    currentlyBorrowed: number;
    rank: number;
}

export interface StudentPerformanceReport {
    studentName: string;
    studentLRN: string;
    grade: string;
    section: string;
    totalBorrowedBooks: number;
    booksReturned: number;
    booksNotReturned: number;
    overdueBooks: number;
    onTimeReturns: number;
    lateReturns: number;
    performanceScore: number; // 0-100
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

export interface BorrowerListReport {
    name: string;
    type: 'Student' | 'Teacher';
    identifier: string; // LRN or Employee ID
    grade?: string;
    section?: string;
    department?: string;
    bookTitle: string;
    bookAccessionNumber: string;
    borrowDate: string;
    dueDate: string;
    status: string;
}

@Injectable({
    providedIn: 'root'
})
export class ReportsService {
    private borrowingService = inject(FirestoreBorrowingService);
    private studentService = inject(FirestoreStudentService);
    private teacherService = inject(FirestoreTeacherService);
    private bookService = inject(FirestoreBookService);

    // ============ BORROWING HISTORY REPORTS ============

    async getBorrowingHistoryReport(
        startDate?: string,
        endDate?: string,
        status?: 'borrowed' | 'returned' | 'overdue'
    ): Promise<BorrowingHistoryReport[]> {
        try {
            let borrowings = await this.borrowingService.getBorrowings();

            // Filter by date range if provided
            if (startDate && endDate) {
                borrowings = borrowings.filter(b => 
                    b.borrowDate >= startDate && b.borrowDate <= endDate
                );
            }

            // Filter by status if provided
            if (status) {
                borrowings = borrowings.filter(b => b.status === status);
            }

            // Transform to report format
            const report: BorrowingHistoryReport[] = borrowings.map(b => {
                let daysOverdue = 0;
                if (b.status === 'overdue' || (b.returnDate && b.returnDate > b.dueDate)) {
                    const compareDate = b.returnDate || new Date().toISOString().split('T')[0];
                    const due = new Date(b.dueDate);
                    const compare = new Date(compareDate);
                    const diffTime = compare.getTime() - due.getTime();
                    daysOverdue = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
                }

                return {
                    borrowerName: b.studentName || 'Unknown',
                    borrowerType: b.borrowerType || 'student',
                    borrowerLRN: b.studentLRN,
                    bookTitle: b.bookTitle || 'Unknown',
                    bookAccessionNumber: b.bookAccessionNumber,
                    borrowDate: b.borrowDate,
                    dueDate: b.dueDate,
                    returnDate: b.returnDate,
                    status: b.status,
                    daysOverdue: daysOverdue > 0 ? daysOverdue : undefined
                };
            });

            // Sort by borrow date (newest first)
            return report.sort((a, b) => 
                new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime()
            );
        } catch (error) {
            console.error('Error generating borrowing history report:', error);
            throw error;
        }
    }

    // ============ BOOK POPULARITY REPORTS ============

    async getBookPopularityReport(): Promise<BookPopularityReport[]> {
        try {
            const borrowings = await this.borrowingService.getBorrowings();
            const books = await this.bookService.getBooks();

            // Count borrows per book
            const bookBorrowCounts = new Map<string, {
                total: number;
                currentlyBorrowed: number;
                bookData?: Book;
            }>();

            borrowings.forEach(b => {
                const key = b.bookAccessionNumber;
                if (!bookBorrowCounts.has(key)) {
                    bookBorrowCounts.set(key, { total: 0, currentlyBorrowed: 0 });
                }
                const counts = bookBorrowCounts.get(key)!;
                counts.total++;
                if (b.status === 'borrowed' || b.status === 'overdue') {
                    counts.currentlyBorrowed++;
                }
            });

            // Merge with book details
            const report: BookPopularityReport[] = [];
            bookBorrowCounts.forEach((counts, accessionNumber) => {
                const book = books.find(b => b.accessionNumber === accessionNumber);
                report.push({
                    bookTitle: book?.title || 'Unknown',
                    bookAccessionNumber: accessionNumber,
                    author: book?.author || 'Unknown',
                    isbn: book?.isbn || 'N/A',
                    totalBorrows: counts.total,
                    currentlyBorrowed: counts.currentlyBorrowed,
                    rank: 0 // Will be set after sorting
                });
            });

            // Sort by total borrows (descending) and assign rank
            report.sort((a, b) => b.totalBorrows - a.totalBorrows);
            report.forEach((item, index) => {
                item.rank = index + 1;
            });

            return report;
        } catch (error) {
            console.error('Error generating book popularity report:', error);
            throw error;
        }
    }

    // ============ STUDENT PERFORMANCE REPORTS ============

    async getStudentPerformanceReport(): Promise<StudentPerformanceReport[]> {
        try {
            const students = await this.studentService.getStudents();
            const allBorrowings = await this.borrowingService.getBorrowings();

            const report: StudentPerformanceReport[] = [];

            for (const student of students) {
                const studentBorrowings = allBorrowings.filter(b => 
                    b.studentLRN === student.lrn && b.borrowerType !== 'teacher'
                );

                const totalBorrowed = studentBorrowings.length;
                const returned = studentBorrowings.filter(b => b.status === 'returned').length;
                const notReturned = studentBorrowings.filter(b => 
                    b.status === 'borrowed' || b.status === 'overdue'
                ).length;
                const overdue = studentBorrowings.filter(b => b.status === 'overdue').length;

                let onTimeReturns = 0;
                let lateReturns = 0;

                studentBorrowings.forEach(b => {
                    if (b.status === 'returned' && b.returnDate) {
                        if (b.returnDate <= b.dueDate) {
                            onTimeReturns++;
                        } else {
                            lateReturns++;
                        }
                    }
                });

                // Calculate performance score (0-100)
                let score = 100;
                if (totalBorrowed > 0) {
                    score -= (overdue * 20); // -20 points per overdue book
                    score -= (lateReturns * 10); // -10 points per late return
                    score = Math.max(0, score);
                }

                // Determine status
                let status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
                if (score >= 90) status = 'Excellent';
                else if (score >= 75) status = 'Good';
                else if (score >= 60) status = 'Fair';
                else status = 'Poor';

                report.push({
                    studentName: student.name,
                    studentLRN: student.lrn,
                    grade: student.grade || 'N/A',
                    section: student.section || 'N/A',
                    totalBorrowedBooks: totalBorrowed,
                    booksReturned: returned,
                    booksNotReturned: notReturned,
                    overdueBooks: overdue,
                    onTimeReturns: onTimeReturns,
                    lateReturns: lateReturns,
                    performanceScore: score,
                    status: status
                });
            }

            // Sort by performance score (descending)
            return report.sort((a, b) => b.performanceScore - a.performanceScore);
        } catch (error) {
            console.error('Error generating student performance report:', error);
            throw error;
        }
    }

    // ============ BORROWER LIST REPORTS ============

    async getBorrowerListReport(
        borrowerType?: 'student' | 'teacher',
        status?: 'borrowed' | 'returned' | 'overdue'
    ): Promise<BorrowerListReport[]> {
        try {
            let borrowings = await this.borrowingService.getBorrowings();
            const students = await this.studentService.getStudents();
            const teachers = await this.teacherService.getTeachers();

            // Filter by borrower type if provided
            if (borrowerType) {
                borrowings = borrowings.filter(b => b.borrowerType === borrowerType);
            }

            // Filter by status if provided
            if (status) {
                borrowings = borrowings.filter(b => b.status === status);
            }

            const report: BorrowerListReport[] = borrowings.map(b => {
                const isStudent = b.borrowerType !== 'teacher';
                let borrower: any = null;
                let type: 'Student' | 'Teacher' = 'Student';

                if (isStudent) {
                    borrower = students.find(s => s.lrn === b.studentLRN);
                    type = 'Student';
                } else {
                    borrower = teachers.find(t => t.teacherID === b.studentLRN);
                    type = 'Teacher';
                }

                return {
                    name: b.studentName || borrower?.name || 'Unknown',
                    type: type,
                    identifier: b.studentLRN,
                    grade: isStudent ? borrower?.grade : undefined,
                    section: isStudent ? borrower?.section : undefined,
                    department: !isStudent ? borrower?.department : undefined,
                    bookTitle: b.bookTitle || 'Unknown',
                    bookAccessionNumber: b.bookAccessionNumber,
                    borrowDate: b.borrowDate,
                    dueDate: b.dueDate,
                    status: b.status.toUpperCase()
                };
            });

            // Sort by name
            return report.sort((a, b) => a.name.localeCompare(b.name));
        } catch (error) {
            console.error('Error generating borrower list report:', error);
            throw error;
        }
    }

    // ============ EXPORT TO EXCEL ============

    exportToExcel(data: any[], filename: string, sheetName: string = 'Report'): void {
        try {
            // Create workbook and worksheet
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

            // Auto-size columns
            const maxWidth = 50;
            const colWidths = Object.keys(data[0] || {}).map(key => {
                const maxLength = Math.max(
                    key.length,
                    ...data.map(row => String(row[key] || '').length)
                );
                return { wch: Math.min(maxLength + 2, maxWidth) };
            });
            worksheet['!cols'] = colWidths;

            // Generate Excel file
            XLSX.writeFile(workbook, `${filename}.xlsx`);
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            throw error;
        }
    }

    // ============ EXPORT TO CSV ============

    exportToCSV(data: any[], filename: string): void {
        try {
            const worksheet = XLSX.utils.json_to_sheet(data);
            const csv = XLSX.utils.sheet_to_csv(worksheet);
            
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            link.setAttribute('href', url);
            link.setAttribute('download', `${filename}.csv`);
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error exporting to CSV:', error);
            throw error;
        }
    }

    // ============ PRINT REPORT ============

    printReport(reportHtml: string, title: string): void {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${title}</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            padding: 20px;
                        }
                        h1 {
                            text-align: center;
                            color: #333;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 20px;
                        }
                        th, td {
                            border: 1px solid #ddd;
                            padding: 8px;
                            text-align: left;
                        }
                        th {
                            background-color: #4CAF50;
                            color: white;
                        }
                        tr:nth-child(even) {
                            background-color: #f2f2f2;
                        }
                        .header {
                            margin-bottom: 20px;
                        }
                        .date {
                            text-align: right;
                            color: #666;
                        }
                        @media print {
                            button {
                                display: none;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>${title}</h1>
                        <p class="date">Generated: ${new Date().toLocaleString()}</p>
                    </div>
                    ${reportHtml}
                    <script>
                        window.onload = function() {
                            window.print();
                        }
                    </script>
                </body>
                </html>
            `);
            printWindow.document.close();
        }
    }

    // ============ GENERATE SUMMARY STATISTICS ============

    async getReportSummary(): Promise<{
        totalBooks: number;
        totalBorrowings: number;
        activeBorrowings: number;
        overdueBorrowings: number;
        totalStudents: number;
        totalTeachers: number;
        mostPopularBook: string;
        averageBorrowsPerStudent: number;
    }> {
        try {
            const books = await this.bookService.getBooks();
            const borrowings = await this.borrowingService.getBorrowings();
            const students = await this.studentService.getStudents();
            const teachers = await this.teacherService.getTeachers();
            
            const activeBorrowings = borrowings.filter(b => 
                b.status === 'borrowed' || b.status === 'overdue'
            ).length;
            
            const overdueBorrowings = borrowings.filter(b => 
                b.status === 'overdue'
            ).length;

            const bookPopularity = await this.getBookPopularityReport();
            const mostPopularBook = bookPopularity.length > 0 
                ? bookPopularity[0].bookTitle 
                : 'N/A';

            const studentBorrowings = borrowings.filter(b => 
                b.borrowerType !== 'teacher'
            ).length;
            const averageBorrowsPerStudent = students.length > 0 
                ? Math.round((studentBorrowings / students.length) * 10) / 10
                : 0;

            return {
                totalBooks: books.length,
                totalBorrowings: borrowings.length,
                activeBorrowings,
                overdueBorrowings,
                totalStudents: students.length,
                totalTeachers: teachers.length,
                mostPopularBook,
                averageBorrowsPerStudent
            };
        } catch (error) {
            console.error('Error generating report summary:', error);
            throw error;
        }
    }
}
