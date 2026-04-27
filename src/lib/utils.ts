import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Pauses execution for a given number of milliseconds.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Splits an array into chunks of the specified size.
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Formats a number with thousands separators
 */
export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('es-CO').format(num);
}

/**
 * Formats a number as currency
 */
export function formatCurrency(num: number | null | undefined, currency = 'USD'): string {
  if (num === null || num === undefined) return '$0.00';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
}
