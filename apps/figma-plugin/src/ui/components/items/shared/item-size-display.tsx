import { formatCompressionRatio, formatSize } from "@tiny-svg/svg";

interface ItemSizeDisplayProps {
  originalSize?: number;
  compressedSize?: number;
  compressionRatio?: number;
  mode?: "full" | "compression-only";
}

const formatSizeWithFallback = (bytes: number | undefined): string => {
  if (!bytes) {
    return "-";
  }
  return formatSize(bytes);
};

const formatCompressionRatioWithParens = (
  ratio: number | undefined
): string => {
  if (!ratio) {
    return "";
  }
  return `(${formatCompressionRatio(ratio)})`;
};

export function ItemSizeDisplay({
  originalSize,
  compressedSize,
  compressionRatio,
  mode = "full",
}: ItemSizeDisplayProps) {
  if (mode === "compression-only") {
    return compressionRatio ? (
      <span className="font-semibold text-success">
        {formatCompressionRatioWithParens(compressionRatio)}
      </span>
    ) : null;
  }

  return compressedSize ? (
    <>
      <span className="line-through opacity-70">
        {formatSizeWithFallback(originalSize)}
      </span>
      {" → "}
      <span className="font-medium text-foreground">
        {formatSizeWithFallback(compressedSize)}
      </span>{" "}
      <span className="font-semibold text-success">
        {formatCompressionRatioWithParens(compressionRatio)}
      </span>
    </>
  ) : (
    <span>{formatSizeWithFallback(originalSize)}</span>
  );
}
