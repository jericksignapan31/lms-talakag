import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { FirestoreStudentService, Student } from '../../services/firestore-student.service';
import { LmsAuthService } from '../../services/lms-auth.service';
import { FirebaseAuthService } from '../../services/firebase-auth.service';

@Component({
    selector: 'app-students',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, DialogModule, ToastModule, ConfirmDialogModule, ToolbarModule, TagModule, InputIconModule, IconFieldModule],
    providers: [MessageService, ConfirmationService],
    template: `
        <p-toast />
        <p-confirmDialog />

        <p-toolbar styleClass="mb-6">
            <ng-template #start>
                <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openAddDialog()" />
                <p-button severity="secondary" label="Delete" icon="pi pi-trash" outlined (onClick)="deleteSelectedStudents()" [disabled]="!selectedStudents || !selectedStudents.length" />
            </ng-template>

            <ng-template #end>
                <p-button label="Import CSV" icon="pi pi-upload" severity="success" (onClick)="fileInput.click()" />
                <input #fileInput type="file" hidden accept=".csv,.xls,.xlsx" (change)="onFileSelected($event)" />
            </ng-template>
        </p-toolbar>

        <p-table
            #dt
            [value]="filteredStudents"
            [rows]="10"
            [paginator]="true"
            [globalFilterFields]="['lrn', 'name', 'email', 'grade']"
            [tableStyle]="{ 'min-width': '100%' }"
            [(selection)]="selectedStudents"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} students"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
            scrollable="true"
            scrollHeight="flex"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">👨‍🎓 Student Management</h5>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Search students..." />
                    </p-iconfield>
                </div>
            </ng-template>

            <ng-template #header>
                <tr>
                    <th style="width: 3rem">
                        <p-tableHeaderCheckbox />
                    </th>
                    <th pSortableColumn="lrn" style="min-width: 10rem">
                        LRN
                        <p-sortIcon field="lrn" />
                    </th>
                    <th pSortableColumn="name" style="min-width: 12rem">
                        Name
                        <p-sortIcon field="name" />
                    </th>
                    <th pSortableColumn="email" style="min-width: 14rem">
                        Email
                        <p-sortIcon field="email" />
                    </th>
                    <th pSortableColumn="grade" style="min-width: 8rem">
                        Grade
                        <p-sortIcon field="grade" />
                    </th>
                    <th pSortableColumn="section" style="min-width: 8rem">
                        Section
                        <p-sortIcon field="section" />
                    </th>
                    <th pSortableColumn="sex" style="min-width: 8rem">
                        Sex
                        <p-sortIcon field="sex" />
                    </th>
                    <th pSortableColumn="contactNumber" style="min-width: 12rem">
                        Contact Number
                        <p-sortIcon field="contactNumber" />
                    </th>
                    <th pSortableColumn="role" style="min-width: 8rem">
                        Role
                        <p-sortIcon field="role" />
                    </th>
                    <th style="min-width: 8rem">Actions</th>
                </tr>
            </ng-template>

            <ng-template #body let-student>
                <tr>
                    <td>
                        <p-tableCheckbox [value]="student" />
                    </td>
                    <td>
                        <p-tag [value]="student.lrn" severity="info" />
                    </td>
                    <td>
                        <span class="font-semibold">{{ student.name }}</span>
                    </td>
                    <td>{{ student.email }}</td>
                    <td>{{ student.grade }}</td>
                    <td>{{ student.section }}</td>
                    <td>{{ student.sex }}</td>
                    <td>{{ student.contactNumber }}</td>
                    <td>
                        <p-tag [value]="student.role" severity="warn" />
                    </td>
                    <td>
                        <p-button icon="pi pi-eye" severity="info" class="mr-2" (onClick)="openProfileDialog(student)" [text]="true" [rounded]="true" pTooltip="View Profile" tooltipPosition="top" />
                        <p-button icon="pi pi-key" severity="secondary" class="mr-2" (onClick)="resetPassword(student)" [text]="true" [rounded]="true" pTooltip="Reset Password" tooltipPosition="top" />
                        <p-button icon="pi pi-pencil" severity="success" class="mr-2" (onClick)="openEditDialog(student)" [text]="true" [rounded]="true" pTooltip="Edit" tooltipPosition="top" />
                        <p-button icon="pi pi-trash" severity="danger" (onClick)="deleteStudent(student.id)" [text]="true" [rounded]="true" pTooltip="Delete" tooltipPosition="top" />
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <!-- Profile View Dialog -->
        <p-dialog [(visible)]="displayProfileDialog" [header]="selectedStudent?.name + ' - Student Profile'" [modal]="true" [style]="{ width: '600px' }">
            <div *ngIf="selectedStudent" class="profile-view">
                <div class="profile-section">
                    <h3>Personal Information</h3>
                    <div class="profile-grid">
                        <div class="profile-field">
                            <label>LRN:</label>
                            <span>{{ selectedStudent.lrn }}</span>
                        </div>
                        <div class="profile-field">
                            <label>Name:</label>
                            <span>{{ selectedStudent.name }}</span>
                        </div>
                        <div class="profile-field">
                            <label>Sex:</label>
                            <span>{{ selectedStudent.sex }}</span>
                        </div>
                        <div class="profile-field">
                            <label>Birth Date:</label>
                            <span>{{ selectedStudent.birthDate }}</span>
                        </div>
                    </div>
                </div>

                <div class="profile-section">
                    <h3>Academic Information</h3>
                    <div class="profile-grid">
                        <div class="profile-field">
                            <label>Grade:</label>
                            <span>{{ selectedStudent.grade }}</span>
                        </div>
                        <div class="profile-field">
                            <label>Section:</label>
                            <span>{{ selectedStudent.section }}</span>
                        </div>
                        <div class="profile-field">
                            <label>Learning Modality:</label>
                            <span>{{ selectedStudent.learningModality }}</span>
                        </div>
                    </div>
                </div>

                <div class="profile-section">
                    <h3>Contact Information</h3>
                    <div class="profile-grid">
                        <div class="profile-field">
                            <label>Email:</label>
                            <span>{{ selectedStudent.email }}</span>
                        </div>
                        <div class="profile-field">
                            <label>Contact Number:</label>
                            <span>{{ selectedStudent.contactNumber }}</span>
                        </div>
                    </div>
                </div>

                <div class="profile-section">
                    <h3>Address Information</h3>
                    <div class="profile-grid">
                        <div class="profile-field">
                            <label>Address:</label>
                            <span>{{ selectedStudent.address }}</span>
                        </div>
                        <div class="profile-field">
                            <label>Barangay:</label>
                            <span>{{ selectedStudent.barangay }}</span>
                        </div>
                        <div class="profile-field">
                            <label>Municipality:</label>
                            <span>{{ selectedStudent.municipality }}</span>
                        </div>
                        <div class="profile-field">
                            <label>Province:</label>
                            <span>{{ selectedStudent.province }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <ng-template pTemplate="footer">
                <button pButton label="Close" (click)="displayProfileDialog = false" class="p-button-text"></button>
            </ng-template>
        </p-dialog>

        <!-- Reset Password Success Modal -->
        <p-dialog [(visible)]="displayResetSuccessDialog" [header]="'✅ Password Reset Sent'" [modal]="true" [style]="{ width: '500px', zIndex: 10000 }" [baseZIndex]="10000" [closable]="true">
            <div class="reset-success-content">
                <div class="success-icon">
                    <i class="pi pi-check-circle"></i>
                </div>

                <div class="success-message">
                    <h3>Password Reset Email Sent!</h3>
                    <p>An email with password reset instructions has been sent to:</p>
                    <p class="email-highlight">{{ resetSuccessData?.email }}</p>
                </div>

                <div class="student-info">
                    <p><strong>Student:</strong> {{ resetSuccessData?.name }}</p>
                </div>

                <div class="instructions">
                    <h4>Next Steps:</h4>
                    <ol>
                        <li>Check the student's email (including spam/junk folder)</li>
                        <li>Click the password reset link in the email</li>
                        <li>Follow the instructions to create a new password</li>
                        <li>The student can now login with their new password</li>
                    </ol>
                </div>

                <div class="info-box">
                    <p>
                        <i class="pi pi-info-circle"></i>
                        The password reset link will expire in <strong>1 hour</strong>
                    </p>
                </div>
            </div>

            <ng-template pTemplate="footer">
                <button pButton label="Close" (click)="displayResetSuccessDialog = false" class="p-button-success"></button>
            </ng-template>
        </p-dialog>

        <!-- Add/Edit Student Dialog -->
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
        `,
        `
            :host ::ng-deep .profile-view {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
                padding: 1rem 0;
            }

            :host ::ng-deep .profile-section {
                border-bottom: 1px solid #e0e0e0;
                padding-bottom: 1rem;
            }

            :host ::ng-deep .profile-section h3 {
                margin: 0 0 1rem 0;
                color: #333;
                font-size: 1rem;
                font-weight: 600;
            }

            :host ::ng-deep .profile-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
            }

            :host ::ng-deep .profile-field {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }

            :host ::ng-deep .profile-field label {
                font-weight: 600;
                color: #666;
                font-size: 0.85rem;
            }

            :host ::ng-deep .profile-field span {
                color: #333;
                padding: 0.5rem 0;
            }
        `,
        `
            :host ::ng-deep .reset-success-content {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
                padding: 1rem 0;
            }

            :host ::ng-deep .success-icon {
                text-align: center;
                font-size: 3rem;
                color: #22c55e;
                margin: 1rem 0;
            }

            :host ::ng-deep .success-message {
                text-align: center;
            }

            :host ::ng-deep .success-message h3 {
                margin: 0 0 0.5rem 0;
                color: #22c55e;
                font-size: 1.3rem;
                font-weight: 600;
            }

            :host ::ng-deep .success-message p {
                margin: 0.5rem 0;
                color: #666;
                font-size: 0.95rem;
            }

            :host ::ng-deep .email-highlight {
                background-color: #f0fdf4 !important;
                padding: 0.75rem;
                border-radius: 4px;
                font-weight: 600;
                color: #16a34a !important;
                font-family: monospace;
                font-size: 0.9rem;
                margin: 1rem 0 !important;
            }

            :host ::ng-deep .student-info {
                background-color: #f8fafc;
                padding: 1rem;
                border-left: 4px solid #22c55e;
                border-radius: 4px;
            }

            :host ::ng-deep .student-info p {
                margin: 0.5rem 0;
                color: #333;
            }

            :host ::ng-deep .instructions {
                background-color: #f0fdf4;
                padding: 1rem;
                border-radius: 4px;
            }

            :host ::ng-deep .instructions h4 {
                margin: 0 0 0.5rem 0;
                color: #16a34a;
                font-size: 0.95rem;
            }

            :host ::ng-deep .instructions ol {
                margin: 0.5rem 0;
                padding-left: 1.5rem;
                color: #333;
            }

            :host ::ng-deep .instructions li {
                margin: 0.3rem 0;
                font-size: 0.9rem;
            }

            :host ::ng-deep .info-box {
                background-color: #eff6ff;
                border: 1px solid #bfdbfe;
                border-radius: 4px;
                padding: 1rem;
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            :host ::ng-deep .info-box i {
                color: #3b82f6;
                font-size: 1.2rem;
            }

            :host ::ng-deep .info-box p {
                margin: 0;
                color: #1e40af;
                font-size: 0.9rem;
            }
        `
    ]
})
export class Students implements OnInit {
    private studentService = inject(FirestoreStudentService);
    private messageService = inject(MessageService);
    private authService = inject(LmsAuthService);
    private firebaseAuthService = inject(FirebaseAuthService);
    private confirmationService = inject(ConfirmationService);

    students: Student[] = [];
    filteredStudents: Student[] = [];
    searchValue: string = '';
    displayDialog = false;
    displayProfileDialog = false;
    displayResetSuccessDialog = false;
    resetSuccessData: { name: string; email: string | undefined } | null = null;
    saving = false;
    isEditMode = false;
    editingId: string | null = null;
    selectedStudent: Student | null = null;
    selectedStudents: Student[] = [];

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

    onGlobalFilter(table: any, event: Event) {
        const searchValue = (event.target as HTMLInputElement).value;
        table.filterGlobal(searchValue, 'contains');
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

    deleteSelectedStudents() {
        if (!this.selectedStudents || this.selectedStudents.length === 0) {
            this.messageService.add({ severity: 'warn', summary: 'No Selection', detail: 'Please select students to delete' });
            return;
        }

        this.confirmationService.confirm({
            message: `Delete ${this.selectedStudents.length} selected student(s)?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    for (const student of this.selectedStudents) {
                        if (student.id) {
                            await this.deleteStudent(student.id);
                        }
                    }
                    this.selectedStudents = [];
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Selected students deleted successfully' });
                } catch (error: any) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
                }
            }
        });
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
                // Set email when updating
                this.studentForm.email = 'indulanglibrary@gmail.com';
                await this.studentService.updateStudent(this.editingId, this.studentForm);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Student updated successfully' });
            } else {
                // Add role field for role-based access
                this.studentForm.role = 'student';
                // Set email for new student
                this.studentForm.email = 'indulanglibrary@gmail.com';
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

    // View Profile Dialog
    openProfileDialog(student: Student) {
        this.selectedStudent = student;
        this.displayProfileDialog = true;
    }

    // Reset Password
    async resetPassword(student: Student) {
        console.log('🔑 Reset Password button clicked for student:', student.name, 'LRN:', student.lrn);

        this.confirmationService.confirm({
            message: `Are you sure you want to reset the password?`,
            header: 'Reset Password',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                console.log('✅ Admin confirmed password reset for:', student.name);
                try {
                    // Send password reset email
                    const email = `${student.lrn}@lms.talakag`;
                    console.log('📧 Preparing to send password reset email to:', email);
                    console.log('📌 Student Details:', {
                        name: student.name,
                        lrn: student.lrn,
                        authEmail: email,
                        contactEmail: student.email
                    });

                    // Verify email is not empty
                    if (!email || email.trim() === '') {
                        throw new Error('Email address is empty');
                    }

                    console.log('⏳ Calling Firebase sendPasswordResetEmail()...');
                    const startTime = performance.now();

                    await this.firebaseAuthService.sendPasswordResetEmailToUser(email);

                    const endTime = performance.now();
                    console.log(`✅ Email sent successfully! (${(endTime - startTime).toFixed(2)}ms)`);
                    console.log('📧 Email delivery confirmed - student should receive reset link shortly');

                    // Show success modal
                    console.log('🎉 Showing success modal');
                    this.resetSuccessData = {
                        name: student.name,
                        email: student.email
                    };
                    console.log('📋 Reset success data:', this.resetSuccessData);
                    console.log('🔓 displayResetSuccessDialog set to true');
                    this.displayResetSuccessDialog = true;

                    // Also show a toast notification for immediate feedback
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `Password reset email sent to ${email}`,
                        life: 5000
                    });
                } catch (error: any) {
                    console.error('❌ Error in password reset:', error);
                    console.error('Error Code:', error.code);
                    console.error('Error Message:', error.message);
                    console.error('Full Error:', error);

                    let errorMessage = 'Failed to send reset email';
                    if (error.code === 'auth/user-not-found') {
                        errorMessage = 'User account not found. Make sure the student account exists.';
                    } else if (error.code === 'auth/invalid-email') {
                        errorMessage = 'Invalid email format.';
                    } else if (error.code === 'auth/too-many-requests') {
                        errorMessage = 'Too many password reset requests. Please try again later.';
                    }

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: errorMessage + ' (' + error.message + ')',
                        sticky: true
                    });
                }
            }
        });
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
                            email: 'indulanglibrary@gmail.com',
                            grade: values[headers.indexOf('grade')] || '',
                            section: values[headers.indexOf('section')] || '',
                            sex: values[headers.indexOf('sex')] || '',
                            birthDate: values[headers.indexOf('birthdate')] || '',
                            address: values[headers.indexOf('address')] || '',
                            barangay: values[headers.indexOf('barangay')] || '',
                            municipality: values[headers.indexOf('municipality')] || '',
                            province: values[headers.indexOf('province')] || '',
                            contactNumber: values[headers.indexOf('contactnumber')] || '',
                            learningModality: values[headers.indexOf('learningmodality')] || '',
                            role: 'student'
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
                    if (row.some((field) => field)) {
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
            if (row.some((field) => field)) {
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
                            email: 'indulanglibrary@gmail.com',
                            grade: values[headers.indexOf('grade')] || '',
                            section: values[headers.indexOf('section')] || '',
                            sex: values[headers.indexOf('sex')] || '',
                            birthDate: values[headers.indexOf('birthdate')] || '',
                            address: values[headers.indexOf('address')] || '',
                            barangay: values[headers.indexOf('barangay')] || '',
                            municipality: values[headers.indexOf('municipality')] || '',
                            province: values[headers.indexOf('province')] || '',
                            contactNumber: values[headers.indexOf('contactnumber')] || '',
                            learningModality: values[headers.indexOf('learningmodality')] || '',
                            role: 'student'
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
                    // Set email for imported student
                    student.email = 'indulanglibrary@gmail.com';
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
