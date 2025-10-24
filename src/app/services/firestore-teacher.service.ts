import { Injectable, inject } from '@angular/core';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';
import { LmsAuthService } from './lms-auth.service';

export interface Teacher {
    id?: string;
    name: string;
    teacherID: string;
    birthDate: string;
    department: string;
    email: string;
    contactNumber: string;
    createdAt?: string;
}

@Injectable({
    providedIn: 'root'
})
export class FirestoreTeacherService {
    private firebaseService = inject(FirebaseService);
    private authService = inject(LmsAuthService);
    private firestore = this.firebaseService.firestore;
    private collectionName = 'teachers';

    // CREATE
    async addTeacher(teacher: Teacher): Promise<string> {
        try {
            const docRef = await addDoc(collection(this.firestore, this.collectionName), {
                ...teacher,
                createdAt: new Date().toISOString()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error adding teacher:', error);
            throw error;
        }
    }

    // READ ALL
    async getTeachers(): Promise<Teacher[]> {
        try {
            const querySnapshot = await getDocs(collection(this.firestore, this.collectionName));
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Teacher)
            }));
        } catch (error) {
            console.error('Error getting teachers:', error);
            throw error;
        }
    }

    // READ ONE
    async getTeacher(id: string): Promise<Teacher | null> {
        try {
            const docRef = doc(this.firestore, this.collectionName, id);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? { id: docSnap.id, ...(docSnap.data() as Teacher) } : null;
        } catch (error) {
            console.error('Error getting teacher:', error);
            throw error;
        }
    }

    // UPDATE
    async updateTeacher(id: string, teacher: Partial<Teacher>): Promise<void> {
        try {
            const docRef = doc(this.firestore, this.collectionName, id);
            await updateDoc(docRef, teacher);
        } catch (error) {
            console.error('Error updating teacher:', error);
            throw error;
        }
    }

    // DELETE
    async deleteTeacher(id: string): Promise<void> {
        try {
            const docRef = doc(this.firestore, this.collectionName, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting teacher:', error);
            throw error;
        }
    }

    // SEARCH BY TEACHER ID
    async getTeacherByTeacherID(teacherID: string): Promise<Teacher | null> {
        try {
            const q = query(collection(this.firestore, this.collectionName), where('teacherID', '==', teacherID));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length > 0) {
                const doc = querySnapshot.docs[0];
                return { id: doc.id, ...(doc.data() as Teacher) };
            }
            return null;
        } catch (error) {
            console.error('Error searching teacher by ID:', error);
            throw error;
        }
    }

    // SEARCH BY NAME
    async getTeachersByName(name: string): Promise<Teacher[]> {
        try {
            const q = query(collection(this.firestore, this.collectionName), where('name', '>=', name), where('name', '<=', name + '\uf8ff'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Teacher)
            }));
        } catch (error) {
            console.error('Error searching teachers by name:', error);
            throw error;
        }
    }

    /**
     * Create a teacher account in Firebase Authentication
     * Uses teacherID as both username and password
     * Email format: {teacherID}@lms.talakag
     * Password: {teacherID}
     */
    async createTeacherAccount(teacher: Teacher): Promise<string | null> {
        try {
            // Create Firebase Auth account
            const uid = await this.authService.createTeacherAccount(teacher.teacherID);
            console.log(`Teacher account created for ${teacher.name} (${teacher.teacherID})`);
            return uid;
        } catch (error: any) {
            console.error(`Error creating teacher account for ${teacher.teacherID}:`, error);
            throw new Error(`Failed to create account for ${teacher.name}: ${error.message}`);
        }
    }

    /**
     * Delete a teacher account from Firebase Authentication
     */
    async deleteTeacherAccount(teacherID: string): Promise<void> {
        try {
            await this.authService.deleteTeacherAccount(teacherID);
            console.log(`Teacher account deleted for ${teacherID}`);
        } catch (error: any) {
            console.error(`Error deleting teacher account for ${teacherID}:`, error);
            throw new Error(`Failed to delete account for ${teacherID}: ${error.message}`);
        }
    }
}
