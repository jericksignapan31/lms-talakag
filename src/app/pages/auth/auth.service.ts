import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LmsAuthService } from '../../services/lms-auth.service';

export interface AuthUser {
    id?: string;
    username: string;
    password?: string;
    lrn?: string;
    teacherID?: string;
    email?: string;
    role?: string;
    name?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private lmsAuth = inject(LmsAuthService);
    private router = inject(Router);
    private readonly tokenKey = 'auth_token';
    private readonly userKey = 'auth_user';

    get isLoggedIn(): boolean {
        return !!localStorage.getItem(this.tokenKey);
    }

    get currentUser(): AuthUser | null {
        const raw = localStorage.getItem(this.userKey);
        return raw ? (JSON.parse(raw) as AuthUser) : null;
    }

    /**
     * Login using LRN as both username and password
     * Uses Firebase Authentication + Firestore
     */
    login(lrn: string, password: string): Observable<boolean> {
        // Validate input
        const lrnTrimmed = (lrn ?? '').trim();
        const pwTrimmed = (password ?? '').trim();

        if (!lrnTrimmed || !pwTrimmed) {
            localStorage.removeItem(this.tokenKey);
            localStorage.removeItem(this.userKey);
            return of(false);
        }

        // Use Firebase LMS Auth Service
        return this.lmsAuth.loginWithLRN(lrnTrimmed, pwTrimmed).pipe(
            tap((user) => {
                if (user) {
                    // Store auth token and user data
                    localStorage.setItem(this.tokenKey, 'firebase-token');
                    const authUser: AuthUser = {
                        id: user.uid,
                        username: lrnTrimmed,
                        lrn: lrnTrimmed,
                        role: user.role || 'student',
                        name: user.studentData?.name || user.displayName || '',
                        email: user.email || ''
                    };
                    localStorage.setItem(this.userKey, JSON.stringify(authUser));
                } else {
                    localStorage.removeItem(this.tokenKey);
                    localStorage.removeItem(this.userKey);
                }
            }),
            map((user) => !!user),
            catchError((error) => {
                console.error('Login error:', error);
                localStorage.removeItem(this.tokenKey);
                localStorage.removeItem(this.userKey);
                return of(false);
            })
        );
    }

    /**
     * Login using TeacherID as both username and password
     */
    loginWithTeacherID(teacherID: string, password: string): Observable<boolean> {
        const teacherIDTrimmed = (teacherID ?? '').trim();
        const pwTrimmed = (password ?? '').trim();

        if (!teacherIDTrimmed || !pwTrimmed) {
            localStorage.removeItem(this.tokenKey);
            localStorage.removeItem(this.userKey);
            return of(false);
        }

        return this.lmsAuth.loginWithTeacherID(teacherIDTrimmed, pwTrimmed).pipe(
            tap((user) => {
                if (user) {
                    localStorage.setItem(this.tokenKey, 'firebase-token');
                    const authUser: AuthUser = {
                        id: user.uid,
                        username: teacherIDTrimmed,
                        teacherID: teacherIDTrimmed,
                        role: user.role || 'teacher',
                        name: user.displayName || '',
                        email: user.email || ''
                    };
                    localStorage.setItem(this.userKey, JSON.stringify(authUser));
                } else {
                    localStorage.removeItem(this.tokenKey);
                    localStorage.removeItem(this.userKey);
                }
            }),
            map((user) => !!user),
            catchError((error) => {
                console.error('Login error:', error);
                localStorage.removeItem(this.tokenKey);
                localStorage.removeItem(this.userKey);
                return of(false);
            })
        );
    }

    /**
     * Login using Email and Password for Admin
     */
    loginWithEmail(email: string, password: string): Observable<boolean> {
        const emailTrimmed = (email ?? '').trim();
        const pwTrimmed = (password ?? '').trim();

        if (!emailTrimmed || !pwTrimmed) {
            localStorage.removeItem(this.tokenKey);
            localStorage.removeItem(this.userKey);
            return of(false);
        }

        return this.lmsAuth.loginWithEmail(emailTrimmed, pwTrimmed).pipe(
            tap((user) => {
                if (user) {
                    localStorage.setItem(this.tokenKey, 'firebase-token');
                    const authUser: AuthUser = {
                        id: user.uid,
                        username: emailTrimmed,
                        email: emailTrimmed,
                        role: user.role || 'admin',
                        name: user.displayName || ''
                    };
                    localStorage.setItem(this.userKey, JSON.stringify(authUser));
                } else {
                    localStorage.removeItem(this.tokenKey);
                    localStorage.removeItem(this.userKey);
                }
            }),
            map((user) => !!user),
            catchError((error) => {
                console.error('Login error:', error);
                localStorage.removeItem(this.tokenKey);
                localStorage.removeItem(this.userKey);
                return of(false);
            })
        );
    }

    logout(): void {
        this.lmsAuth.logout().subscribe(() => {
            localStorage.removeItem(this.tokenKey);
            localStorage.removeItem(this.userKey);
            this.router.navigate(['/auth/login']);
        });
    }
}
