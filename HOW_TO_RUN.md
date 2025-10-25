# 🚀 How to Run LMS Talakag System

## Quick Start (Development Mode)

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Start Development Server**
```bash
npm start
```

This will:
- Start Angular dev server at `http://localhost:4200`
- Enable hot reload (auto-refresh on code changes)
- Watch for file changes

### 3. **Open in Browser**
```
http://localhost:4200
```

---

## 🔧 Available Commands

### Development

**Start dev server:**
```bash
npm start
```
- Runs on `http://localhost:4200`
- Auto-reload enabled
- Source maps for debugging

**Watch mode (build without server):**
```bash
npm run watch
```
- Rebuilds on file changes
- Use with separate HTTP server

### Production

**Build for production:**
```bash
npm run build
```
- Optimized bundle
- Service worker included
- Output: `dist/sakai-ng/browser/`
- Ready for deployment

**Serve production build locally (with HTTPS):**
```bash
npx http-server dist/sakai-ng/browser -p 8080 --ssl --cert cert.pem --key key.pem
```
- Testing production build locally
- HTTPS required for PWA testing

### API & Testing

**Start JSON server (mock API):**
```bash
npm run start:api
```
- Runs on `http://localhost:3000`
- Uses `db.json` as mock database

**Start both (dev + API) simultaneously:**
```bash
npm run start:dev
```
- Runs Angular on `http://localhost:4200`
- Runs API on `http://localhost:3000`
- Uses concurrently

**Run unit tests:**
```bash
npm test
```
- Launches Karma test runner
- Watches for changes

**Format code:**
```bash
npm run format
```
- Uses Prettier to format code
- Applies project style rules

---

## 📋 Full Development Workflow

### Step 1: Setup
```bash
# Clone repository (if needed)
git clone <repository-url>
cd lms-talakag

# Install dependencies
npm install

# Install sharp (for PWA icon generation)
npm install --save-dev sharp --legacy-peer-deps
```

### Step 2: Start Development
```bash
# Option A: Start both Angular and API server
npm run start:dev

# Option B: Start only Angular (port 4200)
npm start

# Option C: Start only API server (port 3000)
npm run start:api
```

### Step 3: Open in Browser
```
http://localhost:4200
```

### Step 4: Make Changes
- Edit TypeScript files in `src/`
- Changes auto-reload in browser
- Check console for errors

### Step 5: Testing
- Build: `npm run build`
- Format: `npm run format`
- Test: `npm test`

---

## 🏗️ Project Structure

```
lms-talakag/
├── src/
│   ├── app/                    # Angular components & services
│   │   ├── components/         # Reusable components
│   │   ├── services/           # Services (Firebase, PWA, etc.)
│   │   ├── pages/              # Page components
│   │   └── layout/             # Layout components
│   ├── assets/                 # Images, logos, styles
│   ├── environments/           # Environment configs
│   └── main.ts                 # Entry point
├── public/                     # Static files (manifest.json, etc.)
├── dist/                       # Build output
├── package.json                # Dependencies
└── angular.json                # Angular config
```

---

## 🔌 Port Reference

| Service | Port | Command | URL |
|---------|------|---------|-----|
| Angular Dev | 4200 | `npm start` | `http://localhost:4200` |
| JSON API | 3000 | `npm run start:api` | `http://localhost:3000` |
| Production | 8080 | `npx http-server ...` | `https://localhost:8080` |

---

## 🌍 Environment Configuration

### Development Environment
File: `src/environments/environment.development.ts`

```typescript
export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000',
    firebase: { /* config */ }
};
```

### Production Environment
File: `src/environments/environment.ts`

```typescript
export const environment = {
    production: true,
    appUrl: 'https://lms-talakag.vercel.app',
    apiUrl: 'https://api.lms-talakag.com',
    firebase: { /* config */ }
};
```

---

## 🧪 Testing the PWA

### Local Testing (Development)

**1. Start dev server:**
```bash
npm start
```

**2. Test in browser DevTools (F12):**
- Application → Manifest → Should load
- Application → Service Workers → Should register
- Console → No major errors

**3. Install prompt won't appear in dev mode** (HTTPS required)

### Local Testing (Production Build)

**1. Build for production:**
```bash
npm run build
```

**2. Serve locally with HTTPS:**
```bash
npx http-server dist/sakai-ng/browser -p 8080 --ssl --cert cert.pem --key key.pem
```

**3. Open in browser:**
```
https://localhost:8080
```

**4. Check DevTools (F12):**
- Wait 2-3 seconds
- Service Worker should activate
- Install prompt should show on Chrome/Edge

**5. Test installation:**
- Click address bar dropdown
- Select "Install app"
- App should install to taskbar

---

## 🔐 Login Credentials

### Test Users (if configured in db.json)

Check `db.json` for available test accounts:

```bash
# View test data
cat db.json | grep -A 5 "users"
```

Or look in the app for:
- Admin credentials
- Teacher credentials
- Student credentials

---

## 🛠️ Troubleshooting

### Port Already in Use

**If port 4200 is in use:**
```bash
npm start -- --port 4300
```

**If port 3000 is in use:**
```bash
npm run start:api -- --port 3001
```

### Dependencies Issue

**If you get dependency errors:**
```bash
# Clear node_modules
rm -r node_modules package-lock.json

# Reinstall with legacy peer deps
npm install --legacy-peer-deps
```

### Build Errors

**Clean build:**
```bash
# Remove dist folder
rm -r dist

# Rebuild
npm run build
```

### Service Worker Not Working

**Check if enabled:**
```bash
# Development builds disable service worker
# Use production build to test PWA:
npm run build
npx http-server dist/sakai-ng/browser -p 8080 --ssl --cert cert.pem --key key.pem
```

---

## 📊 Development Tools

### Browser DevTools (F12)

**Essential tabs:**
- **Console**: See errors and logs
- **Network**: Check API calls and file loading
- **Application**: Service Worker, Cache, Storage
- **Sources**: Debug TypeScript
- **Performance**: Check load time

### VS Code Extensions (Recommended)

```
Angular Language Service
Prettier - Code formatter
ESLint
Thunder Client (API testing)
```

### API Testing

**Using Thunder Client or Postman:**

```
GET  http://localhost:3000/users
GET  http://localhost:3000/books
POST http://localhost:3000/borrowings
```

---

## 🚀 Deployment Commands

### Build Production Bundle

```bash
# Build with optimizations
npm run build

# Output location: dist/sakai-ng/browser/
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy to Firebase

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy
firebase deploy
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist/sakai-ng/browser
```

---

## 📝 Common Tasks

### Add New Component

```bash
ng generate component components/my-component
```

### Add New Service

```bash
ng generate service services/my-service
```

### Add New Page

```bash
ng generate component pages/my-page
```

### Format Code

```bash
npm run format
```

### Run Tests

```bash
ng test
```

---

## 🔄 Git Workflow

### Save Changes

```bash
# Check status
git status

# Stage changes
git add .

# Commit
git commit -m "Your message"

# Push to repository
git push origin main
```

---

## 📚 Additional Resources

- **Angular Docs**: https://angular.io/docs
- **Firebase Docs**: https://firebase.google.com/docs
- **PrimeNG Docs**: https://primeng.org/
- **Tailwind CSS**: https://tailwindcss.com/

---

## 🎯 Quick Reference

### Start System
```bash
npm run start:dev    # Angular + API
npm start            # Angular only
npm run start:api    # API only
```

### Build & Deploy
```bash
npm run build        # Build for production
npm run format       # Format code
npm test             # Run tests
```

### Development
```bash
npm start            # Start dev server (http://localhost:4200)
npm run watch        # Watch for changes
```

---

## 🆘 Need Help?

| Issue | Command |
|-------|---------|
| Clear cache | `npm cache clean --force` |
| Reinstall deps | `npm install --legacy-peer-deps` |
| Fix formatting | `npm run format` |
| Check errors | `npm run build` |
| Test app | `npm test` |

---

**Ready to start?** Run:

```bash
npm install
npm run start:dev
```

Then open: `http://localhost:4200` 🎉

