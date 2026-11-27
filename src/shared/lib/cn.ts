import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merges class names and lets the last Tailwind class win on conflicts.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
