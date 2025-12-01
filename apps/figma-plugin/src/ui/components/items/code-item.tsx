import {
  generateFlutterCode,
  generateReactCode,
  generateReactNativeCode,
  generateSvelteCode,
  generateVueCode,
} from "@tiny-svg/code-generators";
import { Button } from "@tiny-svg/ui/components/button";
import { ButtonGroup } from "@tiny-svg/ui/components/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@tiny-svg/ui/components/dropdown-menu";
import { copyToClipboard, downloadBlob } from "@tiny-svg/utils";
import { useState } from "react";
import { toast } from "sonner";
import { BaseItem } from "@/ui/components/items/base-item";
import { svgToDataUri } from "@/ui/lib/data-uri-utils";
import type { SvgItem as SvgItemType } from "@/ui/store";

interface CodeItemProps {
  item: SvgItemType;
  onPreview: () => void;
}

type CodeFormat =
  | "base64"
  | "data-url"
  | "react-tsx"
  | "react-jsx"
  | "vue"
  | "svelte"
  | "react-native"
  | "flutter";

// Regex constants for sanitizeComponentName
const SVG_EXTENSION_REGEX = /\.svg$/i;
const SPECIAL_CHARS_REGEX = /[^a-zA-Z0-9\s]/g;
const WHITESPACE_REGEX = /\s+/;

/**
 * Sanitize component name from filename
 * Removes special characters and converts to PascalCase
 */
function sanitizeComponentName(name: string): string {
  // Remove .svg extension
  let cleaned = name.replace(SVG_EXTENSION_REGEX, "");
  // Remove special characters, keep alphanumeric and spaces
  cleaned = cleaned.replace(SPECIAL_CHARS_REGEX, "");
  // Convert to PascalCase
  const pascalCase = cleaned
    .split(WHITESPACE_REGEX)
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
  return pascalCase || "SvgIcon"; // Fallback
}

export function CodeItem({ item, onPreview }: CodeItemProps) {
  const [loadingFormat, setLoadingFormat] = useState<string | null>(null);

  const svg = item.compressedSvg || item.originalSvg;
  const componentName = sanitizeComponentName(item.name);

  const generateCode = (
    format: CodeFormat
  ): { code: string; filename: string } => {
    switch (format) {
      case "base64": {
        const { base64 } = svgToDataUri(svg);
        return { code: base64, filename: `${item.name}-base64.txt` };
      }
      case "data-url": {
        const { minified } = svgToDataUri(svg);
        return { code: minified, filename: `${item.name}-dataurl.txt` };
      }
      case "react-tsx": {
        const result = generateReactCode(svg, {
          framework: "react",
          componentName,
          typescript: true,
        });
        return { code: result.code, filename: result.filename };
      }
      case "react-jsx": {
        const result = generateReactCode(svg, {
          framework: "react",
          componentName,
          typescript: false,
        });
        return { code: result.code, filename: result.filename };
      }
      case "vue": {
        const result = generateVueCode(svg, {
          framework: "vue",
          componentName,
          typescript: false,
        });
        return { code: result.code, filename: result.filename };
      }
      case "svelte": {
        const result = generateSvelteCode(svg, {
          framework: "svelte",
          componentName,
          typescript: false,
        });
        return { code: result.code, filename: result.filename };
      }
      case "react-native": {
        const result = generateReactNativeCode(svg, {
          framework: "react-native",
          componentName,
          typescript: false,
        });
        return { code: result.code, filename: result.filename };
      }
      case "flutter": {
        const result = generateFlutterCode(svg, {
          framework: "flutter",
          componentName,
          typescript: false,
        });
        return { code: result.code, filename: result.filename };
      }
      default:
        throw new Error(`Unknown format: ${format}`);
    }
  };

  const handleDownload = async (format: CodeFormat) => {
    try {
      setLoadingFormat(`${format}-download`);

      const { code, filename } = generateCode(format);
      const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
      downloadBlob(blob, filename);

      toast.success("Code downloaded");
    } catch (error) {
      console.error(`Failed to download ${format}:`, error);
      toast.error("Failed to download code");
    } finally {
      setLoadingFormat(null);
    }
  };

  const handleCopy = async (format: CodeFormat) => {
    try {
      setLoadingFormat(`${format}-copy`);

      const { code } = generateCode(format);
      await copyToClipboard(code);

      toast.success("Code copied to clipboard");
    } catch (error) {
      console.error(`Failed to copy ${format}:`, error);
      toast.error("Failed to copy code");
    } finally {
      setLoadingFormat(null);
    }
  };

  const QuickActionButton = ({
    format,
    label,
  }: {
    format: CodeFormat;
    label: string;
  }) => {
    const isDownloadLoading = loadingFormat === `${format}-download`;
    const isCopyLoading = loadingFormat === `${format}-copy`;
    const isLoading = isDownloadLoading || isCopyLoading;

    return (
      <div className="group relative w-full">
        <Button
          className="h-7 w-full font-medium text-xs group-hover:text-transparent"
          size="sm"
          type="button"
          variant="outline"
        >
          {label}
        </Button>
        <ButtonGroup className="absolute inset-0 hidden h-full w-full group-hover:flex">
          <Button
            aria-label={`Download ${label}`}
            className="h-7 grow p-0"
            disabled={isLoading}
            onClick={() => handleDownload(format)}
            title={`Download ${label}`}
            type="button"
            variant="outline"
          >
            <span className="i-hugeicons-download-01 size-4" />
          </Button>
          <Button
            aria-label={`Copy ${label}`}
            className="h-7 grow p-0"
            disabled={isLoading}
            onClick={() => handleCopy(format)}
            title={`Copy ${label}`}
            type="button"
            variant="outline"
          >
            <span className="i-hugeicons-copy-01 size-4" />
          </Button>
        </ButtonGroup>
      </div>
    );
  };

  const DropdownFormatItem = ({
    format,
    label,
  }: {
    format: CodeFormat;
    label: string;
  }) => {
    const isDownloadLoading = loadingFormat === `${format}-download`;
    const isCopyLoading = loadingFormat === `${format}-copy`;
    const isLoading = isDownloadLoading || isCopyLoading;

    return (
      <div className="flex w-full items-center justify-between gap-2">
        <span className="shrink-0 text-xs">{label}</span>
        <div className="flex gap-1">
          <Button
            aria-label={`Download ${label}`}
            className="size-5 rounded"
            disabled={isLoading}
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(format);
            }}
            size="icon"
            title={`Download ${label}`}
            type="button"
            variant="ghost"
          >
            <span className="i-hugeicons-download-01 size-3" />
          </Button>
          <Button
            aria-label={`Copy ${label}`}
            className="size-5 rounded"
            disabled={isLoading}
            onClick={(e) => {
              e.stopPropagation();
              handleCopy(format);
            }}
            size="icon"
            title={`Copy ${label}`}
            type="button"
            variant="ghost"
          >
            <span className="i-hugeicons-copy-01 size-3" />
          </Button>
        </div>
      </div>
    );
  };

  const actions = (
    <div className="grid w-32 grid-cols-2 gap-1">
      <QuickActionButton format="base64" label="Base64" />
      <QuickActionButton format="react-tsx" label="TSX" />
      <QuickActionButton format="react-jsx" label="JSX" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="More code formats"
            className="h-7 w-full rounded-lg pr-1 pl-2"
            size="sm"
            title="More code formats"
            type="button"
            variant="outline"
          >
            <span className="font-medium text-xs">More</span>
            <span className="i-hugeicons-arrow-down-01 size-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-28 space-y-1 rounded-lg p-1.5"
        >
          <DropdownMenuItem
            className="cursor-default p-0 focus:bg-transparent"
            onSelect={(e) => e.preventDefault()}
          >
            <DropdownFormatItem format="data-url" label="Data URL" />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-default p-0 focus:bg-transparent"
            onSelect={(e) => e.preventDefault()}
          >
            <DropdownFormatItem format="vue" label="Vue" />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-default p-0 focus:bg-transparent"
            onSelect={(e) => e.preventDefault()}
          >
            <DropdownFormatItem format="svelte" label="Svelte" />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-default p-0 focus:bg-transparent"
            onSelect={(e) => e.preventDefault()}
          >
            <DropdownFormatItem format="react-native" label="RNative" />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-default p-0 focus:bg-transparent"
            onSelect={(e) => e.preventDefault()}
          >
            <DropdownFormatItem format="flutter" label="Flutter" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <BaseItem
      actions={actions}
      item={item}
      onThumbnailClick={onPreview}
      showPresetSelector
      sizeDisplayMode="compression-only"
    />
  );
}
