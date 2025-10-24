import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { RoleBasedAccessService } from '../../services/role-based-access.service';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {
    private rbacService = inject(RoleBasedAccessService);
    private router = inject(Router);
    private messageService = inject(MessageService, { optional: true });

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const requiredRole = route.data['role'] as string | undefined;
        const requiredPermission = route.data['permission'] as string | undefined;

        // If no role or permission is specified, allow access
        if (!requiredRole && !requiredPermission) {
            return true;
        }

        // Check role-based access
        if (requiredRole) {
            const currentRole = this.rbacService.getRoleValue();
            if (currentRole !== requiredRole && !(requiredRole === 'admin' && currentRole === 'super-admin')) {
                if (this.messageService) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Access Denied',
                        detail: `You don't have permission to access this page. Required role: ${requiredRole}`
                    });
                }
                this.router.navigate(['/']);
                return false;
            }
        }

        // Check permission-based access
        if (requiredPermission) {
            const hasPermission = this.rbacService.canAccess(requiredPermission as any);
            if (!hasPermission) {
                if (this.messageService) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Access Denied',
                        detail: "You don't have permission to access this page."
                    });
                }
                this.router.navigate(['/']);
                return false;
            }
        }

        return true;
    }
}
