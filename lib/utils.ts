import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateLocale(dateString: string, locale: string = 'en-IN'): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Strips Malayalam script and parenthetical Malayalam translations (e.g. '(അനിൽ കുമാർ)')
 * from farmer/user names when the active language is not Malayalam.
 */
export function sanitizeFarmerName(
  name?: string | null,
  lang: string = 'en',
  fallback: string = 'Anil Kumar'
): string {
  if (!name) return fallback;
  if (lang !== 'ml') {
    const cleaned = name
      .replace(/\s*\([\u0D00-\u0D7F\s]+\)/g, '')
      .replace(/[\u0D00-\u0D7F]/g, '')
      .trim();
    return cleaned || fallback;
  }
  return name.trim();
}

