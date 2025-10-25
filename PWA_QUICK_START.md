# 🚀 PWA Installation - Quick Start

## ⚡ 3-Step Process to Enable App Installation

### Step 1: Generate Icons (Choose One Method)

#### Windows Users (PowerShell):
```powershell
.\scripts\Generate-PWA-Icons.ps1
```

#### Mac/Linux Users (Bash):
```bash
bash scripts/generate-pwa-icons.sh
```

#### Or Use Online Tool:
- Go to: https://www.pwabuilder.com/imageGenerator
- Upload `src/assets/IISLogo.png`
- Download and extract to `src/assets/`

### Step 2: Build Production Version
```bash
npm run build
```

### Step 3: Deploy & Test
- Deploy dist folder to your server
- Ensure HTTPS is enabled (required for PWA)
- Open in browser and look for install prompt

## ✅ Verification Checklist

After building, check these in browser DevTools (F12):

1. **Application Tab**
   - [ ] Service Worker registered
   - [ ] Manifest file loaded
   - [ ] Icons visible

2. **Console Tab**
   - [ ] No CORS errors
   - [ ] No manifest errors

3. **Network Tab**
   - [ ] manifest.json loads (200 status)
   - [ ] ngsw-worker.js loads (200 status)

## 🎯 Installation Should Now Work On:

✅ Google Chrome / Microsoft Edge  
✅ Samsung Internet  
✅ Firefox (Android)  
✅ Safari (iOS/macOS)  
✅ Opera (Android)  

## 📱 How to Install

### Chrome/Edge (Desktop & Android)
1. Click address bar dropdown
2. Click "Install [App Name]"
3. Click "Install"

### Safari (iOS)
1. Tap Share icon
2. Tap "Add to Home Screen"
3. Tap "Add"

### Firefox (Android)
1. Tap menu (⋯)
2. Tap "Install"
3. Tap "Add"

## 🆘 Troubleshooting

**No install button appears?**
- Check browser console for errors
- Ensure HTTPS is enabled
- Clear cache and reload
- Wait a few seconds for service worker

**Icons don't show?**
- Generate PNG icons in correct sizes
- Place in `src/assets/`
- Rebuild: `npm run build`

**Service worker not working?**
- Check Application tab in DevTools
- Look for ngsw-worker.js in Network tab
- Check PWA_CONFIG in app.config.ts

## 📚 Complete Documentation

See `PWA_SETUP_GUIDE.md` for full setup and troubleshooting guide.

---

**Ready?** Generate icons and build! 🎉
