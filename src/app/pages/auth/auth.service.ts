import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';

export interface AuthUser {
    id: number;
    username: string;
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

        // Try match by username first. For demo, we also accept identifier as email if present in db.json.
        const q = encodeURIComponent(idTrimmed);
        const p = encodeURIComponent(pwTrimmed);
        // Query both username and email fields via _or if supported; since json-server doesn't support _or by default,
        // we do two queries sequentially by expanding with like match using q param (kept simple here by username).
        return this.http.get<AuthUser[]>(`/api/users?username=${q}&password=${p}`).pipe(
            map((users) => users[0] ?? null),
            tap((user) => {
                if (user) {
                    // Store a fake token and the user
                    localStorage.setItem(this.tokenKey, 'demo-token');
                    localStorage.setItem(this.userKey, JSON.stringify(user));
                }
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
