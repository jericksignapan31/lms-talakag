# PWA Icon Generation Scripts

This directory contains helper scripts to generate PWA icons for the LMS Talakag application.

## Available Scripts

### 1. PowerShell Script (Windows)
**File:** `Generate-PWA-Icons.ps1`

**Requirements:**
- Windows PowerShell
- ImageMagick installed

**Installation:**
```powershell
# Download and install ImageMagick from:
# https://imagemagick.org/script/download.php#windows
```

**Usage:**
```powershell
.\Generate-PWA-Icons.ps1
```

**Features:**
- ✓ Automatic validation of ImageMagick installation
- ✓ Checks source image exists
- ✓ Creates output directories
- ✓ Color-coded output
- ✓ File size reporting

---

### 2. Bash Script (Mac/Linux)
**File:** `generate-pwa-icons.sh`

**Requirements:**
- Bash shell
- ImageMagick installed

**Installation:**
```bash
# macOS
brew install imagemagick

# Ubuntu/Debian
sudo apt-get install imagemagick

# CentOS/RHEL
sudo yum install ImageMagick
```

**Usage:**
```bash
bash generate-pwa-icons.sh
```

**Features:**
- ✓ Cross-platform compatibility
- ✓ Automatic directory creation
- ✓ Generates all required sizes
- ✓ File listing after completion

---

### 3. Node.js Script (All Platforms - Recommended)
**File:** `generate-icons-nodejs.js`

**Requirements:**
- Node.js 12+
- `sharp` npm package

**Installation:**
```bash
npm install --save-dev sharp
```

**Usage:**
```bash
# Default (generates from src/assets/IISLogo.png to src/assets/)
node scripts/generate-icons-nodejs.js

# Custom source and output
node scripts/generate-icons-nodejs.js path/to/image.png output/directory
```

**Features:**
- ✓ No external dependencies (other than Node.js)
- ✓ Fastest option
- ✓ Cross-platform (Windows, Mac, Linux)
- ✓ Better color handling
- ✓ File size reporting
- ✓ Progress indicators

---

## Recommended Setup

### Best Option: Node.js Script (Recommended)
```bash
npm install --save-dev sharp
node scripts/generate-icons-nodejs.js
npm run build
```

### Alternative: Online Generator
1. Visit: https://www.pwabuilder.com/imageGenerator
2. Upload your logo image
3. Download generated icons
4. Extract to `src/assets/`
5. Run `npm run build`

### Manual Creation
Use Photoshop, GIMP, or any design tool to create these PNG files:
- `icon-72x72.png` (72×72)
- `icon-96x96.png` (96×96)
- `icon-128x128.png` (128×128)
- `icon-144x144.png` (144×144)
- `icon-152x152.png` (152×152)
- `icon-192x192.png` (192×192)
- `icon-384x384.png` (384×384)
- `icon-512x512.png` (512×512)

Plus screenshots:
- `screenshots/screenshot-1.png` (540×720)
- `screenshots/screenshot-2.png` (1280×720)

---

## Icon Specifications

### File Format
- Format: PNG
- Color space: RGB or RGBA
- Background: Transparent or white

### Sizes Required
| Size | Purpose | Must-Have |
|------|---------|-----------|
| 72×72 | Legacy | Optional |
| 96×96 | Legacy | Optional |
| 128×128 | Legacy | Optional |
| 144×144 | Tablet | Optional |
| 152×152 | iPad | Optional |
| 192×192 | Android | ✓ Yes |
| 384×384 | Large display | Optional |
| 512×512 | Splash screen | ✓ Yes |

**Note:** 192×192 and 512×512 are marked as "maskable" for better compatibility.

---

## Troubleshooting

### "ImageMagick not found"
**Solution:** Install ImageMagick from https://imagemagick.org/script/download.php

### "sharp not installed"
**Solution:** Run `npm install --save-dev sharp`

### "Convert command not recognized" (Windows)
**Solution:** 
1. Install ImageMagick
2. Restart PowerShell
3. Or use the Node.js script instead

### Generated icons too small/large
The scripts automatically resize to exact dimensions. If you want different quality:
- **Node.js:** Adjust the `fit` option in generate-icons-nodejs.js
- **ImageMagick:** Edit the conversion commands

### Icons not showing after build
1. Clear browser cache (Ctrl+Shift+Delete)
2. Rebuild: `npm run build`
3. Check DevTools Network tab for manifest.json loading

---

## Next Steps After Icon Generation

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Verify icons exist:**
   ```bash
   ls -la src/assets/icon-*.png
   ls -la src/assets/screenshots/
   ```

3. **Deploy to production:**
   - Copy `dist/sakai-ng` to your server
   - Ensure HTTPS is enabled
   - Test on device

4. **Test installation:**
   - Open app in browser
   - Look for "Install app" prompt
   - Complete installation
   - App should appear in home screen/app drawer

---

## Additional Resources

- [PWA Installation Criteria](https://web.dev/install-criteria/)
- [Web App Manifest Spec](https://www.w3.org/TR/appmanifest/)
- [ImageMagick Documentation](https://imagemagick.org/)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)

---

## Support

For more information, see:
- `PWA_SETUP_GUIDE.md` - Complete setup guide
- `PWA_QUICK_START.md` - Quick start instructions
- `PWA_FIX_SUMMARY.md` - Summary of changes made

