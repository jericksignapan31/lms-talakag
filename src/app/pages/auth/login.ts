import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthService } from './auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, SelectModule, AppFloatingConfigurator],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <div class="mb-8 flex justify-center items-center">
                                <img src="https://firebasestorage.googleapis.com/v0/b/mobi-pms.appspot.com/o/IISLogo.png?alt=media&token=db14b8f8-4be9-4941-b61c-568a92c0a3a1" alt="IIS Logo" class="w-24 h-24 shrink-0 object-contain" />
                            </div>
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">
                                Welcome to <br />
                                Indulang Intergated School LMS!
                            </div>
                            <span class="text-muted-color font-medium">Sign in to continue</span>
                        </div>

                        <div>
                            <label for="userType" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">User Type</label>
                            <p-select id="userType" [(ngModel)]="userType" [options]="userTypeOptions" optionLabel="label" optionValue="value" placeholder="Select user type" class="w-full md:w-120 mb-8" />

                            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">
                                {{ userType === 'student' ? 'LRN (Username)' : userType === 'teacher' ? 'Teacher ID (Username)' : 'Email (Username)' }}
                            </label>
                            <input
                                pInputText
                                id="email1"
                                type="text"
                                [placeholder]="userType === 'student' ? 'Enter your LRN' : userType === 'teacher' ? 'Enter your Teacher ID' : 'Enter your email'"
                                class="w-full md:w-120 mb-8"
                                [(ngModel)]="username"
                                required
                            />

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                            <p-password
                                id="password1"
                                [(ngModel)]="password"
                                [placeholder]="userType === 'student' ? 'Enter your LRN or LRN@123' : userType === 'teacher' ? 'Enter your Teacher ID' : 'Enter your password'"
                                [toggleMask]="true"
                                styleClass="mb-4"
                                [fluid]="true"
                                [feedback]="false"
                                [required]="true"
                            ></p-password>

                            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                <div class="flex items-center">
                                    <p-checkbox [(ngModel)]="checked" id="rememberme1" binary class="mr-2"></p-checkbox>
                                    <label for="rememberme1">Remember me</label>
                                </div>
                                <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
                            </div>
                            <p-button label="Sign In" styleClass="w-full" [loading]="loading" [disabled]="!canSubmit || loading" (onClick)="onSubmit()"></p-button>
                            @if (error) {
                                <div class="text-red-500 mt-3">{{ error }}</div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login {
    private auth = inject(AuthService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    username: string = '';
    password: string = '';
    checked: boolean = false;
    userType: string = 'admin';
    loading = false;
    error: string | null = null;

    userTypeOptions = [
        { label: '👨‍🏫 Teacher', value: 'teacher' },
        { label: '⚙️ Admin', value: 'admin' }
    ];

    get canSubmit() {
        return this.username?.trim()?.length > 0 && this.password?.trim()?.length > 0;
    }

    onSubmit() {
        this.error = null;
        this.loading = true;
        if (!this.canSubmit) {
            this.loading = false;
            this.error = 'Please enter username and password.';
            return;
        }

        if (this.userType === 'student') {
            this.auth.login(this.username, this.password).subscribe({
                next: (ok) => {
                    this.loading = false;
                    if (ok) {
                        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
                        this.router.navigate([returnUrl || '/dashboard']);
                    } else {
                        this.error = 'Invalid credentials';
                    }
                },
                error: () => {
                    this.loading = false;
                    this.error = 'Unable to sign in. Please try again.';
                }
            });
        } else if (this.userType === 'teacher') {
            this.auth.loginWithTeacherID(this.username, this.password).subscribe({
                next: (ok) => {
                    this.loading = false;
                    if (ok) {
                        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
                        this.router.navigate([returnUrl || '/dashboard']);
                    } else {
                        this.error = 'Invalid credentials';
                    }
                },
                error: () => {
                    this.loading = false;
                    this.error = 'Unable to sign in. Please try again.';
                }
            });
        } else {
            // Admin login
            this.auth.loginWithEmail(this.username, this.password).subscribe({
                next: (ok) => {
                    this.loading = false;
                    if (ok) {
                        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
                        this.router.navigate([returnUrl || '/dashboard']);
                    } else {
                        this.error = 'Invalid credentials';
                    }
                },
                error: () => {
                    this.loading = false;
                    this.error = 'Unable to sign in. Please try again.';
                }
            });
        }
    }
}
