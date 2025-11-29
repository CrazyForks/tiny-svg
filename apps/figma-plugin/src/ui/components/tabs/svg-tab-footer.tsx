import { toast } from "sonner";
import { Button } from "@/ui/components/base/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/components/base/select";
import { exportAsSpriteSheet, exportAsZip } from "@/ui/lib/svg-export";
import { usePluginStore } from "@/ui/store/plugin-store";

export function SvgTabFooter() {
  const {
    selectedSvgExportFormat,
    setSvgExportFormat,
    items,
    isExporting,
    setExporting,
  } = usePluginStore();

  const handleExportAll = async () => {
    if (items.length === 0) {
      return;
    }

    try {
      setExporting(true);

      if (selectedSvgExportFormat === "zip") {
        await exportAsZip(items);
        toast.success("SVG ZIP exported successfully");
      } else {
        await exportAsSpriteSheet(items);
        toast.success("Sprite sheet exported successfully");
      }
    } catch (error) {
      console.error("Failed to export:", error);
      toast.error("Failed to export");
    } finally {
      setExporting(false);
    }
  };

  const hasItems = items.length > 0;

  return (
    <>
      <Select
        onValueChange={(value) => setSvgExportFormat(value as "zip" | "sprite")}
        value={selectedSvgExportFormat}
      >
        <SelectTrigger className="w-[120px]" size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="zip">Zip</SelectItem>
          <SelectItem value="sprite">Sprite Sheet</SelectItem>
        </SelectContent>
      </Select>

      <Button
        disabled={!hasItems || isExporting}
        onClick={handleExportAll}
        size="sm"
      >
        {isExporting ? "Exporting..." : "Export All"}
      </Button>
    </>
  );
}
