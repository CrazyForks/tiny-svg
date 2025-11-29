import type { Preset } from "@/types/messages";
import { Badge } from "@/ui/components/base/badge";
import { Button } from "@/ui/components/base/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/ui/components/base/item";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui/components/base/tooltip";

interface PresetListItemProps {
  preset: Preset;
  usageCount?: number;
  onPin: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor(diff / 60_000);

  if (days > 0) {
    return `${days} 天前`;
  }
  if (hours > 0) {
    return `${hours} 小时前`;
  }
  if (minutes > 0) {
    return `${minutes} 分钟前`;
  }
  return "刚刚";
}

export function PresetListItem({
  preset,
  usageCount = 0,
  onPin,
  onEdit,
  onDelete,
  onDuplicate,
}: PresetListItemProps) {
  return (
    <Item size="sm" variant="outline">
      <ItemContent>
        <ItemTitle>
          {preset.name}
          {preset.isDefault && (
            <Badge className="text-xs" variant="secondary">
              默认
            </Badge>
          )}
        </ItemTitle>
        <div className="text-muted-foreground text-xs">
          使用 {usageCount} 次 • {formatRelativeTime(preset.updatedAt)}
        </div>
      </ItemContent>

      <ItemActions>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="置顶"
                onClick={() => onPin(preset.id)}
                size="icon-sm"
                title="置顶"
                variant="ghost"
              >
                <span className="i-hugeicons-pin size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>置顶</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="编辑"
                onClick={() => onEdit(preset.id)}
                size="icon-sm"
                title="编辑"
                variant="ghost"
              >
                <span className="i-hugeicons-pencil-edit-01 size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>编辑</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="复制"
                onClick={() => onDuplicate(preset.id)}
                size="icon-sm"
                title="复制"
                variant="ghost"
              >
                <span className="i-hugeicons-copy-01 size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>复制</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="删除"
                disabled={preset.isDefault}
                onClick={() => onDelete(preset.id)}
                size="icon-sm"
                title="删除"
                variant="ghost"
              >
                <span className="i-hugeicons-delete-02 size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {preset.isDefault ? "默认预设不能删除" : "删除"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </ItemActions>
    </Item>
  );
}
