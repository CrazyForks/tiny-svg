/**
 * Thumbnail generation utility
 * Directly uses SVG as data URI for crisp rendering
 */

export function generateThumbnail(svg: string): string {
  try {
    // Encode SVG as data URI for direct use
    // This preserves vector quality and transparency
    const encoded = encodeURIComponent(svg)
      .replace(/'/g, "%27")
      .replace(/"/g, "%22");
    return `data:image/svg+xml,${encoded}`;
  } catch (error) {
    console.error("Failed to generate thumbnail:", error);
    throw error;
  }
}
