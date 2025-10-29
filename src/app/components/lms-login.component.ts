import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LmsAuthService } from '../services/lms-auth.service';

@Component({
    selector: 'app-lms-login',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, CardModule, ToastModule],
    providers: [MessageService],
    template: `
        <div class="login-container">
            <div class="login-card">
                <h1>Indulang Intergated School LMS</h1>
                <h2>Student Login</h2>

                <div *ngIf="messages.length > 0" [ngClass]="'alert-' + messages[0].severity" class="alert">
                    <strong>{{ messages[0].summary }}:</strong> {{ messages[0].detail }}
                </div>
                <div class="form-group">
                    <label for="lrn">LRN (Learner Reference Number)</label>
                    <input id="lrn" pInputText type="text" [(ngModel)]="lrn" placeholder="Enter your LRN" (keyup.enter)="login()" class="w-full" />
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <p class="hint">⚠️ Your password is your LRN. For security, change it after login.</p>
                    <input id="password" pInputText type="password" [(ngModel)]="password" placeholder="Enter password (same as LRN)" (keyup.enter)="login()" class="w-full" />
                </div>

                <button pButton type="button" label="Login" icon="pi pi-sign-in" (click)="login()" [loading]="loading" class="w-full"></button>

                <div class="info-box">
                    <h4>Login Information:</h4>
                    <ul>
                        <li><strong>Username:</strong> Your LRN (Learner Reference Number)</li>
                        <li><strong>Password:</strong> Your LRN</li>
                        <li><strong>Example:</strong> LRN: 1234567890 → Password: 1234567890</li>
                    </ul>
                </div>

                <div class="admin-section">
                    <hr />
                    <h3>Administrator Login</h3>
                    <p>For admin/teacher access, use your email and password:</p>
                    <button pButton type="button" label="Admin Login" icon="pi pi-user-admin" (click)="toggleAdminLogin()" class="p-button-secondary w-full"></button>

                    <div *ngIf="showAdminLogin" class="admin-form">
                        <div class="form-group">
                            <label>Email</label>
                            <input pInputText type="email" [(ngModel)]="adminEmail" placeholder="Enter admin email" class="w-full" />
                        </div>

                        <div class="form-group">
                            <label>Password</label>
                            <input pInputText type="password" [(ngModel)]="adminPassword" placeholder="Enter password" (keyup.enter)="loginAdmin()" class="w-full" />
                        </div>

                        <button pButton type="button" label="Login as Admin" icon="pi pi-sign-in" (click)="loginAdmin()" [loading]="loading" class="w-full"></button>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            :host ::ng-deep {
                .login-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 1rem;

                    .login-card {
                        background: white;
                        border-radius: 8px;
                        padding: 2rem;
                        width: 100%;
                        max-width: 500px;
                        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);

                        h1 {
                            text-align: center;
                            color: #333;
                            margin-bottom: 0.5rem;
                            font-size: 2rem;
                        }

                        h2 {
                            text-align: center;
                            color: #667eea;
                            margin-bottom: 2rem;
                            font-size: 1.5rem;
                        }

                        .form-group {
                            margin-bottom: 1.5rem;

                            label {
                                display: block;
                                margin-bottom: 0.5rem;
                                font-weight: 600;
                                color: #333;
                            }

                            .hint {
                                font-size: 0.85rem;
                                color: #f39c12;
                                margin: 0.25rem 0 0.5rem 0;
                                font-style: italic;
                            }

                            input {
                                width: 100%;
                                padding: 0.75rem;
                                border: 1px solid #ddd;
                                border-radius: 4px;
                                font-size: 1rem;

                                &:focus {
                                    outline: none;
                                    border-color: #667eea;
                                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                                }
                            }
                        }

                        button {
                            width: 100%;
                            padding: 0.75rem;
                            font-size: 1rem;
                            font-weight: 600;
                            border-radius: 4px;
                            cursor: pointer;
                            transition: all 0.3s ease;

                            &:hover:not(:disabled) {
                                transform: translateY(-2px);
                                box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3);
                            }

                            &:disabled {
                                opacity: 0.6;
                                cursor: not-allowed;
                            }
                        }

                        .info-box {
                            background: #f0f4ff;
                            border-left: 4px solid #667eea;
                            padding: 1rem;
                            margin: 1.5rem 0;
                            border-radius: 4px;

                            h4 {
                                margin-top: 0;
                                color: #667eea;
                            }

                            ul {
                                list-style: none;
                                padding: 0;
                                margin: 0;

                                li {
                                    padding: 0.5rem 0;
                                    color: #555;

                                    &:before {
                                        content: '→ ';
                                        color: #667eea;
                                        font-weight: bold;
                                        margin-right: 0.5rem;
                                    }

                                    strong {
                                        color: #333;
                                    }
                                }
                            }
                        }

                        .admin-section {
                            margin-top: 2rem;

                            hr {
                                border: none;
                                border-top: 2px solid #eee;
                                margin: 1.5rem 0;
                            }

                            h3 {
                                color: #333;
                                font-size: 1.2rem;
                                margin-bottom: 0.5rem;
                            }

                            p {
                                color: #666;
                                margin-bottom: 1rem;
                            }

                            .admin-form {
                                margin-top: 1.5rem;
                                padding-top: 1.5rem;
                                border-top: 1px solid #eee;
                            }
                        }

                        .w-full {
                            width: 100%;
                        }
                    }
                }

                .p-message {
                    margin-bottom: 1rem;
                }
            }
        `
    ]
})
export class LmsLoginComponent {
    private authService = inject(LmsAuthService);
    private router = inject(Router);
    private messageService = inject(MessageService);

    lrn = '';
    password = '';
    adminEmail = '';
    adminPassword = '';
    loading = false;
    showAdminLogin = false;
    messages: any[] = [];

    async login() {
        if (!this.lrn || !this.password) {
            this.showMessage('error', 'Required Fields', 'Please enter LRN and password');
            return;
        }

        try {
            this.loading = true;
            this.authService.loginWithLRN(this.lrn, this.password).subscribe({
                next: (user) => {
                    if (user) {
                        this.showMessage('success', 'Success', `Welcome, ${user.studentData?.name || 'Student'}!`);
                        setTimeout(() => {
                            this.router.navigate(['/dashboard']);
                        }, 1500);
                    }
                },
                error: (error) => {
                    console.error('Login error:', error);
                    this.showMessage('error', 'Login Failed', 'Invalid LRN or password');
                    this.loading = false;
                }
            });
        } catch (error: any) {
            this.showMessage('error', 'Error', error.message || 'Login failed');
            this.loading = false;
        }
    }

    async loginAdmin() {
        if (!this.adminEmail || !this.adminPassword) {
            this.showMessage('error', 'Required Fields', 'Please enter email and password');
            return;
        }

        try {
            this.loading = true;
            this.authService.loginWithEmail(this.adminEmail, this.adminPassword).subscribe({
                next: (user) => {
                    if (user) {
                        this.showMessage('success', 'Success', 'Admin login successful!');
                        setTimeout(() => {
                            this.router.navigate(['/admin-dashboard']);
                        }, 1500);
                    }
                },
                error: (error) => {
                    console.error('Admin login error:', error);
                    this.showMessage('error', 'Login Failed', 'Invalid email or password');
                    this.loading = false;
                }
            });
        } catch (error: any) {
            this.showMessage('error', 'Error', error.message || 'Login failed');
            this.loading = false;
        }
    }

    toggleAdminLogin() {
        this.showAdminLogin = !this.showAdminLogin;
    }

    private showMessage(severity: string, summary: string, detail: string) {
        this.messages = [
            {
                severity,
                summary,
                detail,
                life: 3000
            }
        ];
    }
}
