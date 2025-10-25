import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { FirestoreStudentService, Student } from '../../services/firestore-student.service';
import { FirestoreTeacherService, Teacher } from '../../services/firestore-teacher.service';
import { FirestoreAdminService, Admin } from '../../services/firestore-admin.service';
import { LmsAuthService } from '../../services/lms-auth.service';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { FirebaseService } from '../../services/firebase.service';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

@Component({
    selector: 'app-account-settings',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    template: `
        <div class="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-4xl mx-auto">
                <!-- Header -->
                <div class="mb-8">
                    <button (click)="goBack()" class="mb-4 inline-flex items-center gap-2 text-blue-500 hover:text-blue-700 dark:hover:text-blue-400">
                        <i class="pi pi-arrow-left"></i>
                        Back to Profile
                    </button>
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
                    <p class="text-gray-600 dark:text-gray-400 mt-2">Manage your account details and security settings</p>
                </div>

                <!-- Success/Error Messages -->
                @if (successMessage) {
                    <div class="mb-4 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 rounded-lg flex items-center gap-3">
                        <i class="pi pi-check-circle"></i>
                        <span>{{ successMessage }}</span>
                    </div>
                }
                @if (errorMessage) {
                    <div class="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg flex items-center gap-3">
                        <i class="pi pi-exclamation-circle"></i>
                        <span>{{ errorMessage }}</span>
                    </div>
                }

                <!-- Tabs -->
                <div class="flex gap-0 mb-6 bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden border-b border-gray-200 dark:border-slate-700">
                    <button
                        (click)="activeTab = 'profile'"
                        [ngClass]="{
                            'bg-blue-500 text-white': activeTab === 'profile',
                            'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700': activeTab !== 'profile'
                        }"
                        class="flex-1 px-4 py-3 font-medium transition-colors border-b-2"
                        [ngClass]="{ 'border-blue-500': activeTab === 'profile', 'border-transparent': activeTab !== 'profile' }"
                    >
                        <i class="pi pi-user mr-2"></i>Edit Profile
                    </button>
                    <button
                        (click)="activeTab = 'password'"
                        [ngClass]="{
                            'bg-blue-500 text-white': activeTab === 'password',
                            'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700': activeTab !== 'password'
                        }"
                        class="flex-1 px-4 py-3 font-medium transition-colors border-b-2"
                        [ngClass]="{ 'border-blue-500': activeTab === 'password', 'border-transparent': activeTab !== 'password' }"
                    >
                        <i class="pi pi-lock mr-2"></i>Change Password
                    </button>
                </div>

                <!-- Edit Profile Tab -->
                @if (activeTab === 'profile') {
                    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
                        <form [formGroup]="profileForm" (ngSubmit)="updateProfile()" class="divide-y divide-gray-200 dark:divide-slate-700">
                            <!-- Personal Information -->
                            <div class="px-6 py-6">
                                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Personal Information</h2>
                                <div class="space-y-4">
                                    <div>
                                        <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            formControlName="name"
                                            class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                formControlName="email"
                                                [disabled]="true"
                                                class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white cursor-not-allowed opacity-75"
                                            />
                                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
                                        </div>
                                        <div>
                                            <label for="birthDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Birth Date</label>
                                            <input
                                                type="date"
                                                id="birthDate"
                                                formControlName="birthDate"
                                                class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label for="sex" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sex</label>
                                            <select
                                                id="sex"
                                                formControlName="sex"
                                                class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label for="contactNumber" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Number</label>
                                            <input
                                                type="tel"
                                                id="contactNumber"
                                                formControlName="contactNumber"
                                                placeholder="+63 9XX XXX XXXX"
                                                class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Address Information -->
                            <div class="px-6 py-6">
                                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Address</h2>
                                <div class="space-y-4">
                                    <div>
                                        <label for="address" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Street Address</label>
                                        <input
                                            type="text"
                                            id="address"
                                            formControlName="address"
                                            class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label for="barangay" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Barangay</label>
                                            <input
                                                type="text"
                                                id="barangay"
                                                formControlName="barangay"
                                                class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label for="municipality" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Municipality</label>
                                            <input
                                                type="text"
                                                id="municipality"
                                                formControlName="municipality"
                                                class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label for="province" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Province</label>
                                        <input
                                            type="text"
                                            id="province"
                                            formControlName="province"
                                            class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <!-- Student-specific Fields -->
                            @if (userRole === 'student') {
                                <div class="px-6 py-6">
                                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Student Information</h2>
                                    <div class="space-y-4">
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label for="grade" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Grade</label>
                                                <input
                                                    type="text"
                                                    id="grade"
                                                    formControlName="grade"
                                                    [disabled]="true"
                                                    class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white cursor-not-allowed opacity-75"
                                                />
                                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Managed by school</p>
                                            </div>
                                            <div>
                                                <label for="section" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Section</label>
                                                <input
                                                    type="text"
                                                    id="section"
                                                    formControlName="section"
                                                    [disabled]="true"
                                                    class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white cursor-not-allowed opacity-75"
                                                />
                                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Managed by school</p>
                                            </div>
                                        </div>
                                        <div>
                                            <label for="learningModality" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Learning Modality</label>
                                            <input
                                                type="text"
                                                id="learningModality"
                                                formControlName="learningModality"
                                                [disabled]="true"
                                                class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white cursor-not-allowed opacity-75"
                                            />
                                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Managed by school</p>
                                        </div>
                                    </div>
                                </div>
                            }

                            <!-- Admin-specific Fields -->
                            @if (userRole === 'admin' || userRole === 'super-admin') {
                                <div class="px-6 py-6">
                                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Admin Information</h2>
                                    <div class="space-y-4">
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label for="adminID" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Admin ID</label>
                                                <input
                                                    type="text"
                                                    id="adminID"
                                                    formControlName="adminID"
                                                    [disabled]="true"
                                                    class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white cursor-not-allowed opacity-75"
                                                />
                                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Auto-generated</p>
                                            </div>
                                            <div>
                                                <label for="department" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department</label>
                                                <input
                                                    type="text"
                                                    id="department"
                                                    formControlName="department"
                                                    class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }

                            <!-- Form Actions -->
                            <div class="px-6 py-6 flex gap-3">
                                <button type="submit" [disabled]="isUpdating" class="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    @if (isUpdating) {
                                        <i class="pi pi-spin pi-spinner mr-2"></i>Saving...
                                    } @else {
                                        <i class="pi pi-save mr-2"></i>Save Changes
                                    }
                                </button>
                                <button
                                    type="button"
                                    (click)="resetForm()"
                                    [disabled]="isUpdating"
                                    class="px-6 py-2 bg-gray-300 dark:bg-slate-700 text-gray-800 dark:text-white rounded-lg font-medium hover:bg-gray-400 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <i class="pi pi-times mr-2"></i>Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                }

                <!-- Change Password Tab -->
                @if (activeTab === 'password') {
                    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
                        <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="p-6">
                            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Change Your Password</h2>

                            <div class="space-y-4 max-w-md">
                                <div>
                                    <label for="currentPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                                    <input
                                        type="password"
                                        id="currentPassword"
                                        formControlName="currentPassword"
                                        class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    @if (passwordForm.get('currentPassword')?.hasError('required') && passwordForm.get('currentPassword')?.touched) {
                                        <p class="text-red-500 dark:text-red-400 text-sm mt-1">Current password is required</p>
                                    }
                                </div>
                                <div>
                                    <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        formControlName="newPassword"
                                        class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Password must be at least 6 characters</p>
                                    @if (passwordForm.get('newPassword')?.hasError('minlength') && passwordForm.get('newPassword')?.touched) {
                                        <p class="text-red-500 dark:text-red-400 text-sm mt-1">Password must be at least 6 characters</p>
                                    }
                                </div>
                                <div>
                                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        formControlName="confirmPassword"
                                        class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    @if (passwordForm.hasError('passwordMismatch') && passwordForm.get('confirmPassword')?.touched) {
                                        <p class="text-red-500 dark:text-red-400 text-sm mt-1">Passwords do not match</p>
                                    }
                                </div>
                            </div>

                            <div class="flex gap-3 mt-6">
                                <button type="submit" [disabled]="passwordForm.invalid || isUpdating" class="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    @if (isUpdating) {
                                        <i class="pi pi-spin pi-spinner mr-2"></i>Updating...
                                    } @else {
                                        <i class="pi pi-check mr-2"></i>Change Password
                                    }
                                </button>
                                <button
                                    type="button"
                                    (click)="resetPasswordForm()"
                                    [disabled]="isUpdating"
                                    class="px-6 py-2 bg-gray-300 dark:bg-slate-700 text-gray-800 dark:text-white rounded-lg font-medium hover:bg-gray-400 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <i class="pi pi-times mr-2"></i>Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                }
            </div>
        </div>
    `,
    styles: []
})
export class AccountSettings implements OnInit {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private studentService = inject(FirestoreStudentService);
    private teacherService = inject(FirestoreTeacherService);
    private adminService = inject(FirestoreAdminService);
    private lmsAuthService = inject(LmsAuthService);
    private firebaseService = inject(FirebaseService);
    private router = inject(Router);

    activeTab: 'profile' | 'password' = 'profile';
    profileForm!: FormGroup;
    passwordForm!: FormGroup;
    isUpdating = false;
    successMessage = '';
    errorMessage = '';
    userRole = '';
    private userStudentId = '';
    private userTeacherId = '';
    private userAdminEmail = '';

    ngOnInit() {
        this.initializeForms();
        this.loadUserData();
    }

    private initializeForms() {
        this.profileForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
            birthDate: [''],
            sex: [''],
            contactNumber: [''],
            address: [''],
            barangay: [''],
            municipality: [''],
            province: [''],
            grade: [''],
            section: [''],
            learningModality: [''],
            adminID: [''],
            department: ['']
        });

        this.passwordForm = this.fb.group(
            {
                currentPassword: ['', Validators.required],
                newPassword: ['', [Validators.required, Validators.minLength(6)]],
                confirmPassword: ['', Validators.required]
            },
            { validators: this.passwordMatchValidator }
        );
    }

    private passwordMatchValidator(form: FormGroup): { [key: string]: any } | null {
        const newPassword = form.get('newPassword')?.value;
        const confirmPassword = form.get('confirmPassword')?.value;

        if (newPassword && confirmPassword && newPassword !== confirmPassword) {
            return { passwordMismatch: true };
        }
        return null;
    }

    /**
     * Load user data based on role from appropriate Firestore collection
     */
    private async loadUserData() {
        try {
            const currentUser = this.authService.currentUser;
            if (!currentUser) {
                this.router.navigate(['/auth/login']);
                return;
            }

            this.userRole = currentUser.role || 'student';

            // Load data from appropriate collection based on role
            if (currentUser.role === 'student' && currentUser.lrn) {
                await this.loadStudentDataForEdit(currentUser.lrn);
            } else if (currentUser.role === 'teacher' && currentUser.teacherID) {
                await this.loadTeacherDataForEdit(currentUser.teacherID);
            } else if (currentUser.role === 'admin' || currentUser.role === 'super-admin') {
                await this.loadAdminDataForEdit(currentUser.email || '');
            } else {
                this.populateProfileForm(currentUser);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            this.showError('Failed to load user data');
        }
    }

    /**
     * Load student data from Firestore 'students' collection
     */
    private async loadStudentDataForEdit(lrn: string) {
        try {
            this.userStudentId = lrn;
            const studentData = await this.studentService.getStudentByLRN(lrn);
            if (studentData) {
                this.populateProfileForm(studentData);
                console.log('Student data loaded for editing:', studentData);
            } else {
                const currentUser = this.authService.currentUser;
                this.populateProfileForm(currentUser);
            }
        } catch (error) {
            console.error('Error loading student data for edit:', error);
            const currentUser = this.authService.currentUser;
            this.populateProfileForm(currentUser);
        }
    }

    /**
     * Load teacher data from Firestore 'teachers' collection
     */
    private async loadTeacherDataForEdit(teacherID: string) {
        try {
            this.userTeacherId = teacherID;
            const firestore = this.firebaseService.firestore;
            const teachersRef = collection(firestore, 'teachers');
            const q = query(teachersRef, where('teacherID', '==', teacherID));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const teacherDoc = querySnapshot.docs[0];
                const teacherData = { id: teacherDoc.id, ...teacherDoc.data() };
                this.populateProfileForm(teacherData);
                console.log('Teacher data loaded for editing:', teacherData);
            } else {
                const currentUser = this.authService.currentUser;
                this.populateProfileForm(currentUser);
            }
        } catch (error) {
            console.error('Error loading teacher data for edit:', error);
            const currentUser = this.authService.currentUser;
            this.populateProfileForm(currentUser);
        }
    }

    /**
     * Load admin data from Firestore 'admins' collection
     */
    private async loadAdminDataForEdit(email: string) {
        try {
            this.userAdminEmail = email;
            const adminData = await this.adminService.getAdminByEmail(email);
            if (adminData) {
                this.populateProfileForm(adminData);
                console.log('Admin data loaded for editing:', adminData);
            } else {
                const currentUser = this.authService.currentUser;
                this.populateProfileForm(currentUser);
            }
        } catch (error) {
            console.error('Error loading admin data for edit:', error);
            const currentUser = this.authService.currentUser;
            this.populateProfileForm(currentUser);
        }
    }

    /**
     * Populate profile form with user data
     */
    private populateProfileForm(userData: any) {
        this.profileForm.patchValue({
            name: userData.name || '',
            email: userData.email || '',
            birthDate: userData.birthDate || '',
            sex: userData.sex || '',
            contactNumber: userData.contactNumber || '',
            address: userData.address || '',
            barangay: userData.barangay || '',
            municipality: userData.municipality || '',
            province: userData.province || '',
            grade: userData.grade || '',
            section: userData.section || '',
            learningModality: userData.learningModality || '',
            adminID: userData.adminID || '',
            department: userData.department || ''
        });
    }

    /**
     * Load teacher data from Firestore by teacher ID
     */
    private async loadTeacherData(teacherID: string): Promise<any> {
        try {
            const firestore = this.firebaseService.firestore;
            const teachersRef = collection(firestore, 'teachers');
            const q = query(teachersRef, where('teacherID', '==', teacherID));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const teacherDoc = querySnapshot.docs[0];
                return { id: teacherDoc.id, ...teacherDoc.data() };
            }
            return null;
        } catch (error) {
            console.error('Error loading teacher data:', error);
            return null;
        }
    }

    async updateProfile() {
        if (!this.profileForm.valid) {
            this.showError('Please fill in all required fields');
            return;
        }

        this.isUpdating = true;
        this.successMessage = '';
        this.errorMessage = '';

        try {
            const formData = this.profileForm.getRawValue();
            const updateData: any = {};

            // Only include fields that changed
            const currentUser = this.authService.currentUser;
            if (formData.name !== currentUser?.name) updateData.name = formData.name;
            if (formData.birthDate) updateData.birthDate = formData.birthDate;
            if (formData.sex) updateData.sex = formData.sex;
            if (formData.contactNumber) updateData.contactNumber = formData.contactNumber;
            if (formData.address) updateData.address = formData.address;
            if (formData.barangay) updateData.barangay = formData.barangay;
            if (formData.municipality) updateData.municipality = formData.municipality;
            if (formData.province) updateData.province = formData.province;
            if (formData.department) updateData.department = formData.department;

            // Update based on role
            if (this.userRole === 'student' && this.userStudentId) {
                const student = await this.studentService.getStudentByLRN(this.userStudentId);
                if (student && student.id) {
                    await this.studentService.updateStudent(student.id, updateData);
                }
            } else if (this.userRole === 'teacher' && this.userTeacherId) {
                const teacherData = await this.loadTeacherData(this.userTeacherId);
                if (teacherData) {
                    const firestore = this.firebaseService.firestore;
                    const teacherRef = doc(firestore, 'teachers', teacherData.id);
                    await updateDoc(teacherRef, updateData);
                }
            } else if ((this.userRole === 'admin' || this.userRole === 'super-admin') && this.userAdminEmail) {
                const adminData = await this.adminService.getAdminByEmail(this.userAdminEmail);
                if (adminData && adminData.id) {
                    await this.adminService.updateAdmin(adminData.id, updateData);
                }
            }

            this.showSuccess('Profile updated successfully!');
        } catch (error: any) {
            console.error('Error updating profile:', error);
            this.showError('Failed to update profile: ' + (error.message || 'Unknown error'));
        } finally {
            this.isUpdating = false;
        }
    }

    async changePassword() {
        if (!this.passwordForm.valid) {
            this.showError('Please fill in all password fields correctly');
            return;
        }

        this.isUpdating = true;
        this.successMessage = '';
        this.errorMessage = '';

        try {
            const { currentPassword, newPassword } = this.passwordForm.value;
            const user = this.lmsAuthService.getCurrentUserSync();

            if (!user || !user.email) {
                throw new Error('User not authenticated');
            }

            // Reauthenticate user
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);

            // Update password
            await updatePassword(user, newPassword);

            this.showSuccess('Password changed successfully!');
            this.resetPasswordForm();
        } catch (error: any) {
            console.error('Error changing password:', error);
            if (error.code === 'auth/wrong-password') {
                this.showError('Current password is incorrect');
            } else {
                this.showError('Failed to change password: ' + (error.message || 'Unknown error'));
            }
        } finally {
            this.isUpdating = false;
        }
    }

    resetForm() {
        this.loadUserData();
    }

    resetPasswordForm() {
        this.passwordForm.reset();
    }

    goBack() {
        this.router.navigate(['/pages/profile']);
    }

    private showSuccess(message: string) {
        this.successMessage = message;
        setTimeout(() => {
            this.successMessage = '';
        }, 5000);
    }

    private showError(message: string) {
        this.errorMessage = message;
        setTimeout(() => {
            this.errorMessage = '';
        }, 5000);
    }
}
