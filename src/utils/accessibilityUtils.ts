/**
 * Accessibility utility functions for ensuring WCAG compliance
 */

/**
 * Calculate the relative luminance of a color
 * Based on WCAG 2.0 formula: https://www.w3.org/TR/WCAG20-TECHS/G17.html
 *
 * @param r Red channel (0-255)
 * @param g Green channel (0-255)
 * @param b Blue channel (0-255)
 * @returns Relative luminance value (0-1)
 */
function calculateLuminance(r: number, g: number, b: number): number {
  // Normalize RGB values to 0-1 range
  const sR = r / 255;
  const sG = g / 255;
  const sB = b / 255;

  // Convert to linear RGB space (remove gamma correction)
  const R = sR <= 0.03928 ? sR / 12.92 : Math.pow((sR + 0.055) / 1.055, 2.4);
  const G = sG <= 0.03928 ? sG / 12.92 : Math.pow((sG + 0.055) / 1.055, 2.4);
  const B = sB <= 0.03928 ? sB / 12.92 : Math.pow((sB + 0.055) / 1.055, 2.4);

  // Calculate luminance
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Parse a CSS color string into RGB components
 *
 * @param color CSS color string (hex, rgb, or rgba)
 * @returns RGB values as [r, g, b] array
 */
function parseColor(color: string): [number, number, number] {
  // Create temporary element to parse colors
  const tempEl = document.createElement('div');
  tempEl.style.color = color;
  document.body.appendChild(tempEl);
  const computedColor = window.getComputedStyle(tempEl).color;
  document.body.removeChild(tempEl);

  // Extract RGB values from computed color
  const match = computedColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i);
  if (!match) {
    throw new Error(`Failed to parse color: ${color}`);
  }

  return [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10)];
}

/**
 * Calculate the contrast ratio between two colors
 * Based on WCAG 2.0 formula: https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
 *
 * @param color1 First color (foreground)
 * @param color2 Second color (background)
 * @returns Contrast ratio (1-21)
 */
export function getContrastRatio(color1: string, color2: string): number {
  try {
    // Parse colors to RGB
    const [r1, g1, b1] = parseColor(color1);
    const [r2, g2, b2] = parseColor(color2);

    // Calculate luminance values
    const l1 = calculateLuminance(r1, g1, b1);
    const l2 = calculateLuminance(r2, g2, b2);

    // Calculate contrast ratio
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  } catch (error) {
    console.error('Error calculating contrast ratio:', error);
    return 1; // Return minimum ratio on error
  }
}

/**
 * Check if a color combination meets WCAG AA contrast standards
 *
 * @param foreground Foreground color string
 * @param background Background color string
 * @param isLargeText Whether the text is considered "large" (>= 18pt or >= 14pt bold)
 * @returns True if contrast meets WCAG AA standards
 */
export function meetsWCAGAA(foreground: string, background: string, isLargeText = false): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Check if a color combination meets WCAG AAA contrast standards
 *
 * @param foreground Foreground color string
 * @param background Background color string
 * @param isLargeText Whether the text is considered "large" (>= 18pt or >= 14pt bold)
 * @returns True if contrast meets WCAG AAA standards
 */
export function meetsWCAGAAA(foreground: string, background: string, isLargeText = false): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
}
