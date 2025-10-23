import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, tap, switchMap } from 'rxjs';

export interface AuthUser {
    id: number;
    username: string;
    password?: string;
    lrn?: string;
    role?: string;
    name?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
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

    login(identifier: string, password: string): Observable<boolean> {
        // Basic validation: do not attempt if empty
        const idTrimmed = (identifier ?? '').trim();
        const pwTrimmed = (password ?? '').trim();
        if (!idTrimmed || !pwTrimmed) {
            return new Observable<boolean>((subscriber) => {
                // Ensure we don't keep stale auth on invalid attempt
                localStorage.removeItem(this.tokenKey);
                localStorage.removeItem(this.userKey);
                subscriber.next(false);
                subscriber.complete();
            });
        }

        // First try to authenticate from users table (for admin, teachers, etc.)
        const q = encodeURIComponent(idTrimmed);
        return this.http.get<AuthUser[]>(`/api/users?username=${q}`).pipe(
            map((users) => {
                if (users.length > 0) {
                    const user = users[0];
                    // Verify password matches
                    if (user.password === pwTrimmed) {
                        return user;
                    }
                }
                return null;
            }),
            tap((user) => {
                if (user) {
                    // Store a fake token and the user
                    localStorage.setItem(this.tokenKey, 'demo-token');
                    localStorage.setItem(this.userKey, JSON.stringify(user));
                } else {
                    localStorage.removeItem(this.tokenKey);
                    localStorage.removeItem(this.userKey);
                }
            }),
            // If not found in users, try to find in students table using LRN
            // The identifier is the LRN and password should equal LRN
            switchMap((user: AuthUser | null) => {
                if (user) {
                    return new Observable<AuthUser | null>((sub) => {
                        sub.next(user);
                        sub.complete();
                    });
                }
                // Try to find student by LRN (where LRN is the username and also the password)
                if (idTrimmed === pwTrimmed) {
                    return this.http.get<any[]>(`/api/students?lrn=${encodeURIComponent(idTrimmed)}`).pipe(
                        map((students) => {
                            if (students.length > 0) {
                                const student = students[0];
                                // Transform student to AuthUser format
                                return {
                                    id: student.id,
                                    username: student.lrn,
                                    lrn: student.lrn,
                                    role: 'student',
                                    name: student.name
                                } as AuthUser;
                            }
                            return null;
                        }),
                        tap((authUser) => {
                            if (authUser) {
                                localStorage.setItem(this.tokenKey, 'demo-token');
                                localStorage.setItem(this.userKey, JSON.stringify(authUser));
                            }
                        })
                    );
                }
                return new Observable<AuthUser | null>((sub) => {
                    sub.next(null);
                    sub.complete();
                });
            }),
            map((user) => !!user)
        );
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        this.router.navigate(['/auth/login']);
    }
}
