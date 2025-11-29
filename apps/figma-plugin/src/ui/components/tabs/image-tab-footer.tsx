import { Button } from "@/ui/components/base/button";
import type { ImageFormat } from "@/ui/store/plugin-store";
import { usePluginStore } from "@/ui/store/plugin-store";

export function ImageTabFooter() {
  const { selectedImageFormats, toggleImageFormat, items, isExporting } =
    usePluginStore();

  const handleExportAll = async () => {
    // TODO: Implement export all logic
    // Placeholder to avoid empty block warning
  };

  const hasItems = items.length > 0;
  const hasFormats = selectedImageFormats.length > 0;

  const formats: ImageFormat[] = ["png", "jpeg", "webp", "ico"];

  return (
    <>
      <div className="flex gap-3">
        {formats.map((format) => (
          <label
            className="flex cursor-pointer items-center gap-1.5 font-medium text-sm"
            key={format}
          >
            <input
              checked={selectedImageFormats.includes(format)}
              className="cursor-pointer"
              onChange={() => toggleImageFormat(format)}
              type="checkbox"
            />
            <span>{format.toUpperCase()}</span>
          </label>
        ))}
      </div>

      <Button
        disabled={!(hasItems && hasFormats) || isExporting}
        onClick={handleExportAll}
        size="sm"
      >
        {isExporting ? "Exporting..." : "Export All"}
      </Button>
    </>
  );
}
