import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FirestoreStudentService, Student } from '../services/firestore-student.service';

@Component({
  selector: 'app-students-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="card">
      <h2>Students Management</h2>
      
      <div class="toolbar">
        <button pButton 
                pRipple 
                label="Add New Student" 
                icon="pi pi-plus" 
                class="p-button-success mr-2"
                (click)="openAddDialog()"></button>
        <button pButton 
                pRipple 
                label="Refresh" 
                icon="pi pi-refresh" 
                (click)="loadStudents()"></button>
      </div>

      <p-table [value]="students" 
               responsiveLayout="scroll"
               [paginator]="true"
               [rows]="10"
               [globalFilterFields]="['lrn','name','email']">
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
              <button pButton 
                      pRipple 
                      type="button" 
                      pButton 
                      icon="pi pi-pencil" 
                      class="p-button-rounded p-button-info mr-2"
                      (click)="openEditDialog(student)"
                      title="Edit Student"></button>
              <button pButton 
                      pRipple 
                      type="button" 
                      icon="pi pi-trash" 
                      class="p-button-rounded p-button-danger"
                      (click)="deleteStudent(student.id)"
                      title="Delete Student"></button>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="7" class="text-center">No students found</td>
          </tr>
        </ng-template>
      </p-table>
    </div>

    <!-- Add/Edit Dialog -->
    <p-dialog [(visible)]="displayDialog" 
              [header]="isEditMode ? 'Edit Student' : 'Add New Student'" 
              [modal]="true" 
              [style]="{width: '50vw'}"
              (onHide)="hideDialog()">
      <div class="form">
        <div class="field">
          <label>LRN</label>
          <input type="text" 
                 pInputText 
                 [(ngModel)]="studentForm.lrn"
                 [disabled]="isEditMode"
                 placeholder="Enter LRN">
        </div>

        <div class="field">
          <label>Name</label>
          <input type="text" 
                 pInputText 
                 [(ngModel)]="studentForm.name"
                 placeholder="Enter Full Name">
        </div>

        <div class="field">
          <label>Email</label>
          <input type="email" 
                 pInputText 
                 [(ngModel)]="studentForm.email"
                 placeholder="Enter Email">
        </div>

        <div class="field">
          <label>Sex</label>
          <select pInputText [(ngModel)]="studentForm.sex">
            <option value="">-- Select --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div class="field">
          <label>Birth Date</label>
          <input type="date" 
                 pInputText 
                 [(ngModel)]="studentForm.birthDate">
        </div>

        <div class="field">
          <label>Address</label>
          <input type="text" 
                 pInputText 
                 [(ngModel)]="studentForm.address"
                 placeholder="Enter Address">
        </div>

        <div class="field">
          <label>Barangay</label>
          <input type="text" 
                 pInputText 
                 [(ngModel)]="studentForm.barangay"
                 placeholder="Enter Barangay">
        </div>

        <div class="field">
          <label>Municipality</label>
          <input type="text" 
                 pInputText 
                 [(ngModel)]="studentForm.municipality"
                 placeholder="Enter Municipality">
        </div>

        <div class="field">
          <label>Province</label>
          <input type="text" 
                 pInputText 
                 [(ngModel)]="studentForm.province"
                 placeholder="Enter Province">
        </div>

        <div class="field">
          <label>Contact Number</label>
          <input type="tel" 
                 pInputText 
                 [(ngModel)]="studentForm.contactNumber"
                 placeholder="Enter Contact Number">
        </div>

        <div class="field">
          <label>Learning Modality</label>
          <select pInputText [(ngModel)]="studentForm.learningModality">
            <option value="">-- Select --</option>
            <option value="Face-to-Face">Face-to-Face</option>
            <option value="Online">Online</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <button pButton 
                label="Cancel" 
                icon="pi pi-times" 
                (click)="hideDialog()"
                class="p-button-text"></button>
        <button pButton 
                label="Save" 
                icon="pi pi-check" 
                (click)="saveStudent()"
                [loading]="saving"></button>
      </ng-template>
    </p-dialog>

    <p-toast></p-toast>
  `,
  styles: [`
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

        .field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;

          label {
            font-weight: 600;
          }

          input, select {
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
        }
      }

      .mr-2 {
        margin-right: 0.5rem;
      }

      .text-center {
        text-align: center;
      }
    }
  `]
})
export class StudentsTableComponent implements OnInit {
  private studentService = inject(FirestoreStudentService);
  private messageService = inject(MessageService);

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
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load students'
      });
    }
  }

  openAddDialog() {
    this.isEditMode = false;
    this.editingId = null;
    this.studentForm = {
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
        this.messageService.add({
          severity: 'warn',
          summary: 'Validation',
          detail: 'LRN and Name are required'
        });
        return;
      }

      if (this.isEditMode && this.editingId) {
        await this.studentService.updateStudent(this.editingId, this.studentForm);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Student updated successfully'
        });
      } else {
        await this.studentService.addStudent(this.studentForm);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Student added successfully'
        });
      }

      this.hideDialog();
      this.loadStudents();
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Failed to save student'
      });
    } finally {
      this.saving = false;
    }
  }

  async deleteStudent(id: string | undefined) {
    if (!id) return;

    if (confirm('Are you sure you want to delete this student?')) {
      try {
        await this.studentService.deleteStudent(id);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Student deleted successfully'
        });
        this.loadStudents();
      } catch (error: any) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to delete student'
        });
      }
    }
  }

  hideDialog() {
    this.displayDialog = false;
    this.isEditMode = false;
    this.editingId = null;
  }
}
