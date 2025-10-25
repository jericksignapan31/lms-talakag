# 🔧 PWA Install Not Showing? - Complete Fix Guide

## ❌ Problem
You don't see the "Install app" option in your browser.

## ✅ Root Cause

**Development mode** (`npm start`) does NOT show install prompts!

### Why?
- Service worker not active in dev mode
- PWA features disabled for development
- Install prompts require HTTPS + production build

---

## ✅ Solution: Test in Production Mode

### Step 1: Stop Current Server
Press `Ctrl + C` in your terminal

### Step 2: Build for Production
```bash
npm run build
```
⏱️ **Time**: ~15 seconds

### Step 3: Serve Production Build with HTTPS
```bash
npx http-server dist/sakai-ng/browser -p 8080 --ssl --cert cert.pem --key key.pem
```

### Step 4: Open in Browser
```
https://localhost:8080
```

### Step 5: Look for Install Prompt
- Wait 2-3 seconds
- Should see "Install" button in address bar (Chrome/Edge)
- Or try address bar dropdown

---

## 🔍 If Still Not Showing

### Check 1: Verify Manifest Loads
```
Open DevTools (F12)
→ Application tab
→ Manifest
Should show all fields without errors
```

### Check 2: Verify Service Worker
```
Open DevTools (F12)
→ Application tab
→ Service Workers
Should show "ngsw-worker.js" as "activated and running"
```

### Check 3: Check Console for Errors
```
Open DevTools (F12)
→ Console tab
Look for red error messages
Should be clean
```

### Check 4: Verify Icons Exist
```
Open: https://localhost:8080/assets/icon-192x192.png
Should download the image file
If 404 → icons weren't generated
```

---

## 🛠️ Complete Fix Process

### If Icons Missing
```bash
# Stop server (Ctrl + C)

# Generate icons
npm install --save-dev sharp --legacy-peer-deps
node scripts/generate-icons-nodejs.js

# Rebuild
npm run build

# Serve again
npx http-server dist/sakai-ng/browser -p 8080 --ssl --cert cert.pem --key key.pem
```

---

## 📋 PWA Requirements Checklist

For install prompt to appear:

✅ **Service Worker**
- [ ] `ngsw-worker.js` loads (Network tab)
- [ ] Shows "activated and running" (Application tab)

✅ **Manifest**
- [ ] `manifest.json` loads (Network tab)
- [ ] Has all required fields
- [ ] Icons paths correct

✅ **Icons**
- [ ] `icon-192x192.png` exists
- [ ] `icon-512x512.png` exists
- [ ] Other sizes exist (optional)

✅ **Security**
- [ ] HTTPS enabled (or localhost)
- [ ] Valid SSL certificate

✅ **Config**
- [ ] `display: "standalone"`
- [ ] `start_url` configured
- [ ] `theme_color` set

---

## 🎯 Quick Fix (Copy & Paste)

### Stop and restart in production mode

```bash
# Stop current server
Ctrl + C

# Build production
npm run build

# Serve with HTTPS
npx http-server dist/sakai-ng/browser -p 8080 --ssl --cert cert.pem --key key.pem

# Open browser
https://localhost:8080
```

Wait 2-3 seconds → Install prompt should appear! 🎉

---

## 🔑 Key Difference

| Mode | Install Prompt | Service Worker | Use For |
|------|---|---|---|
| **Development** (`npm start`) | ❌ NO | ⚠️ Disabled | Coding |
| **Production** (`npm run build`) | ✅ YES | ✅ Active | Testing PWA |

---

## 💡 Why Develop Mode Doesn't Show Install?

1. Service worker disabled (for fast reloads)
2. HTTP used (not HTTPS)
3. Dev not production-optimized
4. Development for coding, not testing PWA

Use production build to test install feature!

---

## 🚀 After Testing Locally

Once it works locally:

```bash
# Deploy to production server
# Upload: dist/sakai-ng/browser/
# Enable HTTPS on your server
# Open your domain
# Install prompt appears!
```

---

## ✨ Expected Result

After switching to production mode:

✅ Browser shows install prompt after 2-3 seconds
✅ Address bar shows install button
✅ Click to install
✅ App appears on home screen
✅ Works offline
✅ Perfect! 🎉

---

## 📚 Related Docs

- `DEPLOYMENT_READY.md` - Production deployment
- `HOW_TO_RUN.md` - All available commands
- `PWA_SETUP_GUIDE.md` - Detailed PWA setup

---

## 🎯 TL;DR (Quick Version)

```bash
# Stop dev server
Ctrl + C

# Build production
npm run build

# Serve production
npx http-server dist/sakai-ng/browser -p 8080 --ssl --cert cert.pem --key key.pem

# Open
https://localhost:8080

# Wait 2-3 seconds
# Install prompt appears!
```

**That's it!** 🎉

