import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            @if (!item.separator) {
                <li app-menuitem [item]="item" [index]="i" [root]="true"></li>
            }
            @if (item.separator) {
                <li class="menu-separator"></li>
            }
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: [] }]
            },

            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Books',
                        icon: 'pi pi-fw pi-address-book',
                        routerLink: ['/pages/crud']
                    },
                    {
                        label: 'Book Borrowing',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/pages/borrowing']
                    },
                    {
                        label: 'Student Users',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/pages/users']
                    },
                    {
                        label: 'Teacher Users',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/pages/teacher']
                    }
                ]
            }
        ];
    }
}
