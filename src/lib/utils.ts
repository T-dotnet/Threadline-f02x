import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const FORM_LABEL_CLASS = "text-[10px] uppercase tracking-wider font-bold text-text-secondary";

/** Normalises a tags value that may be a string array, comma-separated string, or undefined. */
export function normalizeTags(tags: string[] | string | undefined): string[] {
  if (Array.isArray(tags)) return tags;
  if (!tags) return [];
  return tags.split(',').map(t => t.trim()).filter(Boolean);
}
