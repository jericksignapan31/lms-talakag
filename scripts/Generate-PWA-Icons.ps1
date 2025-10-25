# PWA Icon Generation Script for Windows
# Requires ImageMagick to be installed: https://imagemagick.org/script/download.php#windows

param(
    [string]$SourceImage = "src/assets/IISLogo.png"
)

# Check if ImageMagick is installed
try {
    $convert = Get-Command convert -ErrorAction Stop
    Write-Host "✓ ImageMagick found at: $($convert.Source)" -ForegroundColor Green
}
catch {
    Write-Host "✗ ImageMagick not found!" -ForegroundColor Red
    Write-Host "Please install ImageMagick from: https://imagemagick.org/script/download.php#windows" -ForegroundColor Yellow
    exit 1
}

# Check if source image exists
if (-not (Test-Path $SourceImage)) {
    Write-Host "✗ Source image not found: $SourceImage" -ForegroundColor Red
    exit 1
}

$outputDir = "src/assets"
$screenshotsDir = "$outputDir/screenshots"

# Create output directories
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}
if (-not (Test-Path $screenshotsDir)) {
    New-Item -ItemType Directory -Path $screenshotsDir | Out-Null
}

Write-Host "Generating PWA icons from $SourceImage..." -ForegroundColor Cyan

# Define icon sizes
$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)

# Generate icons
foreach ($size in $sizes) {
    $output = "$outputDir/icon-${size}x${size}.png"
    Write-Host "Generating icon-${size}x${size}.png..." -ForegroundColor Yellow
    
    & convert "$SourceImage" -resize "${size}x${size}" -background white -gravity center -extent "${size}x${size}" "$output" 2>$null
    
    if ($?) {
        Write-Host "  ✓ Created: $output" -ForegroundColor Green
    }
    else {
        Write-Host "  ✗ Failed to create: $output" -ForegroundColor Red
    }
}

# Generate screenshots
Write-Host "Generating screenshots..." -ForegroundColor Yellow

$screenshots = @(
    @{ size = "540x720"; name = "screenshot-1.png" },
    @{ size = "1280x720"; name = "screenshot-2.png" }
)

foreach ($screenshot in $screenshots) {
    $output = "$screenshotsDir/$($screenshot.name)"
    Write-Host "  Creating $($screenshot.name)..." -ForegroundColor Yellow
    
    & convert "$SourceImage" -resize $screenshot.size -background white -gravity center -extent $screenshot.size "$output" 2>$null
    
    if ($?) {
        Write-Host "    ✓ Created: $output" -ForegroundColor Green
    }
    else {
        Write-Host "    ✗ Failed to create: $output" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✓ Icon generation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Generated files:" -ForegroundColor Cyan
Get-ChildItem "$outputDir/icon-*.png" | ForEach-Object { Write-Host "  - $($_.Name)" }
Write-Host ""
Write-Host "Generated screenshots:" -ForegroundColor Cyan
Get-ChildItem "$screenshotsDir/*" | ForEach-Object { Write-Host "  - $($_.Name)" }
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Green
Write-Host "1. Run: npm run build" -ForegroundColor Cyan
Write-Host "2. Deploy to production" -ForegroundColor Cyan
Write-Host "3. Test installation on device" -ForegroundColor Cyan
