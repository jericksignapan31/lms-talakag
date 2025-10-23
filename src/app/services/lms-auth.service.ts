import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { inject } from '@angular/core';
import { Observable, from, of, Subject } from 'rxjs';
import { switchMap, map, tap } from 'rxjs/operators';
import { FirebaseService } from './firebase.service';
import { FirestoreStudentService, Student } from './firestore-student.service';

export interface AuthenticatedUser extends User {
  studentData?: Student | null;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LmsAuthService {
  private firebaseService = inject(FirebaseService);
  private studentService = inject(FirestoreStudentService);
  private auth: Auth;
  private currentUserSubject = new Subject<AuthenticatedUser | null>();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.auth = this.firebaseService.auth;
    this.initAuthStateListener();
  }

  private initAuthStateListener() {
    onAuthStateChanged(this.auth, async (user: User | null) => {
      if (user) {
        // Fetch student data if exists
        const studentData = await this.studentService.getStudentByLRN(user.uid);
        const authUser: AuthenticatedUser = {
          ...user,
          studentData,
          role: studentData ? 'student' : 'admin'
        };
        this.currentUserSubject.next(authUser);
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  /**
   * Login using LRN as username and password
   * LRN = username
   * LRN = password
   * Email format: {lrn}@lms.talakag
   */
  loginWithLRN(lrn: string, password: string): Observable<AuthenticatedUser | null> {
    // Verify password equals LRN
    if (password !== lrn) {
      return new Observable(observer => {
        observer.error(new Error('Invalid credentials'));
        observer.complete();
      });
    }

    const email = `${lrn}@lms.talakag`;
    return from(signInWithEmailAndPassword(this.auth, email, lrn)).pipe(
      switchMap(async result => {
        const studentData = await this.studentService.getStudentByLRN(lrn);
        return {
          ...result.user,
          studentData,
          role: studentData ? 'student' : 'admin'
        } as AuthenticatedUser;
      }),
      tap(user => this.currentUserSubject.next(user))
    );
  }

  /**
   * Login using Email and Password
   * For admin and teachers
   */
  loginWithEmail(email: string, password: string): Observable<AuthenticatedUser | null> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(async result => {
        return {
          ...result.user,
          role: 'admin'
        } as AuthenticatedUser;
      }),
      tap(user => this.currentUserSubject.next(user))
    );
  }

  // LOGOUT
  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      tap(() => this.currentUserSubject.next(null))
    );
  }

  // GET CURRENT USER (Observable)
  getCurrentUser(): Observable<AuthenticatedUser | null> {
    return this.currentUser$;
  }

  // GET CURRENT USER (Sync)
  getCurrentUserSync(): User | null {
    return this.auth.currentUser;
  }

  // IS LOGGED IN
  isLoggedIn(): Observable<boolean> {
    return this.getCurrentUser().pipe(map(user => !!user));
  }

  // GET USER ID TOKEN
  getIdToken(): Observable<string | null> {
    return this.getCurrentUser().pipe(
      switchMap((user: any) => {
        if (user && user.getIdToken) {
          return from(user.getIdToken() as Promise<string>).pipe(map((token: string) => token));
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
