import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FirestoreStudentService, Student } from '../../services/firestore-student.service';
import { LmsAuthService } from '../../services/lms-auth.service';

@Component({
    selector: 'app-students',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, DialogModule, ToastModule],
    providers: [MessageService],
    template: `
        <div class="card">
            <h2>Students Management</h2>

            <div class="toolbar">
                <div class="toolbar-left">
                    <button pButton pRipple label="Add New Student" icon="pi pi-plus" class="p-button-success mr-2" (click)="openAddDialog()"></button>
                    <button pButton pRipple label="Import Excel" icon="pi pi-upload" class="p-button-info mr-2" (click)="fileInput.click()"></button>
                    <button pButton pRipple label="Refresh" icon="pi pi-refresh" (click)="loadStudents()"></button>
                    <input #fileInput type="file" hidden accept=".xlsx,.xls,.csv" (change)="onFileSelected($event)" />
                </div>

                <div class="toolbar-right">
                    <span class="p-input-icon-left">
                        <i class="pi pi-search"></i>
                        <input pInputText type="text" [(ngModel)]="searchValue" (ngModelChange)="onSearchChange()" placeholder="Search by LRN, Name, or Email..." class="w-full" />
                    </span>
                    <button pButton pRipple icon="pi pi-times" class="p-button-rounded p-button-text" (click)="clearSearch()" [disabled]="!searchValue" title="Clear search"></button>
                </div>
            </div>

            <p-table [value]="filteredStudents" responsiveLayout="scroll" [paginator]="true" [rows]="10" [globalFilterFields]="['lrn', 'name', 'email']" [scrollable]="true" scrollHeight="flex">
                <ng-template pTemplate="header">
                    <tr>
                        <th pSortableColumn="lrn" style="width: 100px">LRN <p-sortIcon field="lrn"></p-sortIcon></th>
                        <th pSortableColumn="name" style="width: 120px">Name <p-sortIcon field="name"></p-sortIcon></th>
                        <th pSortableColumn="grade" style="width: 90px">Grade <p-sortIcon field="grade"></p-sortIcon></th>
                        <th pSortableColumn="section" style="width: 80px">Section <p-sortIcon field="section"></p-sortIcon></th>
                        <th pSortableColumn="sex" style="width: 70px">Sex <p-sortIcon field="sex"></p-sortIcon></th>
                        <th pSortableColumn="birthDate" style="width: 110px">Birth Date <p-sortIcon field="birthDate"></p-sortIcon></th>
                        <th pSortableColumn="address" style="width: 120px">Address <p-sortIcon field="address"></p-sortIcon></th>
                        <th pSortableColumn="barangay" style="width: 100px">Barangay <p-sortIcon field="barangay"></p-sortIcon></th>
                        <th pSortableColumn="municipality" style="width: 110px">Municipality <p-sortIcon field="municipality"></p-sortIcon></th>
                        <th pSortableColumn="province" style="width: 100px">Province <p-sortIcon field="province"></p-sortIcon></th>
                        <th pSortableColumn="contactNumber" style="width: 120px">Contact Number <p-sortIcon field="contactNumber"></p-sortIcon></th>
                        <th pSortableColumn="learningModality" style="width: 130px">Learning Modality <p-sortIcon field="learningModality"></p-sortIcon></th>
                        <th style="width: 80px">Actions</th>
                    </tr>
                </ng-template>

                <ng-template pTemplate="body" let-student>
                    <tr>
                        <td style="width: 100px">{{ student.lrn }}</td>
                        <td style="width: 120px">{{ student.name }}</td>
                        <td style="width: 90px">{{ student.grade }}</td>
                        <td style="width: 80px">{{ student.section }}</td>
                        <td style="width: 70px">{{ student.sex }}</td>
                        <td style="width: 110px">{{ student.birthDate }}</td>
                        <td style="width: 120px">{{ student.address }}</td>
                        <td style="width: 100px">{{ student.barangay }}</td>
                        <td style="width: 110px">{{ student.municipality }}</td>
                        <td style="width: 100px">{{ student.province }}</td>
                        <td style="width: 120px">{{ student.contactNumber }}</td>
                        <td style="width: 130px">{{ student.learningModality }}</td>
                        <td style="width: 80px">
                            <button pButton pRipple type="button" icon="pi pi-pencil" class="p-button-rounded p-button-info mr-2" (click)="openEditDialog(student)" title="Edit"></button>
                            <button pButton pRipple type="button" icon="pi pi-trash" class="p-button-rounded p-button-danger" (click)="deleteStudent(student.id)" title="Delete"></button>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <p-dialog [(visible)]="displayDialog" [header]="isEditMode ? 'Edit Student' : 'Add Student'" [modal]="true">
            <div class="form">
                <div><label>LRN</label><input pInputText [(ngModel)]="studentForm.lrn" [disabled]="isEditMode" /></div>
                <div><label>Name</label><input pInputText [(ngModel)]="studentForm.name" /></div>
                <div><label>Grade</label><input pInputText [(ngModel)]="studentForm.grade" placeholder="e.g. Grade 7, Grade 10" /></div>
                <div><label>Section</label><input pInputText [(ngModel)]="studentForm.section" placeholder="e.g. A, B, C" /></div>
                <div>
                    <label>Sex</label
                    ><select [(ngModel)]="studentForm.sex">
                        <option>Male</option>
                        <option>Female</option>
                    </select>
                </div>
                <div><label>Birth Date</label><input pInputText type="date" [(ngModel)]="studentForm.birthDate" /></div>
                <div><label>Address</label><input pInputText [(ngModel)]="studentForm.address" /></div>
                <div><label>Barangay</label><input pInputText [(ngModel)]="studentForm.barangay" /></div>
                <div><label>Municipality</label><input pInputText [(ngModel)]="studentForm.municipality" /></div>
                <div><label>Province</label><input pInputText [(ngModel)]="studentForm.province" /></div>
                <div><label>Contact Number</label><input pInputText [(ngModel)]="studentForm.contactNumber" /></div>
                <div>
                    <label>Learning Modality</label
                    ><select [(ngModel)]="studentForm.learningModality">
                        <option>Face-to-Face</option>
                        <option>Online</option>
                        <option>Hybrid</option>
                    </select>
                </div>
                <div><label>Email</label><input pInputText type="email" [(ngModel)]="studentForm.email" /></div>
            </div>
            <ng-template pTemplate="footer">
                <button pButton label="Cancel" (click)="hideDialog()" class="p-button-text"></button>
                <button pButton label="Save" (click)="saveStudent()" [loading]="saving"></button>
            </ng-template>
        </p-dialog>

        <p-toast></p-toast>
    `,
    styles: [
        `
            :host ::ng-deep {
                .toolbar {
                    margin-bottom: 1rem;
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    align-items: center;
                }

                .toolbar-left {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                    align-items: center;
                }

                .toolbar-right {
                    display: flex;
                    gap: 0.5rem;
                    align-items: center;
                    min-width: 300px;
                }

                .card {
                    padding: 1.5rem;
                }

                p-table {
                    width: 100%;
                }

                .p-datatable {
                    font-size: 0.875rem;
                }

                .p-datatable th {
                    padding: 0.75rem 0.5rem !important;
                    font-weight: 600;
                    white-space: normal;
                    word-wrap: break-word;
                    max-width: 150px;
                }

                .p-datatable td {
                    padding: 0.5rem !important;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .p-datatable-scrollable-body {
                    overflow-x: auto;
                    overflow-y: auto;
                }

                .form {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    padding: 1rem 0;
                }

                .form div {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .form label {
                    font-weight: 600;
                }

                .form input,
                .form select {
                    padding: 0.5rem;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }

                .mr-2 {
                    margin-right: 0.5rem;
                }

                .p-input-icon-left {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    position: relative;
                    flex: 1;
                    min-width: 250px;
                }

                .p-input-icon-left > i {
                    position: absolute;
                    left: 0.75rem;
                    color: #999;
                    pointer-events: none;
                    z-index: 1;
                }

                .p-input-icon-left input {
                    padding-left: 2.5rem !important;
                    width: 100%;
                }

                .w-full {
                    width: 100%;
                }

                .search-section {
                    margin-bottom: 1.5rem;
                    display: flex;
                    gap: 0.5rem;
                    align-items: center;
                }

                .p-input-icon-left {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    max-width: 400px;
                    position: relative;
                }

                .p-input-icon-left > i {
                    position: absolute;
                    left: 0.75rem;
                    color: #999;
                    pointer-events: none;
                }

                .p-input-icon-left input {
                    padding-left: 2.5rem !important;
                    width: 100%;
                }

                .w-full {
                    width: 100%;
                }
            }
        `
    ]
})
export class Students implements OnInit {
    private studentService = inject(FirestoreStudentService);
    private messageService = inject(MessageService);
    private authService = inject(LmsAuthService);

    students: Student[] = [];
    filteredStudents: Student[] = [];
    searchValue: string = '';
    displayDialog = false;
    saving = false;
    isEditMode = false;
    editingId: string | null = null;

    studentForm: Student = {
        lrn: '',
        name: '',
        email: '',
        grade: '',
        section: '',
        sex: '',
        birthDate: '',
        address: '',
        barangay: '',
        municipality: '',
        province: '',
        contactNumber: '',
        learningModality: ''
    };

    ngOnInit() {
        this.loadStudents();
    }

    async loadStudents() {
        try {
            this.students = await this.studentService.getStudents();
            this.filterStudents();
        } catch (error) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load students' });
        }
    }

    onSearchChange() {
        this.filterStudents();
    }

    filterStudents() {
        if (!this.searchValue || this.searchValue.trim() === '') {
            this.filteredStudents = [...this.students];
        } else {
            const searchTerm = this.searchValue.toLowerCase().trim();
            this.filteredStudents = this.students.filter((student) => {
                return (
                    student.lrn?.toLowerCase().includes(searchTerm) ||
                    student.name?.toLowerCase().includes(searchTerm) ||
                    student.email?.toLowerCase().includes(searchTerm) ||
                    student.grade?.toLowerCase().includes(searchTerm) ||
                    student.section?.toLowerCase().includes(searchTerm) ||
                    student.barangay?.toLowerCase().includes(searchTerm) ||
                    student.municipality?.toLowerCase().includes(searchTerm) ||
                    student.contactNumber?.toLowerCase().includes(searchTerm)
                );
            });
        }
    }

    clearSearch() {
        this.searchValue = '';
        this.filterStudents();
    }

    openAddDialog() {
        this.isEditMode = false;
        this.editingId = null;
        this.studentForm = { lrn: '', name: '', email: '', grade: '', section: '', sex: '', birthDate: '', address: '', barangay: '', municipality: '', province: '', contactNumber: '', learningModality: '' };
        this.displayDialog = true;
    }

    openEditDialog(student: Student) {
        this.isEditMode = true;
        this.editingId = student.id || null;
        this.studentForm = { ...student };
        this.displayDialog = true;
    }

    async saveStudent() {
        try {
            this.saving = true;
            if (!this.studentForm.lrn || !this.studentForm.name) {
                this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'LRN and Name required' });
                return;
            }
            if (this.isEditMode && this.editingId) {
                await this.studentService.updateStudent(this.editingId, this.studentForm);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Student updated successfully' });
            } else {
                // Create Firebase Authentication account first
                const uid = await this.authService.createStudentAccount(this.studentForm.lrn);
                // Then save student data to Firestore
                await this.studentService.addStudent(this.studentForm);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `Account created! Email: ${this.studentForm.lrn}@lms.talakag | Password: ${this.studentForm.lrn}@123`
                });
            }
            this.hideDialog();
            this.loadStudents();
        } catch (error: any) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
        } finally {
            this.saving = false;
        }
    }

    async deleteStudent(id: string | undefined) {
        if (!id) return;

        if (!confirm('Are you sure you want to delete this student? This will also delete their Firebase account.')) {
            return;
        }

        try {
            // Find the student to get their LRN
            const student = this.students.find((s) => s.id === id);

            // Delete from Firestore first
            await this.studentService.deleteStudent(id);

            // Then try to delete from Firebase Authentication
            if (student && student.lrn) {
                await this.authService.deleteStudentAccount(student.lrn);
            }

            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Student and account deleted successfully'
            });
            this.loadStudents();
        } catch (error: any) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.message
            });
        }
    }

    hideDialog() {
        this.displayDialog = false;
        this.isEditMode = false;
        this.editingId = null;
    }

    onFileSelected(event: any) {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.name.endsWith('.csv')) {
                this.parseCSV(file);
            } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Excel Format',
                    detail: 'For best compatibility, please export your Excel file as CSV format and import again'
                });
                // Still try to parse it as text
                this.parseExcel(file);
            } else {
                this.messageService.add({ severity: 'warn', summary: 'Invalid File', detail: 'Only CSV and Excel files are supported' });
            }
            event.target.value = '';
        }
    }

    parseCSV(file: File) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            try {
                const csv = e.target.result;
                const rows = this.parseCSVRows(csv);
                
                if (rows.length < 2) {
                    this.messageService.add({ severity: 'warn', summary: 'Invalid File', detail: 'File must have headers and at least one row' });
                    return;
                }

                const headers = rows[0].map((h: string) => h.trim().toLowerCase());
                const importedStudents: Student[] = [];

                for (let i = 1; i < rows.length; i++) {
                    const values = rows[i];
                    if (values.length > 0 && values[0]) {
                        const student: Student = {
                            lrn: values[headers.indexOf('lrn')] || '',
                            name: values[headers.indexOf('name')] || '',
                            email: values[headers.indexOf('email')] || '',
                            grade: values[headers.indexOf('grade')] || '',
                            section: values[headers.indexOf('section')] || '',
                            sex: values[headers.indexOf('sex')] || '',
                            birthDate: values[headers.indexOf('birthdate')] || '',
                            address: values[headers.indexOf('address')] || '',
                            barangay: values[headers.indexOf('barangay')] || '',
                            municipality: values[headers.indexOf('municipality')] || '',
                            province: values[headers.indexOf('province')] || '',
                            contactNumber: values[headers.indexOf('contactnumber')] || '',
                            learningModality: values[headers.indexOf('learningmodality')] || ''
                        };
                        if (student.lrn && student.name) {
                            importedStudents.push(student);
                        }
                    }
                }

                if (importedStudents.length === 0) {
                    this.messageService.add({ severity: 'warn', summary: 'No Data', detail: 'No valid student records found' });
                    return;
                }

                this.importStudents(importedStudents, file.name);
            } catch (error) {
                this.messageService.add({ severity: 'error', summary: 'Parse Error', detail: 'Failed to parse CSV file' });
            }
        };
        reader.readAsText(file);
    }

    parseCSVRows(csv: string): string[][] {
        const rows: string[][] = [];
        let row: string[] = [];
        let current = '';
        let insideQuotes = false;

        for (let i = 0; i < csv.length; i++) {
            const char = csv[i];
            const nextChar = csv[i + 1];

            if (char === '"') {
                if (insideQuotes && nextChar === '"') {
                    // Escaped quote
                    current += '"';
                    i++;
                } else {
                    // Toggle quote state
                    insideQuotes = !insideQuotes;
                }
            } else if (char === ',' && !insideQuotes) {
                // End of field
                row.push(current.trim());
                current = '';
            } else if ((char === '\n' || char === '\r') && !insideQuotes) {
                // End of row
                if (current.trim() || row.length > 0) {
                    row.push(current.trim());
                    if (row.some(field => field)) {
                        rows.push(row);
                    }
                    row = [];
                    current = '';
                }
                // Skip \r\n combination
                if (char === '\r' && nextChar === '\n') {
                    i++;
                }
            } else {
                current += char;
            }
        }

        // Handle last field and row
        if (current.trim() || row.length > 0) {
            row.push(current.trim());
            if (row.some(field => field)) {
                rows.push(row);
            }
        }

        return rows;
    }

    parseExcel(file: File) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            try {
                // For Excel files, we need to handle binary data
                // This is a basic parser - for .xlsx we'd need a library
                // For now, treat Excel files similar to CSV but with better error handling

                const data = e.target.result;
                let rows: string[] = [];

                // Try to parse as text (works for some Excel exports)
                if (typeof data === 'string') {
                    rows = data
                        .split('\n')
                        .map((row: string) => row.trim())
                        .filter((row: string) => row.length > 0);
                } else {
                    // For binary Excel files, show helpful error
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Tip',
                        detail: 'For .xlsx files, please export as CSV from Excel first, or use the CSV format'
                    });
                    return;
                }

                if (rows.length < 2) {
                    this.messageService.add({ severity: 'warn', summary: 'Invalid File', detail: 'File must have headers and at least one row' });
                    return;
                }

                // Parse using improved CSV parser that handles quoted fields
                const parsedRows = this.parseCSVRows(data);
                
                if (parsedRows.length < 2) {
                    this.messageService.add({ severity: 'warn', summary: 'Invalid File', detail: 'File must have headers and at least one row' });
                    return;
                }

                const headers = parsedRows[0].map((h: string) => h.trim().toLowerCase());
                const importedStudents: Student[] = [];

                for (let i = 1; i < parsedRows.length; i++) {
                    const values = parsedRows[i];
                    if (values.length > 0 && values[0]) {
                        const student: Student = {
                            lrn: values[headers.indexOf('lrn')] || '',
                            name: values[headers.indexOf('name')] || '',
                            email: values[headers.indexOf('email')] || '',
                            grade: values[headers.indexOf('grade')] || '',
                            section: values[headers.indexOf('section')] || '',
                            sex: values[headers.indexOf('sex')] || '',
                            birthDate: values[headers.indexOf('birthdate')] || '',
                            address: values[headers.indexOf('address')] || '',
                            barangay: values[headers.indexOf('barangay')] || '',
                            municipality: values[headers.indexOf('municipality')] || '',
                            province: values[headers.indexOf('province')] || '',
                            contactNumber: values[headers.indexOf('contactnumber')] || '',
                            learningModality: values[headers.indexOf('learningmodality')] || ''
                        };
                        if (student.lrn && student.name) {
                            importedStudents.push(student);
                        }
                    }
                }

                if (importedStudents.length === 0) {
                    this.messageService.add({ severity: 'warn', summary: 'No Data', detail: 'No valid student records found' });
                    return;
                }

                this.importStudents(importedStudents, file.name);
            } catch (error) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Parse Error',
                    detail: 'Failed to parse Excel file. Try exporting as CSV instead.'
                });
            }
        };
        reader.readAsText(file);
    }

    async importStudents(importedStudents: Student[], fileName: string) {
        try {
            let importedCount = 0;
            let skippedCount = 0;

            for (const student of importedStudents) {
                try {
                    // Create Firebase account
                    await this.authService.createStudentAccount(student.lrn);
                    // Add student to Firestore
                    await this.studentService.addStudent(student);
                    importedCount++;
                } catch (error: any) {
                    // Skip if account already exists or other error
                    if (error.message.includes('already exists')) {
                        skippedCount++;
                    } else {
                        console.error(`Error importing student ${student.lrn}:`, error);
                        skippedCount++;
                    }
                }
            }

            this.messageService.add({
                severity: importedCount > 0 ? 'success' : 'warn',
                summary: 'Import Complete',
                detail: `Imported: ${importedCount}, Skipped: ${skippedCount} from ${fileName}`
            });

            this.loadStudents();
        } catch (error) {
            this.messageService.add({ severity: 'error', summary: 'Import Error', detail: 'Failed to import students' });
        }
    }
}
