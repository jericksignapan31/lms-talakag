import { Injectable, inject } from '@angular/core';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where, Query, Timestamp } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';

export interface Borrowing {
    id?: string;
    studentLRN: string;
    studentName?: string;
    bookAccessionNumber: string;
    bookTitle?: string;
    bookISBN?: string;
    borrowDate: string; // YYYY-MM-DD format
    dueDate: string; // 2 weeks from borrowDate (YYYY-MM-DD)
    returnDate?: string; // When student returns the book (YYYY-MM-DD)
    status: 'borrowed' | 'returned' | 'overdue'; // borrowed, returned, overdue
    issuedBy?: string; // Librarian who issued
    createdAt?: string;
}

export interface Penalty {
    id?: string;
    studentLRN: string;
    studentName?: string;
    borrowingId: string;
    bookAccessionNumber: string;
    bookTitle?: string;
    amount: number; // Penalty amount in pesos (20 per day)
    daysOverdue: number;
    dateCreated: string; // When penalty was calculated
    paidDate?: string; // When student paid the penalty
    status: 'pending' | 'paid'; // pending or paid
    createdAt?: string;
}

@Injectable({
    providedIn: 'root'
})
export class FirestoreBorrowingService {
    private firebaseService = inject(FirebaseService);
    private firestore = this.firebaseService.firestore;
    private borrowingCollectionName = 'borrowing';
    private penaltyCollectionName = 'penalties';

    // ============ BORROWING OPERATIONS ============

    // CREATE - Borrow a book
    async borrowBook(borrowing: Borrowing): Promise<string> {
        try {
            const docRef = await addDoc(collection(this.firestore, this.borrowingCollectionName), {
                ...borrowing,
                createdAt: new Date().toISOString()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error borrowing book:', error);
            throw error;
        }
    }

    // READ - Get all borrowings
    async getBorrowings(): Promise<Borrowing[]> {
        try {
            const querySnapshot = await getDocs(collection(this.firestore, this.borrowingCollectionName));
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Borrowing)
            }));
        } catch (error) {
            console.error('Error getting borrowings:', error);
            throw error;
        }
    }

    // READ - Get borrowing by ID
    async getBorrowing(id: string): Promise<Borrowing | null> {
        try {
            const docRef = doc(this.firestore, this.borrowingCollectionName, id);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? { id: docSnap.id, ...(docSnap.data() as Borrowing) } : null;
        } catch (error) {
            console.error('Error getting borrowing:', error);
            throw error;
        }
    }

    // READ - Get borrowings by student LRN
    async getBorrowingsByStudent(studentLRN: string): Promise<Borrowing[]> {
        try {
            const q = query(collection(this.firestore, this.borrowingCollectionName), where('studentLRN', '==', studentLRN));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Borrowing)
            }));
        } catch (error) {
            console.error('Error getting borrowings by student:', error);
            throw error;
        }
    }

    // READ - Get active borrowings (not returned)
    async getActiveBorrowings(): Promise<Borrowing[]> {
        try {
            const q = query(collection(this.firestore, this.borrowingCollectionName), where('status', 'in', ['borrowed', 'overdue']));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Borrowing)
            }));
        } catch (error) {
            console.error('Error getting active borrowings:', error);
            throw error;
        }
    }

    // READ - Get overdue borrowings
    async getOverdueBorrowings(): Promise<Borrowing[]> {
        try {
            const today = new Date().toISOString().split('T')[0];
            const q = query(collection(this.firestore, this.borrowingCollectionName), where('status', '==', 'borrowed'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs
                .map((doc) => ({
                    id: doc.id,
                    ...(doc.data() as Borrowing)
                }))
                .filter((borrowing) => borrowing.dueDate < today);
        } catch (error) {
            console.error('Error getting overdue borrowings:', error);
            throw error;
        }
    }

    // UPDATE - Return a book
    async returnBook(id: string, returnDate: string): Promise<void> {
        try {
            const docRef = doc(this.firestore, this.borrowingCollectionName, id);
            await updateDoc(docRef, {
                returnDate: returnDate,
                status: 'returned'
            });
        } catch (error) {
            console.error('Error returning book:', error);
            throw error;
        }
    }

    // UPDATE - Mark as overdue
    async markAsOverdue(id: string): Promise<void> {
        try {
            const docRef = doc(this.firestore, this.borrowingCollectionName, id);
            await updateDoc(docRef, {
                status: 'overdue'
            });
        } catch (error) {
            console.error('Error marking as overdue:', error);
            throw error;
        }
    }

    // DELETE
    async deleteBorrowing(id: string): Promise<void> {
        try {
            const docRef = doc(this.firestore, this.borrowingCollectionName, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting borrowing:', error);
            throw error;
        }
    }

    // ============ PENALTY OPERATIONS ============

    // CREATE - Record a penalty
    async recordPenalty(penalty: Penalty): Promise<string> {
        try {
            const docRef = await addDoc(collection(this.firestore, this.penaltyCollectionName), {
                ...penalty,
                createdAt: new Date().toISOString()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error recording penalty:', error);
            throw error;
        }
    }

    // READ - Get penalties by student LRN
    async getPenaltiesByStudent(studentLRN: string): Promise<Penalty[]> {
        try {
            const q = query(collection(this.firestore, this.penaltyCollectionName), where('studentLRN', '==', studentLRN));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Penalty)
            }));
        } catch (error) {
            console.error('Error getting penalties by student:', error);
            throw error;
        }
    }

    // READ - Get all pending penalties
    async getPendingPenalties(): Promise<Penalty[]> {
        try {
            const q = query(collection(this.firestore, this.penaltyCollectionName), where('status', '==', 'pending'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Penalty)
            }));
        } catch (error) {
            console.error('Error getting pending penalties:', error);
            throw error;
        }
    }

    // UPDATE - Mark penalty as paid
    async markPenaltyAsPaid(id: string, paidDate: string): Promise<void> {
        try {
            const docRef = doc(this.firestore, this.penaltyCollectionName, id);
            await updateDoc(docRef, {
                status: 'paid',
                paidDate: paidDate
            });
        } catch (error) {
            console.error('Error marking penalty as paid:', error);
            throw error;
        }
    }

    // UTILITY - Calculate penalty amount
    calculatePenalty(dueDate: string, returnDate: string): { daysOverdue: number; penaltyAmount: number } {
        const due = new Date(dueDate);
        const returned = new Date(returnDate);
        const diffTime = returned.getTime() - due.getTime();
        const daysOverdue = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        const penaltyAmount = daysOverdue * 20; // 20 pesos per day

        return { daysOverdue, penaltyAmount };
    }

    // UTILITY - Check and auto-mark overdue books
    async checkAndMarkOverdue(): Promise<void> {
        try {
            const overdueBorrowings = await this.getOverdueBorrowings();
            for (const borrowing of overdueBorrowings) {
                if (borrowing.id && borrowing.status !== 'overdue') {
                    await this.markAsOverdue(borrowing.id);
                }
            }
        } catch (error) {
            console.error('Error checking overdue borrowings:', error);
            throw error;
        }
    }

    // UTILITY - Auto-calculate and create penalties for overdue books
    async autoCalculatePenalties(): Promise<void> {
        try {
            const overdueBorrowings = await this.getOverdueBorrowings();
            const today = new Date().toISOString().split('T')[0];

            for (const borrowing of overdueBorrowings) {
                // Check if penalty already exists for this borrowing
                const existingPenalties = await getDocs(query(collection(this.firestore, this.penaltyCollectionName), where('borrowingId', '==', borrowing.id)));

                if (existingPenalties.docs.length === 0 && borrowing.id) {
                    // No penalty exists, create one
                    const { daysOverdue, penaltyAmount } = this.calculatePenalty(borrowing.dueDate, today);
                    const penalty: Penalty = {
                        studentLRN: borrowing.studentLRN,
                        studentName: borrowing.studentName,
                        borrowingId: borrowing.id,
                        bookAccessionNumber: borrowing.bookAccessionNumber,
                        bookTitle: borrowing.bookTitle,
                        amount: penaltyAmount,
                        daysOverdue: daysOverdue,
                        dateCreated: today,
                        status: 'pending'
                    };
                    await this.recordPenalty(penalty);
                }
            }
        } catch (error) {
            console.error('Error calculating penalties:', error);
            throw error;
        }
    }
}
