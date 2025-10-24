import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { Students } from './students/students';
import { BorrowingComponent } from './borrowing/borrowing';
import { TeacherComponent } from './teacher/teacher';
import { AdminComponent } from './admin/admin';
import { RoleGuard } from './auth/role.guard';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'borrowing', component: BorrowingComponent },
    { path: 'teacher', component: TeacherComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'empty', component: Empty },
    { path: 'users', component: Students },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
