# PWA Installation Fix Guide

## ✅ Changes Made

The PWA system has been updated to allow app installation. Here's what was fixed:

### 1. **manifest.json** (`public/manifest.json`)
   - ✅ Added `maskable` purpose to 192x192 and 512x512 icons
   - ✅ Added required screenshot with `form_factor` fields
   - ✅ Fixed icon paths (changed from relative to absolute paths)
   - ✅ Added second screenshot for wide displays

### 2. **index.html** (`src/index.html`)
   - ✅ Added `viewport-fit=cover` for notch support
   - ✅ Added `mobile-web-app-capable` meta tag
   - ✅ Added `apple-mobile-web-app-capable` meta tag
   - ✅ Added `apple-mobile-web-app-status-bar-style` meta tag
   - ✅ Added `apple-mobile-web-app-title` meta tag
   - ✅ Fixed manifest.json path (absolute path)
   - ✅ Added multiple apple-touch-icon sizes
   - ✅ Added Windows tile color configuration

### 3. **ngsw-config.json**
   - ✅ Added `updateMode: "prefetch"` for app assets
   - ✅ Added manifest.json to prefetch resources
   - ✅ Added dedicated icons asset group
   - ✅ Improved caching strategy for offline support

### 4. **PWA Service** (`src/app/services/pwa.service.ts`)
   - ✅ Added install prompt handling (`beforeinstallprompt` event listener)
   - ✅ Added `triggerInstallPrompt()` method for manual installation
   - ✅ Added app installation detection
   - ✅ Added `installPrompt$` observable for UI integration
   - ✅ Added `isAppInstalled$` observable for display mode detection

### 5. **browserconfig.xml** (`public/browserconfig.xml`)
   - ✅ Added Windows tile configuration

## 🚀 Next Steps

### Generate PWA Icons

You need to generate icons in various sizes for PWA installation to work properly.

#### Option 1: Using ImageMagick (Recommended)

1. Install ImageMagick:
   - **Windows**: `choco install imagemagick`
   - **Mac**: `brew install imagemagick`
   - **Linux**: `sudo apt-get install imagemagick`

2. Run the icon generation script:
   ```bash
   bash scripts/generate-pwa-icons.sh
   ```

   Or manually generate icons from your logo:
   ```bash
   mkdir -p src/assets/screenshots
   
   # Generate icons
   convert src/assets/IISLogo.png -resize 72x72 -background white -gravity center -extent 72x72 src/assets/icon-72x72.png
   convert src/assets/IISLogo.png -resize 96x96 -background white -gravity center -extent 96x96 src/assets/icon-96x96.png
   convert src/assets/IISLogo.png -resize 128x128 -background white -gravity center -extent 128x128 src/assets/icon-128x128.png
   convert src/assets/IISLogo.png -resize 144x144 -background white -gravity center -extent 144x144 src/assets/icon-144x144.png
   convert src/assets/IISLogo.png -resize 152x152 -background white -gravity center -extent 152x152 src/assets/icon-152x152.png
   convert src/assets/IISLogo.png -resize 192x192 -background white -gravity center -extent 192x192 src/assets/icon-192x192.png
   convert src/assets/IISLogo.png -resize 384x384 -background white -gravity center -extent 384x384 src/assets/icon-384x384.png
   convert src/assets/IISLogo.png -resize 512x512 -background white -gravity center -extent 512x512 src/assets/icon-512x512.png
   
   # Generate screenshots
   convert src/assets/IISLogo.png -resize 540x720 -background white -gravity center -extent 540x720 src/assets/screenshots/screenshot-1.png
   convert src/assets/IISLogo.png -resize 1280x720 -background white -gravity center -extent 1280x720 src/assets/screenshots/screenshot-2.png
   ```

#### Option 2: Using Online PWA Icon Generator
- Visit: https://www.pwabuilder.com/imageGenerator
- Upload your IISLogo.png
- Download the generated icons and place them in `src/assets/`

#### Option 3: Manual Creation
- Create icons using your design software (Photoshop, GIMP, etc.)
- Save as PNG files with proper dimensions in `src/assets/`

### Integrate Install Button (Optional)

Add this to any component where you want to show an install button:

```typescript
import { Component, inject } from '@angular/core';
import { PwaService } from './services/pwa.service';

@Component({
  selector: 'app-install-button',
  template: `
    @if (showInstallButton$ | async) {
      <button (click)="installApp()" class="install-btn">
        📱 Install App
      </button>
    }
  `
})
export class InstallButtonComponent {
  private pwaService = inject(PwaService);
  showInstallButton$ = this.pwaService.installPrompt$.pipe(
    map(prompt => prompt !== null)
  );

  async installApp() {
    const success = await this.pwaService.triggerInstallPrompt();
    if (success) {
      console.log('App installation initiated');
    }
  }
}
```

## 📱 Testing PWA Installation

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Test locally with HTTPS** (required for PWA):
   ```bash
   npx http-server dist/sakai-ng -p 8080 --ssl --cert cert.pem --key key.pem
   ```

3. **Open in browser:**
   - Chrome/Edge: Look for "Install app" prompt in address bar
   - Safari (iOS): Tap Share → Add to Home Screen
   - Android: Tap menu → Install app

## ✨ Features Enabled

- ✅ Download as native app (Chrome, Edge, Firefox, Safari)
- ✅ Works offline with service worker caching
- ✅ Appears in app drawer/home screen
- ✅ Automatic updates when new version is available
- ✅ PWA installation prompt detection
- ✅ Maskable icons for better display
- ✅ Multiple icon sizes for different devices
- ✅ Windows tile support

## 🐛 Troubleshooting

### App won't install?
- Check console for errors (F12 → Console)
- Ensure manifest.json is served with correct MIME type
- Service worker must be registered (check Application tab)
- HTTPS is required (except localhost)
- Wait 2-3 seconds for manifest to load

### Icons not showing?
- Check if icon files exist in `src/assets/`
- Verify paths in manifest.json are correct
- Clear browser cache
- Rebuild: `npm run build`

### Service worker not working?
- Check if PWA_CONFIG is properly imported in main app
- Ensure production build: `ng build`
- Check Network tab in DevTools for ngsw-worker.js

## 📚 References

- [Web App Manifest Spec](https://www.w3.org/TR/appmanifest/)
- [PWA Installation Criteria](https://web.dev/install-criteria/)
- [Android Install Prompt](https://web.dev/customize-install/)
- [Apple PWA Support](https://developer.apple.com/news/?id=w6rm6rq9)
