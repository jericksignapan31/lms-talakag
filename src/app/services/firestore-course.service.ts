import { Injectable, inject } from '@angular/core';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';

export interface Course {
    id?: string;
    code: string;
    title: string;
    description?: string;
    teacherId: string;
    credits?: number;
    createdAt?: string;
}

@Injectable({
    providedIn: 'root'
})
export class FirestoreCourseService {
    private firebaseService = inject(FirebaseService);
    private firestore = this.firebaseService.firestore;
    private collectionName = 'courses';

    // CREATE
    async addCourse(course: Course): Promise<string> {
        try {
            const docRef = await addDoc(collection(this.firestore, this.collectionName), {
                ...course,
                createdAt: new Date().toISOString()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error adding course:', error);
            throw error;
        }
    }

    // READ ALL
    async getCourses(): Promise<Course[]> {
        try {
            const querySnapshot = await getDocs(collection(this.firestore, this.collectionName));
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Course)
            }));
        } catch (error) {
            console.error('Error getting courses:', error);
            throw error;
        }
    }

    // READ ONE
    async getCourse(id: string): Promise<Course | null> {
        try {
            const docRef = doc(this.firestore, this.collectionName, id);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? { id: docSnap.id, ...(docSnap.data() as Course) } : null;
        } catch (error) {
            console.error('Error getting course:', error);
            throw error;
        }
    }

    // UPDATE
    async updateCourse(id: string, course: Partial<Course>): Promise<void> {
        try {
            const docRef = doc(this.firestore, this.collectionName, id);
            await updateDoc(docRef, course);
        } catch (error) {
            console.error('Error updating course:', error);
            throw error;
        }
    }

    // DELETE
    async deleteCourse(id: string): Promise<void> {
        try {
            const docRef = doc(this.firestore, this.collectionName, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting course:', error);
            throw error;
        }
    }

    // GET COURSES BY TEACHER
    async getCoursesByTeacher(teacherId: string): Promise<Course[]> {
        try {
            const q = query(collection(this.firestore, this.collectionName), where('teacherId', '==', teacherId));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Course)
            }));
        } catch (error) {
            console.error('Error getting courses by teacher:', error);
            throw error;
        }
    }
}
