import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { Students } from './students/students';
import { BorrowingComponent } from './borrowing/borrowing';
import { TeacherComponent } from './teacher/teacher';
import { AdminComponent } from './admin/admin';
import { Dashboard } from './dashboard/dashboard';
import { RoleGuard } from './auth/role.guard';

export default [
    { path: 'dashboard', component: Dashboard },
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud, canActivate: [RoleGuard], data: { permission: 'canAccessBooks' } },
    { path: 'borrowing', component: BorrowingComponent, canActivate: [RoleGuard], data: { permission: 'canAccessBorrowing' } },
    { path: 'teacher', component: TeacherComponent, canActivate: [RoleGuard], data: { permission: 'canAccessTeacherUsers' } },
    { path: 'admin', component: AdminComponent, canActivate: [RoleGuard], data: { permission: 'canAccessAdminUsers' } },
    { path: 'empty', component: Empty },
    { path: 'users', component: Students, canActivate: [RoleGuard], data: { permission: 'canAccessStudentUsers' } },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
