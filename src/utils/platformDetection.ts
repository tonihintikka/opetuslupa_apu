/**
 * Platform detection utilities for browser environments
 */

/**
 * Detects if the current device is running iOS
 * Uses a combination of User Agent detection and iOS-specific API detection
 */
export const isIOS = (): boolean => {
  // First check for iOS-specific CSS support
  const iOSCSSSupport = window.CSS?.supports('-webkit-touch-callout', 'none');

  // Then check user agent as fallback
  const iOSUserAgent = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  // Safari on macOS can sometimes spoof iOS, check platform to differentiate
  const isPlatformMacOS = navigator.platform?.toLowerCase().includes('mac');
  const isMobileSize = window.innerWidth <= 812 || window.innerHeight <= 812;

  // Return true if we detect iOS CSS support OR (iOS user agent AND not macOS OR mobile size)
  return Boolean(iOSCSSSupport || (iOSUserAgent && (!isPlatformMacOS || isMobileSize)));
};

/**
 * Detect Safari browser regardless of platform
 */
export const isSafari = (): boolean => {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

/**
 * Detect if app is running in standalone PWA mode
 * Works for both iOS and Android
 */
export const isPWAStandalone = (): boolean => {
  return (
    (window.navigator as any).standalone || // iOS
    window.matchMedia('(display-mode: standalone)').matches // Android/other browsers
  );
};
