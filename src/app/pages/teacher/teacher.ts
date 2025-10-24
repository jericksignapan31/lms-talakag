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
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputMaskModule } from 'primeng/inputmask';
import { FirestoreTeacherService, Teacher } from '../../services/firestore-teacher.service';

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
    selector: 'app-teacher',
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
        ConfirmDialogModule,
        InputMaskModule
    ],
    providers: [MessageService, ConfirmationService],
    template: `
        <p-toast />
        <p-confirmDialog />

        <p-toolbar styleClass="mb-6">
            <ng-template #start>
                <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
                <p-button severity="secondary" label="Delete" icon="pi pi-trash" outlined (onClick)="deleteSelectedTeachers()" [disabled]="!selectedTeachers || !selectedTeachers.length" />
            </ng-template>

            <ng-template #end>
                <p-button label="Export CSV" icon="pi pi-download" severity="info" class="mr-2" (onClick)="exportCSV()" />
                <p-button label="Import CSV" icon="pi pi-upload" severity="success" (onClick)="fileInput.click()" />
                <input #fileInput type="file" hidden accept=".csv,.xls,.xlsx" (change)="handleFileInput($event)" />
            </ng-template>
        </p-toolbar>

        <p-table
            #dt
            [value]="teachers()"
            [rows]="10"
            [columns]="cols"
            [paginator]="true"
            [globalFilterFields]="['name', 'teacherID', 'email', 'department']"
            [tableStyle]="{ 'min-width': '100%' }"
            [(selection)]="selectedTeachers"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} teachers"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
            scrollable="true"
            scrollHeight="flex"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">👨‍🏫 Teacher Users Management</h5>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Search teachers..." />
                    </p-iconfield>
                </div>
            </ng-template>

            <ng-template #header>
                <tr>
                    <th style="width: 3rem">
                        <p-tableHeaderCheckbox />
                    </th>
                    <th pSortableColumn="name" style="min-width: 12rem">
                        Name
                        <p-sortIcon field="name" />
                    </th>
                    <th pSortableColumn="teacherID" style="min-width: 10rem">
                        Teacher ID
                        <p-sortIcon field="teacherID" />
                    </th>
                    <th pSortableColumn="birthDate" style="min-width: 10rem">
                        Birth Date
                        <p-sortIcon field="birthDate" />
                    </th>
                    <th pSortableColumn="department" style="min-width: 12rem">
                        Department/Unit
                        <p-sortIcon field="department" />
                    </th>
                    <th pSortableColumn="email" style="min-width: 14rem">
                        Email
                        <p-sortIcon field="email" />
                    </th>
                    <th pSortableColumn="contactNumber" style="min-width: 12rem">
                        Contact Number
                        <p-sortIcon field="contactNumber" />
                    </th>
                    <th style="min-width: 8rem">Actions</th>
                </tr>
            </ng-template>

            <ng-template #body let-teacher>
                <tr>
                    <td>
                        <p-tableCheckbox [value]="teacher" />
                    </td>
                    <td>
                        <span class="font-semibold">{{ teacher.name }}</span>
                    </td>
                    <td>
                        <p-tag [value]="teacher.teacherID" severity="info" />
                    </td>
                    <td>{{ teacher.birthDate }}</td>
                    <td>{{ teacher.department }}</td>
                    <td>{{ teacher.email }}</td>
                    <td>{{ teacher.contactNumber }}</td>
                    <td>
                        <p-button icon="pi pi-pencil" severity="success" class="mr-2" (onClick)="editTeacher(teacher)" [text]="true" [rounded]="true" />
                        <p-button icon="pi pi-trash" severity="danger" (onClick)="deleteTeacher(teacher)" [text]="true" [rounded]="true" />
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog [(visible)]="teacherDialog" [header]="submitLabel" [modal]="true" class="p-fluid">
            <ng-template #content>
                <div class="field">
                    <label for="name">Name</label>
                    <input pInputText id="name" [(ngModel)]="teacher.name" required />
                </div>

                <div class="field">
                    <label for="teacherID">Teacher ID</label>
                    <input pInputText id="teacherID" [(ngModel)]="teacher.teacherID" required />
                </div>

                <div class="field">
                    <label for="birthDate">Birth Date</label>
                    <input pInputText id="birthDate" type="date" [(ngModel)]="teacher.birthDate" required />
                </div>

                <div class="field">
                    <label for="department">Department/Unit</label>
                    <input pInputText id="department" [(ngModel)]="teacher.department" />
                </div>

                <div class="field">
                    <label for="email">Email</label>
                    <input pInputText id="email" type="email" [(ngModel)]="teacher.email" />
                </div>

                <div class="field">
                    <label for="contactNumber">Contact Number</label>
                    <p-inputMask id="contactNumber" mask="+63 999 999 9999" [(ngModel)]="teacher.contactNumber" placeholder="+63 999 999 9999" />
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Cancel" icon="pi pi-times" [text]="true" severity="secondary" (onClick)="hideDialog()" />
                <p-button label="Save" icon="pi pi-check" [text]="true" (onClick)="saveTeacher()" />
            </ng-template>
        </p-dialog>
    `
})
export class TeacherComponent implements OnInit {
    private teacherService = inject(FirestoreTeacherService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    @ViewChild('dt') dataTable?: Table;

    teachers = signal<Teacher[]>([]);
    teacher: Teacher = this.getEmptyTeacher();
    selectedTeachers: Teacher[] | null = null;
    submitted: boolean = false;
    teacherDialog: boolean = false;
    cols: Column[] = [];
    exportColumns: ExportColumn[] = [];
    submitLabel: string = '';

    ngOnInit() {
        this.loadTeachersFromFirestore();
        this.initializeColumns();
    }

    async loadTeachersFromFirestore() {
        try {
            const teachersData = await this.teacherService.getTeachers();
            this.teachers.set(teachersData);
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load teachers from Firestore'
            });
            console.error('Error loading teachers:', error);
        }
    }

    initializeColumns() {
        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'teacherID', header: 'Teacher ID' },
            { field: 'birthDate', header: 'Birth Date' },
            { field: 'department', header: 'Department/Unit' },
            { field: 'email', header: 'Email' },
            { field: 'contactNumber', header: 'Contact Number' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.teacher = this.getEmptyTeacher();
        this.submitted = false;
        this.teacherDialog = true;
        this.submitLabel = 'Add Teacher';
    }

    getEmptyTeacher(): Teacher {
        return {
            id: '',
            name: '',
            teacherID: '',
            birthDate: new Date().toISOString().split('T')[0],
            department: '',
            email: '',
            contactNumber: ''
        };
    }

    editTeacher(teacher: Teacher) {
        this.teacher = { ...teacher };
        this.teacherDialog = true;
        this.submitLabel = 'Edit Teacher';
    }

    deleteSelectedTeachers() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected teachers?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    if (this.selectedTeachers) {
                        for (const teacher of this.selectedTeachers) {
                            if (teacher.id) {
                                await this.teacherService.deleteTeacher(teacher.id);
                            }
                        }
                    }
                    await this.loadTeachersFromFirestore();
                    this.selectedTeachers = null;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Teachers Deleted',
                        life: 3000
                    });
                } catch (error) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to delete teachers',
                        life: 3000
                    });
                    console.error('Error deleting teachers:', error);
                }
            }
        });
    }

    hideDialog() {
        this.teacherDialog = false;
        this.submitted = false;
    }

    deleteTeacher(teacher: Teacher) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + teacher.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    if (teacher.id) {
                        await this.teacherService.deleteTeacher(teacher.id);
                    }
                    await this.loadTeachersFromFirestore();
                    this.teacher = this.getEmptyTeacher();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Teacher Deleted',
                        life: 3000
                    });
                } catch (error) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to delete teacher',
                        life: 3000
                    });
                    console.error('Error deleting teacher:', error);
                }
            }
        });
    }

    async saveTeacher() {
        this.submitted = true;

        if (this.teacher.name?.trim() && this.teacher.teacherID?.trim() && this.teacher.email?.trim()) {
            try {
                if (this.teacher.id) {
                    // Update existing teacher
                    await this.teacherService.updateTeacher(this.teacher.id, {
                        name: this.teacher.name,
                        teacherID: this.teacher.teacherID,
                        birthDate: this.teacher.birthDate,
                        department: this.teacher.department,
                        email: this.teacher.email,
                        contactNumber: this.teacher.contactNumber
                    });

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Teacher Updated',
                        life: 3000
                    });
                } else {
                    // Add new teacher
                    await this.teacherService.addTeacher({
                        name: this.teacher.name,
                        teacherID: this.teacher.teacherID,
                        birthDate: this.teacher.birthDate,
                        department: this.teacher.department,
                        email: this.teacher.email,
                        contactNumber: this.teacher.contactNumber
                    });

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Teacher Added',
                        life: 3000
                    });
                }

                await this.loadTeachersFromFirestore();
                this.hideDialog();
            } catch (error) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to save teacher',
                    life: 3000
                });
                console.error('Error saving teacher:', error);
            }
        }
    }

    exportCSV() {
        let csv = this.exportColumns.map((c) => c.title).join(',') + '\n';

        this.teachers().forEach((data) => {
            csv += (data.name || '') + ',' + (data.teacherID || '') + ',' + (data.birthDate || '') + ',' + (data.department || '') + ',' + (data.email || '') + ',' + (data.contactNumber || '') + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `teachers_${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async handleFileInput(event: Event) {
        const input = event.target as HTMLInputElement | null;
        const files = input?.files;
        if (files && files.length > 0) {
            const file = files[0];
            const extension = file.name.split('.').pop()?.toLowerCase();

            if (extension && ['xls', 'xlsx', 'csv'].includes(extension)) {
                if (extension === 'csv') {
                    await this.parseCSV(file);
                } else {
                    await this.parseXLS(file);
                }
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

    private async parseCSV(file: File) {
        try {
            const text = await file.text();
            const lines = text.trim().split('\n');

            if (lines.length < 2) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'CSV file must have headers and at least one data row'
                });
                return;
            }

            const rawHeaders = this.parseCSVRow(lines[0]);
            const headerIndex = this.buildHeaderIndex(rawHeaders);

            // Check for required columns
            if (headerIndex['name'] === undefined || headerIndex['teacherid'] === undefined) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Missing required columns. Please ensure your CSV has "Name" and "Teacher ID" columns.\n\nFound columns: ${rawHeaders.join(', ')}`
                });
                return;
            }

            const importedTeachers: Teacher[] = [];

            const getValue = (values: string[], key: string): string => {
                const index = headerIndex[key];
                return index === undefined ? '' : (values[index] ?? '').trim();
            };

            for (let i = 1; i < lines.length; i++) {
                const values = this.parseCSVRow(lines[i]);
                if (!values || values.every((value) => !String(value).trim())) {
                    continue;
                }

                const name = getValue(values, 'name');
                const teacherID = getValue(values, 'teacherid');

                if (!name || !teacherID) {
                    continue;
                }

                const teacher: Teacher = {
                    name,
                    teacherID,
                    birthDate: this.formatDateForInput(getValue(values, 'birthdate')),
                    department: getValue(values, 'department'),
                    email: getValue(values, 'email'),
                    contactNumber: getValue(values, 'contactnumber')
                };

                importedTeachers.push(teacher);
            }

            if (importedTeachers.length > 0) {
                let successCount = 0;
                let failureCount = 0;

                for (const teacher of importedTeachers) {
                    try {
                        await this.teacherService.addTeacher(teacher);
                        successCount++;
                    } catch (error) {
                        console.error('Error saving imported teacher:', error);
                        failureCount++;
                    }
                }

                await this.loadTeachersFromFirestore();

                this.messageService.add({
                    severity: 'success',
                    summary: 'Import Complete',
                    detail: `Successfully imported ${successCount} teacher(s). ${failureCount > 0 ? `Failed to import ${failureCount} teacher(s).` : ''}`,
                    life: 5000
                });
            } else {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'No valid teacher records found in the CSV file'
                });
            }
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to parse CSV file'
            });
            console.error('Error parsing CSV:', error);
        }
    }

    private async parseXLS(file: File) {
        try {
            const XLSX = await import('xlsx');
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

            const rawHeaders = rows[0];
            const headerIndex = this.buildHeaderIndex(rawHeaders);

            // Check for required columns
            if (headerIndex['name'] === undefined || headerIndex['teacherid'] === undefined) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Missing required columns. Please ensure your Excel has "Name" and "Teacher ID" columns.\n\nFound columns: ${rawHeaders.join(', ')}`
                });
                return;
            }

            const importedTeachers: Teacher[] = [];

            const getValue = (row: (string | number)[], key: string): string => {
                const index = headerIndex[key];
                return index === undefined ? '' : String(row[index] ?? '').trim();
            };

            for (let i = 1; i < rows.length; i++) {
                const values = rows[i];
                if (!values || values.every((value) => !String(value).trim())) {
                    continue;
                }

                const name = getValue(values, 'name');
                const teacherID = getValue(values, 'teacherid');

                if (!name || !teacherID) {
                    continue;
                }

                const teacher: Teacher = {
                    name,
                    teacherID,
                    birthDate: this.formatDateForInput(getValue(values, 'birthdate')),
                    department: getValue(values, 'department'),
                    email: getValue(values, 'email'),
                    contactNumber: getValue(values, 'contactnumber')
                };

                importedTeachers.push(teacher);
            }

            if (importedTeachers.length > 0) {
                let successCount = 0;
                let failureCount = 0;

                for (const teacher of importedTeachers) {
                    try {
                        await this.teacherService.addTeacher(teacher);
                        successCount++;
                    } catch (error) {
                        console.error('Error saving imported teacher:', error);
                        failureCount++;
                    }
                }

                await this.loadTeachersFromFirestore();

                this.messageService.add({
                    severity: 'success',
                    summary: 'Import Complete',
                    detail: `Successfully imported ${successCount} teacher(s). ${failureCount > 0 ? `Failed to import ${failureCount} teacher(s).` : ''}`,
                    life: 5000
                });
            } else {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'No valid teacher records found in the file'
                });
            }
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to parse file'
            });
            console.error('Error parsing file:', error);
        }
    }

    private parseCSVRow(line: string): string[] {
        const result: string[] = [];
        let current = '';
        let insideQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (char === '"') {
                if (insideQuotes && nextChar === '"') {
                    current += '"';
                    i++;
                } else {
                    insideQuotes = !insideQuotes;
                }
            } else if (char === ',' && !insideQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }

        result.push(current);
        return result;
    }

    private buildHeaderIndex(rawHeaders: string[]): Record<string, number> {
        const headerIndex: Record<string, number> = {};
        const nameMatches: { index: number; score: number }[] = [];
        const teacherIdMatches: { index: number; score: number }[] = [];
        const birthdateMatches: { index: number; score: number }[] = [];
        const departmentMatches: { index: number; score: number }[] = [];
        const emailMatches: { index: number; score: number }[] = [];
        const contactMatches: { index: number; score: number }[] = [];

        rawHeaders.forEach((header, index) => {
            if (!header || !header.trim()) {
                return;
            }

            const normalized = header
                .toLowerCase()
                .trim()
                .replace(/[\s_-]/g, '')
                .replace(/[^a-z0-9]/g, '');

            const lowerHeader = header.toLowerCase();

            // Name matching - with scoring
            if (normalized.includes('fullname') || (normalized.includes('name') && !normalized.includes('id') && lowerHeader.includes('name'))) {
                nameMatches.push({ index, score: normalized.includes('fullname') ? 10 : 5 });
            }

            // Teacher ID matching - with scoring
            if (
                (normalized.includes('teacher') && normalized.includes('id')) ||
                normalized.includes('teacherid') ||
                (lowerHeader.includes('teacher') && lowerHeader.includes('id')) ||
                (lowerHeader.includes("teacher's") && lowerHeader.includes('id'))
            ) {
                teacherIdMatches.push({ index, score: 10 });
            }

            // Birth Date matching
            if (normalized.includes('birth') || normalized.includes('dob') || lowerHeader.includes('birthdate') || lowerHeader.includes('date of birth')) {
                birthdateMatches.push({ index, score: 10 });
            }

            // Department matching
            if (normalized.includes('department') || normalized.includes('unit') || normalized.includes('dept') || lowerHeader.includes('department/unit')) {
                departmentMatches.push({ index, score: 10 });
            }

            // Email matching
            if (normalized.includes('email')) {
                emailMatches.push({ index, score: 10 });
            }

            // Contact matching
            if (normalized.includes('contact') || normalized.includes('phone') || normalized.includes('mobile') || lowerHeader.includes('mobile number')) {
                contactMatches.push({ index, score: 10 });
            }
        });

        // Select highest scoring matches
        if (nameMatches.length > 0) {
            const best = nameMatches.sort((a, b) => b.score - a.score)[0];
            headerIndex['name'] = best.index;
        }

        if (teacherIdMatches.length > 0) {
            const best = teacherIdMatches.sort((a, b) => b.score - a.score)[0];
            headerIndex['teacherid'] = best.index;
        }

        if (birthdateMatches.length > 0) {
            const best = birthdateMatches.sort((a, b) => b.score - a.score)[0];
            headerIndex['birthdate'] = best.index;
        }

        if (departmentMatches.length > 0) {
            const best = departmentMatches.sort((a, b) => b.score - a.score)[0];
            headerIndex['department'] = best.index;
        }

        if (emailMatches.length > 0) {
            const best = emailMatches.sort((a, b) => b.score - a.score)[0];
            headerIndex['email'] = best.index;
        }

        if (contactMatches.length > 0) {
            const best = contactMatches.sort((a, b) => b.score - a.score)[0];
            headerIndex['contactnumber'] = best.index;
        }

        return headerIndex;
    }

    private formatDateForInput(dateString: string): string {
        if (!dateString || dateString.trim() === '') {
            return '';
        }

        const trimmed = dateString.trim();

        // If already in YYYY-MM-DD format, return as is
        if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
            return trimmed;
        }

        // Try MM/DD/YYYY format
        if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) {
            const [month, day, year] = trimmed.split('/');
            const m = parseInt(month).toString().padStart(2, '0');
            const d = parseInt(day).toString().padStart(2, '0');
            return `${year}-${m}-${d}`;
        }

        // Try DD-MM-YYYY format
        if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(trimmed)) {
            const [day, month, year] = trimmed.split('-');
            const m = parseInt(month).toString().padStart(2, '0');
            const d = parseInt(day).toString().padStart(2, '0');
            return `${year}-${m}-${d}`;
        }

        // Try DD/MM/YYYY format
        if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) {
            const parts = trimmed.split('/');
            // Assume DD/MM/YYYY if day > 12
            if (parseInt(parts[0]) > 12) {
                const d = parseInt(parts[0]).toString().padStart(2, '0');
                const m = parseInt(parts[1]).toString().padStart(2, '0');
                return `${parts[2]}-${m}-${d}`;
            } else {
                // Could be either MM/DD/YYYY or DD/MM/YYYY - try MM/DD/YYYY first
                const m = parseInt(parts[0]).toString().padStart(2, '0');
                const d = parseInt(parts[1]).toString().padStart(2, '0');
                return `${parts[2]}-${m}-${d}`;
            }
        }

        // If no recognized format, return as is (preserve original)
        return trimmed;
    }
}
