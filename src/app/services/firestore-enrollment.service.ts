import { Injectable, inject } from '@angular/core';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';

export interface Enrollment {
    id?: string;
    studentId: string;
    courseId: string;
    enrollmentDate: string;
    status: 'active' | 'inactive' | 'completed';
    createdAt?: string;
}

@Injectable({
    providedIn: 'root'
})
export class FirestoreEnrollmentService {
    private firebaseService = inject(FirebaseService);
    private firestore = this.firebaseService.firestore;
    private collectionName = 'enrollments';

    // CREATE
    async addEnrollment(enrollment: Enrollment): Promise<string> {
        try {
            const docRef = await addDoc(collection(this.firestore, this.collectionName), {
                ...enrollment,
                createdAt: new Date().toISOString()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error adding enrollment:', error);
            throw error;
        }
    }

    // READ ALL
    async getEnrollments(): Promise<Enrollment[]> {
        try {
            const querySnapshot = await getDocs(collection(this.firestore, this.collectionName));
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Enrollment)
            }));
        } catch (error) {
            console.error('Error getting enrollments:', error);
            throw error;
        }
    }

    // READ ONE
    async getEnrollment(id: string): Promise<Enrollment | null> {
        try {
            const docRef = doc(this.firestore, this.collectionName, id);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? { id: docSnap.id, ...(docSnap.data() as Enrollment) } : null;
        } catch (error) {
            console.error('Error getting enrollment:', error);
            throw error;
        }
    }

    // UPDATE
    async updateEnrollment(id: string, enrollment: Partial<Enrollment>): Promise<void> {
        try {
            const docRef = doc(this.firestore, this.collectionName, id);
            await updateDoc(docRef, enrollment);
        } catch (error) {
            console.error('Error updating enrollment:', error);
            throw error;
        }
    }

    // DELETE
    async deleteEnrollment(id: string): Promise<void> {
        try {
            const docRef = doc(this.firestore, this.collectionName, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting enrollment:', error);
            throw error;
        }
    }

    // GET ENROLLMENTS BY STUDENT
    async getEnrollmentsByStudent(studentId: string): Promise<Enrollment[]> {
        try {
            const q = query(collection(this.firestore, this.collectionName), where('studentId', '==', studentId));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Enrollment)
            }));
        } catch (error) {
            console.error('Error getting enrollments by student:', error);
            throw error;
        }
    }

    // GET ENROLLMENTS BY COURSE
    async getEnrollmentsByCourse(courseId: string): Promise<Enrollment[]> {
        try {
            const q = query(collection(this.firestore, this.collectionName), where('courseId', '==', courseId));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Enrollment)
            }));
        } catch (error) {
            console.error('Error getting enrollments by course:', error);
            throw error;
        }
    }

    // GET ACTIVE ENROLLMENTS BY STUDENT
    async getActiveEnrollmentsByStudent(studentId: string): Promise<Enrollment[]> {
        try {
            const q = query(collection(this.firestore, this.collectionName), where('studentId', '==', studentId), where('status', '==', 'active'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Enrollment)
            }));
        } catch (error) {
            console.error('Error getting active enrollments:', error);
            throw error;
        }
    }
}
