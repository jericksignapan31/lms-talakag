# Firebase Storage - Upgrade to Blaze Plan

## Problem

You're seeing: **"To use Storage, upgrade your project's billing plan"**

This means your Firebase project is on the **Spark Plan** (free tier), which doesn't include Cloud Storage.

---

## Solution: Upgrade to Blaze Plan

### Step 1: Open Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Sign in with your Google account
3. Select your project: **lams-talakag**

### Step 2: Go to Billing

1. Click **⚙️ Settings** (gear icon) in top right
2. Select **Project settings**
3. Click the **Billing** tab
4. Or directly click **Upgrade** button you see on the screen

### Step 3: Choose Blaze Plan

1. Click **Upgrade to Blaze**
2. You'll be directed to Google Cloud Console
3. Click **Set up a billing account**
4. Follow Google's instructions:
   - Enter your credit card information
   - Verify billing details
   - Complete setup

### Step 4: Confirm Upgrade

After billing is set up:
1. Return to Firebase Console
2. Your project should now be on **Blaze Plan**
3. Go to **Storage** in left sidebar
4. You should see the option to **Create bucket** or **Get Started**

---

## Blaze Plan Pricing

### ✅ What's Included FREE (Monthly):

- **Storage**: 5GB
- **Download bandwidth**: 1GB
- **Upload bandwidth**: Unlimited
- **Operations**: Generous free tier

### 💰 If you exceed free tier:

| Service | Price |
|---------|-------|
| Storage | $0.18/GB (after 5GB) |
| Download | $0.12/GB (after 1GB) |
| Upload | Free |
| Operations | Very cheap (per 10k ops) |

### Example Monthly Cost:

- **Small LMS (5-10 students)**: ~$0/month (within free tier)
- **Medium LMS (50-100 students)**: ~$0-5/month
- **Large LMS (1000+ students)**: ~$10-50/month

---

## Step-by-Step Screenshots Guide

### Step 1: Settings
```
Firebase Console (top right)
   ↓
⚙️ Settings icon
   ↓
Project settings
```

### Step 2: Billing
```
Project settings page
   ↓
Click "Billing" tab
   ↓
"Upgrade to Blaze" button
```

### Step 3: Payment
```
Payment screen
   ↓
Enter credit card
   ↓
Complete verification
   ↓
Upgrade complete!
```

---

## After Upgrade: Create Storage Bucket

1. In Firebase Console, go to **Build** → **Storage**
2. Click **Get Started** or **Create bucket**
3. Choose location: **asia-southeast1** (Singapore)
4. Keep default security rules
5. Click **Create**
6. Done! Storage is ready to use

---

## Enable Cloud Storage (if needed)

If Storage still shows disabled:

1. Go to **Google Cloud Console** (link in Firebase)
2. Enable **Cloud Storage API**
3. Return to Firebase Console
4. Refresh page
5. Storage should now work

---

## Verify Storage is Working

1. In Firebase Console, go to **Storage**
2. You should see:
   - Blue **Upload file** button
   - **Create folder** button
   - Storage browser (empty at first)

If you see these, Storage is ready! ✅

---

## Alternative: Use Free Alternatives

If you don't want to upgrade to paid:

### Option 1: Firestore with Base64 Images
- Store small images as Base64 in Firestore
- Not recommended (data usage increases)
- Limited to ~1MB per field

### Option 2: External Free Storage
- Use free services like **Imgur**, **Cloudinary**, or **imgbb**
- Generate public URLs manually
- Store URLs in Firestore

### Option 3: Use only LMS without photos
- Skip photo uploads entirely
- Just use names and LRNs
- Add photos later when you upgrade

---

## FAQ

### Q: Do I have to pay monthly?

**A:** Not necessarily! If you stay within the free tier (5GB storage, 1GB download), you pay **$0/month**. You only pay when you exceed the limits.

### Q: Can I downgrade later?

**A:** Yes! You can delete the billing account anytime, but your project will become read-only for Cloud Storage.

### Q: Is my data safe?

**A:** Yes! Google manages all security. Your data is encrypted and backed up.

### Q: How long does it take to activate?

**A:** Usually 5-15 minutes after payment verification.

### Q: Can I use a debit card?

**A:** Yes! Most debit cards work. Google requires verification (small charge, then refund).

---

## Checklist

- [ ] Opened Firebase Console
- [ ] Clicked Settings → Project settings
- [ ] Clicked Billing tab
- [ ] Clicked "Upgrade to Blaze"
- [ ] Added payment method
- [ ] Verified billing
- [ ] Project upgraded to Blaze Plan
- [ ] Created Storage bucket in asia-southeast1
- [ ] Tested upload by creating a test folder
- [ ] Ready to use Storage!

---

## Next Steps After Upgrade

Once Storage is active:

1. **Create folder structure** in Firebase Console:
   ```
   students/photos/
   profiles/photos/
   documents/
   ```

2. **Upload test files** manually

3. **Copy download URLs** and use them in your app

4. **Or use code upload** with the `FirebaseStorageService` I created

---

## Need Help?

If you're stuck:

1. Check [Firebase Pricing Page](https://firebase.google.com/pricing)
2. Review [Firebase Storage Setup](https://firebase.google.com/docs/storage/web/start)
3. Check Google Cloud Billing documentation

---

**You're just one upgrade away from using Cloud Storage!** 🚀

