import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
} 

export function convertLatexBlocks(raw: string): string {
  // Match everything between {{ and }} including newlines
  return raw
    .replace(/{{([\s\S]*?)}}/g, (_, inner) => `$$\n${inner.trim()}\n$$`)
    .replace(/\\\((.*?)\\\)/g, (_, inline) => `$${inline.trim()}$`)
    .replace(/\\\\/g, '\\');
}
