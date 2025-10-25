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
import { LmsAuthService } from '../../services/lms-auth.service';
import { FirebaseAuthService } from '../../services/firebase-auth.service';

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
                    <th pSortableColumn="role" style="min-width: 8rem">
                        Role
                        <p-sortIcon field="role" />
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
                        <p-tag [value]="teacher.role" severity="warning" />
                    </td>
                    <td>
                        <p-button icon="pi pi-eye" severity="info" class="mr-2" (onClick)="openProfileDialog(teacher)" [text]="true" [rounded]="true" pTooltip="View Profile" tooltipPosition="top" />
                        <p-button icon="pi pi-key" severity="secondary" class="mr-2" (onClick)="resetPassword(teacher)" [text]="true" [rounded]="true" pTooltip="Reset Password" tooltipPosition="top" />
                        <p-button icon="pi pi-pencil" severity="success" class="mr-2" (onClick)="editTeacher(teacher)" [text]="true" [rounded]="true" pTooltip="Edit" tooltipPosition="top" />
                        <p-button icon="pi pi-trash" severity="danger" (onClick)="deleteTeacher(teacher)" [text]="true" [rounded]="true" pTooltip="Delete" tooltipPosition="top" />
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <!-- Profile View Dialog -->
        <p-dialog [(visible)]="displayProfileDialog" [header]="selectedTeacher?.name + ' - Teacher Profile'" [modal]="true" [style]="{ width: '600px' }">
            <div *ngIf="selectedTeacher" class="profile-view">
                <div class="profile-section">
                    <h3>Personal Information</h3>
                    <div class="profile-grid">
                        <div class="profile-field">
                            <label>Teacher ID:</label>
                            <span>{{ selectedTeacher.teacherID }}</span>
                        </div>
                        <div class="profile-field">
                            <label>Name:</label>
                            <span>{{ selectedTeacher.name }}</span>
                        </div>
                        <div class="profile-field">
                            <label>Birth Date:</label>
                            <span>{{ selectedTeacher.birthDate }}</span>
                        </div>
                        <div class="profile-field">
                            <label>Department/Unit:</label>
                            <span>{{ selectedTeacher.department }}</span>
                        </div>
                    </div>
                </div>

                <div class="profile-section">
                    <h3>Contact Information</h3>
                    <div class="profile-grid">
                        <div class="profile-field">
                            <label>Email:</label>
                            <span>{{ selectedTeacher.email }}</span>
                        </div>
                        <div class="profile-field">
                            <label>Contact Number:</label>
                            <span>{{ selectedTeacher.contactNumber }}</span>
                        </div>
                    </div>
                </div>

                <div class="profile-section">
                    <h3>Role Information</h3>
                    <div class="profile-grid">
                        <div class="profile-field">
                            <label>Role:</label>
                            <span>{{ selectedTeacher.role }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <ng-template pTemplate="footer">
                <p-button label="Close" icon="pi pi-times" [text]="true" (onClick)="displayProfileDialog = false" />
            </ng-template>
        </p-dialog>

        <!-- Reset Password Success Modal -->
        <p-dialog [(visible)]="displayResetSuccessDialog" [header]="'✅ Password Reset Sent'" [modal]="true" [style]="{ width: '500px' }" [closable]="true">
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
                    <p><strong>Teacher:</strong> {{ resetSuccessData?.name }}</p>
                </div>

                <div class="instructions">
                    <h4>Next Steps:</h4>
                    <ol>
                        <li>Check the teacher's email (including spam/junk folder)</li>
                        <li>Click the password reset link in the email</li>
                        <li>Follow the instructions to create a new password</li>
                        <li>The teacher can now login with their new password</li>
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
                <p-button label="Close" icon="pi pi-check" severity="success" [text]="true" (onClick)="displayResetSuccessDialog = false" />
            </ng-template>
        </p-dialog>

        <!-- Edit Teacher Dialog -->
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
    `,
    styles: [
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
export class TeacherComponent implements OnInit {
    private teacherService = inject(FirestoreTeacherService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private authService = inject(LmsAuthService);
    private firebaseAuthService = inject(FirebaseAuthService);

    @ViewChild('dt') dataTable?: Table;

    teachers = signal<Teacher[]>([]);
    teacher: Teacher = this.getEmptyTeacher();
    selectedTeachers: Teacher[] | null = null;
    selectedTeacher: Teacher | null = null;
    submitted: boolean = false;
    teacherDialog: boolean = false;
    displayProfileDialog: boolean = false;
    displayResetSuccessDialog: boolean = false;
    resetSuccessData: { name: string; email: string | undefined } | null = null;
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
            { field: 'contactNumber', header: 'Contact Number' },
            { field: 'role', header: 'Role' }
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

    // View Profile Dialog
    openProfileDialog(teacher: Teacher) {
        this.selectedTeacher = teacher;
        this.displayProfileDialog = true;
    }

    // Reset Password
    async resetPassword(teacher: Teacher) {
        console.log('🔑 Reset Password button clicked for teacher:', teacher.name, 'ID:', teacher.teacherID);

        this.confirmationService.confirm({
            message: `Are you sure you want to reset password for ${teacher.name}? A password reset email will be sent to ${teacher.email}.`,
            header: 'Reset Password',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                console.log('✅ Admin confirmed password reset for:', teacher.name);
                try {
                    // Send password reset email
                    const email = `${teacher.teacherID}@lms.talakag`;
                    console.log('📧 Preparing to send password reset email to:', email);
                    console.log('📌 Teacher Details:', {
                        name: teacher.name,
                        teacherID: teacher.teacherID,
                        authEmail: email,
                        contactEmail: teacher.email
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
                    console.log('📧 Email delivery confirmed - teacher should receive reset link shortly');

                    // Show success modal
                    console.log('🎉 Showing success modal');
                    this.resetSuccessData = {
                        name: teacher.name,
                        email: teacher.email
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
                        errorMessage = 'User account not found. Make sure the teacher account exists.';
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

    deleteTeacher(teacher: Teacher) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + teacher.name + '?\n\nThis will also delete their Firebase account.',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    if (teacher.id) {
                        // Delete from Firestore
                        await this.teacherService.deleteTeacher(teacher.id);

                        // Delete Firebase account
                        if (teacher.teacherID) {
                            try {
                                await this.teacherService.deleteTeacherAccount(teacher.teacherID);
                            } catch (accountError) {
                                // Log error but continue with deletion
                                console.warn('Account deletion partial:', accountError);
                            }
                        }
                    }
                    await this.loadTeachersFromFirestore();
                    this.teacher = this.getEmptyTeacher();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Teacher and Account Deleted',
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
                    const newTeacher: Teacher = {
                        name: this.teacher.name,
                        teacherID: this.teacher.teacherID,
                        birthDate: this.teacher.birthDate,
                        department: this.teacher.department,
                        email: this.teacher.email,
                        contactNumber: this.teacher.contactNumber,
                        role: 'teacher'
                    };

                    await this.teacherService.addTeacher(newTeacher);

                    // Create Firebase account for new teacher
                    try {
                        await this.teacherService.createTeacherAccount(newTeacher);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: `Teacher Added and Account Created\nUsername: ${this.teacher.teacherID}\nPassword: ${this.teacher.teacherID}`,
                            life: 5000
                        });
                    } catch (accountError) {
                        // Teacher added but account creation failed
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Partial Success',
                            detail: `Teacher Added but Account Creation Failed: ${accountError instanceof Error ? accountError.message : 'Unknown error'}`,
                            life: 5000
                        });
                        console.error('Account creation error:', accountError);
                    }
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
                    contactNumber: getValue(values, 'contactnumber'),
                    role: 'teacher'
                };

                importedTeachers.push(teacher);
            }

            if (importedTeachers.length > 0) {
                let successCount = 0;
                let failureCount = 0;
                let accountCreationErrors: string[] = [];

                for (const teacher of importedTeachers) {
                    try {
                        // First, create Firebase account with teacherID
                        try {
                            await this.authService.createTeacherAccount(teacher.teacherID);
                        } catch (accountError: any) {
                            // If account creation fails, still try to save the teacher record
                            const errorMsg = accountError.message || 'Unknown error';
                            console.warn(`Failed to create Firebase account for teacher ${teacher.teacherID}:`, errorMsg);
                            accountCreationErrors.push(`${teacher.teacherID}: ${errorMsg}`);
                        }

                        // Save the teacher record in Firestore
                        await this.teacherService.addTeacher(teacher);
                        successCount++;
                    } catch (error) {
                        console.error('Error saving imported teacher:', error);
                        failureCount++;
                    }
                }

                await this.loadTeachersFromFirestore();

                let detailMessage = `Successfully imported ${successCount} teacher(s)`;
                if (failureCount > 0) {
                    detailMessage += `. Failed to import ${failureCount} teacher(s).`;
                }
                if (accountCreationErrors.length > 0) {
                    detailMessage += `\n\nSome Firebase accounts couldn't be created (check console for details)`;
                }

                this.messageService.add({
                    severity: 'success',
                    summary: 'Import Complete',
                    detail: detailMessage,
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
                    contactNumber: getValue(values, 'contactnumber'),
                    role: 'teacher'
                };

                importedTeachers.push(teacher);
            }

            if (importedTeachers.length > 0) {
                let successCount = 0;
                let failureCount = 0;
                let accountCreationErrors: string[] = [];

                for (const teacher of importedTeachers) {
                    try {
                        // First, create Firebase account with teacherID
                        try {
                            await this.authService.createTeacherAccount(teacher.teacherID);
                        } catch (accountError: any) {
                            // If account creation fails, still try to save the teacher record
                            const errorMsg = accountError.message || 'Unknown error';
                            console.warn(`Failed to create Firebase account for teacher ${teacher.teacherID}:`, errorMsg);
                            accountCreationErrors.push(`${teacher.teacherID}: ${errorMsg}`);
                        }

                        // Save the teacher record in Firestore
                        await this.teacherService.addTeacher(teacher);
                        successCount++;
                    } catch (error) {
                        console.error('Error saving imported teacher:', error);
                        failureCount++;
                    }
                }

                await this.loadTeachersFromFirestore();

                let detailMessage = `Successfully imported ${successCount} teacher(s)`;
                if (failureCount > 0) {
                    detailMessage += `. Failed to import ${failureCount} teacher(s).`;
                }
                if (accountCreationErrors.length > 0) {
                    detailMessage += `\n\nSome Firebase accounts couldn't be created (check console for details)`;
                }

                this.messageService.add({
                    severity: 'success',
                    summary: 'Import Complete',
                    detail: detailMessage,
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
