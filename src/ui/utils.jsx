import { clsx } from "clsx"; // Removed 'type ClassValue' as it's TS-only
import { twMerge } from "tailwind-merge";

// Removed the TypeScript type annotation: (...inputs: ClassValue[])
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}