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
        @for (item of filteredModel(); let i = $index; track i) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [index]="i" [root]="true"></li>
            }
            @if (item.separator) {
                <li class="menu-separator"></li>
            }
        }
    </ul> `
})
export class AppMenu implements OnInit {
    private rbacService = inject(RoleBasedAccessService);
    model: MenuItem[] = [];

    // Filter menu based on role
    filteredModel = computed(() => {
        const perms = this.rbacService.getCurrentPermissions();
        const role = this.rbacService.getCurrentRole();

        console.log('Current Role:', role);
        console.log('Current Permissions:', perms);

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

        console.log('Pages Items:', pagesItems);

        // Return filtered model
        return [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                items: pagesItems
            }
        ] as MenuItem[];
    });

    ngOnInit() {
        // Initial model setup (will be filtered by computed property)
        this.model = [];
    }
}
