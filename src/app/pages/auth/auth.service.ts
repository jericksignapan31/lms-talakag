import { Injectable, inject, effect } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, of, interval } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
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

export interface TokenData {
    token: string;
    expiresAt: number; // Unix timestamp
    issuedAt: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private lmsAuth = inject(LmsAuthService);
    private router = inject(Router);

    // Token configuration (in minutes)
    private readonly TOKEN_EXPIRY_TIME = 60; // Token expires after 60 minutes
    private readonly TOKEN_REFRESH_THRESHOLD = 10; // Refresh token 10 minutes before expiry
    private readonly REFRESH_CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes

    private readonly tokenKey = 'auth_token';
    private readonly userKey = 'auth_user';
    private refreshTokenTimeout: any;

    constructor() {
        // Initialize token validation on service creation
        this.validateTokenOnStartup();
        this.setupTokenRefreshTimer();
    }

    /**
     * Validate token on app startup
     */
    private validateTokenOnStartup(): void {
        const tokenData = this.getTokenData();
        if (tokenData) {
            if (this.isTokenExpired(tokenData)) {
                console.log('Token expired on startup, logging out');
                this.logout();
            } else {
                console.log('Token valid on startup');
                this.scheduleTokenRefresh(tokenData);
            }
        }
    }

    /**
     * Setup automatic token refresh timer
     */
    private setupTokenRefreshTimer(): void {
        interval(this.REFRESH_CHECK_INTERVAL).subscribe(() => {
            const tokenData = this.getTokenData();
            if (tokenData && !this.isTokenExpired(tokenData)) {
                const timeUntilExpiry = (tokenData.expiresAt - Date.now()) / 1000 / 60; // minutes
                if (timeUntilExpiry <= this.TOKEN_REFRESH_THRESHOLD) {
                    console.log(`Token expires in ${timeUntilExpiry.toFixed(1)} minutes, refreshing...`);
                    this.refreshToken();
                }
            }
        });
    }

    /**
     * Schedule token refresh before expiry
     */
    private scheduleTokenRefresh(tokenData: TokenData): void {
        // Clear existing timeout
        if (this.refreshTokenTimeout) {
            clearTimeout(this.refreshTokenTimeout);
        }

        const now = Date.now();
        const expiresAt = tokenData.expiresAt;
        const refreshTime = expiresAt - this.TOKEN_REFRESH_THRESHOLD * 60 * 1000;
        const timeUntilRefresh = refreshTime - now;

        if (timeUntilRefresh > 0) {
            this.refreshTokenTimeout = setTimeout(() => {
                console.log('Scheduled token refresh triggered');
                this.refreshToken();
            }, timeUntilRefresh);
        }
    }

    /**
     * Refresh the token
     */
    private refreshToken(): void {
        const tokenData = this.getTokenData();
        if (tokenData && !this.isTokenExpired(tokenData)) {
            const newTokenData = this.generateTokenData();
            this.saveTokenData(newTokenData);
            this.scheduleTokenRefresh(newTokenData);
            console.log('Token refreshed successfully');
        }
    }

    /**
     * Generate new token data with expiry time
     */
    private generateTokenData(): TokenData {
        const now = Date.now();
        return {
            token: 'firebase-token-' + Math.random().toString(36).substr(2, 9),
            issuedAt: now,
            expiresAt: now + this.TOKEN_EXPIRY_TIME * 60 * 1000 // Expire in X minutes
        };
    }

    /**
     * Save token data to secure storage
     */
    private saveTokenData(tokenData: TokenData): void {
        try {
            sessionStorage.setItem(this.tokenKey, JSON.stringify(tokenData));
        } catch (e) {
            console.error('Error saving token:', e);
            localStorage.setItem(this.tokenKey, JSON.stringify(tokenData));
        }
    }

    /**
     * Get token data from secure storage
     */
    private getTokenData(): TokenData | null {
        try {
            let data = sessionStorage.getItem(this.tokenKey);
            if (!data) {
                data = localStorage.getItem(this.tokenKey);
            }
            return data ? (JSON.parse(data) as TokenData) : null;
        } catch (e) {
            console.error('Error retrieving token:', e);
            return null;
        }
    }

    /**
     * Check if token is expired
     */
    private isTokenExpired(tokenData: TokenData): boolean {
        return Date.now() > tokenData.expiresAt;
    }

    get isLoggedIn(): boolean {
        const tokenData = this.getTokenData();
        if (!tokenData) return false;

        if (this.isTokenExpired(tokenData)) {
            this.logout();
            return false;
        }
        return true;
    }

    get currentUser(): AuthUser | null {
        const raw = sessionStorage.getItem(this.userKey) || localStorage.getItem(this.userKey);
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
            this.clearAuthData();
            return of(false);
        }

        // Use Firebase LMS Auth Service
        return this.lmsAuth.loginWithLRN(lrnTrimmed, pwTrimmed).pipe(
            tap((user) => {
                if (user) {
                    // Generate and save token with expiry
                    const tokenData = this.generateTokenData();
                    this.saveTokenData(tokenData);

                    const authUser: AuthUser = {
                        id: user.uid,
                        username: lrnTrimmed,
                        lrn: lrnTrimmed,
                        role: user.role || 'student',
                        name: user.studentData?.name || user.displayName || '',
                        email: user.email || ''
                    };
                    try {
                        sessionStorage.setItem(this.userKey, JSON.stringify(authUser));
                    } catch {
                        localStorage.setItem(this.userKey, JSON.stringify(authUser));
                    }

                    // Schedule token refresh
                    this.scheduleTokenRefresh(tokenData);

                    // Navigate to dashboard after successful login
                    setTimeout(() => this.router.navigate(['/pages/crud']), 300);
                } else {
                    this.clearAuthData();
                }
            }),
            map((user) => !!user),
            catchError((error) => {
                console.error('Login error:', error);
                this.clearAuthData();
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
            this.clearAuthData();
            return of(false);
        }

        return this.lmsAuth.loginWithTeacherID(teacherIDTrimmed, pwTrimmed).pipe(
            tap((user) => {
                if (user) {
                    // Generate and save token with expiry
                    const tokenData = this.generateTokenData();
                    this.saveTokenData(tokenData);

                    const authUser: AuthUser = {
                        id: user.uid,
                        username: teacherIDTrimmed,
                        teacherID: teacherIDTrimmed,
                        role: user.role || 'teacher',
                        name: (user as any).name || user.displayName || '',
                        email: user.email || ''
                    };
                    try {
                        sessionStorage.setItem(this.userKey, JSON.stringify(authUser));
                    } catch {
                        localStorage.setItem(this.userKey, JSON.stringify(authUser));
                    }

                    // Schedule token refresh
                    this.scheduleTokenRefresh(tokenData);

                    // Navigate to dashboard after successful login
                    setTimeout(() => this.router.navigate(['/pages/crud']), 300);
                } else {
                    this.clearAuthData();
                }
            }),
            map((user) => !!user),
            catchError((error) => {
                console.error('Login error:', error);
                this.clearAuthData();
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
            this.clearAuthData();
            return of(false);
        }

        return this.lmsAuth.loginWithEmail(emailTrimmed, pwTrimmed).pipe(
            tap((user) => {
                if (user) {
                    // Generate and save token with expiry
                    const tokenData = this.generateTokenData();
                    this.saveTokenData(tokenData);

                    const authUser: AuthUser = {
                        id: user.uid,
                        username: emailTrimmed,
                        email: emailTrimmed,
                        role: user.role || 'admin',
                        name: user.displayName || ''
                    };
                    try {
                        sessionStorage.setItem(this.userKey, JSON.stringify(authUser));
                    } catch {
                        localStorage.setItem(this.userKey, JSON.stringify(authUser));
                    }

                    // Schedule token refresh
                    this.scheduleTokenRefresh(tokenData);

                    // Navigate to dashboard after successful login
                    setTimeout(() => this.router.navigate(['/pages/crud']), 300);
                } else {
                    this.clearAuthData();
                }
            }),
            map((user) => !!user),
            catchError((error) => {
                console.error('Login error:', error);
                this.clearAuthData();
                return of(false);
            })
        );
    }

    /**
     * Logout and clear all auth data
     */
    logout(): void {
        if (this.refreshTokenTimeout) {
            clearTimeout(this.refreshTokenTimeout);
        }
        this.lmsAuth.logout().subscribe(() => {
            this.clearAuthData();
            this.router.navigate(['/auth/login']);
        });
    }

    /**
     * Clear all authentication data
     */
    private clearAuthData(): void {
        sessionStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.tokenKey);
        sessionStorage.removeItem(this.userKey);
        localStorage.removeItem(this.userKey);
    }
}
