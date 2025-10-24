import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { Students } from './students/students';
import { BorrowingComponent } from './borrowing/borrowing';
import { TeacherComponent } from './teacher/teacher';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'borrowing', component: BorrowingComponent },
    { path: 'teacher', component: TeacherComponent },
    { path: 'empty', component: Empty },
    { path: 'users', component: Students },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
