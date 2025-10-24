import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, updateProfile, sendPasswordResetEmail, createUserWithEmailAndPassword } from 'firebase/auth';
import { inject } from '@angular/core';
import { Observable, from, of, Subject, throwError } from 'rxjs';
import { switchMap, map, tap, catchError } from 'rxjs/operators';
import { FirebaseService } from './firebase.service';
import { FirestoreStudentService, Student } from './firestore-student.service';
import { collection, query, where, getDocs } from 'firebase/firestore';

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
                // Determine role based on email format and fetch from database
                let role = 'student';
                let userData: any = null;

                if (user.email?.includes('@lms.talakag')) {
                    // Extract identifier from email
                    const identifier = user.email.split('@')[0];

                    // Check if it's a student (has student data)
                    const studentData = await this.studentService.getStudentByLRN(identifier);
                    if (studentData) {
                        role = studentData.role || 'student';
                        userData = studentData;
                    } else {
                        // Try teacher lookup
                        try {
                            const firestore = this.firebaseService.firestore;
                            const teachersRef = collection(firestore, 'teachers');
                            const q = query(teachersRef, where('teacherID', '==', identifier));
                            const querySnapshot = await getDocs(q);

                            if (!querySnapshot.empty) {
                                const teacherDoc = querySnapshot.docs[0];
                                const teacherData = teacherDoc.data();
                                role = (teacherData as any)['role'] || 'teacher';
                                userData = teacherData;
                            }
                        } catch (error) {
                            console.error('Error fetching teacher data:', error);
                        }
                    }
                } else {
                    // Check if admin by email
                    try {
                        const firestore = this.firebaseService.firestore;
                        const adminsRef = collection(firestore, 'admins');
                        const q = query(adminsRef, where('email', '==', user.email));
                        const querySnapshot = await getDocs(q);

                        if (!querySnapshot.empty) {
                            const adminDoc = querySnapshot.docs[0];
                            const adminData = adminDoc.data();
                            role = (adminData as any)['role'] || 'admin';
                            userData = adminData;
                        }
                    } catch (error) {
                        console.error('Error fetching admin data:', error);
                    }
                }

                const authUser: AuthenticatedUser = {
                    ...user,
                    studentData: userData as Student | undefined,
                    role
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
     * Password can be either: {lrn} (old) or {lrn}@123 (new)
     * Email format: {lrn}@lms.talakag
     * Fetches student data and role from Firestore
     */
    loginWithLRN(lrn: string, password: string): Observable<AuthenticatedUser | null> {
        const email = `${lrn}@lms.talakag`;

        // Try new password format first: {lrn}@123
        const newPasswordFormat = `${lrn}@123`;
        // Also try old password format for backward compatibility: {lrn}
        const oldPasswordFormat = lrn;

        // Try new format first
        return from(signInWithEmailAndPassword(this.auth, email, newPasswordFormat)).pipe(
            switchMap(async (result) => {
                const studentData = await this.studentService.getStudentByLRN(lrn);
                const role = studentData?.role || 'student'; // Get role from student data
                return {
                    ...result.user,
                    studentData,
                    role,
                    lrn,
                    name: studentData?.name || result.user.displayName || ''
                } as AuthenticatedUser;
            }),
            tap((user) => this.currentUserSubject.next(user)),
            // If new format fails, try old format
            catchError((error) => {
                // Only retry with old format if it's an auth error
                if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                    return from(signInWithEmailAndPassword(this.auth, email, oldPasswordFormat)).pipe(
                        switchMap(async (result) => {
                            const studentData = await this.studentService.getStudentByLRN(lrn);
                            const role = studentData?.role || 'student'; // Get role from student data
                            return {
                                ...result.user,
                                studentData,
                                role,
                                lrn,
                                name: studentData?.name || result.user.displayName || ''
                            } as AuthenticatedUser;
                        }),
                        tap((user) => this.currentUserSubject.next(user))
                    );
                }
                return throwError(() => error);
            })
        );
    }

    /**
     * Login using Email and Password
     * For admin and teachers
     */
    loginWithEmail(email: string, password: string): Observable<AuthenticatedUser | null> {
        return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
            switchMap(async (result) => {
                // Check if user is in admin collection to get proper role (admin or super-admin)
                let role = 'admin';
                try {
                    const firestore = this.firebaseService.firestore;
                    const adminsRef = collection(firestore, 'admins');
                    const q = query(adminsRef, where('email', '==', email));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        const adminDoc = querySnapshot.docs[0];
                        const adminData = adminDoc.data() as any;
                        role = adminData.role || 'admin'; // Get role from Firestore (admin or super-admin)
                    }
                } catch (error) {
                    console.error('Error fetching admin role:', error);
                    // Default to admin if error occurs
                }

                return {
                    ...result.user,
                    role
                } as AuthenticatedUser;
            }),
            tap((user) => this.currentUserSubject.next(user))
        );
    }

    // LOGOUT
    logout(): Observable<void> {
        return from(signOut(this.auth)).pipe(tap(() => this.currentUserSubject.next(null)));
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
        return this.getCurrentUser().pipe(map((user) => !!user));
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

    /**
     * Create a student account in Firebase Authentication
     * Email format: {lrn}@lms.talakag
     * Password: {lrn}@123 (appends @123 to ensure minimum 6 characters)
     */
    async createStudentAccount(lrn: string): Promise<string | null> {
        try {
            const email = `${lrn}@lms.talakag`;
            // Append @123 to ensure password is at least 6 characters
            const password = `${lrn}@123`;

            const result = await createUserWithEmailAndPassword(this.auth, email, password);
            return result.user.uid;
        } catch (error: any) {
            console.error('Error creating student account:', error);
            throw new Error(`Failed to create account: ${error.message}`);
        }
    }

    /**
     * Delete student account by LRN
     * Note: In a real application with Firebase Admin SDK, you would delete the user directly
     * For now, this logs the deletion intention. A backend function would handle actual deletion.
     */
    async deleteStudentAccount(lrn: string): Promise<void> {
        try {
            const email = `${lrn}@lms.talakag`;

            // Try to delete current user if it matches
            const currentUser = this.auth.currentUser;
            if (currentUser && currentUser.email === email) {
                await currentUser.delete();
            } else {
                // For other users, log intention to delete
                // In production, you would call a backend function with admin privileges
                console.info(`Delete request for student account: ${email}`);
                console.warn('Note: Full account deletion requires Firebase Admin SDK on backend');
            }
        } catch (error: any) {
            console.error('Error deleting student account:', error);
            // Don't throw error to allow student deletion even if auth account can't be deleted
            // This prevents cascade failures
        }
    }

    /**
     * Create a teacher account in Firebase Authentication
     * Email format: {teacherID}@lms.talakag
     * Password: {teacherID} (same as username for easy access)
     */
    async createTeacherAccount(teacherID: string): Promise<string | null> {
        try {
            const email = `${teacherID}@lms.talakag`;
            const password = teacherID; // Username as password for teacher

            const result = await createUserWithEmailAndPassword(this.auth, email, password);
            return result.user.uid;
        } catch (error: any) {
            console.error('Error creating teacher account:', error);
            throw new Error(`Failed to create teacher account: ${error.message}`);
        }
    }

    /**
     * Login with TeacherID as username
     * Email format: {teacherID}@lms.talakag
     * Password: {teacherID}
     * Also fetches teacher data and role from Firestore
     */
    loginWithTeacherID(teacherID: string, password: string): Observable<AuthenticatedUser | null> {
        const email = `${teacherID}@lms.talakag`;

        return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
            switchMap(async (result) => {
                // Fetch teacher data from Firestore to get role
                let role = 'teacher';
                let teacherData: any = null;

                try {
                    const firestore = this.firebaseService.firestore;
                    const teachersRef = collection(firestore, 'teachers');
                    const q = query(teachersRef, where('teacherID', '==', teacherID));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        const teacherDoc = querySnapshot.docs[0];
                        teacherData = teacherDoc.data();
                        role = teacherData.role || 'teacher'; // Get role from Firestore
                    }
                } catch (error) {
                    console.error('Error fetching teacher data:', error);
                    // Default to teacher role if error occurs
                }

                return {
                    ...result.user,
                    role,
                    teacherID,
                    name: teacherData?.name || result.user.displayName || ''
                } as AuthenticatedUser;
            }),
            tap((user) => this.currentUserSubject.next(user))
        );
    }

    /**
     * Delete teacher account by teacherID
     * Note: In a real application with Firebase Admin SDK, you would delete the user directly
     * For now, this logs the deletion intention. A backend function would handle actual deletion.
     */
    async deleteTeacherAccount(teacherID: string): Promise<void> {
        try {
            const email = `${teacherID}@lms.talakag`;

            // Try to delete current user if it matches
            const currentUser = this.auth.currentUser;
            if (currentUser && currentUser.email === email) {
                await currentUser.delete();
            } else {
                // For other users, log intention to delete
                console.info(`Delete request for teacher account: ${email}`);
                console.warn('Note: Full account deletion requires Firebase Admin SDK on backend');
            }
        } catch (error: any) {
            console.error('Error deleting teacher account:', error);
            // Don't throw error to allow teacher deletion even if auth account can't be deleted
        }
    }

    /**
     * Create an admin account in Firebase Authentication
     * Email format: {email}
     * Password: {password}
     * Note: Email should be the admin's actual email
     */
    async createAdminAccount(email: string, password: string): Promise<string | null> {
        try {
            // Validate password strength (minimum 6 characters)
            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }

            const result = await createUserWithEmailAndPassword(this.auth, email, password);
            return result.user.uid;
        } catch (error: any) {
            console.error('Error creating admin account:', error);
            throw new Error(`Failed to create admin account: ${error.message}`);
        }
    }

    /**
     * Delete admin account by email
     */
    async deleteAdminAccount(email: string): Promise<void> {
        try {
            const currentUser = this.auth.currentUser;
            if (currentUser && currentUser.email === email) {
                await currentUser.delete();
            } else {
                console.info(`Delete request for admin account: ${email}`);
                console.warn('Note: Full account deletion requires Firebase Admin SDK on backend');
            }
        } catch (error: any) {
            console.error('Error deleting admin account:', error);
        }
    }
}
