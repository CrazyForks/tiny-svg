/**
 * Data URI utilities for SVG conversion
 * Ported from apps/web/src/lib/data-uri-utils.ts
 */

// Constants
const BASE64_DATA_URI_PREFIX = "data:image/svg+xml;base64,";
const DATA_URI_PREFIX = "image/svg+xml";
const BYTE_PRECISION = 2;
const BYTES_DIVISOR = 1024;
const SIZE_UNITS = ["B", "KB", "MB"] as const;

const URL_ENCODING_REPLACEMENTS = {
  "%20": " ",
  "%3D": "=",
  "%3A": ":",
  "%2F": "/",
} as const;

export interface DataUriResult {
  minified: string;
  base64: string;
  urlEncoded: string;
  minifiedSize: number;
  base64Size: number;
  urlEncodedSize: number;
}

/**
 * Converts SVG content to various Data URI formats
 * @param svg - The SVG string content
 * @returns Object containing different Data URI formats and their sizes
 */
export function svgToDataUri(svg: string): DataUriResult {
  // Minified Data URI (using encodeURIComponent with optimizations)
  let encoded = encodeURIComponent(svg);
  for (const [encoded_char, decoded] of Object.entries(
    URL_ENCODING_REPLACEMENTS
  )) {
    // Use split/join instead of replaceAll for broader compatibility
    encoded = encoded.split(encoded_char).join(decoded);
  }
  const minified = `data:${DATA_URI_PREFIX},${encoded}`;

  // Base64 Data URI
  const base64 = `${BASE64_DATA_URI_PREFIX}${btoa(unescape(encodeURIComponent(svg)))}`;

  // URL Encoded Data URI
  const urlEncoded = `data:${DATA_URI_PREFIX},${encodeURIComponent(svg)}`;

  return {
    minified,
    base64,
    urlEncoded,
    minifiedSize: new Blob([minified]).size,
    base64Size: new Blob([base64]).size,
    urlEncodedSize: new Blob([urlEncoded]).size,
  };
}

/**
 * Formats byte size to human-readable format
 * @param bytes - The size in bytes
 * @returns Formatted string (e.g., "1.23 KB")
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return `0 ${SIZE_UNITS[0]}`;
  }

  const i = Math.floor(Math.log(bytes) / Math.log(BYTES_DIVISOR));

  return `${(bytes / BYTES_DIVISOR ** i).toFixed(BYTE_PRECISION)} ${SIZE_UNITS[i]}`;
}
