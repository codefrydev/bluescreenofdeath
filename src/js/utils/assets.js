// Asset loading, embedded vector SVG icons, and simulation data

/**
 * Creates an image from an SVG string (instant synchronous load, 100% offline, zero network CORS issues)
 * @param {string} svgString - Clean SVG markup
 * @returns {HTMLImageElement}
 */
function createSvgImage(svgString) {
  const img = new Image();
  const encoded = encodeURIComponent(svgString)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  img.src = `data:image/svg+xml;charset=utf-8,${encoded}`;
  return img;
}

// Windows 11 Fluent 4-tile Blue Logo
const WIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88" width="88" height="88">
  <path fill="#0078D4" d="M0 0h41.6v41.6H0zm46.4 0H88v41.6H46.4zM0 46.4h41.6V88H0zm46.4 0H88V88H46.4z"/>
</svg>`;

// Monochrome White Windows Logo (for BSOD screens)
const WIN_WHITE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88" width="88" height="88">
  <path fill="#ffffff" d="M0 0h41.6v41.6H0zm46.4 0H88v41.6H46.4zM0 46.4h41.6V88H0zm46.4 0H88V88H46.4z"/>
</svg>`;

// Authentic Apple Logo (Black)
const APPLE_BLACK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 170" width="170" height="170">
  <path fill="#000000" d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.71-7.97-12.04-14.67-6.09-9.44-10.88-20.2-14.36-32.28-3.48-12.08-5.22-23.36-5.22-33.84 0-14.36 3.7-26.31 11.1-35.85 7.4-9.54 16.74-14.42 28.02-14.64 4.58 0 9.87 1.25 15.86 3.75 5.99 2.5 9.77 3.82 11.35 3.96 1.83-.24 5.9-1.68 12.22-4.32 6.32-2.64 11.83-3.84 16.53-3.6 12.63.61 22.84 5.21 30.63 13.8-11.02 6.67-16.42 15.83-16.2 27.48.24 9.07 3.65 16.75 10.22 23.04 6.57 6.29 14.38 9.83 23.44 10.62-2.19 6.81-4.7 13.52-7.53 20.13zm-29.39-106.8c0 7.4-2.8 14.15-8.4 20.25-5.6 6.1-12.44 9.68-20.52 10.74-.24-1.22-.36-2.31-.36-3.29 0-7.19 2.92-14.15 8.76-20.88 5.84-6.73 12.63-10.49 20.36-11.28.12 1.46.16 2.95.16 4.46z"/>
</svg>`;

// Authentic Apple Logo (White)
const APPLE_WHITE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 170" width="170" height="170">
  <path fill="#ffffff" d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.71-7.97-12.04-14.67-6.09-9.44-10.88-20.2-14.36-32.28-3.48-12.08-5.22-23.36-5.22-33.84 0-14.36 3.7-26.31 11.1-35.85 7.4-9.54 16.74-14.42 28.02-14.64 4.58 0 9.87 1.25 15.86 3.75 5.99 2.5 9.77 3.82 11.35 3.96 1.83-.24 5.9-1.68 12.22-4.32 6.32-2.64 11.83-3.84 16.53-3.6 12.63.61 22.84 5.21 30.63 13.8-11.02 6.67-16.42 15.83-16.2 27.48.24 9.07 3.65 16.75 10.22 23.04 6.57 6.29 14.38 9.83 23.44 10.62-2.19 6.81-4.7 13.52-7.53 20.13zm-29.39-106.8c0 7.4-2.8 14.15-8.4 20.25-5.6 6.1-12.44 9.68-20.52 10.74-.24-1.22-.36-2.31-.36-3.29 0-7.19 2.92-14.15 8.76-20.88 5.84-6.73 12.63-10.49 20.36-11.28.12 1.46.16 2.95.16 4.46z"/>
</svg>`;

// Google Chrome Logo
const CHROME_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="48" fill="#ffffff"/>
  <path fill="#EA4335" d="M50 4a46 46 0 0 0-38.3 20.7L31 58.3l19-32.9h40.8A46 46 0 0 0 50 4z"/>
  <path fill="#4285F4" d="M96 50a46 46 0 0 0-5.2-21.4H50l19 32.9L50 96a46 46 0 0 0 46-46z"/>
  <path fill="#34A853" d="M50 96A46 46 0 0 0 90.8 71.5L69.8 38.6 31 58.3 11.7 24.7A46 46 0 0 0 50 96z"/>
  <circle cx="50" cy="50" r="21" fill="#ffffff"/>
  <circle cx="50" cy="50" r="17" fill="#1A73E8"/>
</svg>`;

// Ubuntu Circle of Friends Logo
const UBUNTU_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="48" fill="#E95420"/>
  <circle cx="50" cy="50" r="23" fill="none" stroke="#ffffff" stroke-width="9"/>
  <!-- Head 1 -->
  <circle cx="18" cy="50" r="6" fill="#ffffff"/>
  <!-- Head 2 -->
  <circle cx="66" cy="22" r="6" fill="#ffffff"/>
  <!-- Head 3 -->
  <circle cx="66" cy="78" r="6" fill="#ffffff"/>
  <!-- Gaps in circle -->
  <rect x="0" y="47" width="30" height="6" fill="#E95420"/>
  <rect x="52" y="10" width="6" height="30" transform="rotate(30 55 25)" fill="#E95420"/>
  <rect x="52" y="60" width="6" height="30" transform="rotate(-30 55 75)" fill="#E95420"/>
</svg>`;

// Android Bugdroid Logo
const ANDROID_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <path fill="#3DDC84" d="M50 20c-15.5 0-28 12.5-28 28h56c0-15.5-12.5-28-28-28zm-14 16a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm28 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
  <rect x="22" y="52" width="56" height="36" rx="6" fill="#3DDC84"/>
  <rect x="13" y="52" width="6" height="26" rx="3" fill="#3DDC84"/>
  <rect x="81" y="52" width="6" height="26" rx="3" fill="#3DDC84"/>
  <rect x="33" y="90" width="8" height="10" rx="4" fill="#3DDC84"/>
  <rect x="59" y="90" width="8" height="10" rx="4" fill="#3DDC84"/>
  <!-- Antennae -->
  <line x1="38" y1="22" x2="30" y2="10" stroke="#3DDC84" stroke-width="3" stroke-linecap="round"/>
  <line x1="62" y1="22" x2="70" y2="10" stroke="#3DDC84" stroke-width="3" stroke-linecap="round"/>
</svg>`;

// Instant embedded images
export const imgWin = createSvgImage(WIN_SVG);
export const imgWinWhite = createSvgImage(WIN_WHITE_SVG);
export const imgApple = createSvgImage(APPLE_BLACK_SVG);
export const imgAppleWhite = createSvgImage(APPLE_WHITE_SVG);
export const imgChrome = createSvgImage(CHROME_SVG);
export const imgUbuntu = createSvgImage(UBUNTU_SVG);
export const imgAndroid = createSvgImage(ANDROID_SVG);

export const quotes = [
  "Reality is merely an illusion, albeit a very persistent one. - Albert Einstein",
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Error 404: Sleep not found. Please try coffee.",
  "I'm not lazy, I'm just on energy saving mode.",
  "Everything is fine. (It is not fine.)",
  "Be the person your dog thinks you are.",
  "There are 10 types of people: those who understand binary, and those who don't.",
  "Simplicity is the ultimate sophistication. - Leonardo da Vinci",
  "Stay hungry, stay foolish. - Whole Earth Catalog",
  "Programs must be written for people to read, and only incidentally for machines to execute. - Abelson & Sussman"
];
