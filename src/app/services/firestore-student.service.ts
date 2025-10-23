import { Injectable, inject } from '@angular/core';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where, QueryConstraint } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';

export interface Student {
    id?: string;
    lrn: string;
    name: string;
    email?: string;
    grade?: string;
    section?: string;
    sex: string;
    birthDate: string;
    address: string;
    barangay: string;
    municipality: string;
    province: string;
    contactNumber: string;
    learningModality: string;
    createdAt?: string;
}

@Injectable({
    providedIn: 'root'
})
export class FirestoreStudentService {
    private firebaseService = inject(FirebaseService);
    private firestore = this.firebaseService.firestore;
    private collectionName = 'students';

    // CREATE
    async addStudent(student: Student): Promise<string> {
        try {
            const docRef = await addDoc(collection(this.firestore, this.collectionName), {
                ...student,
                createdAt: new Date().toISOString()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error adding student:', error);
            throw error;
        }
    }

    // READ ALL
    async getStudents(): Promise<Student[]> {
        try {
            const querySnapshot = await getDocs(collection(this.firestore, this.collectionName));
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Student)
            }));
        } catch (error) {
            console.error('Error getting students:', error);
            throw error;
        }
    }

    // READ ONE
    async getStudent(id: string): Promise<Student | null> {
        try {
            const docRef = doc(this.firestore, this.collectionName, id);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? { id: docSnap.id, ...(docSnap.data() as Student) } : null;
        } catch (error) {
            console.error('Error getting student:', error);
            throw error;
        }
    }

    // UPDATE
    async updateStudent(id: string, student: Partial<Student>): Promise<void> {
        try {
            const docRef = doc(this.firestore, this.collectionName, id);
            await updateDoc(docRef, student);
        } catch (error) {
            console.error('Error updating student:', error);
            throw error;
        }
    }

    // DELETE
    async deleteStudent(id: string): Promise<void> {
        try {
            const docRef = doc(this.firestore, this.collectionName, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting student:', error);
            throw error;
        }
    }

    // SEARCH BY LRN
    async getStudentByLRN(lrn: string): Promise<Student | null> {
        try {
            const q = query(collection(this.firestore, this.collectionName), where('lrn', '==', lrn));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length > 0) {
                const doc = querySnapshot.docs[0];
                return { id: doc.id, ...(doc.data() as Student) };
            }
            return null;
        } catch (error) {
            console.error('Error searching student by LRN:', error);
            throw error;
        }
    }

    // SEARCH BY NAME
    async getStudentsByName(name: string): Promise<Student[]> {
        try {
            const q = query(collection(this.firestore, this.collectionName), where('name', '>=', name), where('name', '<=', name + '\uf8ff'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Student)
            }));
        } catch (error) {
            console.error('Error searching students by name:', error);
            throw error;
        }
    }
}
