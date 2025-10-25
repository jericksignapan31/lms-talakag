#!/bin/bash

# PWA Icon Generation Script
# This script uses ImageMagick to generate PWA icons from a source image
# Install ImageMagick first: brew install imagemagick (Mac) or choco install imagemagick (Windows)

SOURCE_IMAGE=${1:-"src/assets/IISLogo.png"}
OUTPUT_DIR="src/assets"

echo "Generating PWA icons from $SOURCE_IMAGE..."

# Create directories if they don't exist
mkdir -p "$OUTPUT_DIR/screenshots"

# Generate icons with various sizes
for size in 72 96 128 144 152 192 384 512; do
    echo "Generating icon-${size}x${size}.png..."
    convert "$SOURCE_IMAGE" -resize "${size}x${size}" -background white -gravity center -extent "${size}x${size}" "$OUTPUT_DIR/icon-${size}x${size}.png"
done

# Generate screenshots (placeholder size)
echo "Generating screenshots..."
convert "$SOURCE_IMAGE" -resize 540x720 -background white -gravity center -extent 540x720 "$OUTPUT_DIR/screenshots/screenshot-1.png"
convert "$SOURCE_IMAGE" -resize 1280x720 -background white -gravity center -extent 1280x720 "$OUTPUT_DIR/screenshots/screenshot-2.png"

echo "Icon generation complete! Icons are ready in $OUTPUT_DIR"
echo ""
echo "Generated files:"
ls -lh "$OUTPUT_DIR"/icon-*.png
ls -lh "$OUTPUT_DIR"/screenshots/
