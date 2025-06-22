import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isWebView() {
  if (typeof window === 'undefined') return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  const webviewPatterns = [/wv\)/, /kakaotalk/, /instagram/, /naver/, /line/, /fb_iab/, /fbav/, /fban/, /fbdv/];
  return webviewPatterns.some(pattern => pattern.test(userAgent));
}
