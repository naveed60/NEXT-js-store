import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

const allowedImageHosts = new Set([
  "images.unsplash.com",
  "www.bopuqilamur.org.uk",
  "img.freepik.com",
]);

export function formatPrice(amount: number): string {
  return "PKR " + new Intl.NumberFormat("en-PK").format(Math.round(amount));
}

export function getValidImageUrl(src: string): string | null {
  if (!src) return null;
  if (src.startsWith("/")) return src;
  try {
    const url = new URL(src);
    return allowedImageHosts.has(url.hostname) ? src : null;
  } catch {
    return null;
  }
}
