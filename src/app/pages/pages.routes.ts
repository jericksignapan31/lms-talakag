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
import { Profile } from './profile/profile';
import { AccountSettings } from './account-settings/account-settings';
import { ReportsComponent } from './reports/reports.component';

export default [
    { path: 'dashboard', component: Dashboard, canActivate: [RoleGuard] },
    { path: 'documentation', component: Documentation, canActivate: [RoleGuard] },
    { path: 'crud', component: Crud, canActivate: [RoleGuard], data: { permission: 'canAccessBooks' } },
    { path: 'borrowing', component: BorrowingComponent, canActivate: [RoleGuard], data: { permission: 'canAccessBorrowing' } },
    { path: 'reports', component: ReportsComponent, canActivate: [RoleGuard], data: { permission: 'canAccessReports' } },
    { path: 'teacher', component: TeacherComponent, canActivate: [RoleGuard], data: { permission: 'canAccessTeacherUsers' } },
    { path: 'admin', component: AdminComponent, canActivate: [RoleGuard], data: { permission: 'canAccessAdminUsers' } },
    { path: 'empty', component: Empty, canActivate: [RoleGuard] },
    { path: 'users', component: Students, canActivate: [RoleGuard], data: { permission: 'canAccessStudentUsers' } },
    { path: 'profile', component: Profile, canActivate: [RoleGuard] },
    { path: 'account-settings', component: AccountSettings, canActivate: [RoleGuard] },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
