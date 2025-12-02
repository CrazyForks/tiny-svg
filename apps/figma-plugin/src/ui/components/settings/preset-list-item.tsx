import { Badge } from "@tiny-svg/ui/components/badge";
import { Button } from "@tiny-svg/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@tiny-svg/ui/components/tooltip";
import { cn } from "@tiny-svg/ui/lib/utils";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@tiny-svg/ui/shared/item";
import { useState } from "react";
import { useTranslation } from "@/i18n/hooks";
import type { Preset } from "@/types/messages";
import { DeleteConfirmationDialog } from "@/ui/components/preset/delete-confirmation-dialog";
import { formatRelativeTime } from "@/ui/lib/format-time";
import { usePluginStore } from "@/ui/store";

interface PresetListItemProps {
  preset: Preset;
  usageCount?: number;
  isSelected?: boolean;
}

export function PresetListItem({
  preset,
  usageCount = 0,
  isSelected = false,
}: PresetListItemProps) {
  const { t } = useTranslation();
  const { openPresetEditor, deletePreset, pinPreset } = usePluginStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEdit = () => {
    openPresetEditor("edit", { presetId: preset.id });
  };

  const handleDuplicate = () => {
    openPresetEditor("create", { sourcePresetId: preset.id });
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    deletePreset(preset.id);
    setShowDeleteDialog(false);
  };

  const handlePin = () => {
    pinPreset(preset.id);
  };

  return (
    <>
      <Item
        className={cn(isSelected && "border-primary")}
        size="sm"
        variant="outline"
      >
        <ItemContent>
          <ItemTitle>
            {preset.name}
            {preset.isDefault && (
              <Badge className="text-xs" variant="secondary">
                {t("presets.item.systemBadge")}
              </Badge>
            )}
          </ItemTitle>
          <div className="text-muted-foreground text-xs">
            {t("presets.item.usageTime")
              .replace("{count}", String(usageCount))
              .replace("{time}", formatRelativeTime(preset.updatedAt, t))}
          </div>
        </ItemContent>

        <ItemActions>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-label={
                    preset.pinned
                      ? t("presets.item.actions.unpin")
                      : t("presets.item.actions.pin")
                  }
                  onClick={handlePin}
                  size="icon-sm"
                  title={
                    preset.pinned
                      ? t("presets.item.actions.unpin")
                      : t("presets.item.actions.pin")
                  }
                  variant="ghost"
                >
                  <span
                    className={
                      preset.pinned
                        ? "i-hugeicons-pin size-4 text-primary"
                        : "i-hugeicons-pin size-4"
                    }
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {preset.pinned
                  ? t("presets.item.actions.unpin")
                  : t("presets.item.actions.pin")}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-label={t("presets.item.actions.edit")}
                  onClick={handleEdit}
                  size="icon-sm"
                  title={t("presets.item.actions.edit")}
                  variant="ghost"
                >
                  <span className="i-hugeicons-pencil-edit-01 size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("presets.item.actions.edit")}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-label={t("presets.item.actions.duplicate")}
                  onClick={handleDuplicate}
                  size="icon-sm"
                  title={t("presets.item.actions.duplicate")}
                  variant="ghost"
                >
                  <span className="i-hugeicons-copy-01 size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {t("presets.item.actions.duplicate")}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-label={t("presets.item.actions.delete")}
                  className="hover:bg-destructive hover:text-destructive-foreground"
                  disabled={preset.isDefault}
                  onClick={handleDelete}
                  size="icon-sm"
                  title={t("presets.item.actions.delete")}
                  variant="ghost"
                >
                  <span className="i-hugeicons-delete-02 size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {preset.isDefault
                  ? t("presets.item.actions.cannotDeleteDefault")
                  : t("presets.item.actions.delete")}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </ItemActions>
      </Item>

      <DeleteConfirmationDialog
        onConfirm={handleConfirmDelete}
        onOpenChange={setShowDeleteDialog}
        open={showDeleteDialog}
        presetName={preset.name}
      />
    </>
  );
}
