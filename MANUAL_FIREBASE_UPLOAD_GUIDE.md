# Manual Upload to Firebase Storage - Step by Step Guide

## What is Firebase Storage?

Firebase Storage is a cloud service where you can store photos, videos, documents, and other files. You can upload files manually through the Firebase Console without writing code.

---

## Step 1: Open Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Sign in with your Google account
3. Select your project: **lams-talakag**

---

## Step 2: Navigate to Storage

1. In the left sidebar, click on **Build** section
2. Click on **Storage**
3. You'll see the Storage dashboard

If Storage is not initialized yet:
- Click **Get Started** or **Create bucket**
- Choose location: **asia-southeast1** (Singapore)
- Keep default security rules
- Click **Create**

---

## Step 3: Upload Files

### Method 1: Upload Button (Easiest)

1. Click the blue **Upload file** button at the top
2. Select your image/file from your computer
3. Wait for upload to complete
4. The file appears in the list

### Method 2: Drag and Drop

1. Simply drag files from your computer
2. Drop them into the Storage area
3. Files upload automatically

### Method 3: Create Folders First (Recommended)

Better organization - create folders first:

1. Click **Create folder**
2. Enter folder name: `students`
3. Click **Create**
4. Inside `students`, click **Create folder** again
5. Enter: `photos`
6. Now you have: `students > photos > [upload files here]`

**Repeat for other folders:**
- `profiles > photos`
- `documents`
- `announcements`

---

## Step 4: View Uploaded Files

In the Storage dashboard, you'll see:

```
📦 Storage Root
├── 📁 students
│   └── 📁 photos
│       ├── student1_photo.jpg
│       ├── student2_photo.jpg
│       └── ...
├── 📁 profiles
│   └── 📁 photos
│       ├── profile_pic.jpg
│       └── ...
└── 📁 documents
    └── document.pdf
```

---

## Step 5: Get Download URLs

Each uploaded file has a **Download URL** that you can use:

1. Click on any file in the list
2. In the **File details** panel on the right
3. Copy the **Download URL**
4. This URL looks like:
```
https://firebasestorage.googleapis.com/v0/b/lams-talakag.appspot.com/o/students%2Fphotos%2Fstudent1.jpg?alt=media&token=xxxxx
```

---

## Step 6: Delete Files

1. Click on the file you want to delete
2. Click the **Delete** button (trash icon)
3. Confirm deletion
4. File is removed from storage

---

## Complete Folder Structure Example

Here's a recommended folder structure for your LMS:

```
Firebase Storage (Root)
│
├── 📁 students
│   ├── 📁 photos
│   │   ├── 1234567890_photo.jpg
│   │   ├── 1234567891_photo.jpg
│   │   └── ...
│   └── 📁 documents
│       ├── transcript_1234567890.pdf
│       └── ...
│
├── 📁 profiles
│   └── 📁 photos
│       ├── admin_profile.jpg
│       ├── teacher_profile.jpg
│       └── ...
│
├── 📁 announcements
│   └── banner_image.jpg
│
├── 📁 courses
│   ├── 📁 photos
│   │   └── course_banner.jpg
│   └── 📁 materials
│       └── course_material.pdf
│
└── 📁 uploads
    └── (temporary uploads)
```

---

## Using Downloaded URLs in Your App

Once you have a download URL, you can use it in your Angular app:

### In HTML Template:
```html
<!-- Display student photo -->
<img [src]="'https://firebasestorage.googleapis.com/v0/b/lams-talakag.appspot.com/o/students%2Fphotos%2Fstudent1.jpg?alt=media&token=xxxxx'" 
     alt="Student Photo" 
     class="w-24 h-24 rounded" />
```

### In TypeScript Component:
```typescript
export class StudentComponent {
    student = {
        name: 'Juan Santos',
        lrn: '1234567890',
        // Store the download URL here
        photoURL: 'https://firebasestorage.googleapis.com/v0/b/lams-talakag.appspot.com/o/students%2Fphotos%2Fstudent1.jpg?alt=media&token=xxxxx'
    };
}
```

### Save URL to Firestore:
```typescript
// Save the download URL in Firestore
await this.studentService.updateStudent(studentId, {
    photoURL: 'https://firebasestorage.googleapis.com/v0/b/lams-talakag.appspot.com/o/students%2Fphotos%2Fstudent1.jpg?alt=media&token=xxxxx'
});
```

---

## Firebase Storage Dashboard Controls

| Control | What it does |
|---------|------------|
| **Upload file** | Upload single file from computer |
| **Create folder** | Create new folder for organization |
| **Delete** | Remove file or folder |
| **Download** | Download file to your computer |
| **File details** | View file info and download URL |
| **Copy URL** | Copy download link (on file detail panel) |

---

## Important Notes

⚠️ **File Size Limits:**
- Free tier: 5GB per month
- Each file can be any size (recommended: < 100MB)
- Large files take longer to upload

⚠️ **File Names:**
- Use simple names (avoid special characters)
- Include file extension (.jpg, .png, .pdf)
- Example good names:
  - `student_photo.jpg` ✅
  - `document.pdf` ✅
  - `file-name-123.png` ✅
  
- Example bad names:
  - `photo!!!.jpg` ❌
  - `doc` (no extension) ❌
  - `فoto` (Arabic letters) ❌

⚠️ **Security:**
- Any file with a download URL can be accessed by anyone
- Don't upload sensitive personal information as public
- For private files, set up Firebase Security Rules

---

## Security Rules (Optional)

To restrict who can access files, you can set rules in Firebase Console:

1. Go to **Storage** → **Rules** tab
2. Replace the code with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to read and write
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

This allows only logged-in users to access files.

---

## Quick Checklist

- [ ] Project selected: **lams-talakag**
- [ ] Storage initialized in Singapore (asia-southeast1)
- [ ] Created folder structure (students/photos, profiles/photos, etc.)
- [ ] Uploaded test files
- [ ] Copied download URLs
- [ ] Tested URLs in browser (images display)
- [ ] Ready to use in Angular app

---

## Troubleshooting

### "Storage bucket not found"
- Go to Storage tab in Firebase Console
- Click **Get Started** to create bucket
- Select region: **asia-southeast1**

### "File won't upload"
- Check file size (should be under 100MB)
- Check file type (ensure it's a valid format)
- Try refreshing the page
- Check internet connection

### "Download URL shows blank image"
- Copy the full URL (including token)
- Paste in new browser tab to test
- Check if URL is public (no special security rules)

### "Can't see files I uploaded"
- Refresh the Storage page (F5)
- Clear browser cache
- Check correct folder path

---

## Next Steps

Once you have URLs uploaded:

1. **Add photo field to Student form** - Users can paste URLs
2. **Create photo upload component** - Use code upload (FirebaseStorageService)
3. **Display photos in table** - Show thumbnail in student list
4. **Allow bulk import** - Include photoURL in CSV import

Would you like me to help with any of these? 📸

---

**Happy uploading!** 🚀
