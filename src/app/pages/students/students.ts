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
                <button pButton pRipple label="Refresh" icon="pi pi-refresh" (click)="loadStudents()"></button>
            </div>

            <p-table [value]="students" responsiveLayout="scroll" [paginator]="true" [rows]="10" [globalFilterFields]="['lrn', 'name', 'email']">
                <ng-template pTemplate="header">
                    <tr>
                        <th pSortableColumn="lrn">LRN <p-sortIcon field="lrn"></p-sortIcon></th>
                        <th pSortableColumn="name">Name <p-sortIcon field="name"></p-sortIcon></th>
                        <th pSortableColumn="email">Email <p-sortIcon field="email"></p-sortIcon></th>
                        <th pSortableColumn="sex">Sex <p-sortIcon field="sex"></p-sortIcon></th>
                        <th pSortableColumn="barangay">Barangay <p-sortIcon field="barangay"></p-sortIcon></th>
                        <th pSortableColumn="learningModality">Learning Mode <p-sortIcon field="learningModality"></p-sortIcon></th>
                        <th>Actions</th>
                    </tr>
                </ng-template>

                <ng-template pTemplate="body" let-student>
                    <tr>
                        <td>{{ student.lrn }}</td>
                        <td>{{ student.name }}</td>
                        <td>{{ student.email }}</td>
                        <td>{{ student.sex }}</td>
                        <td>{{ student.barangay }}</td>
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
                <div><label>Email</label><input pInputText type="email" [(ngModel)]="studentForm.email" /></div>
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
                <div><label>Contact</label><input pInputText [(ngModel)]="studentForm.contactNumber" /></div>
                <div>
                    <label>Learning Modality</label
                    ><select [(ngModel)]="studentForm.learningModality">
                        <option>Face-to-Face</option>
                        <option>Online</option>
                        <option>Hybrid</option>
                    </select>
                </div>
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
        this.studentForm = { lrn: '', name: '', email: '', sex: '', birthDate: '', address: '', barangay: '', municipality: '', province: '', contactNumber: '', learningModality: '' };
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
}
