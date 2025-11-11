import { Component, OnInit, signal, ViewChild, inject, computed } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FirestoreBookService, Book } from '../../services/firestore-book.service';
import { RoleBasedAccessService } from '../../services/role-based-access.service';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-crud',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule
    ],
    template: `
        <p-toast />
        <p-toolbar styleClass="mb-6">
            <ng-template #start>
                <!-- Admin-only buttons -->
                <p-button *ngIf="isAdmin()" label="New" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
                <p-button *ngIf="isAdmin()" severity="secondary" label="Delete" icon="pi pi-trash" outlined (onClick)="deleteSelectedBooks()" [disabled]="!selectedBooks || !selectedBooks.length" />
            </ng-template>

            <ng-template #end>
                <!-- Export available to all users, Import admin-only -->
                <p-button label="Export CSV" icon="pi pi-download" severity="info" class="mr-2" (onClick)="exportCSV()" />
                <p-button *ngIf="isAdmin()" label="Import XLS" icon="pi pi-upload" severity="success" (onClick)="fileInput.click()" />
                <input #fileInput type="file" hidden accept=".xls,.xlsx" (change)="handleFileInput($event)" />
            </ng-template>
        </p-toolbar>

        <p-table
            #dt
            [value]="books()"
            [rows]="10"
            [columns]="cols"
            [paginator]="true"
            [globalFilterFields]="['title', 'author', 'isbn', 'callNumber', 'accessionNumber']"
            [tableStyle]="{ 'min-width': '100%' }"
            [(selection)]="selectedBooks"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} books"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
            scrollable="true"
            scrollHeight="flex"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Library Management</h5>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Search..." />
                    </p-iconfield>
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th style="width: 3rem" *ngIf="isAdmin()">
                        <p-tableHeaderCheckbox />
                    </th>
                    <th pSortableColumn="accessionNumber" style="min-width: 12rem">
                        Accession Number
                        <p-sortIcon field="accessionNumber" />
                    </th>
                    <th pSortableColumn="dateInput" style="min-width: 10rem">
                        Date Input
                        <p-sortIcon field="dateInput" />
                    </th>
                    <th pSortableColumn="callNumber" style="min-width: 10rem">
                        Call Number
                        <p-sortIcon field="callNumber" />
                    </th>
                    <th pSortableColumn="author" style="min-width: 14rem">
                        Author
                        <p-sortIcon field="author" />
                    </th>
                    <th pSortableColumn="title" style="min-width: 16rem">
                        Title
                        <p-sortIcon field="title" />
                    </th>
                    <th pSortableColumn="edition" style="min-width: 8rem">
                        Edition
                        <p-sortIcon field="edition" />
                    </th>
                    <th pSortableColumn="volumeNumber" style="min-width: 10rem">
                        Volume Number
                        <p-sortIcon field="volumeNumber" />
                    </th>
                    <th pSortableColumn="pages" style="min-width: 8rem">
                        Pages
                        <p-sortIcon field="pages" />
                    </th>
                    <th pSortableColumn="sourceOfFund" style="min-width: 12rem">
                        Source of Fund
                        <p-sortIcon field="sourceOfFund" />
                    </th>
                    <th pSortableColumn="price" style="min-width: 8rem">
                        Price
                        <p-sortIcon field="price" />
                    </th>
                    <th pSortableColumn="publisher" style="min-width: 12rem">
                        Publisher
                        <p-sortIcon field="publisher" />
                    </th>
                    <th pSortableColumn="year" style="min-width: 8rem">
                        Year
                        <p-sortIcon field="year" />
                    </th>
                    <th pSortableColumn="remarks" style="min-width: 14rem">
                        Remarks
                        <p-sortIcon field="remarks" />
                    </th>
                    <th pSortableColumn="isbn" style="min-width: 12rem">
                        ISBN
                        <p-sortIcon field="isbn" />
                    </th>
                    <th style="min-width: 12rem" *ngIf="isAdmin()"></th>
                </tr>
            </ng-template>
            <ng-template #body let-book>
                <tr (click)="logBookData(book)" style="cursor: pointer;">
                    <td style="width: 3rem" *ngIf="isAdmin()">
                        <p-tableCheckbox [value]="book" />
                    </td>
                    <td style="min-width: 12rem">{{ book.accessionNumber }}</td>
                    <td style="min-width: 10rem">{{ book.dateInput }}</td>
                    <td style="min-width: 10rem">{{ book.callNumber }}</td>
                    <td style="min-width: 14rem">{{ book.author }}</td>
                    <td style="min-width: 16rem">{{ book.title }}</td>
                    <td style="min-width: 8rem">{{ book.edition }}</td>
                    <td style="min-width: 10rem">{{ book.volumeNumber }}</td>
                    <td style="min-width: 8rem">{{ book.pages }}</td>
                    <td style="min-width: 12rem">{{ book.sourceOfFund }}</td>
                    <td style="min-width: 8rem">{{ book.price | currency: 'PHP' }}</td>
                    <td style="min-width: 12rem">{{ book.publisher }}</td>
                    <td style="min-width: 8rem">{{ book.year }}</td>
                    <td style="min-width: 14rem">{{ book.remarks }}</td>
                    <td style="min-width: 12rem">{{ book.isbn }}</td>
                    <td *ngIf="isAdmin()" (click)="$event.stopPropagation()">
                        <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editBook(book)" />
                        <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="deleteBook(book)" />
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog [(visible)]="bookDialog" [style]="{ width: '550px' }" header="Book Details" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-4">
                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-6">
                            <label for="accessionNumber" class="block font-bold mb-2">Accession Number *</label>
                            <input type="text" pInputText id="accessionNumber" [(ngModel)]="book.accessionNumber" required fluid />
                            <small class="text-red-500" *ngIf="submitted && !book.accessionNumber">Accession Number is required.</small>
                        </div>
                        <div class="col-span-6">
                            <label for="callNumber" class="block font-bold mb-2">Call Number</label>
                            <input type="text" pInputText id="callNumber" [(ngModel)]="book.callNumber" fluid />
                        </div>
                    </div>

                    <div>
                        <label for="title" class="block font-bold mb-2">Title *</label>
                        <input type="text" pInputText id="title" [(ngModel)]="book.title" required fluid />
                        <small class="text-red-500" *ngIf="submitted && !book.title">Title is required.</small>
                    </div>

                    <div>
                        <label for="author" class="block font-bold mb-2">Author (Last, First)</label>
                        <input type="text" pInputText id="author" [(ngModel)]="book.author" fluid />
                    </div>

                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-6">
                            <label for="edition" class="block font-bold mb-2">Edition</label>
                            <input type="text" pInputText id="edition" [(ngModel)]="book.edition" fluid />
                        </div>
                        <div class="col-span-6">
                            <label for="volumeNumber" class="block font-bold mb-2">Volume Number</label>
                            <input type="text" pInputText id="volumeNumber" [(ngModel)]="book.volumeNumber" fluid />
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-6">
                            <label for="pages" class="block font-bold mb-2">Pages</label>
                            <input type="text" pInputText id="pages" [(ngModel)]="book.pages" fluid />
                        </div>
                        <div class="col-span-6">
                            <label for="year" class="block font-bold mb-2">Year</label>
                            <input type="text" pInputText id="year" [(ngModel)]="book.year" fluid />
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-6">
                            <label for="isbn" class="block font-bold mb-2">ISBN</label>
                            <input type="text" pInputText id="isbn" [(ngModel)]="book.isbn" fluid />
                        </div>
                        <div class="col-span-6">
                            <label for="price" class="block font-bold mb-2">Price</label>
                            <p-inputnumber id="price" [(ngModel)]="book.price" mode="currency" currency="PHP" locale="en-PH" fluid />
                        </div>
                    </div>

                    <div>
                        <label for="publisher" class="block font-bold mb-2">Publisher</label>
                        <input type="text" pInputText id="publisher" [(ngModel)]="book.publisher" fluid />
                    </div>

                    <div>
                        <label for="sourceOfFund" class="block font-bold mb-2">Source of Fund</label>
                        <p-select [(ngModel)]="book.sourceOfFund" inputId="sourceOfFund" [options]="fundSources" placeholder="Select Source" fluid />
                    </div>

                    <div>
                        <label for="dateInput" class="block font-bold mb-2">Date Input</label>
                        <input type="date" pInputText id="dateInput" [(ngModel)]="book.dateInput" fluid />
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Save" icon="pi pi-check" (click)="saveBook()" />
            </ng-template>
        </p-dialog>

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, ConfirmationService]
})
export class Crud implements OnInit {
    bookDialog: boolean = false;

    books = signal<Book[]>([]);

    book!: Book;

    selectedBooks!: Book[] | null;

    submitted: boolean = false;

    fundSources!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    private bookService = inject(FirestoreBookService);

    private messageService = inject(MessageService);

    private confirmationService = inject(ConfirmationService);

    private rbacService = inject(RoleBasedAccessService);

    // Check if admin can manage books
    isAdmin = computed(() => this.rbacService.isAdmin());

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadBooksFromFirestore();
        this.initializeFundSources();
        this.initializeColumns();
    }

    /**
     * DEBUG HELPER: Call this in browser console to check book IDs
     * Example: window['app'].checkBookIds()
     */
    checkBookIds() {
        console.log('📚 Checking book IDs...');
        const books = this.books();
        console.log(`Total books: ${books.length}`);

        books.forEach((book, index) => {
            console.log(`[${index + 1}] ID: "${book.id}" | Title: "${book.title}"`);
            // Check if ID looks like Firestore auto-generated (20+ chars)
            if (book.id && book.id.length < 15) {
                console.warn(`⚠️ Suspicious ID detected: "${book.id}" - might be custom ID`);
            }
        });
    }

    /**
     * Log book data when row is clicked
     */
    logBookData(book: Book) {
        console.log('📖 ROW CLICKED - Book Data:');
        console.log('====================================');
        console.table({
            ID: book.id,
            'ID Type': typeof book.id,
            'ID Length': book.id?.length,
            Title: book.title,
            'Accession Number': book.accessionNumber,
            Author: book.author,
            ISBN: book.isbn,
            Price: book.price
        });
        console.log('Full Object:', book);
        console.log('====================================');
    }

    async loadBooksFromFirestore() {
        try {
            console.log('📚 Loading books from Firestore...');
            const booksData = await this.bookService.getBooks();
            console.log('📚 Books loaded:', booksData.length);

            // Update signal with new data
            this.books.set(booksData);
            console.log('✅ Signal updated with', this.books().length, 'books');
        } catch (error) {
            console.error('❌ Error loading books:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load books from Firestore'
            });
        }
    }

    initializeFundSources() {
        this.fundSources = [
            { label: 'Purchase', value: 'Purchase' },
            { label: 'Donation', value: 'Donation' }
        ];
    }

    initializeColumns() {
        this.cols = [
            { field: 'accessionNumber', header: 'Accession Number' },
            { field: 'dateInput', header: 'Date Input' },
            { field: 'callNumber', header: 'Call Number' },
            { field: 'author', header: 'Author' },
            { field: 'title', header: 'Title' },
            { field: 'edition', header: 'Edition' },
            { field: 'volumeNumber', header: 'Volume Number' },
            { field: 'pages', header: 'Pages' },
            { field: 'sourceOfFund', header: 'Source of Fund' },
            { field: 'price', header: 'Price' },
            { field: 'publisher', header: 'Publisher' },
            { field: 'year', header: 'Year' },
            { field: 'remarks', header: 'Remarks' },
            { field: 'isbn', header: 'ISBN' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.book = {
            id: '',
            accessionNumber: '',
            dateInput: new Date().toISOString().split('T')[0],
            callNumber: '',
            author: '',
            title: '',
            edition: '',
            volumeNumber: '',
            pages: '',
            sourceOfFund: '',
            price: 0,
            publisher: '',
            year: new Date().getFullYear().toString(),
            remarks: '',
            isbn: ''
        };
        this.submitted = false;
        this.bookDialog = true;
    }

    editBook(book: Book) {
        this.book = { ...book };
        this.bookDialog = true;
    }

    deleteSelectedBooks() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected books?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    console.log('🗑️ Deleting selected books:', this.selectedBooks?.length);
                    console.log('📚 Current books count:', this.books().length);

                    if (this.selectedBooks) {
                        for (const book of this.selectedBooks) {
                            if (book.id) {
                                console.log('Deleting book ID:', book.id, 'Title:', book.title);
                                await this.bookService.deleteBook(book.id);
                            }
                        }
                    }

                    console.log('✅ All books deleted, waiting for propagation...');
                    // Wait a bit for Firestore to propagate
                    await new Promise((resolve) => setTimeout(resolve, 500));

                    // Reload from Firestore
                    await this.loadBooksFromFirestore();
                    console.log('📚 New books count:', this.books().length);

                    // Force change detection
                    this.books.update((books) => [...books]);

                    // Clear selection
                    this.selectedBooks = null;

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Books Deleted',
                        life: 3000
                    });
                    console.log('✅ Books reloaded successfully');
                } catch (error) {
                    console.error('❌ Error deleting books:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: `Failed to delete books: ${error instanceof Error ? error.message : 'Unknown error'}`,
                        life: 5000
                    });
                }
            }
        });
    }

    hideDialog() {
        this.bookDialog = false;
        this.submitted = false;
    }

    deleteBook(book: Book) {
        // Log the complete book data when clicked
        console.log('🖱️ DELETE BUTTON CLICKED - Book Data:');
        console.log('====================================');
        console.log('Full Book Object:', book);
        console.log('Book ID:', book.id);
        console.log('Book ID Type:', typeof book.id);
        console.log('Book ID Length:', book.id?.length);
        console.log('Book Title:', book.title);
        console.log('Book Accession Number:', book.accessionNumber);
        console.log('====================================');

        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + book.title + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    console.log('🗑️ Deleting book with ID:', book.id);
                    console.log('📚 Current books count:', this.books().length);

                    if (book.id) {
                        // Delete from Firestore
                        await this.bookService.deleteBook(book.id);
                        console.log('✅ Book deleted from Firestore');

                        // Wait a bit for Firestore to propagate
                        await new Promise((resolve) => setTimeout(resolve, 500));

                        // Reload from Firestore to ensure UI is synced
                        await this.loadBooksFromFirestore();
                        console.log('✅ Books reloaded from Firestore');
                        console.log('📚 New books count:', this.books().length);

                        // Force change detection
                        this.books.update((books) => [...books]);
                    }

                    // Clear current book
                    this.book = {} as Book;

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Book Deleted',
                        life: 3000
                    });
                } catch (error) {
                    console.error('❌ Error deleting book:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: `Failed to delete book: ${error instanceof Error ? error.message : 'Unknown error'}`,
                        life: 5000
                    });
                }
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.books().length; i++) {
            if (this.books()[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    private formatDateForInput(dateString: string): string {
        if (!dateString || dateString.trim() === '') {
            return new Date().toISOString().split('T')[0];
        }

        // Try to parse the date string
        let date: Date;

        // Check if it's already in YYYY-MM-DD format
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString.trim())) {
            date = new Date(dateString.trim());
        }
        // Try MM/DD/YYYY format
        else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString.trim())) {
            const [month, day, year] = dateString.trim().split('/');
            date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        }
        // Try DD-MM-YYYY format
        else if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(dateString.trim())) {
            const [day, month, year] = dateString.trim().split('-');
            date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        }
        // Try DD/MM/YYYY format
        else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString.trim())) {
            const parts = dateString.trim().split('/');
            // Assume DD/MM/YYYY if day > 12
            if (parseInt(parts[0]) > 12) {
                date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
            } else {
                date = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
            }
        }
        // Try parsing as general date string
        else {
            date = new Date(dateString);
        }

        // Check if date is valid
        if (isNaN(date.getTime())) {
            return new Date().toISOString().split('T')[0];
        }

        // Return in YYYY-MM-DD format
        return date.toISOString().split('T')[0];
    }

    async saveBook() {
        this.submitted = true;
        if (this.book.accessionNumber?.trim() && this.book.title?.trim()) {
            try {
                if (this.book.id) {
                    // Update existing book
                    await this.bookService.updateBook(this.book.id, this.book);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Book Updated',
                        life: 3000
                    });
                } else {
                    // Add new book
                    await this.bookService.addBook(this.book);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Book Created',
                        life: 3000
                    });
                }

                // Reload books from Firestore
                await this.loadBooksFromFirestore();
                this.bookDialog = false;
                this.book = {} as Book;
            } catch (error) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to save book',
                    life: 3000
                });
                console.error('Error saving book:', error);
            }
        }
    }

    async handleFileInput(event: Event) {
        const input = event.target as HTMLInputElement | null;
        const files = input?.files;
        if (files && files.length > 0) {
            const file = files[0];
            const extension = file.name.split('.').pop()?.toLowerCase();

            if (extension && ['xls', 'xlsx', 'csv'].includes(extension)) {
                await this.parseXLS(file);
            } else {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'Only XLS, XLSX, or CSV files are supported.'
                });
            }

            if (input) {
                input.value = '';
            }
        }
    }

    private async parseXLS(file: File) {
        try {
            const XLSX = await import('xlsx'); // Lazy-load to keep bundle lean when import is unused.
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, { type: 'array' });

            if (!workbook.SheetNames.length) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'The spreadsheet does not contain any sheets.'
                });
                return;
            }

            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            if (!worksheet) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'Unable to read the first sheet of the spreadsheet.'
                });
                return;
            }

            const rows = (
                XLSX.utils.sheet_to_json(worksheet, {
                    header: 1,
                    raw: false,
                    defval: ''
                }) as (string | number)[][]
            ).map((row) => row.map((cell) => String(cell).trim()));

            if (rows.length < 2) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'File must have headers and at least one data row'
                });
                return;
            }

            const headers = rows[0].map((header) => header.toLowerCase());
            const headerIndex = headers.reduce<Record<string, number>>((acc, header, index) => {
                if (header) {
                    acc[header] = index;
                }
                return acc;
            }, {});

            const requiredCols = ['accession number', 'title'];
            const missingCols = requiredCols.filter((col) => headerIndex[col] === undefined);
            if (missingCols.length > 0) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Missing required columns: ${missingCols.join(', ')}`
                });
                return;
            }

            const importedBooks: Book[] = [];

            const getValue = (row: (string | number)[], key: string): string => {
                const index = headerIndex[key];
                return index === undefined ? '' : String(row[index] ?? '').trim();
            };

            for (let i = 1; i < rows.length; i++) {
                const values = rows[i];
                if (!values || values.every((value) => !String(value).trim())) {
                    continue;
                }

                const accessionNumber = getValue(values, 'accession number');
                const title = getValue(values, 'title');

                if (!accessionNumber || !title) {
                    continue;
                }

                const priceValue = getValue(values, 'price').replace(/[^0-9.,-]/g, '');
                const normalizedPrice = priceValue.replace(/,/g, '');
                const price = normalizedPrice ? parseFloat(normalizedPrice) || 0 : 0;

                const book: Book = {
                    // Don't set id here - let Firestore auto-generate it
                    accessionNumber,
                    dateInput: this.formatDateForInput(getValue(values, 'date input')),
                    callNumber: getValue(values, 'call number'),
                    author: getValue(values, 'author (last, first)') || getValue(values, 'author'),
                    title,
                    edition: getValue(values, 'edition'),
                    volumeNumber: getValue(values, 'volume number'),
                    pages: getValue(values, 'pages'),
                    sourceOfFund: getValue(values, 'source of fund (donation/purchase)') || getValue(values, 'source of fund'),
                    price,
                    publisher: getValue(values, 'publisher'),
                    year: getValue(values, 'year'),
                    remarks: getValue(values, 'remarks'),
                    isbn: getValue(values, 'isbn')
                };

                importedBooks.push(book);
            }

            if (importedBooks.length > 0) {
                // Save each imported book to Firestore
                let successCount = 0;
                let failureCount = 0;

                for (const book of importedBooks) {
                    try {
                        await this.bookService.addBook(book);
                        successCount++;
                    } catch (error) {
                        console.error('Error saving imported book:', error);
                        failureCount++;
                    }
                }

                // Reload books from Firestore to display the imported data
                await this.loadBooksFromFirestore();

                if (failureCount === 0) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `Successfully imported ${successCount} books from ${file.name}`
                    });
                } else {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Import Completed',
                        detail: `Imported ${successCount} books successfully, ${failureCount} failed from ${file.name}`
                    });
                }
            } else {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'No valid book records found in file'
                });
            }
        } catch (error) {
            console.error('XLS Parse Error:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: `Failed to parse spreadsheet: ${error instanceof Error ? error.message : 'Unknown error'}`
            });
        }
    }
}
