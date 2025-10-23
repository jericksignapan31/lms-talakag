import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, onAuthStateChanged, User, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { inject } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { FirebaseService } from './firebase.service';

@Injectable({
    providedIn: 'root'
})
export class FirebaseAuthService {
    private firebaseService = inject(FirebaseService);
    private auth: Auth;

    constructor() {
        this.auth = this.firebaseService.auth;
    }

    // LOGIN
    login(email: string, password: string): Observable<User | null> {
        return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(map((result) => result.user));
    }

    // REGISTER
    register(email: string, password: string): Observable<User | null> {
        return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(map((result) => result.user));
    }

    // LOGOUT
    logout(): Observable<void> {
        return from(signOut(this.auth));
    }

    // GET CURRENT USER
    getCurrentUser(): Observable<User | null> {
        return new Observable((observer) => {
            const unsubscribe = onAuthStateChanged(this.auth, (user: User | null) => {
                observer.next(user);
            });
            return () => unsubscribe();
        });
    }

    // GET CURRENT USER (Sync)
    getCurrentUserSync(): User | null {
        return this.auth.currentUser;
    }

    // IS LOGGED IN
    isLoggedIn(): Observable<boolean> {
        return this.getCurrentUser().pipe(map((user) => !!user));
    }

    // GET USER ID TOKEN
    getIdToken(): Observable<string | null> {
        return this.getCurrentUser().pipe(
            switchMap((user) => {
                if (user) {
                    return from(user.getIdToken()).pipe(map((token) => token));
                }
                return of(null);
            })
        );
    }

    // UPDATE USER PROFILE
    async updateUserProfile(displayName: string, photoURL?: string): Promise<void> {
        const user = this.auth.currentUser;
        if (user) {
            return updateProfile(user, {
                displayName,
                photoURL
            });
        }
    }

    // SEND PASSWORD RESET EMAIL
    async sendPasswordResetEmailToUser(email: string): Promise<void> {
        return await sendPasswordResetEmail(this.auth, email);
    }

    // DELETE USER ACCOUNT
    async deleteUserAccount(): Promise<void> {
        const user = this.auth.currentUser;
        if (user) {
            await user.delete();
        }
    }
}
