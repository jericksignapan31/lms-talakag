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
                <button pButton pRipple label="Add New Student" icon="pi pi-plus" class="p-button-success mr-2" (click)="openAddDialog()"></button>
                <button pButton pRipple label="Import Excel" icon="pi pi-upload" class="p-button-info mr-2" (click)="fileInput.click()"></button>
                <button pButton pRipple label="Refresh" icon="pi pi-refresh" (click)="loadStudents()"></button>
                <input #fileInput type="file" hidden accept=".xlsx,.xls,.csv" (change)="onFileSelected($event)" />
            </div>

            <p-table [value]="students" responsiveLayout="scroll" [paginator]="true" [rows]="10" [globalFilterFields]="['lrn', 'name', 'email']">
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
                        <th pSortableColumn="municipality">Municipality <p-sortIcon field="municipality"></p-sortIcon></th>
                        <th pSortableColumn="province">Province <p-sortIcon field="province"></p-sortIcon></th>
                        <th pSortableColumn="contactNumber">Contact Number <p-sortIcon field="contactNumber"></p-sortIcon></th>
                        <th pSortableColumn="learningModality">Learning Modality <p-sortIcon field="learningModality"></p-sortIcon></th>
                        <th>Actions</th>
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
                        <td>{{ student.learningModality }}</td>
                        <td>
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
                    gap: 0.5rem;
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
            }
        `
    ]
})
export class Students implements OnInit {
    private studentService = inject(FirestoreStudentService);
    private messageService = inject(MessageService);
    private authService = inject(LmsAuthService);

    students: Student[] = [];
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
        } catch (error) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load students' });
        }
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
        if (!id || !confirm('Sure?')) return;
        try {
            await this.studentService.deleteStudent(id);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Deleted' });
            this.loadStudents();
        } catch (error: any) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
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
                const rows = csv.split('\n').filter((row: string) => row.trim());
                if (rows.length < 2) {
                    this.messageService.add({ severity: 'warn', summary: 'Invalid File', detail: 'File must have headers and at least one row' });
                    return;
                }

                const headers = rows[0].split(',').map((h: string) => h.trim().toLowerCase());
                const importedStudents: Student[] = [];

                for (let i = 1; i < rows.length; i++) {
                    const values = rows[i].split(',').map((v: string) => v.trim().replace(/"/g, ''));
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

    parseExcel(file: File) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            try {
                const data = e.target.result;
                const rows = data
                    .split('\n')
                    .map((row: string) => row.trim())
                    .filter((row: string) => row.length > 0);

                if (rows.length < 2) {
                    this.messageService.add({ severity: 'warn', summary: 'Invalid File', detail: 'File must have headers and at least one row' });
                    return;
                }

                const delimiter = rows[0].includes('\t') ? '\t' : ',';
                const headers = rows[0].split(delimiter).map((h: string) => h.trim().toLowerCase());
                const importedStudents: Student[] = [];

                for (let i = 1; i < rows.length; i++) {
                    const values = rows[i].split(delimiter).map((v: string) => v.trim().replace(/"/g, ''));
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
                this.messageService.add({ severity: 'error', summary: 'Parse Error', detail: 'Failed to parse Excel file' });
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
