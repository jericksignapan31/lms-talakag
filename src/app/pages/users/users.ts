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
import { MessageService } from 'primeng/api';

interface User {
    id: number;
    username: string;
    password?: string;
    role: string;
    name: string;
}

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, TableModule, InputTextModule, IconFieldModule, InputIconModule, ToolbarModule, ToastModule, TagModule],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>
        <div class="card">
            <p-toolbar class="mb-6">
                <ng-template pTemplate="left">
                    <h5>Users Management</h5>
                </ng-template>
            </p-toolbar>

            <p-table #dt [value]="users" [rows]="10" [paginator]="true" [globalFilterFields]="['username', 'name', 'role']" [tableStyle]="{ 'min-width': '75rem' }" responsiveLayout="scroll">
                <ng-template pTemplate="caption">
                    <div class="flex items-center justify-between">
                        <span class="p-input-icon-left ml-auto">
                            <i class="pi pi-search"></i>
                            <input pInputText type="text" (input)="dt.filterGlobal($event, 'contains')" placeholder="Search users..." />
                        </span>
                    </div>
                </ng-template>

                <ng-template pTemplate="header">
                    <tr>
                        <th pSortableColumn="id">ID <p-sortIcon field="id"></p-sortIcon></th>
                        <th pSortableColumn="username">Username <p-sortIcon field="username"></p-sortIcon></th>
                        <th pSortableColumn="name">Full Name <p-sortIcon field="name"></p-sortIcon></th>
                        <th pSortableColumn="role">Role <p-sortIcon field="role"></p-sortIcon></th>
                    </tr>
                </ng-template>

                <ng-template pTemplate="body" let-user>
                    <tr>
                        <td>{{ user.id }}</td>
                        <td>{{ user.username }}</td>
                        <td>{{ user.name }}</td>
                        <td>
                            <p-tag [value]="user.role" [severity]="getSeverity(user.role)"></p-tag>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
export class Users implements OnInit {
    private http = inject(HttpClient);
    private messageService = inject(MessageService);

    users: User[] = [];

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.http.get<User[]>('/api/users').subscribe({
            next: (data) => {
                this.users = data;
            },
            error: (err) => {
                console.error('Failed to load users:', err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load users' });
            }
        });
    }

    getSeverity(role: string) {
        switch (role?.toLowerCase()) {
            case 'admin':
                return 'danger';
            case 'teacher':
                return 'warning';
            case 'student':
                return 'info';
            default:
                return 'secondary';
        }
    }
}
