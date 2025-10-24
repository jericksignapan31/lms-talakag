import { Component, OnInit, signal, ViewChild, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { FirestoreBorrowingService, Borrowing, Penalty } from '../../services/firestore-borrowing.service';
import { FirestoreStudentService, Student } from '../../services/firestore-student.service';
import { FirestoreBookService, Book } from '../../services/firestore-book.service';

@Component({
    selector: 'app-borrowing',
    standalone: true,
    imports: [CommonModule, TableModule, FormsModule, ButtonModule, RippleModule, ToastModule, ToolbarModule, InputTextModule, SelectModule, DialogModule, TagModule, InputIconModule, IconFieldModule, ConfirmDialogModule],
    template: `
        <p-toast />
        <p-toolbar styleClass="mb-6">
            <ng-template #start>
                <p-button label="New Borrow" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openBorrowDialog()" />
                <p-button label="Check Penalties" icon="pi pi-bell" severity="warn" class="mr-2" (onClick)="checkAndUpdatePenalties()" />
            </ng-template>
            <ng-template #end>
                <p-button label="Refresh" icon="pi pi-refresh" (onClick)="loadBorrowings()" />
            </ng-template>
        </p-toolbar>

        <!-- Borrowing Records Table -->
        <div class="mb-8">
            <h3 class="text-xl font-bold mb-4">📚 Borrowed Books</h3>
            <p-table
                #borrowingTable
                [value]="borrowings()"
                [rows]="10"
                [paginator]="true"
                [globalFilterFields]="['studentName', 'bookTitle', 'status']"
                [tableStyle]="{ 'min-width': '100%' }"
                [rowHover]="true"
                dataKey="id"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} borrowing records"
                [showCurrentPageReport]="true"
                [rowsPerPageOptions]="[10, 20, 30]"
                scrollable="true"
                scrollHeight="flex"
            >
                <ng-template #caption>
                    <div class="flex items-center justify-between">
                        <h5 class="m-0">Borrowing Management</h5>
                        <p-iconfield>
                            <p-inputicon styleClass="pi pi-search" />
                            <input pInputText type="text" (input)="onGlobalFilter(borrowingTable, $event)" placeholder="Search..." />
                        </p-iconfield>
                    </div>
                </ng-template>

                <ng-template #header>
                    <tr>
                        <th style="min-width: 12rem">Student Name</th>
                        <th style="min-width: 14rem">Book Title</th>
                        <th style="min-width: 10rem">Borrow Date</th>
                        <th style="min-width: 10rem">Due Date</th>
                        <th style="min-width: 10rem">Return Date</th>
                        <th style="min-width: 8rem">Status</th>
                        <th style="min-width: 12rem">Actions</th>
                    </tr>
                </ng-template>

                <ng-template #body let-borrowing>
                    <tr>
                        <td style="min-width: 12rem">{{ borrowing.studentName }}</td>
                        <td style="min-width: 14rem">{{ borrowing.bookTitle }}</td>
                        <td style="min-width: 10rem">{{ borrowing.borrowDate }}</td>
                        <td style="min-width: 10rem">{{ borrowing.dueDate }}</td>
                        <td style="min-width: 10rem">{{ borrowing.returnDate || 'Not returned' }}</td>
                        <td style="min-width: 8rem">
                            <p-tag [value]="borrowing.status | titlecase" [severity]="getStatusSeverity(borrowing.status)" />
                        </td>
                        <td style="min-width: 12rem">
                            <p-button *ngIf="borrowing.status !== 'returned'" icon="pi pi-check" class="mr-2" severity="success" [rounded]="true" [outlined]="true" pTooltip="Return Book" tooltipPosition="top" (click)="returnBook(borrowing)" />
                            <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" pTooltip="Delete" tooltipPosition="top" (click)="deleteBorrowing(borrowing)" />
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <!-- Penalties Table -->
        <div class="mb-8">
            <h3 class="text-xl font-bold mb-4">⚠️ Penalties</h3>
            <p-table
                #penaltyTable
                [value]="penalties()"
                [rows]="10"
                [paginator]="true"
                [globalFilterFields]="['studentName', 'bookTitle', 'status']"
                [tableStyle]="{ 'min-width': '100%' }"
                [rowHover]="true"
                dataKey="id"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} penalties"
                [showCurrentPageReport]="true"
                [rowsPerPageOptions]="[10, 20, 30]"
                scrollable="true"
                scrollHeight="flex"
            >
                <ng-template #caption>
                    <div class="flex items-center justify-between">
                        <h5 class="m-0">Student Penalties</h5>
                        <p-iconfield>
                            <p-inputicon styleClass="pi pi-search" />
                            <input pInputText type="text" (input)="onGlobalFilter(penaltyTable, $event)" placeholder="Search..." />
                        </p-iconfield>
                    </div>
                </ng-template>

                <ng-template #header>
                    <tr>
                        <th style="min-width: 12rem">Student Name</th>
                        <th style="min-width: 14rem">Book Title</th>
                        <th style="min-width: 8rem">Days Overdue</th>
                        <th style="min-width: 10rem">Penalty Amount</th>
                        <th style="min-width: 10rem">Date Created</th>
                        <th style="min-width: 8rem">Status</th>
                        <th style="min-width: 12rem">Actions</th>
                    </tr>
                </ng-template>

                <ng-template #body let-penalty>
                    <tr>
                        <td style="min-width: 12rem">{{ penalty.studentName }}</td>
                        <td style="min-width: 14rem">{{ penalty.bookTitle }}</td>
                        <td style="min-width: 8rem">{{ penalty.daysOverdue }} days</td>
                        <td style="min-width: 10rem" class="font-bold text-red-600">₱{{ penalty.amount }}</td>
                        <td style="min-width: 10rem">{{ penalty.dateCreated }}</td>
                        <td style="min-width: 8rem">
                            <p-tag [value]="penalty.status | titlecase" [severity]="getPenaltySeverity(penalty.status)" />
                        </td>
                        <td style="min-width: 12rem">
                            <p-button *ngIf="penalty.status !== 'paid'" icon="pi pi-check" class="mr-2" severity="success" [rounded]="true" [outlined]="true" pTooltip="Mark as Paid" tooltipPosition="top" (click)="markPenaltyAsPaid(penalty)" />
                            <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" pTooltip="Delete" tooltipPosition="top" (click)="deletePenalty(penalty)" />
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <!-- Borrow Dialog -->
        <p-dialog [(visible)]="borrowDialog" [style]="{ width: '550px' }" header="Borrow Book" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-4">
                    <div>
                        <label for="student" class="block font-bold mb-2">Student *</label>
                        <p-select [(ngModel)]="selectedStudentLRN" [options]="students()" optionLabel="name" optionValue="lrn" placeholder="Select Student" filter fluid id="student" />
                        <small class="text-red-500" *ngIf="submitted && !selectedStudentLRN">Student is required.</small>
                    </div>

                    <div>
                        <label for="book" class="block font-bold mb-2">Book *</label>
                        <p-select [(ngModel)]="selectedBookAccessionNumber" [options]="books()" optionLabel="title" optionValue="accessionNumber" placeholder="Select Book" filter fluid id="book" />
                        <small class="text-red-500" *ngIf="submitted && !selectedBookAccessionNumber">Book is required.</small>
                    </div>

                    <div>
                        <label for="borrowDate" class="block font-bold mb-2">Borrow Date</label>
                        <input type="date" pInputText id="borrowDate" [(ngModel)]="borrowDate" fluid />
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Cancel" icon="pi pi-times" text (click)="hideBorrowDialog()" />
                <p-button label="Borrow" icon="pi pi-check" (click)="saveBorrowing()" />
            </ng-template>
        </p-dialog>

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, ConfirmationService]
})
export class BorrowingComponent implements OnInit {
    borrowDialog: boolean = false;
    submitted: boolean = false;

    borrowings = signal<Borrowing[]>([]);
    penalties = signal<Penalty[]>([]);
    students = signal<Student[]>([]);
    books = signal<Book[]>([]);

    selectedStudentLRN: string | null = null;
    selectedBookAccessionNumber: string | null = null;
    borrowDate: string = '';

    @ViewChild('borrowingTable') borrowingTable!: Table;
    @ViewChild('penaltyTable') penaltyTable!: Table;

    private borrowingService = inject(FirestoreBorrowingService);
    private studentService = inject(FirestoreStudentService);
    private bookService = inject(FirestoreBookService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    ngOnInit() {
        this.loadBorrowings();
        this.loadStudents();
        this.loadBooks();
        this.loadPenalties();
    }

    async loadBorrowings() {
        try {
            const borrowingsData = await this.borrowingService.getBorrowings();
            this.borrowings.set(borrowingsData);
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load borrowing records'
            });
            console.error('Error loading borrowings:', error);
        }
    }

    async loadPenalties() {
        try {
            const penaltiesData = await this.borrowingService.getPendingPenalties();
            this.penalties.set(penaltiesData);
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load penalties'
            });
            console.error('Error loading penalties:', error);
        }
    }

    async loadStudents() {
        try {
            const studentsData = await this.studentService.getStudents();
            this.students.set(studentsData);
        } catch (error) {
            console.error('Error loading students:', error);
        }
    }

    async loadBooks() {
        try {
            const booksData = await this.bookService.getBooks();
            this.books.set(booksData);
        } catch (error) {
            console.error('Error loading books:', error);
        }
    }

    openBorrowDialog() {
        this.borrowDate = new Date().toISOString().split('T')[0];
        this.selectedStudentLRN = null;
        this.selectedBookAccessionNumber = null;
        this.submitted = false;
        this.borrowDialog = true;
    }

    hideBorrowDialog() {
        this.borrowDialog = false;
        this.submitted = false;
    }

    async saveBorrowing() {
        this.submitted = true;

        if (!this.selectedStudentLRN || !this.selectedBookAccessionNumber) {
            return;
        }

        try {
            const student = this.students().find((s) => s.lrn === this.selectedStudentLRN);
            const book = this.books().find((b) => b.accessionNumber === this.selectedBookAccessionNumber);

            if (!student || !book) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Student or Book not found'
                });
                return;
            }

            // CHECK IF BOOK IS ALREADY BORROWED
            const isBookAlreadyBorrowed = this.borrowings().some((borrowing) => borrowing.bookAccessionNumber === this.selectedBookAccessionNumber && (borrowing.status === 'borrowed' || borrowing.status === 'overdue'));

            if (isBookAlreadyBorrowed) {
                // Find the borrowing record to show who has it
                const currentBorrowing = this.borrowings().find((borrowing) => borrowing.bookAccessionNumber === this.selectedBookAccessionNumber && (borrowing.status === 'borrowed' || borrowing.status === 'overdue'));

                this.messageService.add({
                    severity: 'error',
                    summary: '❌ Book Already Borrowed',
                    detail: `This book is currently borrowed by: ${currentBorrowing?.studentName} (Due: ${currentBorrowing?.dueDate})`,
                    sticky: true
                });
                return;
            }

            // Calculate due date (2 weeks from borrow date)
            const borrowDateObj = new Date(this.borrowDate);
            const dueDate = new Date(borrowDateObj.getTime() + 14 * 24 * 60 * 60 * 1000);

            const borrowing: Borrowing = {
                studentLRN: student.lrn,
                studentName: student.name,
                bookAccessionNumber: book.accessionNumber,
                bookTitle: book.title,
                bookISBN: book.isbn,
                borrowDate: this.borrowDate,
                dueDate: dueDate.toISOString().split('T')[0],
                status: 'borrowed'
            };

            await this.borrowingService.borrowBook(borrowing);
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Book borrowed successfully. Due date: ' + borrowing.dueDate
            });

            await this.loadBorrowings();
            this.hideBorrowDialog();
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to borrow book'
            });
            console.error('Error borrowing book:', error);
        }
    }

    returnBook(borrowing: Borrowing) {
        this.confirmationService.confirm({
            message: `Return "${borrowing.bookTitle}"?`,
            header: 'Confirm Return',
            icon: 'pi pi-question-circle',
            accept: async () => {
                try {
                    if (!borrowing.id) return;

                    const today = new Date().toISOString().split('T')[0];
                    await this.borrowingService.returnBook(borrowing.id, today);

                    // Check if there's a penalty
                    const { daysOverdue, penaltyAmount } = this.borrowingService.calculatePenalty(borrowing.dueDate, today);

                    if (daysOverdue > 0) {
                        // Create penalty
                        const penalty: Penalty = {
                            studentLRN: borrowing.studentLRN,
                            studentName: borrowing.studentName,
                            borrowingId: borrowing.id,
                            bookAccessionNumber: borrowing.bookAccessionNumber,
                            bookTitle: borrowing.bookTitle,
                            amount: penaltyAmount,
                            daysOverdue: daysOverdue,
                            dateCreated: today,
                            status: 'pending'
                        };

                        await this.borrowingService.recordPenalty(penalty);

                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Book Returned with Penalty',
                            detail: `Penalty: ₱${penaltyAmount} (${daysOverdue} days overdue @ ₱20/day)`
                        });
                    } else {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Book returned on time'
                        });
                    }

                    await this.loadBorrowings();
                    await this.loadPenalties();
                } catch (error) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to return book'
                    });
                    console.error('Error returning book:', error);
                }
            }
        });
    }

    async checkAndUpdatePenalties() {
        try {
            await this.borrowingService.checkAndMarkOverdue();
            await this.borrowingService.autoCalculatePenalties();
            await this.loadBorrowings();
            await this.loadPenalties();

            this.messageService.add({
                severity: 'info',
                summary: 'Complete',
                detail: 'Penalties checked and updated'
            });
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to check penalties'
            });
            console.error('Error checking penalties:', error);
        }
    }

    async markPenaltyAsPaid(penalty: Penalty) {
        this.confirmationService.confirm({
            message: `Mark ₱${penalty.amount} penalty as paid?`,
            header: 'Confirm Payment',
            icon: 'pi pi-check-circle',
            accept: async () => {
                try {
                    if (!penalty.id) return;

                    const today = new Date().toISOString().split('T')[0];
                    await this.borrowingService.markPenaltyAsPaid(penalty.id, today);

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Penalty marked as paid'
                    });

                    await this.loadPenalties();
                } catch (error) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to update penalty'
                    });
                    console.error('Error updating penalty:', error);
                }
            }
        });
    }

    deleteBorrowing(borrowing: Borrowing) {
        this.confirmationService.confirm({
            message: `Delete borrowing record for "${borrowing.bookTitle}"?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    if (!borrowing.id) return;
                    await this.borrowingService.deleteBorrowing(borrowing.id);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Borrowing record deleted'
                    });
                    await this.loadBorrowings();
                } catch (error) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to delete borrowing'
                    });
                    console.error('Error deleting borrowing:', error);
                }
            }
        });
    }

    async deletePenalty(penalty: Penalty) {
        this.confirmationService.confirm({
            message: `Delete penalty (₱${penalty.amount})?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    if (!penalty.id) return;
                    // Note: You'll need to add deleteDoc method in the service
                    // For now, this is a placeholder
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Info',
                        detail: 'Delete method to be implemented'
                    });
                    await this.loadPenalties();
                } catch (error) {
                    console.error('Error deleting penalty:', error);
                }
            }
        });
    }

    getStatusSeverity(status: string): string {
        switch (status) {
            case 'returned':
                return 'success';
            case 'overdue':
                return 'danger';
            case 'borrowed':
                return 'info';
            default:
                return 'secondary';
        }
    }

    getPenaltySeverity(status: string): string {
        return status === 'paid' ? 'success' : 'danger';
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
