import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthService } from './auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <img [src]="logoPath" alt="IIS Logo" class="mb-8 w-16 shrink-0 mx-auto" />
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome to PrimeLand!</div>
                            <span class="text-muted-color font-medium">Sign in to continue</span>
                            <p class="text-sm text-blue-600 dark:text-blue-400 mt-2">Use your LRN for both username and password</p>
                        </div>

                        <div>
                            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">LRN (Username)</label>
                            <input pInputText id="email1" type="text" placeholder="Enter your LRN" class="w-full md:w-120 mb-8" [(ngModel)]="username" required />

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password (same as LRN)</label>
                            <p-password id="password1" [(ngModel)]="password" placeholder="Enter your LRN" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false" [required]="true"></p-password>

                            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                <div class="flex items-center">
                                    <p-checkbox [(ngModel)]="checked" id="rememberme1" binary class="mr-2"></p-checkbox>
                                    <label for="rememberme1">Remember me</label>
                                </div>
                                <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
                            </div>
                            <p-button label="Sign In" styleClass="w-full" [loading]="loading" [disabled]="!canSubmit || loading" (onClick)="onSubmit()"></p-button>
                            <div *ngIf="error" class="text-red-500 mt-3">{{ error }}</div>
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

    logoPath = 'assets/images/IISLogo.png';

    username: string = '';

    password: string = '';

    checked: boolean = false;

    loading = false;
    error: string | null = null;

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
    }
}
