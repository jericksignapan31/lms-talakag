#!/usr/bin/env node

/**
 * PWA Icon Generator - Node.js Version
 * Alternative to ImageMagick for generating PWA icons
 * 
 * Usage: node scripts/generate-icons-nodejs.js [source-image] [output-dir]
 * Example: node scripts/generate-icons-nodejs.js src/assets/IISLogo.png src/assets
 * 
 * Requires: npm install sharp
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is installed
try {
    var sharp = require('sharp');
} catch (error) {
    console.error('❌ sharp is not installed');
    console.log('\nPlease install it first:');
    console.log('  npm install --save-dev sharp');
    console.log('\nThen run this script again.');
    process.exit(1);
}

const sourceImage = process.argv[2] || 'src/assets/IISLogo.png';
const outputDir = process.argv[3] || 'src/assets';
const screenshotDir = path.join(outputDir, 'screenshots');

// Validate source image
if (!fs.existsSync(sourceImage)) {
    console.error(`❌ Source image not found: ${sourceImage}`);
    process.exit(1);
}

console.log('🔧 Generating PWA icons...\n');
console.log(`📁 Source: ${sourceImage}`);
console.log(`📁 Output: ${outputDir}\n`);

// Create output directories
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
}

// Icon sizes to generate
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Generate icons
const iconPromises = iconSizes.map(size => {
    return new Promise((resolve, reject) => {
        const output = path.join(outputDir, `icon-${size}x${size}.png`);
        process.stdout.write(`  Generating icon-${size}x${size}.png... `);
        
        sharp(sourceImage)
            .resize(size, size, {
                fit: 'contain',
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            })
            .png()
            .toFile(output)
            .then(() => {
                console.log('✓');
                resolve();
            })
            .catch(err => {
                console.log('✗');
                reject(err);
            });
    });
});

// Generate screenshots
const screenshotSpecs = [
    { size: { width: 540, height: 720 }, name: 'screenshot-1.png', desc: 'Mobile (540x720)' },
    { size: { width: 1280, height: 720 }, name: 'screenshot-2.png', desc: 'Desktop (1280x720)' }
];

const screenshotPromises = screenshotSpecs.map(spec => {
    return new Promise((resolve, reject) => {
        const output = path.join(screenshotDir, spec.name);
        process.stdout.write(`  Generating ${spec.desc}... `);
        
        sharp(sourceImage)
            .resize(spec.size.width, spec.size.height, {
                fit: 'contain',
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            })
            .png()
            .toFile(output)
            .then(() => {
                console.log('✓');
                resolve();
            })
            .catch(err => {
                console.log('✗');
                reject(err);
            });
    });
});

// Execute all promises
Promise.all([...iconPromises, ...screenshotPromises])
    .then(() => {
        console.log('\n✅ Icon generation complete!\n');
        
        console.log('📦 Generated icons:');
        iconSizes.forEach(size => {
            const file = path.join(outputDir, `icon-${size}x${size}.png`);
            const stats = fs.statSync(file);
            console.log(`   • icon-${size}x${size}.png (${(stats.size / 1024).toFixed(2)} KB)`);
        });
        
        console.log('\n📸 Generated screenshots:');
        screenshotSpecs.forEach(spec => {
            const file = path.join(screenshotDir, spec.name);
            const stats = fs.statSync(file);
            console.log(`   • ${spec.name} (${(stats.size / 1024).toFixed(2)} KB)`);
        });
        
        console.log('\n🚀 Next steps:');
        console.log('   1. npm run build');
        console.log('   2. Deploy to production');
        console.log('   3. Test app installation on device\n');
    })
    .catch(error => {
        console.error('\n❌ Error generating icons:', error.message);
        process.exit(1);
    });
