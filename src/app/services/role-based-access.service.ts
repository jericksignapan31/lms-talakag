import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthService } from '../pages/auth/auth.service';

export type UserRole = 'admin' | 'super-admin' | 'teacher' | 'student';

export interface RolePermissions {
    canAccessStudentUsers: boolean;
    canAccessTeacherUsers: boolean;
    canAccessAdminUsers: boolean;
    canAccessBooks: boolean;
    canAccessBorrowing: boolean;
    canAccessBorrowingManagement: boolean;
    canAccessPenalties: boolean;
    canChangeBorrowerType: boolean;
    canFilterBorrowings: boolean;
    canFilterPenalties: boolean;
    canAccessAllData: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class RoleBasedAccessService {
    private authService = inject(AuthService);

    // Get current user role
    getCurrentRole = computed(() => {
        const user = this.authService.currentUser;
        return (user?.role || 'student') as UserRole;
    });

    // Check if current user is admin or super-admin
    isAdmin = computed(() => {
        const role = this.getCurrentRole();
        return role === 'admin' || role === 'super-admin';
    });

    // Check if current user is teacher
    isTeacher = computed(() => {
        return this.getCurrentRole() === 'teacher';
    });

    // Check if current user is student
    isStudent = computed(() => {
        return this.getCurrentRole() === 'student';
    });

    /**
     * Get permissions for a specific role
     */
    getPermissionsForRole(role: UserRole): RolePermissions {
        const permissions: Record<UserRole, RolePermissions> = {
            admin: {
                canAccessStudentUsers: true,
                canAccessTeacherUsers: true,
                canAccessAdminUsers: true,
                canAccessBooks: true,
                canAccessBorrowing: true,
                canAccessBorrowingManagement: true,
                canAccessPenalties: true,
                canChangeBorrowerType: true,
                canFilterBorrowings: true,
                canFilterPenalties: true,
                canAccessAllData: true
            },
            'super-admin': {
                canAccessStudentUsers: true,
                canAccessTeacherUsers: true,
                canAccessAdminUsers: true,
                canAccessBooks: true,
                canAccessBorrowing: true,
                canAccessBorrowingManagement: true,
                canAccessPenalties: true,
                canChangeBorrowerType: true,
                canFilterBorrowings: true,
                canFilterPenalties: true,
                canAccessAllData: true
            },
            teacher: {
                canAccessStudentUsers: false,
                canAccessTeacherUsers: false,
                canAccessAdminUsers: false,
                canAccessBooks: true,
                canAccessBorrowing: true,
                canAccessBorrowingManagement: false,
                canAccessPenalties: true,
                canChangeBorrowerType: false,
                canFilterBorrowings: false,
                canFilterPenalties: false,
                canAccessAllData: false
            },
            student: {
                canAccessStudentUsers: false,
                canAccessTeacherUsers: false,
                canAccessAdminUsers: false,
                canAccessBooks: true,
                canAccessBorrowing: true,
                canAccessBorrowingManagement: false,
                canAccessPenalties: false,
                canChangeBorrowerType: false,
                canFilterBorrowings: false,
                canFilterPenalties: false,
                canAccessAllData: false
            }
        };

        return permissions[role];
    }

    /**
     * Get current user permissions
     */
    getCurrentPermissions = computed(() => {
        return this.getPermissionsForRole(this.getCurrentRole());
    });

    /**
     * Check if can access a specific feature
     */
    canAccess(feature: keyof RolePermissions): boolean {
        return this.getCurrentPermissions()[feature];
    }

    /**
     * Check if user should see all borrowings or only their own
     */
    shouldFilterByCurrentUser(): boolean {
        return !this.isAdmin();
    }

    /**
     * Get current user identifier (LRN for student, TeacherID for teacher, Email for admin)
     */
    getCurrentUserIdentifier(): string | undefined {
        const user = this.authService.currentUser;
        if (!user) return undefined;

        const role = user.role || 'student';
        if (role === 'student') return user.lrn;
        if (role === 'teacher') return user.teacherID;
        if (role === 'admin' || role === 'super-admin') return user.email;

        return undefined;
    }

    /**
     * Get current user type for filtering
     */
    getCurrentUserType(): 'student' | 'teacher' | 'admin' | undefined {
        const role = this.getCurrentRole();
        if (role === 'student') return 'student';
        if (role === 'teacher') return 'teacher';
        if (role === 'admin' || role === 'super-admin') return 'admin';
        return undefined;
    }

    /**
     * Get current role as a plain value (for use in guards and other non-computed contexts)
     */
    getRoleValue(): UserRole {
        return this.getCurrentRole();
    }
}
