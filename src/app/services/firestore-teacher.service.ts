import { Injectable, inject } from '@angular/core';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';

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
}
