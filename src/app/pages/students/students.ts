import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';

interface Student {
    id: number;
    lrn: string;
    name: string;
    sex: string;
    birthDate: string;
    address: string;
    barangay: string;
    municipality: string;
    province: string;
    contactNumber: string;
    learningModality: string;
    grade: string;
    section: string;
}

interface StudentHistory {
    id: number;
    action: string;
    timestamp: string;
    details: string;
}

@Component({
    selector: 'app-students',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, TableModule, InputTextModule, IconFieldModule, InputIconModule, ToolbarModule, ToastModule, TagModule, FileUploadModule, DialogModule, SelectModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>
        <div class="card">
            <p-toolbar class="mb-6">
                <ng-template pTemplate="left">
                    <h5>Students Management</h5>
                </ng-template>
                <ng-template pTemplate="right">
                    <div class="flex gap-2">
                        <button pButton type="button" icon="pi pi-plus" (click)="openAddDialog()" label="Add Student" class="p-button-primary"></button>
                        <button pButton type="button" icon="pi pi-download" (click)="exportToExcel()" label="Export XLS" class="p-button-success"></button>
                        <button pButton type="button" icon="pi pi-upload" (click)="fileInput.click()" label="Import CSV" class="p-button-info"></button>
                        <input #fileInput type="file" hidden accept=".csv,.xlsx,.xls" (change)="handleFileInput($event)" />
                    </div>
                </ng-template>
            </p-toolbar>

            <!-- History Tab -->
            <div class="mb-6">
                <button pButton type="button" label="View History" (click)="toggleHistory()" class="p-button-secondary"></button>
            </div>

            <p-table *ngIf="!showHistory" #dt [value]="students" [rows]="10" [paginator]="true" [globalFilterFields]="['lrn', 'name', 'barangay', 'municipality']" [tableStyle]="{ 'min-width': '100%' }" responsiveLayout="scroll">
                <ng-template pTemplate="caption">
                    <div class="flex items-center justify-between">
                        <span class="p-input-icon-left ml-auto">
                            <i class="pi pi-search"></i>
                            <input pInputText type="text" (input)="dt.filterGlobal($event, 'contains')" placeholder="Search students..." />
                        </span>
                    </div>
                </ng-template>

                <ng-template pTemplate="header">
                    <tr>
                        <th pSortableColumn="lrn">LRN <p-sortIcon field="lrn"></p-sortIcon></th>
                        <th pSortableColumn="name">Name <p-sortIcon field="name"></p-sortIcon></th>
                        <th pSortableColumn="grade">Grade <p-sortIcon field="grade"></p-sortIcon></th>
                        <th pSortableColumn="section">Section <p-sortIcon field="section"></p-sortIcon></th>
                        <th pSortableColumn="sex">Sex <p-sortIcon field="sex"></p-sortIcon></th>
                        <th pSortableColumn="birthDate">Birth Date <p-sortIcon field="birthDate"></p-sortIcon></th>
                        <th pSortableColumn="address">Address <p-sortIcon field="address"></p-sortIcon></th>
                        <th pSortableColumn="barangay">Barangay <p-sortIcon field="barangay"></p-sortIcon></th>
                        <th pSortableColumn="municipality">Municipality/City <p-sortIcon field="municipality"></p-sortIcon></th>
                        <th pSortableColumn="province">Province <p-sortIcon field="province"></p-sortIcon></th>
                        <th pSortableColumn="contactNumber">Contact Number <p-sortIcon field="contactNumber"></p-sortIcon></th>
                        <th pSortableColumn="learningModality">Learning Modality <p-sortIcon field="learningModality"></p-sortIcon></th>
                    </tr>
                </ng-template>

                <ng-template pTemplate="body" let-student>
                    <tr>
                        <td>{{ student.lrn }}</td>
                        <td>{{ student.name }}</td>
                        <td>{{ student.grade }}</td>
                        <td>{{ student.section }}</td>
                        <td>{{ student.sex }}</td>
                        <td>{{ student.birthDate }}</td>
                        <td>{{ student.address }}</td>
                        <td>{{ student.barangay }}</td>
                        <td>{{ student.municipality }}</td>
                        <td>{{ student.province }}</td>
                        <td>{{ student.contactNumber }}</td>
                        <td>
                            <p-tag [value]="student.learningModality" [severity]="getModalitySeverity(student.learningModality)"></p-tag>
                        </td>
                    </tr>
                </ng-template>
            </p-table>

            <!-- History Table -->
            <p-table *ngIf="showHistory" [value]="history" [rows]="10" [paginator]="true" [tableStyle]="{ 'min-width': '75rem' }" responsiveLayout="scroll">
                <ng-template pTemplate="caption">
                    <div class="flex items-center justify-between">
                        <h6>Import History</h6>
                    </div>
                </ng-template>

                <ng-template pTemplate="header">
                    <tr>
                        <th pSortableColumn="id">ID <p-sortIcon field="id"></p-sortIcon></th>
                        <th pSortableColumn="action">Action <p-sortIcon field="action"></p-sortIcon></th>
                        <th pSortableColumn="timestamp">Timestamp <p-sortIcon field="timestamp"></p-sortIcon></th>
                        <th pSortableColumn="details">Details <p-sortIcon field="details"></p-sortIcon></th>
                    </tr>
                </ng-template>

                <ng-template pTemplate="body" let-record>
                    <tr>
                        <td>{{ record.id }}</td>
                        <td>{{ record.action }}</td>
                        <td>{{ record.timestamp }}</td>
                        <td>{{ record.details }}</td>
                    </tr>
                </ng-template>
            </p-table>

            <!-- Add Student Dialog -->
            <p-dialog [(visible)]="displayAddDialog" [header]="'Add New Student'" [modal]="true" [style]="{ width: '50vw' }" [breakpoints]="{ '960px': '75vw', '640px': '90vw' }">
                <div class="flex flex-col gap-4">
                    <div>
                        <label class="block mb-2">LRN *</label>
                        <input pInputText [(ngModel)]="newStudent.lrn" class="w-full" placeholder="Learning Reference Number" />
                    </div>
                    <div>
                        <label class="block mb-2">Name *</label>
                        <input pInputText [(ngModel)]="newStudent.name" class="w-full" placeholder="Full Name" />
                    </div>
                    <div>
                        <label class="block mb-2">Grade</label>
                        <input pInputText [(ngModel)]="newStudent.grade" class="w-full" placeholder="e.g. Grade 7, Grade 10" />
                    </div>
                    <div>
                        <label class="block mb-2">Section</label>
                        <input pInputText [(ngModel)]="newStudent.section" class="w-full" placeholder="e.g. A, B, C" />
                    </div>
                    <div>
                        <label class="block mb-2">Sex</label>
                        <select pInputText [(ngModel)]="newStudent.sex" class="w-full">
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div>
                        <label class="block mb-2">Birth Date</label>
                        <input pInputText type="date" [(ngModel)]="newStudent.birthDate" class="w-full" />
                    </div>
                    <div>
                        <label class="block mb-2">Address</label>
                        <input pInputText [(ngModel)]="newStudent.address" class="w-full" placeholder="Street Address" />
                    </div>
                    <div>
                        <label class="block mb-2">Barangay</label>
                        <input pInputText [(ngModel)]="newStudent.barangay" class="w-full" placeholder="Barangay" />
                    </div>
                    <div>
                        <label class="block mb-2">Municipality/City</label>
                        <input pInputText [(ngModel)]="newStudent.municipality" class="w-full" placeholder="Municipality/City" />
                    </div>
                    <div>
                        <label class="block mb-2">Province</label>
                        <input pInputText [(ngModel)]="newStudent.province" class="w-full" placeholder="Province" />
                    </div>
                    <div>
                        <label class="block mb-2">Contact Number</label>
                        <input pInputText [(ngModel)]="newStudent.contactNumber" class="w-full" placeholder="09XX-XXX-XXXX" />
                    </div>
                    <div>
                        <label class="block mb-2">Learning Modality</label>
                        <select pInputText [(ngModel)]="newStudent.learningModality" class="w-full">
                            <option value="">Select</option>
                            <option value="Face-to-Face">Face-to-Face</option>
                            <option value="Online">Online</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </div>
                </div>
                <ng-template pTemplate="footer">
                    <button pButton type="button" label="Cancel" (click)="displayAddDialog = false" class="p-button-secondary"></button>
                    <button pButton type="button" label="Save" (click)="saveStudent()" class="p-button-primary"></button>
                </ng-template>
            </p-dialog>
        </div>
    `
})
export class Students implements OnInit {
    private http = inject(HttpClient);
    private messageService = inject(MessageService);

    students: Student[] = [];
    history: StudentHistory[] = [];
    uploadedFiles: any[] = [];
    showHistory = false;
    displayAddDialog = false;
    private historyId = 1;

    newStudent: Student = {
        id: 0,
        lrn: '',
        name: '',
        sex: '',
        birthDate: '',
        address: '',
        barangay: '',
        municipality: '',
        province: '',
        contactNumber: '',
        learningModality: '',
        grade: '',
        section: ''
    };

    ngOnInit() {
        this.loadStudents();
        this.loadHistory();
    }

    loadStudents() {
        this.http.get<Student[]>('/api/students').subscribe({
            next: (data) => {
                this.students = data;
            },
            error: (err) => {
                console.error('Failed to load students:', err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load students' });
            }
        });
    }

    loadHistory() {
        const saved = localStorage.getItem('studentImportHistory');
        if (saved) {
            this.history = JSON.parse(saved);
            this.historyId = Math.max(...this.history.map((h) => h.id), 0) + 1;
        }
    }

    toggleHistory() {
        this.showHistory = !this.showHistory;
    }

    onFileSelect(event: any) {
        const files = event.files;
        if (files && files.length > 0) {
            const file = files[0];
            this.uploadedFiles = [file];

            if (file.name.endsWith('.csv')) {
                this.parseCSV(file);
            } else {
                this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Only CSV files are supported currently. Excel support coming soon.' });
            }
        }
    }

    parseCSV(file: File) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            try {
                const csv = e.target.result;
                const rows = csv.split('\n').filter((row: string) => row.trim());
                const headers = rows[0].split(',').map((h: string) => h.trim().toLowerCase());

                const importedStudents: Student[] = [];
                let id = this.students.length > 0 ? Math.max(...this.students.map((s) => s.id)) + 1 : 1;

                for (let i = 1; i < rows.length; i++) {
                    const values = rows[i].split(',').map((v: string) => v.trim().replace(/"/g, ''));
                    if (values.length >= headers.length && values[0]) {
                        const student: Student = {
                            id: id++,
                            lrn: values[headers.indexOf('lrn')] || '',
                            name: values[headers.indexOf('name')] || '',
                            sex: values[headers.indexOf('sex')] || '',
                            birthDate: values[headers.indexOf('birth date')] || '',
                            address: values[headers.indexOf('address')] || '',
                            barangay: values[headers.indexOf('barangay')] || '',
                            municipality: values[headers.indexOf('municipality/ city') >= 0 ? headers.indexOf('municipality/ city') : headers.indexOf('municipality/city')] || '',
                            province: values[headers.indexOf('province')] || '',
                            contactNumber: values[headers.indexOf('contact number')] || '',
                            learningModality: values[headers.indexOf('learning modality')] || '',
                            grade: values[headers.indexOf('grade')] || '',
                            section: values[headers.indexOf('section')] || ''
                        };
                        if (student.lrn) {
                            importedStudents.push(student);
                        }
                    }
                }

                if (importedStudents.length > 0) {
                    this.students.push(...importedStudents);
                    this.addHistory('IMPORT', `Imported ${importedStudents.length} students from ${file.name}`);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `Successfully imported ${importedStudents.length} students`
                    });
                    this.uploadedFiles = [];
                } else {
                    this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'No valid student records found in file' });
                }
            } catch (error) {
                console.error('CSV Parse Error:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to parse CSV file' });
            }
        };
        reader.readAsText(file);
    }

    addHistory(action: string, details: string) {
        const record: StudentHistory = {
            id: this.historyId++,
            action,
            timestamp: new Date().toLocaleString(),
            details
        };
        this.history.unshift(record);
        localStorage.setItem('studentImportHistory', JSON.stringify(this.history));
    }

    getSeverity(gradeLevel: string) {
        if (!gradeLevel) return 'secondary';
        const level = parseInt(gradeLevel.split(' ')[1] || '0');
        if (level <= 6) return 'info';
        if (level <= 9) return 'warning';
        return 'success';
    }

    handleFileInput(event: any) {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.name.endsWith('.csv')) {
                this.parseCSV(file);
            } else if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
                this.parseXLS(file);
            } else {
                this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Only CSV and XLS files are supported.' });
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
                    this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'File must have headers and at least one data row' });
                    return;
                }

                // Parse headers - handle both TSV and CSV
                const delimiter = rows[0].includes('\t') ? '\t' : ',';
                const headers = rows[0].split(delimiter).map((h: string) => h.trim().toLowerCase());

                // Validate required columns
                const requiredCols = ['lrn', 'name'];
                const missingCols = requiredCols.filter((col) => !headers.includes(col));
                if (missingCols.length > 0) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: `Missing required columns: ${missingCols.join(', ')}\nFound: ${headers.join(', ')}`
                    });
                    return;
                }

                const importedStudents: Student[] = [];
                let id = this.students.length > 0 ? Math.max(...this.students.map((s) => s.id)) + 1 : 1;

                for (let i = 1; i < rows.length; i++) {
                    const values = rows[i].split(delimiter).map((v: string) => v.trim().replace(/"/g, ''));

                    if (values.length > 0 && values[0]) {
                        const student: Student = {
                            id: id++,
                            lrn: values[headers.indexOf('lrn')] || '',
                            name: values[headers.indexOf('name')] || '',
                            sex: values[headers.indexOf('sex')] || '',
                            birthDate: values[headers.indexOf('birth date')] || '',
                            address: values[headers.indexOf('address')] || '',
                            barangay: values[headers.indexOf('barangay')] || '',
                            municipality:
                                values[headers.indexOf('municipality/ city') >= 0 ? headers.indexOf('municipality/ city') : headers.indexOf('municipality/city')] >= 0
                                    ? values[headers.indexOf('municipality/ city') >= 0 ? headers.indexOf('municipality/ city') : headers.indexOf('municipality/city')]
                                    : '',
                            province: values[headers.indexOf('province')] || '',
                            contactNumber: values[headers.indexOf('contact number')] || '',
                            learningModality: values[headers.indexOf('learning modality')] || '',
                            grade: values[headers.indexOf('grade')] || '',
                            section: values[headers.indexOf('section')] || ''
                        };

                        // Only add if lrn is not empty
                        if (student.lrn && student.lrn.trim()) {
                            importedStudents.push(student);
                        }
                    }
                }

                if (importedStudents.length > 0) {
                    this.students.push(...importedStudents);
                    this.addHistory('IMPORT XLS', `Imported ${importedStudents.length} students from ${file.name}`);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `Successfully imported ${importedStudents.length} students from ${file.name}`
                    });
                } else {
                    this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'No valid student records found in file' });
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

    exportToExcel() {
        if (this.students.length === 0) {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'No students to export' });
            return;
        }

        try {
            // Create CSV content with all columns
            const headers = ['LRN', 'Name', 'Grade', 'Section', 'Sex', 'Birth Date', 'Address', 'Barangay', 'Municipality/ City', 'Province', 'Contact Number', 'Learning Modality'];
            const rows = this.students.map((s) => [s.lrn, s.name, s.grade, s.section, s.sex, s.birthDate, s.address, s.barangay, s.municipality, s.province, s.contactNumber, s.learningModality]);

            let csvContent = headers.join(',') + '\n';
            rows.forEach((row) => {
                csvContent += row.map((cell) => `"${cell}"`).join(',') + '\n';
            });

            // Convert CSV to TSV for better Excel compatibility
            const tsvContent = csvContent.replace(/,/g, '\t');

            // Create blob and download
            const blob = new Blob([tsvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', `students_${new Date().getTime()}.xls`);
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            this.addHistory('EXPORT', `Exported ${this.students.length} students to XLS`);
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: `Successfully exported ${this.students.length} students`
            });
        } catch (error) {
            console.error('Export Error:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to export file' });
        }
    }

    getModalitySeverity(modality: string) {
        if (!modality) return 'secondary';
        const mode = modality.toLowerCase();
        if (mode.includes('face')) return 'success';
        if (mode.includes('online')) return 'info';
        if (mode.includes('hybrid') || mode.includes('blended')) return 'warning';
        return 'secondary';
    }

    openAddDialog() {
        this.newStudent = {
            id: 0,
            lrn: '',
            name: '',
            sex: '',
            birthDate: '',
            address: '',
            barangay: '',
            municipality: '',
            province: '',
            contactNumber: '',
            learningModality: '',
            grade: '',
            section: ''
        };
        this.displayAddDialog = true;
    }

    saveStudent() {
        if (!this.newStudent.lrn || !this.newStudent.name) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'LRN and Name are required fields'
            });
            return;
        }

        // Generate ID
        const newId = this.students.length > 0 ? Math.max(...this.students.map((s) => s.id)) + 1 : 1;
        const student: Student = {
            ...this.newStudent,
            id: newId
        };

        this.students.push(student);
        this.addHistory('ADD STUDENT', `Added student: ${student.name} (LRN: ${student.lrn})`);
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Student ${student.name} added successfully`
        });
        this.displayAddDialog = false;
    }
}
