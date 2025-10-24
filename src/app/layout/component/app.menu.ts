import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { RoleBasedAccessService } from '../../services/role-based-access.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of filteredModel(); let i = index">
            <ng-container *ngIf="!item.separator">
                <li app-menuitem [item]="item" [index]="i" [root]="true"></li>
            </ng-container>
            <ng-container *ngIf="item.separator">
                <li class="menu-separator"></li>
            </ng-container>
        </ng-container>
    </ul> `
})
export class AppMenu implements OnInit {
    private rbacService = inject(RoleBasedAccessService);
    model: MenuItem[] = [];

    // Filter menu based on role
    filteredModel = computed(() => {
        const perms = this.rbacService.getCurrentPermissions();

        // Build filtered Pages submenu
        const pagesItems: MenuItem[] = [];

        // Books - always available for authenticated users
        if (perms.canAccessBooks) {
            pagesItems.push({
                label: 'Books',
                icon: 'pi pi-fw pi-address-book',
                routerLink: ['/pages/crud']
            });
        }

        // Book Borrowing - always available for authenticated users
        if (perms.canAccessBorrowing) {
            pagesItems.push({
                label: 'Book Borrowing',
                icon: 'pi pi-fw pi-book',
                routerLink: ['/pages/borrowing']
            });
        }

        // Student Users - admin only
        if (perms.canAccessStudentUsers) {
            pagesItems.push({
                label: 'Student Users',
                icon: 'pi pi-fw pi-users',
                routerLink: ['/pages/users']
            });
        }

        // Teacher Users - admin only
        if (perms.canAccessTeacherUsers) {
            pagesItems.push({
                label: 'Teacher Users',
                icon: 'pi pi-fw pi-id-card',
                routerLink: ['/pages/teacher']
            });
        }

        // Admin Users - admin only
        if (perms.canAccessAdminUsers) {
            pagesItems.push({
                label: 'Admin Users',
                icon: 'pi pi-fw pi-cog',
                routerLink: ['/pages/admin']
            });
        }

        // Return filtered model
        return [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: [] }]
            },
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: pagesItems
            }
        ] as MenuItem[];
    });

    ngOnInit() {
        // Initial model setup (will be filtered by computed property)
        this.model = [];
    }
}
