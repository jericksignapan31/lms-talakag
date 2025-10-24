import { Injectable, inject } from '@angular/core';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';
import { LmsAuthService } from './lms-auth.service';

export interface Admin {
    id?: string;
    name: string;
    email: string;
    adminID: string;
    department: string;
    role: 'admin' | 'super-admin';
    status: 'active' | 'inactive';
    createdAt?: string;
    lastLogin?: string;
}

@Injectable({
    providedIn: 'root'
})
export class FirestoreAdminService {
    private firebaseService = inject(FirebaseService);
    private authService = inject(LmsAuthService);
    private firestore = this.firebaseService.firestore;
    private collectionName = 'admins';

    // CREATE
    async addAdmin(admin: Admin): Promise<string> {
        try {
            const docRef = await addDoc(collection(this.firestore, this.collectionName), {
                ...admin,
                createdAt: new Date().toISOString(),
                status: admin.status || 'active'
            });
            return docRef.id;
        } catch (error) {
            console.error('Error adding admin:', error);
            throw error;
        }
    }

    // READ ALL
    async getAdmins(): Promise<Admin[]> {
        try {
            const querySnapshot = await getDocs(collection(this.firestore, this.collectionName));
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Admin)
            }));
        } catch (error) {
            console.error('Error getting admins:', error);
            throw error;
        }
    }

    // READ ONE
    async getAdmin(id: string): Promise<Admin | null> {
        try {
            const docRef = doc(this.firestore, this.collectionName, id);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? { id: docSnap.id, ...(docSnap.data() as Admin) } : null;
        } catch (error) {
            console.error('Error getting admin:', error);
            throw error;
        }
    }

    // UPDATE
    async updateAdmin(id: string, admin: Partial<Admin>): Promise<void> {
        try {
            const docRef = doc(this.firestore, this.collectionName, id);
            await updateDoc(docRef, admin);
        } catch (error) {
            console.error('Error updating admin:', error);
            throw error;
        }
    }

    // DELETE
    async deleteAdmin(id: string): Promise<void> {
        try {
            const docRef = doc(this.firestore, this.collectionName, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting admin:', error);
            throw error;
        }
    }

    // SEARCH BY EMAIL
    async getAdminByEmail(email: string): Promise<Admin | null> {
        try {
            const q = query(collection(this.firestore, this.collectionName), where('email', '==', email));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length > 0) {
                const doc = querySnapshot.docs[0];
                return { id: doc.id, ...(doc.data() as Admin) };
            }
            return null;
        } catch (error) {
            console.error('Error searching admin by email:', error);
            throw error;
        }
    }

    // SEARCH BY ADMIN ID
    async getAdminByAdminID(adminID: string): Promise<Admin | null> {
        try {
            const q = query(collection(this.firestore, this.collectionName), where('adminID', '==', adminID));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length > 0) {
                const doc = querySnapshot.docs[0];
                return { id: doc.id, ...(doc.data() as Admin) };
            }
            return null;
        } catch (error) {
            console.error('Error searching admin by ID:', error);
            throw error;
        }
    }

    // UPDATE LAST LOGIN
    async updateLastLogin(id: string): Promise<void> {
        try {
            const docRef = doc(this.firestore, this.collectionName, id);
            await updateDoc(docRef, {
                lastLogin: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error updating last login:', error);
            throw error;
        }
    }

    // GET ADMINS BY ROLE
    async getAdminsByRole(role: 'admin' | 'super-admin'): Promise<Admin[]> {
        try {
            const q = query(collection(this.firestore, this.collectionName), where('role', '==', role));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Admin)
            }));
        } catch (error) {
            console.error('Error getting admins by role:', error);
            throw error;
        }
    }

    // GET ACTIVE ADMINS
    async getActiveAdmins(): Promise<Admin[]> {
        try {
            const q = query(collection(this.firestore, this.collectionName), where('status', '==', 'active'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Admin)
            }));
        } catch (error) {
            console.error('Error getting active admins:', error);
            throw error;
        }
    }

    /**
     * Create an admin account in Firebase Authentication
     * and add to Firestore admins collection
     */
    async createAdminAccountAndRecord(admin: Admin, password: string): Promise<string | null> {
        try {
            // Create Firebase Auth account
            const uid = await this.authService.createAdminAccount(admin.email, password);

            // Add admin record to Firestore
            const adminId = await this.addAdmin(admin);
            console.log(`Admin account created for ${admin.name} (${admin.email})`);
            return adminId;
        } catch (error: any) {
            console.error(`Error creating admin account for ${admin.email}:`, error);
            throw new Error(`Failed to create admin account: ${error.message}`);
        }
    }

    /**
     * Delete an admin account from Firebase and Firestore
     */
    async deleteAdminAccountAndRecord(id: string, email: string): Promise<void> {
        try {
            // Delete from Firestore
            await this.deleteAdmin(id);

            // Delete Firebase account
            await this.authService.deleteAdminAccount(email);
            console.log(`Admin account deleted for ${email}`);
        } catch (error: any) {
            console.error(`Error deleting admin account for ${email}:`, error);
            throw new Error(`Failed to delete admin account: ${error.message}`);
        }
    }
}
