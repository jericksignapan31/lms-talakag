# Firebase Storage - Photo Upload Guide

## Overview
I've created a `FirebaseStorageService` that handles all file uploads to Firebase Storage. This guide shows you how to use it.

## Setup

The service is already configured at:
```
src/app/services/firebase-storage.service.ts
```

## Basic Usage

### 1. **Upload a Student Photo**

```typescript
import { FirebaseStorageService } from './services/firebase-storage.service';

export class StudentComponent {
    constructor(private storageService: FirebaseStorageService) {}

    async onPhotoSelected(event: any) {
        const file = event.target.files[0];
        
        // Validate the image
        if (!this.storageService.isValidImageFile(file)) {
            console.error('Invalid image file');
            return;
        }

        try {
            // Upload the photo
            const downloadURL = await this.storageService.uploadStudentPhoto(file, studentId);
            console.log('Photo uploaded:', downloadURL);
            // Save the downloadURL to your database
        } catch (error) {
            console.error('Upload failed:', error);
        }
    }
}
```

### 2. **Upload a Profile Photo**

```typescript
async uploadProfilePicture(file: File, userId: string) {
    try {
        const url = await this.storageService.uploadProfilePhoto(file, userId);
        // Save URL to user profile in Firestore
        return url;
    } catch (error) {
        console.error('Upload failed:', error);
    }
}
```

### 3. **Upload with Custom Path**

```typescript
async uploadCustomFile(file: File, customPath: string) {
    try {
        const url = await this.storageService.uploadFile(file, customPath);
        return url;
    } catch (error) {
        console.error('Upload failed:', error);
    }
}

// Example usage:
// const url = await this.uploadCustomFile(file, 'documents/invoices/invoice_2025.pdf');
```

## HTML Template Example

```html
<!-- File Input -->
<input 
    type="file" 
    accept="image/*" 
    (change)="onPhotoSelected($event)"
    #fileInput
/>

<!-- Preview -->
<img *ngIf="photoURL" [src]="photoURL" alt="Photo" class="w-24 h-24 rounded" />

<!-- Upload Button -->
<button 
    (click)="uploadPhoto()"
    [disabled]="!selectedFile || uploading"
>
    {{ uploading ? 'Uploading...' : 'Upload Photo' }}
</button>
```

## Component Implementation

```typescript
import { Component, inject } from '@angular/core';
import { FirebaseStorageService } from './services/firebase-storage.service';

@Component({
    selector: 'app-photo-upload',
    template: `
        <div>
            <input 
                type="file" 
                accept="image/*" 
                (change)="onFileSelected($event)"
            />
            <img *ngIf="photoURL" [src]="photoURL" alt="Photo" class="w-32 h-32" />
            <button 
                (click)="uploadPhoto()"
                [disabled]="!selectedFile || uploading"
            >
                {{ uploading ? 'Uploading...' : 'Upload' }}
            </button>
        </div>
    `
})
export class PhotoUploadComponent {
    private storageService = inject(FirebaseStorageService);
    
    selectedFile: File | null = null;
    photoURL: string | null = null;
    uploading = false;

    onFileSelected(event: any) {
        this.selectedFile = event.target.files[0];
    }

    async uploadPhoto() {
        if (!this.selectedFile) return;

        // Validate (5MB max)
        if (!this.storageService.isValidImageFile(this.selectedFile, 5)) {
            alert('Invalid image or file too large (max 5MB)');
            return;
        }

        this.uploading = true;
        try {
            this.photoURL = await this.storageService.uploadStudentPhoto(
                this.selectedFile, 
                'student-123'
            );
            alert('Photo uploaded successfully!');
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed');
        } finally {
            this.uploading = false;
        }
    }
}
```

## Service Methods

### `uploadFile(file, path)`
Upload any file to custom path

**Parameters:**
- `file: File` - The file to upload
- `path: string` - Storage path (e.g., 'students/photos/photo.jpg')

**Returns:** Promise with download URL

**Example:**
```typescript
const url = await this.storageService.uploadFile(file, 'documents/resume.pdf');
```

---

### `uploadStudentPhoto(file, studentId)`
Upload student photo automatically

**Parameters:**
- `file: File` - Image file
- `studentId: string` - Student ID or LRN

**Returns:** Promise with download URL

**Example:**
```typescript
const url = await this.storageService.uploadStudentPhoto(file, '1234567890');
// Saves to: students/photos/{studentId}_{timestamp}_{filename}
```

---

### `uploadProfilePhoto(file, userId)`
Upload user profile photo

**Parameters:**
- `file: File` - Image file
- `userId: string` - User ID or email

**Returns:** Promise with download URL

**Example:**
```typescript
const url = await this.storageService.uploadProfilePhoto(file, 'user@example.com');
// Saves to: profiles/photos/{userId}_{timestamp}_{filename}
```

---

### `deleteFile(path)`
Delete a file from storage

**Parameters:**
- `path: string` - Full path of file to delete

**Example:**
```typescript
await this.storageService.deleteFile('students/photos/photo.jpg');
```

---

### `deleteStudentPhoto(photoUrl)`
Delete student photo by download URL

**Parameters:**
- `photoUrl: string` - Download URL

**Example:**
```typescript
await this.storageService.deleteStudentPhoto(downloadURL);
```

---

### `isValidImageFile(file, maxSizeMB)`
Validate image file before upload

**Parameters:**
- `file: File` - File to validate
- `maxSizeMB: number` - Max size in MB (default: 5)

**Returns:** boolean

**Allowed formats:** JPEG, PNG, GIF, WebP

**Example:**
```typescript
if (this.storageService.isValidImageFile(file, 10)) {
    // File is valid
}
```

## Storage Structure

Files are organized as follows:

```
Firebase Storage/
├── students/
│   └── photos/
│       ├── 1234567890_1729700400_photo.jpg
│       ├── 1234567891_1729700401_photo.png
│       └── ...
├── profiles/
│   └── photos/
│       ├── user@email.com_1729700400_profile.jpg
│       └── ...
└── documents/
    └── (other file types)
```

## Error Handling

The service throws errors with descriptive messages:

```typescript
try {
    const url = await this.storageService.uploadStudentPhoto(file, studentId);
} catch (error) {
    if (error.message.includes('Upload failed')) {
        console.error('Network or permission error');
    }
}
```

## Security Rules

Make sure your Firebase Storage rules allow uploads. Add this to Firebase Console:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload to their folders
    match /students/photos/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
    match /profiles/photos/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
    // Allow anyone to read (public access)
    match /{allPaths=**} {
      allow read: if true;
    }
  }
}
```

## Best Practices

✅ **Always validate files before upload**
```typescript
if (!this.storageService.isValidImageFile(file)) {
    return; // Don't upload invalid files
}
```

✅ **Use unique file paths with timestamps**
```typescript
// Service automatically adds timestamps
const path = `documents/${Date.now()}_${file.name}`;
```

✅ **Show loading state during upload**
```typescript
this.uploading = true;
try {
    // upload
} finally {
    this.uploading = false;
}
```

✅ **Store download URLs in Firestore**
```typescript
const photoURL = await this.storageService.uploadStudentPhoto(file, studentId);
// Save to Firestore
await this.studentService.updateStudent(studentId, { photoURL });
```

✅ **Delete old photos when updating**
```typescript
// Delete old photo
if (student.photoURL) {
    await this.storageService.deleteStudentPhoto(student.photoURL);
}
// Upload new photo
const newURL = await this.storageService.uploadStudentPhoto(file, studentId);
```

## Troubleshooting

### "Upload failed: Permission denied"
- Check Firebase Storage rules in console
- Ensure user is authenticated
- Check that path is correct

### "File size exceeds 5MB limit"
- Compress image before uploading
- Use `isValidImageFile(file, 10)` for 10MB limit
- Consider using image compression libraries

### "Download URL returns 403"
- Storage rules might be too restrictive
- Check public read access is enabled
- Verify file was actually uploaded

### Console shows "CORS error"
- Firebase Storage handles CORS automatically
- If issue persists, check security rules

---

**Happy uploading!** 📸
