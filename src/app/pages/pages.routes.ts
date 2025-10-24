import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { Students } from './students/students';
import { BorrowingComponent } from './borrowing/borrowing';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'borrowing', component: BorrowingComponent },
    { path: 'empty', component: Empty },
    { path: 'users', component: Students },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
