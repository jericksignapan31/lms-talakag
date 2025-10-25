# 🎯 Quick Start Guide - Run LMS Talakag

## ⚡ Fastest Way to Run

### 1️⃣ Install (First Time Only)
```bash
npm install
```
⏱️ **Takes**: ~2-3 minutes

### 2️⃣ Run System
```bash
npm run start:dev
```
✅ Starts both:
- Angular app on port 4200
- API server on port 3000

⏱️ **Takes**: ~10-15 seconds

### 3️⃣ Open Browser
```
http://localhost:4200
```
✅ App ready to use!

---

## 📋 What You Get

```
✅ Angular dev server on http://localhost:4200
✅ JSON API server on http://localhost:3000
✅ Hot reload enabled (auto-refresh on changes)
✅ Ready to develop and test
```

---

## 🔄 Development Flow

```
Edit code in src/
        ↓
Auto-reload in browser
        ↓
See changes instantly
        ↓
Repeat!
```

---

## 🛑 Stop Running

Press `Ctrl + C` in terminal

---

## 📱 Build for PWA (Production)

```bash
npm run build
```

Output: `dist/sakai-ng/browser/`

Ready to deploy! 🚀

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| Port in use | `npm start -- --port 4300` |
| Dep errors | `npm install --legacy-peer-deps` |
| Build fails | `rm -r dist && npm run build` |

---

## ✅ You're Ready!

```bash
npm install
npm run start:dev
# Open http://localhost:4200
```

That's it! 🎉

