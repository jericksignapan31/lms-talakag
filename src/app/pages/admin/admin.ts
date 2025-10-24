import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FirestoreAdminService, Admin } from '../../services/firestore-admin.service';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, DialogModule, InputTextModule, SelectModule, ToastModule, ConfirmDialogModule],
    providers: [MessageService, ConfirmationService],
    template: `
        <div class="p-6 bg-gray-50 min-h-screen">
            <div class="max-w-7xl mx-auto">
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-800">Admin Management</h1>
                        <p class="text-gray-600 mt-2">Manage system administrators and roles</p>
                    </div>
                    <button pButton (click)="openNew()" label="➕ Add Admin" class="p-button-rounded p-button-success"></button>
                </div>

                <!-- Admins Table -->
                <div class="bg-white rounded-lg shadow-md overflow-x-auto">
                    <table class="w-full border-collapse">
                        <thead>
                            <tr class="bg-gray-100 border-b-2 border-gray-300">
                                <th class="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                                <th class="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                                <th class="px-4 py-3 text-left font-semibold text-gray-700">Admin ID</th>
                                <th class="px-4 py-3 text-left font-semibold text-gray-700">Department</th>
                                <th class="px-4 py-3 text-left font-semibold text-gray-700">Role</th>
                                <th class="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                                <th class="px-4 py-3 text-left font-semibold text-gray-700">Last Login</th>
                                <th class="px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor="let admin of admins()" class="border-b border-gray-200 hover:bg-gray-50 transition">
                                <td class="px-4 py-3 text-gray-800">{{ admin.name }}</td>
                                <td class="px-4 py-3 text-gray-600">{{ admin.email }}</td>
                                <td class="px-4 py-3 text-gray-600">{{ admin.adminID }}</td>
                                <td class="px-4 py-3 text-gray-600">{{ admin.department }}</td>
                                <td class="px-4 py-3">
                                    <span class="px-3 py-1 rounded-full text-xs font-semibold" [ngClass]="admin.role === 'super-admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'">
                                        {{ admin.role }}
                                    </span>
                                </td>
                                <td class="px-4 py-3">
                                    <span class="px-3 py-1 rounded-full text-xs font-semibold" [ngClass]="admin.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                                        {{ admin.status }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-gray-600">{{ admin.lastLogin ? (admin.lastLogin | date: 'short') : 'Never' }}</td>
                                <td class="px-4 py-3 text-center">
                                    <button pButton pRipple icon="pi pi-pencil" class="p-button-rounded p-button-warning p-button-sm mr-2" (click)="editAdmin(admin)"></button>
                                    <button pButton pRipple icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-sm" (click)="confirmDelete(admin)"></button>
                                </td>
                            </tr>
                            <tr *ngIf="admins().length === 0" class="border-b border-gray-200">
                                <td colspan="8" class="px-4 py-8 text-center text-gray-500">No admins found</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Add/Edit Dialog -->
        <p-dialog [visible]="displayDialog()" (visibleChange)="displayDialog.set($event)" [header]="editingAdmin() ? 'Edit Admin' : 'Add Admin'" [modal]="true" [style]="{ width: '50vw' }" [breakpoints]="{ '960px': '75vw', '640px': '90vw' }">
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input pInputText [(ngModel)]="adminForm.name" class="w-full" placeholder="Admin name" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input pInputText [(ngModel)]="adminForm.email" type="email" class="w-full" placeholder="admin@example.com" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Admin ID</label>
                    <div class="flex gap-2">
                        <input pInputText [(ngModel)]="adminForm.adminID" class="w-full" placeholder="Auto-generated" [readOnly]="!editingAdmin()" [ngClass]="{ 'bg-gray-100': !editingAdmin() }" />
                        <button *ngIf="!editingAdmin()" pButton type="button" (click)="generateNewAdminID()" label="Generate" class="p-button-info p-button-sm"></button>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <p-select [(ngModel)]="adminForm.department" [options]="departmentOptions" optionLabel="label" optionValue="value" class="w-full" placeholder="Select Department"></p-select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <p-select [(ngModel)]="adminForm.role" [options]="roleOptions" optionLabel="label" optionValue="value" class="w-full"></p-select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <p-select [(ngModel)]="adminForm.status" [options]="statusOptions" optionLabel="label" optionValue="value" class="w-full"></p-select>
                </div>
                <div *ngIf="!editingAdmin()">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input pInputText [(ngModel)]="adminForm.password" type="password" class="w-full" placeholder="Minimum 6 characters" />
                </div>
            </div>
            <ng-template pTemplate="footer">
                <button pButton label="Cancel" icon="pi pi-times" (click)="hideDialog()" class="p-button-text"></button>
                <button pButton label="Save" icon="pi pi-check" (click)="saveAdmin()" class="p-button-success"></button>
            </ng-template>
        </p-dialog>

        <!-- Confirm Delete Dialog -->
        <p-confirmDialog [style]="{ width: '50vw' }" [breakpoints]="{ '960px': '75vw', '640px': '90vw' }"></p-confirmDialog>

        <!-- Toast Notifications -->
        <p-toast position="top-right"></p-toast>
    `,
    styles: `
        :host {
            --surface-card: white;
            --surface-ground: #f8f9fa;
        }
    `
})
export class AdminComponent implements OnInit, OnDestroy {
    admins = signal<Admin[]>([]);
    displayDialog = signal(false);
    editingAdmin = signal<Admin | null>(null);
    adminForm = {
        id: '',
        name: '',
        email: '',
        adminID: '',
        department: '',
        role: 'admin' as 'admin' | 'super-admin',
        status: 'active' as 'active' | 'inactive',
        password: '',
        createdAt: '',
        lastLogin: ''
    };

    roleOptions = [
        { label: 'Admin', value: 'admin' },
        { label: 'Super Admin', value: 'super-admin' }
    ];

    statusOptions = [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
    ];

    departmentOptions = [
        { label: 'Administration', value: 'Administration' },
        { label: 'IT Department', value: 'IT Department' },
        { label: 'Finance', value: 'Finance' },
        { label: 'Human Resources', value: 'Human Resources' },
        { label: 'Academic Affairs', value: 'Academic Affairs' },
        { label: 'Student Services', value: 'Student Services' },
        { label: 'Library', value: 'Library' },
        { label: 'Facilities', value: 'Facilities' },
        { label: 'Other', value: 'Other' }
    ];

    constructor(
        private adminService: FirestoreAdminService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadAdmins();
    }

    ngOnDestroy() {
        // Cleanup if needed
    }

    loadAdmins() {
        this.adminService
            .getAdmins()
            .then((data) => {
                this.admins.set(data);
            })
            .catch((error: any) => {
                console.error('Error loading admins:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load admins' });
            });
    }

    openNew() {
        this.adminForm = {
            id: '',
            name: '',
            email: '',
            adminID: '',
            department: '',
            role: 'admin',
            status: 'active',
            password: '',
            createdAt: '',
            lastLogin: ''
        };
        this.editingAdmin.set(null);
        this.displayDialog.set(true);

        // Auto-generate Admin ID when opening new admin dialog
        this.generateNewAdminID();
    }

    async generateNewAdminID() {
        try {
            const newAdminID = await this.adminService.generateAdminID();
            this.adminForm.adminID = newAdminID;
            this.messageService.add({ severity: 'info', summary: 'Info', detail: `Admin ID generated: ${newAdminID}` });
        } catch (error: any) {
            console.error('Error generating Admin ID:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to generate Admin ID' });
        }
    }

    editAdmin(admin: Admin) {
        this.adminForm = { ...admin, password: '' } as any;
        this.editingAdmin.set(admin);
        this.displayDialog.set(true);
    }

    saveAdmin() {
        if (!this.adminForm.name || !this.adminForm.email || !this.adminForm.adminID) {
            this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Please fill all required fields' });
            return;
        }

        if (this.editingAdmin()) {
            // Update
            const adminToUpdate: Admin = {
                name: this.adminForm.name,
                email: this.adminForm.email,
                adminID: this.adminForm.adminID,
                department: this.adminForm.department,
                role: this.adminForm.role,
                status: this.adminForm.status
            };
            this.adminService
                .updateAdmin(this.editingAdmin()!.id!, adminToUpdate)
                .then(() => {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Admin updated successfully' });
                    this.displayDialog.set(false);
                    this.loadAdmins();
                })
                .catch((error: any) => {
                    console.error('Error updating admin:', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update admin' });
                });
        } else {
            // Create
            if (!this.adminForm.password || this.adminForm.password.length < 6) {
                this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Password must be at least 6 characters' });
                return;
            }

            const newAdmin: Admin = {
                name: this.adminForm.name,
                email: this.adminForm.email,
                adminID: this.adminForm.adminID,
                department: this.adminForm.department,
                role: this.adminForm.role,
                status: this.adminForm.status,
                createdAt: new Date().toISOString()
            };

            this.adminService
                .createAdminAccountAndRecord(newAdmin, this.adminForm.password)
                .then(() => {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Admin created successfully' });
                    this.displayDialog.set(false);
                    this.loadAdmins();
                })
                .catch((error: any) => {
                    console.error('Error creating admin:', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to create admin' });
                });
        }
    }

    hideDialog() {
        this.displayDialog.set(false);
    }

    confirmDelete(admin: Admin) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete ${admin.name}? This will also delete the Firebase account.`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteAdmin(admin);
            }
        });
    }

    deleteAdmin(admin: Admin) {
        this.adminService
            .deleteAdminAccountAndRecord(admin.id!, admin.email)
            .then(() => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Admin deleted successfully' });
                this.loadAdmins();
            })
            .catch((error: any) => {
                console.error('Error deleting admin:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to delete admin' });
            });
    }
}
