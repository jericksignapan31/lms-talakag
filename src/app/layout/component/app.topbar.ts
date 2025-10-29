import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { AuthService } from '../../pages/auth/auth.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo">
                <img src="https://firebasestorage.googleapis.com/v0/b/mobi-pms.appspot.com/o/IISLogo.png?alt=media&token=db14b8f8-4be9-4941-b61c-568a92c0a3a1" alt="IIS Logo" class="w-13 h-13 shrink-0 object-contain" />

                <span>LMS - TALAKAG</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <div class="relative inline-block">
                        <button type="button" class="text-left hover:opacity-80 transition-opacity cursor-pointer" (click)="toggleUserMenu()">
                            <span>{{ currentUserName }}</span> <br />
                            <span class="text-xs text-gray-600 dark:text-gray-400 capitalize ">{{ userRole }}</span>
                        </button>
                        <div *ngIf="isUserMenuOpen" class="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-lg shadow-lg z-50">
                            <button type="button" class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-600 flex items-center gap-2" (click)="goToProfile()">
                                <i class="pi pi-user text-sm"></i>
                                <span>Profile</span>
                            </button>
                            <button type="button" class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-600 flex items-center gap-2" (click)="goToAccountSettings()">
                                <i class="pi pi-cog text-sm"></i>
                                <span>Account Settings</span>
                            </button>
                            <hr class="my-1 border-gray-200 dark:border-slate-600" />
                            <button type="button" class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-600 flex items-center gap-2 text-red-600 dark:text-red-400" (click)="logout()">
                                <i class="pi pi-sign-out text-sm"></i>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`
})
export class AppTopbar {
    items!: MenuItem[];
    userMenuItems: MenuItem[] = [];
    currentUserName: string = 'User';
    userRole: string = 'User';
    isUserMenuOpen: boolean = false;
    private authService = inject(AuthService);
    private router = inject(Router);

    constructor(public layoutService: LayoutService) {
        this.initUserMenu();
        this.loadCurrentUser();
    }

    private initUserMenu() {
        this.userMenuItems = [
            {
                label: 'Profile',
                icon: 'pi pi-fw pi-user',
                command: () => this.goToProfile()
            },
            {
                label: 'Logout',
                icon: 'pi pi-fw pi-sign-out',
                command: () => this.logout()
            }
        ];
    }

    private loadCurrentUser() {
        const user = this.authService.currentUser;
        if (user) {
            this.currentUserName = user.name || user.email?.split('@')[0] || 'User';
            this.userRole = user.role || 'User';
        } else {
            this.currentUserName = 'User';
            this.userRole = 'User';
        }
    }

    toggleUserMenu() {
        this.isUserMenuOpen = !this.isUserMenuOpen;
    }

    goToProfile() {
        this.isUserMenuOpen = false;
        this.router.navigate(['/pages/profile']);
    }

    goToAccountSettings() {
        this.isUserMenuOpen = false;
        this.router.navigate(['/pages/account-settings']);
    }

    logout() {
        this.isUserMenuOpen = false;
        this.currentUserName = 'User';
        // Call the logout from AuthService which will handle the page reload
        this.authService.logout().subscribe();
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }
}
