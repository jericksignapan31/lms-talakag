import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { FirestoreStudentService, Student } from '../../services/firestore-student.service';
import { FirestoreTeacherService, Teacher } from '../../services/firestore-teacher.service';
import { FirestoreAdminService, Admin } from '../../services/firestore-admin.service';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FirebaseService } from '../../services/firebase.service';

interface UserProfile {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    lrn?: string;
    teacherID?: string;
    adminID?: string;
    department?: string;
    birthDate?: string;
    sex?: string;
    address?: string;
    barangay?: string;
    municipality?: string;
    province?: string;
    contactNumber?: string;
    grade?: string;
    section?: string;
    learningModality?: string;
}

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-3xl mx-auto">
                <!-- Header -->
                <div class="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden mb-6">
                    <div class="bg-gradient-to-r from-blue-500 to-blue-600 h-32"></div>
                    <div class="px-6 pb-6 pt-0 relative">
                        <!-- Avatar -->
                        <div class="flex items-start gap-6">
                            <div class="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold -mt-12 border-4 border-white dark:border-slate-800 shadow-lg">
                                {{ userProfile.name?.charAt(0) || 'U' }}
                            </div>
                            <div class="flex-1 pt-2">
                                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ userProfile.name }}</h1>
                                <p class="text-gray-500 dark:text-gray-400 mt-1">{{ getRoleLabel() }}</p>
                                <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">{{ userProfile.email }}</p>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex gap-3 mt-6">
                            <button
                                (click)="goToAccountSettings()"
                                class="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                            >
                                <i class="pi pi-pencil mr-2"></i>Edit Profile
                            </button>
                            <button
                                (click)="goBack()"
                                class="px-6 py-2 bg-gray-300 dark:bg-slate-700 text-gray-800 dark:text-white rounded-lg font-medium hover:bg-gray-400 dark:hover:bg-slate-600 transition-colors"
                            >
                                <i class="pi pi-arrow-left mr-2"></i>Back
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Profile Information -->
                <div class="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
                    <div class="border-b border-gray-200 dark:border-slate-700 px-6 py-4">
                        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
                    </div>

                    <div class="divide-y divide-gray-200 dark:divide-slate-700">
                        <!-- Personal Information Section -->
                        <div class="px-6 py-4">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                                    <p class="mt-1 text-gray-900 dark:text-gray-100">{{ userProfile.name || 'N/A' }}</p>
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                    <p class="mt-1 text-gray-900 dark:text-gray-100">{{ userProfile.email || 'N/A' }}</p>
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                                    <p class="mt-1 text-gray-900 dark:text-gray-100">{{ getRoleLabel() }}</p>
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Birth Date</label>
                                    <p class="mt-1 text-gray-900 dark:text-gray-100">{{ userProfile.birthDate || 'N/A' }}</p>
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Sex</label>
                                    <p class="mt-1 text-gray-900 dark:text-gray-100">{{ userProfile.sex || 'N/A' }}</p>
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Number</label>
                                    <p class="mt-1 text-gray-900 dark:text-gray-100">{{ userProfile.contactNumber || 'N/A' }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Address Information Section -->
                        <div class="px-6 py-4">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Address</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                                    <p class="mt-1 text-gray-900 dark:text-gray-100">{{ userProfile.address || 'N/A' }}</p>
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Barangay</label>
                                    <p class="mt-1 text-gray-900 dark:text-gray-100">{{ userProfile.barangay || 'N/A' }}</p>
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Municipality</label>
                                    <p class="mt-1 text-gray-900 dark:text-gray-100">{{ userProfile.municipality || 'N/A' }}</p>
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Province</label>
                                    <p class="mt-1 text-gray-900 dark:text-gray-100">{{ userProfile.province || 'N/A' }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Student-specific Information -->
                        @if (userProfile.role === 'student') {
                        <div class="px-6 py-4">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Student Information</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">LRN (Learner Reference Number)</label>
                                    <p class="mt-1 text-gray-900 dark:text-gray-100">{{ userProfile.lrn || 'N/A' }}</p>
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Grade</label>
                                    <p class="mt-1 text-gray-900 dark:text-gray-100">{{ userProfile.grade || 'N/A' }}</p>
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Section</label>
                                    <p class="mt-1 text-gray-900 dark:text-gray-100">{{ userProfile.section || 'N/A' }}</p>
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Learning Modality</label>
                                    <p class="mt-1 text-gray-900 dark:text-gray-100">{{ userProfile.learningModality || 'N/A' }}</p>
                                </div>
                            </div>
                        </div>
                        }

                        <!-- Teacher-specific Information -->
                        @if (userProfile.role === 'teacher') {
                        <div class="px-6 py-4">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Teacher Information</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Teacher ID</label>
                                    <p class="mt-1 text-gray-900 dark:text-gray-100">{{ userProfile.teacherID || 'N/A' }}</p>
                                </div>
                            </div>
                        </div>
                        }

                        <!-- Admin-specific Information -->
                        @if (userProfile.role === 'admin' || userProfile.role === 'super-admin') {
                        <div class="px-6 py-4">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Admin Information</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Admin ID</label>
                                    <p class="mt-1 text-gray-900 dark:text-gray-100">{{ userProfile.adminID || 'N/A' }}</p>
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
                                    <p class="mt-1 text-gray-900 dark:text-gray-100">{{ userProfile.department || 'N/A' }}</p>
                                </div>
                            </div>
                        </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: []
})
export class Profile implements OnInit {
    private authService = inject(AuthService);
    private studentService = inject(FirestoreStudentService);
    private teacherService = inject(FirestoreTeacherService);
    private adminService = inject(FirestoreAdminService);
    private firebaseService = inject(FirebaseService);
    private router = inject(Router);

    userProfile: UserProfile = {};
    isLoading = false;

    ngOnInit() {
        this.loadUserProfile();
    }

    private async loadUserProfile() {
        this.isLoading = true;
        try {
            const currentUser = this.authService.currentUser;
            if (!currentUser) {
                this.router.navigate(['/auth/login']);
                return;
            }

            this.userProfile = {
                email: currentUser.email || '',
                role: currentUser.role || 'student',
                name: currentUser.name || ''
            };

            // Load role-specific data from appropriate Firestore collection
            if (currentUser.role === 'student' && currentUser.lrn) {
                await this.loadStudentData(currentUser.lrn);
            } else if (currentUser.role === 'teacher' && currentUser.teacherID) {
                await this.loadTeacherData(currentUser.teacherID);
            } else if (currentUser.role === 'admin' || currentUser.role === 'super-admin') {
                await this.loadAdminData(currentUser.email || '');
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Load student data from Firestore 'students' collection
     */
    private async loadStudentData(lrn: string) {
        try {
            const studentData = await this.studentService.getStudentByLRN(lrn);
            if (studentData) {
                this.userProfile = {
                    ...this.userProfile,
                    ...studentData
                };
                console.log('Student profile loaded:', this.userProfile);
            }
        } catch (error) {
            console.error('Error loading student data:', error);
        }
    }

    /**
     * Load teacher data from Firestore 'teachers' collection
     */
    private async loadTeacherData(teacherID: string) {
        try {
            const firestore = this.firebaseService.firestore;
            const teachersRef = collection(firestore, 'teachers');
            const q = query(teachersRef, where('teacherID', '==', teacherID));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const teacherDoc = querySnapshot.docs[0];
                const teacherData = { id: teacherDoc.id, ...teacherDoc.data() };
                this.userProfile = {
                    ...this.userProfile,
                    ...teacherData
                };
                console.log('Teacher profile loaded:', this.userProfile);
            }
        } catch (error) {
            console.error('Error loading teacher data:', error);
        }
    }

    /**
     * Load admin data from Firestore 'admins' collection
     */
    private async loadAdminData(email: string) {
        try {
            const adminData = await this.adminService.getAdminByEmail(email);
            if (adminData) {
                this.userProfile = {
                    ...this.userProfile,
                    ...adminData
                };
                console.log('Admin profile loaded:', this.userProfile);
            }
        } catch (error) {
            console.error('Error loading admin data:', error);
        }
    }

    getRoleLabel(): string {
        const roleMap: { [key: string]: string } = {
            student: 'Student',
            teacher: 'Teacher',
            admin: 'Administrator',
            'super-admin': 'Super Administrator'
        };
        return roleMap[this.userProfile.role || ''] || 'User';
    }

    goToAccountSettings() {
        this.router.navigate(['/pages/account-settings']);
    }

    goBack() {
        this.router.navigate(['/pages/dashboard']);
    }
}
