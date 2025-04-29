#!/bin/bash

# Make sure the icons directory exists
mkdir -p public/icons

# Favicon - 16x16 and 32x32 icons
convert -background none public/ajokamu-icon.svg -resize 16x16 public/icons/favicon-16x16.png
convert -background none public/ajokamu-icon.svg -resize 32x32 public/icons/favicon-32x32.png
convert -background none public/ajokamu-icon.svg -resize 48x48 public/icons/favicon-48x48.png

# Combined favicon.ico (16x16, 32x32, 48x48)
convert public/icons/favicon-16x16.png public/icons/favicon-32x32.png public/icons/favicon-48x48.png public/favicon.ico

# Apple Touch Icons
convert -background none public/ajokamu-icon.svg -resize 57x57 public/icons/apple-touch-icon-57x57.png
convert -background none public/ajokamu-icon.svg -resize 60x60 public/icons/apple-touch-icon-60x60.png
convert -background none public/ajokamu-icon.svg -resize 72x72 public/icons/apple-touch-icon-72x72.png
convert -background none public/ajokamu-icon.svg -resize 76x76 public/icons/apple-touch-icon-76x76.png
convert -background none public/ajokamu-icon.svg -resize 114x114 public/icons/apple-touch-icon-114x114.png
convert -background none public/ajokamu-icon.svg -resize 120x120 public/icons/apple-touch-icon-120x120.png
convert -background none public/ajokamu-icon.svg -resize 144x144 public/icons/apple-touch-icon-144x144.png
convert -background none public/ajokamu-icon.svg -resize 152x152 public/icons/apple-touch-icon-152x152.png
convert -background none public/ajokamu-icon.svg -resize 180x180 public/icons/apple-touch-icon-180x180.png

# Create the default apple-touch-icon.png (180x180)
cp public/icons/apple-touch-icon-180x180.png public/apple-touch-icon.png

# Android Homescreen Icons
convert -background none public/ajokamu-icon.svg -resize 36x36 public/icons/android-chrome-36x36.png
convert -background none public/ajokamu-icon.svg -resize 48x48 public/icons/android-chrome-48x48.png
convert -background none public/ajokamu-icon.svg -resize 72x72 public/icons/android-chrome-72x72.png
convert -background none public/ajokamu-icon.svg -resize 96x96 public/icons/android-chrome-96x96.png
convert -background none public/ajokamu-icon.svg -resize 144x144 public/icons/android-chrome-144x144.png
convert -background none public/ajokamu-icon.svg -resize 192x192 public/icons/android-chrome-192x192.png
convert -background none public/ajokamu-icon.svg -resize 256x256 public/icons/android-chrome-256x256.png
convert -background none public/ajokamu-icon.svg -resize 384x384 public/icons/android-chrome-384x384.png
convert -background none public/ajokamu-icon.svg -resize 512x512 public/icons/android-chrome-512x512.png

# Create standard sizes for PWA
convert -background none public/ajokamu-icon.svg -resize 192x192 public/icons/icon-192x192.png
convert -background none public/ajokamu-icon.svg -resize 512x512 public/icons/icon-512x512.png

# Create maskable icons for Android (with proper safe zone)
convert -background none public/maskable-icon.svg -resize 192x192 public/icons/maskable-192x192.png
convert -background none public/maskable-icon.svg -resize 512x512 public/icons/maskable-512x512.png

# Create shortcut icons
mkdir -p public/icons/shortcuts
convert -background none public/ajokamu-icon.svg -resize 96x96 public/icons/shortcut-lesson.png

# Create custom shortcut icon for adding student
cat > public/icons/student-icon.svg << EOF
<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="256" cy="256" r="248" fill="#1976D2"/>
  <circle cx="256" cy="256" r="232" fill="white"/>
  <circle cx="256" cy="256" r="216" fill="#1976D2"/>
  
  <!-- Student silhouette -->
  <circle cx="256" cy="156" r="80" fill="white"/>
  <path d="M256 256C180 256 140 320 140 380V400H372V380C372 320 332 256 256 256Z" fill="white"/>
  
  <!-- Plus sign for "Add" -->
  <rect x="234" y="330" width="44" height="120" rx="10" fill="#1976D2"/>
  <rect x="196" y="368" width="120" height="44" rx="10" fill="#1976D2"/>
</svg>
EOF

convert -background none public/icons/student-icon.svg -resize 96x96 public/icons/shortcut-student.png

# Microsoft Windows Tile Icons
convert -background none public/ajokamu-icon.svg -resize 70x70 public/icons/mstile-70x70.png
convert -background none public/ajokamu-icon.svg -resize 144x144 public/icons/mstile-144x144.png
convert -background none public/ajokamu-icon.svg -resize 150x150 public/icons/mstile-150x150.png
convert -background none public/ajokamu-icon.svg -resize 310x150 public/icons/mstile-310x150.png
convert -background none public/ajokamu-icon.svg -resize 310x310 public/icons/mstile-310x310.png

# Create Safari Pinned Tab SVG (monochrome silhouette)
cat > public/safari-pinned-tab.svg << EOF
<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="512pt" height="512pt" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet">
  <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
    <path d="M2380 4619 c-344 -31 -623 -120 -900 -286 -230 -138 -450 -339 -605 -552 -320 -440 -456 -964 -386 -1491 20 -149 86 -374 153 -523 332 -736 1068 -1225 1873 -1243 126 -3 190 0 290 14 728 101 1343 587 1630 1292 74 182 130 405 151 605 24 229 -2 553 -61 770 -221 809 -884 1373 -1725 1470 -108 13 -322 19 -420 12 -36 -2 -36 -2 -5 -4 17 -1 55 -8 85 -17 139 -38 175 -153 81 -259 -34 -39 -109 -79 -177 -95 l-44 -10 0 -175 0 -175 41 -10 c56 -14 156 -71 184 -105 58 -70 63 -147 15 -217 -32 -48 -124 -105 -186 -115 l-44 -8 0 -173 0 -172 23 -5 c57 -14 170 -83 207 -126 69 -81 67 -179 -6 -255 -39 -40 -121 -89 -169 -100 -19 -4 -37 -8 -39 -9 -2 -1 -3 -80 -3 -176 l0 -175 39 -7 c47 -9 141 -56 182 -90 87 -74 91 -199 10 -280 -43 -43 -151 -102 -210 -115 -35 -8 -36 -9 -39 -63 -8 -129 -19 -192 -49 -292 -116 -386 -444 -687 -838 -770 -119 -25 -321 -25 -440 0 -394 83 -722 384 -838 770 -30 100 -41 163 -49 292 -3 54 -4 55 -39 63 -59 13 -167 72 -210 115 -81 81 -77 206 10 280 41 34 135 81 182 90 l39 7 0 175 c0 96 -1 175 -2 176 -2 1 -20 5 -39 9 -48 11 -130 60 -169 100 -73 76 -75 174 -6 255 37 43 150 112 207 126 l23 5 0 172 0 173 -44 8 c-62 10 -154 67 -186 115 -48 70 -43 147 15 217 28 34 128 91 184 105 l41 10 0 175 0 175 -44 10 c-68 16 -143 56 -177 95 -94 106 -58 221 81 259 30 9 68 16 85 17 31 2 31 2 -5 4 -22 1 -87 -2 -145 -7z"/>
  </g>
</svg>
EOF

echo "PWA icons generated successfully!" 