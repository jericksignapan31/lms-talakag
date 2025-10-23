import { Component, OnInit, signal, ViewChild } from '@angular/core';
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

interface Book {
    id: string;
    accessionNumber: string;
    dateInput: string;
    callNumber: string;
    author: string;
    title: string;
    edition: string;
    volumeNumber: string;
    pages: string;
    sourceOfFund: string;
    price: number;
    publisher: string;
    year: string;
    remarks: string;
    isbn: string;
}

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
                <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
                <p-button severity="secondary" label="Delete" icon="pi pi-trash" outlined (onClick)="deleteSelectedBooks()" [disabled]="!selectedBooks || !selectedBooks.length" />
            </ng-template>

            <ng-template #end>
                <p-button label="Export CSV" icon="pi pi-download" severity="info" class="mr-2" (onClick)="exportCSV()" />
                <p-button label="Import XLS" icon="pi pi-upload" severity="success" (onClick)="fileInput.click()" />
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
                    <th style="width: 3rem">
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
                    <th pSortableColumn="isbn" style="min-width: 12rem">
                        ISBN
                        <p-sortIcon field="isbn" />
                    </th>
                    <th style="min-width: 12rem"></th>
                </tr>
            </ng-template>
            <ng-template #body let-book>
                <tr>
                    <td style="width: 3rem">
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
                    <td style="min-width: 12rem">{{ book.isbn }}</td>
                    <td>
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

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadDemoData();
    }

    loadDemoData() {
        // Sample book data
        this.books.set([
            {
                id: '1',
                accessionNumber: 'ACC001',
                dateInput: '2024-01-15',
                callNumber: '823.9 ABS',
                author: 'Austen, Jane',
                title: 'Pride and Prejudice',
                edition: '3rd',
                volumeNumber: '1',
                pages: '279',
                sourceOfFund: 'Purchase',
                price: 450,
                publisher: 'Penguin Classics',
                year: '2003',
                remarks: 'Good condition',
                isbn: '978-0141439518'
            },
            {
                id: '2',
                accessionNumber: 'ACC002',
                dateInput: '2024-01-20',
                callNumber: '500 DAW',
                author: 'Dawkins, Richard',
                title: 'The Selfish Gene',
                edition: '2nd',
                volumeNumber: '1',
                pages: '360',
                sourceOfFund: 'Donation',
                price: 550,
                publisher: 'Oxford University Press',
                year: '1989',
                remarks: 'Excellent condition',
                isbn: '978-0192860926'
            }
        ]);

        this.fundSources = [
            { label: 'Purchase', value: 'Purchase' },
            { label: 'Donation', value: 'Donation' }
        ];

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
            accept: () => {
                this.books.set(this.books().filter((val) => !this.selectedBooks?.includes(val)));
                this.selectedBooks = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Books Deleted',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.bookDialog = false;
        this.submitted = false;
    }

    deleteBook(book: Book) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + book.title + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.books.set(this.books().filter((val) => val.id !== book.id));
                this.book = {} as Book;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Book Deleted',
                    life: 3000
                });
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

    saveBook() {
        this.submitted = true;
        let _books = this.books();
        if (this.book.accessionNumber?.trim() && this.book.title?.trim()) {
            if (this.book.id) {
                _books[this.findIndexById(this.book.id)] = this.book;
                this.books.set([..._books]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Book Updated',
                    life: 3000
                });
            } else {
                this.book.id = this.createId();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Book Created',
                    life: 3000
                });
                this.books.set([..._books, this.book]);
            }

            this.bookDialog = false;
            this.book = {} as Book;
        }
    }

    handleFileInput(event: any) {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
                this.parseXLS(file);
            } else {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'Only XLS and XLSX files are supported.'
                });
            }
            event.target.value = '';
        }
    }

    parseXLS(file: File) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            try {
                const data = e.target.result;
                // Split by newlines and filter empty rows
                const rows = data
                    .split('\n')
                    .map((row: string) => row.trim())
                    .filter((row: string) => row.length > 0);

                if (rows.length < 2) {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Warning',
                        detail: 'File must have headers and at least one data row'
                    });
                    return;
                }

                // Parse headers - handle both TSV and CSV
                const delimiter = rows[0].includes('\t') ? '\t' : ',';
                const headers = rows[0].split(delimiter).map((h: string) => h.trim().toLowerCase());

                // Validate required columns
                const requiredCols = ['accession number', 'title'];
                const missingCols = requiredCols.filter((col) => !headers.includes(col));
                if (missingCols.length > 0) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: `Missing required columns: ${missingCols.join(', ')}`
                    });
                    return;
                }

                const importedBooks: Book[] = [];
                let id = this.books().length > 0 ? Math.max(...this.books().map((b) => parseInt(b.id) || 0)) + 1 : 1;

                for (let i = 1; i < rows.length; i++) {
                    const values = rows[i].split(delimiter).map((v: string) => v.trim().replace(/"/g, ''));

                    if (values.length > 0 && values[0]) {
                        const book: Book = {
                            id: id.toString(),
                            accessionNumber: values[headers.indexOf('accession number')] || '',
                            dateInput: values[headers.indexOf('date input')] || new Date().toISOString().split('T')[0],
                            callNumber: values[headers.indexOf('call number')] || '',
                            author: values[headers.indexOf('author (last, first)')] || '',
                            title: values[headers.indexOf('title')] || '',
                            edition: values[headers.indexOf('edition')] || '',
                            volumeNumber: values[headers.indexOf('volume number')] || '',
                            pages: values[headers.indexOf('pages')] || '',
                            sourceOfFund: values[headers.indexOf('source of fund (donation/purchase)')] || '',
                            price: parseFloat(values[headers.indexOf('price')]) || 0,
                            publisher: values[headers.indexOf('publisher')] || '',
                            year: values[headers.indexOf('year')] || '',
                            remarks: values[headers.indexOf('remarks')] || '',
                            isbn: values[headers.indexOf('isbn')] || ''
                        };

                        // Only add if accessionNumber and title are not empty
                        if (book.accessionNumber.trim() && book.title.trim()) {
                            importedBooks.push(book);
                            id++;
                        }
                    }
                }

                if (importedBooks.length > 0) {
                    this.books.set([...this.books(), ...importedBooks]);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `Successfully imported ${importedBooks.length} books from ${file.name}`
                    });
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
                    detail: `Failed to parse XLS file: ${error instanceof Error ? error.message : 'Unknown error'}`
                });
            }
        };
        reader.readAsText(file);
    }
}
