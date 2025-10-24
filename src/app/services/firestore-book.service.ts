import { Injectable, inject } from '@angular/core';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';

export interface Book {
    id?: string;
    accessionNumber: string;
    dateInput: string;
    callNumber: string;
    author: string;
    title: string;
    edition: string;
    volumeNumber: string;
    pages: string;
    sourceOfFund: string;
    price: number;
    publisher: string;
    year: string;
    remarks: string;
    isbn: string;
    createdAt?: string;
}

@Injectable({
    providedIn: 'root'
})
export class FirestoreBookService {
    private firebaseService = inject(FirebaseService);
    private firestore = this.firebaseService.firestore;
    private collectionName = 'book';

    // CREATE
    async addBook(book: Book): Promise<string> {
        try {
            const docRef = await addDoc(collection(this.firestore, this.collectionName), {
                ...book,
                createdAt: new Date().toISOString()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error adding book:', error);
            throw error;
        }
    }

    // READ ALL
    async getBooks(): Promise<Book[]> {
        try {
            const querySnapshot = await getDocs(collection(this.firestore, this.collectionName));
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Book)
            }));
        } catch (error) {
            console.error('Error getting books:', error);
            throw error;
        }
    }

    // READ ONE
    async getBook(id: string): Promise<Book | null> {
        try {
            const docRef = doc(this.firestore, this.collectionName, id);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? { id: docSnap.id, ...(docSnap.data() as Book) } : null;
        } catch (error) {
            console.error('Error getting book:', error);
            throw error;
        }
    }

    // UPDATE
    async updateBook(id: string, book: Partial<Book>): Promise<void> {
        try {
            const docRef = doc(this.firestore, this.collectionName, id);
            await updateDoc(docRef, book);
        } catch (error) {
            console.error('Error updating book:', error);
            throw error;
        }
    }

    // DELETE
    async deleteBook(id: string): Promise<void> {
        try {
            const docRef = doc(this.firestore, this.collectionName, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting book:', error);
            throw error;
        }
    }

    // SEARCH BY TITLE
    async getBooksByTitle(title: string): Promise<Book[]> {
        try {
            const q = query(collection(this.firestore, this.collectionName), where('title', '>=', title), where('title', '<=', title + '\uf8ff'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Book)
            }));
        } catch (error) {
            console.error('Error searching books by title:', error);
            throw error;
        }
    }

    // SEARCH BY AUTHOR
    async getBooksByAuthor(author: string): Promise<Book[]> {
        try {
            const q = query(collection(this.firestore, this.collectionName), where('author', '>=', author), where('author', '<=', author + '\uf8ff'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Book)
            }));
        } catch (error) {
            console.error('Error searching books by author:', error);
            throw error;
        }
    }

    // SEARCH BY ISBN
    async getBookByISBN(isbn: string): Promise<Book | null> {
        try {
            const q = query(collection(this.firestore, this.collectionName), where('isbn', '==', isbn));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length > 0) {
                const doc = querySnapshot.docs[0];
                return { id: doc.id, ...(doc.data() as Book) };
            }
            return null;
        } catch (error) {
            console.error('Error searching book by ISBN:', error);
            throw error;
        }
    }
}
