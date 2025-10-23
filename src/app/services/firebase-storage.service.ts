import { Injectable, inject } from '@angular/core';
import { FirebaseStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { FirebaseService } from './firebase.service';

@Injectable({
    providedIn: 'root'
})
export class FirebaseStorageService {
    private firebaseService = inject(FirebaseService);
    private storage: FirebaseStorage;

    constructor() {
        this.storage = this.firebaseService.storage;
    }

    /**
     * Upload a file to Firebase Storage
     * @param file - File to upload
     * @param path - Path in storage (e.g., 'students/photos/{userId}')
     * @returns Promise with download URL
     */
    async uploadFile(file: File, path: string): Promise<string> {
        try {
            const storageRef = ref(this.storage, path);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            console.log('File uploaded successfully:', downloadURL);
            return downloadURL;
        } catch (error: any) {
            console.error('Error uploading file:', error);
            throw new Error(`Upload failed: ${error.message}`);
        }
    }

    /**
     * Upload a student photo
     * @param file - Image file
     * @param studentId - Student ID or LRN
     * @returns Promise with download URL
     */
    async uploadStudentPhoto(file: File, studentId: string): Promise<string> {
        const timestamp = new Date().getTime();
        const fileName = `${studentId}_${timestamp}_${file.name}`;
        const path = `students/photos/${fileName}`;
        return this.uploadFile(file, path);
    }

    /**
     * Upload a profile photo
     * @param file - Image file
     * @param userId - User ID or email
     * @returns Promise with download URL
     */
    async uploadProfilePhoto(file: File, userId: string): Promise<string> {
        const timestamp = new Date().getTime();
        const fileName = `${userId}_${timestamp}_${file.name}`;
        const path = `profiles/photos/${fileName}`;
        return this.uploadFile(file, path);
    }

    /**
     * Delete a file from Firebase Storage
     * @param path - Full path of the file to delete
     */
    async deleteFile(path: string): Promise<void> {
        try {
            const storageRef = ref(this.storage, path);
            await deleteObject(storageRef);
            console.log('File deleted successfully');
        } catch (error: any) {
            console.error('Error deleting file:', error);
            throw new Error(`Delete failed: ${error.message}`);
        }
    }

    /**
     * Delete a student photo by URL
     * @param photoUrl - Download URL of the photo
     */
    async deleteStudentPhoto(photoUrl: string): Promise<void> {
        try {
            // Extract the file path from the download URL
            const path = this.extractPathFromUrl(photoUrl);
            if (path) {
                await this.deleteFile(path);
            }
        } catch (error: any) {
            console.warn('Could not delete photo from URL:', error);
        }
    }

    /**
     * Extract file path from Firebase download URL
     * @param url - Download URL
     * @returns File path or null
     */
    private extractPathFromUrl(url: string): string | null {
        try {
            // Firebase URL format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?...
            const urlObj = new URL(url);
            const encodedPath = urlObj.pathname.split('/o/')[1];
            if (encodedPath) {
                return decodeURIComponent(encodedPath.split('?')[0]);
            }
        } catch (error) {
            console.warn('Could not extract path from URL:', error);
        }
        return null;
    }

    /**
     * Validate image file
     * @param file - File to validate
     * @param maxSizeMB - Maximum file size in MB (default: 5)
     * @returns true if valid, false otherwise
     */
    isValidImageFile(file: File, maxSizeMB: number = 5): boolean {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const maxSizeBytes = maxSizeMB * 1024 * 1024;

        if (!validTypes.includes(file.type)) {
            console.warn('Invalid file type. Allowed: JPEG, PNG, GIF, WebP');
            return false;
        }

        if (file.size > maxSizeBytes) {
            console.warn(`File size exceeds ${maxSizeMB}MB limit`);
            return false;
        }

        return true;
    }
}
