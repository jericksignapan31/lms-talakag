import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreBookService } from '../../../services/firestore-book.service';
import { FirestoreStudentService } from '../../../services/firestore-student.service';
import { FirestoreTeacherService } from '../../../services/firestore-teacher.service';
import { FirestoreBorrowingService } from '../../../services/firestore-borrowing.service';

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule],
    template: `<div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Available Books</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ totalBooks }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-book text-blue-500 text-xl!"></i>
                    </div>
                </div>
                <span class="text-muted-color">Total books in system</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Students</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ totalStudents }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-orange-500 text-xl!"></i>
                    </div>
                </div>
                <span class="text-muted-color">Total students registered</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Teachers</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ totalTeachers }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-user-plus text-cyan-500 text-xl!"></i>
                    </div>
                </div>
                <span class="text-muted-color">Total teachers in system</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Active Borrowers</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ activeBorrowers }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-check-circle text-purple-500 text-xl!"></i>
                    </div>
                </div>
                <span class="text-muted-color">Students & teachers borrowing</span>
            </div>
        </div>`
})
export class StatsWidget implements OnInit {
    private bookService = inject(FirestoreBookService);
    private studentService = inject(FirestoreStudentService);
    private teacherService = inject(FirestoreTeacherService);
    private borrowingService = inject(FirestoreBorrowingService);

    totalBooks = 0;
    totalStudents = 0;
    totalTeachers = 0;
    activeBorrowers = 0;

    ngOnInit() {
        this.loadStats();
    }

    private loadStats() {
        // Load books
        this.bookService.getBooks().then((books: any[]) => {
            this.totalBooks = books.length;
        });

        // Load students
        this.studentService.getStudents().then((students: any[]) => {
            this.totalStudents = students.length;
        });

        // Load teachers
        this.teacherService.getTeachers().then((teachers: any[]) => {
            this.totalTeachers = teachers.length;
        });

        // Load active borrowers
        this.borrowingService.getBorrowings().then((borrowings: any[]) => {
            const uniqueBorrowers = new Set(borrowings.filter((b: any) => b.status === 'borrowed').map((b: any) => b.studentLRN));
            this.activeBorrowers = uniqueBorrowers.size;
        });
    }
}
