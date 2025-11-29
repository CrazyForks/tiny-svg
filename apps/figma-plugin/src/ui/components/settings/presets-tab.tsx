import type { Preset } from "@/types/messages";
import { Button } from "@/ui/components/base/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/ui/components/base/empty";
import { ItemGroup } from "@/ui/components/base/item";
import { ScrollArea } from "@/ui/components/base/scroll-area";
import { usePluginStore } from "@/ui/store/plugin-store";
import { PresetListItem } from "./preset-list-item";

// Mock data for testing
const MOCK_PRESETS: Preset[] = [
  {
    id: "default",
    name: "默认",
    description: "适用于大多数场景的标准优化配置",
    icon: "i-hugeicons-tick-02",
    isDefault: true,
    svgoConfig: {
      plugins: ["preset-default", "removeViewBox", "cleanupIds"],
    },
    createdAt: Date.now() - 86_400_000 * 30,
    updatedAt: Date.now() - 86_400_000 * 30,
  },
  {
    id: "aggressive",
    name: "极致压缩",
    description: "最大程度压缩文件大小，可能影响部分视觉效果",
    icon: "i-hugeicons-flash",
    isDefault: false,
    svgoConfig: {
      plugins: [
        "preset-default",
        "removeViewBox",
        "cleanupIds",
        "convertPathData",
        "mergePaths",
      ],
    },
    createdAt: Date.now() - 86_400_000 * 15,
    updatedAt: Date.now() - 86_400_000 * 7,
  },
  {
    id: "safe",
    name: "安全模式",
    description: "保守的优化策略，保留所有可能需要的属性",
    icon: "i-hugeicons-security-check",
    isDefault: false,
    svgoConfig: { plugins: ["preset-default"] },
    createdAt: Date.now() - 86_400_000 * 20,
    updatedAt: Date.now() - 86_400_000 * 10,
  },
  {
    id: "web-optimized",
    name: "Web 优化",
    description: "针对网页使用优化的配置",
    icon: "i-hugeicons-internet",
    isDefault: false,
    svgoConfig: {
      plugins: [
        "preset-default",
        "removeViewBox",
        "cleanupIds",
        "minifyStyles",
      ],
    },
    createdAt: Date.now() - 86_400_000 * 12,
    updatedAt: Date.now() - 86_400_000 * 3,
  },
  {
    id: "print-ready",
    name: "打印就绪",
    description: "适合打印输出的配置",
    icon: "i-hugeicons-printer",
    isDefault: false,
    svgoConfig: {
      plugins: ["preset-default", "removeViewBox"],
    },
    createdAt: Date.now() - 86_400_000 * 25,
    updatedAt: Date.now() - 86_400_000 * 18,
  },
  {
    id: "animation",
    name: "动画优化",
    description: "保留动画相关属性",
    icon: "i-hugeicons-motion",
    isDefault: false,
    svgoConfig: {
      plugins: ["preset-default"],
    },
    createdAt: Date.now() - 86_400_000 * 8,
    updatedAt: Date.now() - 86_400_000 * 2,
  },
  {
    id: "icon-library",
    name: "图标库",
    description: "适用于图标库的优化配置",
    icon: "i-hugeicons-image-01",
    isDefault: false,
    svgoConfig: {
      plugins: ["preset-default", "removeViewBox", "cleanupIds", "removeTitle"],
    },
    createdAt: Date.now() - 86_400_000 * 18,
    updatedAt: Date.now() - 86_400_000 * 5,
  },
  {
    id: "accessibility",
    name: "无障碍优化",
    description: "保留无障碍相关属性",
    icon: "i-hugeicons-accessibility",
    isDefault: false,
    svgoConfig: {
      plugins: ["preset-default", "removeViewBox"],
    },
    createdAt: Date.now() - 86_400_000 * 22,
    updatedAt: Date.now() - 86_400_000 * 14,
  },
  {
    id: "minimal",
    name: "极简模式",
    description: "最小化处理，几乎不做改动",
    icon: "i-hugeicons-minimalism",
    isDefault: false,
    svgoConfig: {
      plugins: [],
    },
    createdAt: Date.now() - 86_400_000 * 5,
    updatedAt: Date.now() - 86_400_000 * 1,
  },
  {
    id: "react-native",
    name: "React Native",
    description: "适用于 React Native 的配置",
    icon: "i-hugeicons-programming-flag",
    isDefault: false,
    svgoConfig: {
      plugins: ["preset-default", "removeViewBox", "cleanupIds"],
    },
    createdAt: Date.now() - 86_400_000 * 16,
    updatedAt: Date.now() - 86_400_000 * 9,
  },
];

// Mock usage counts
const mockUsageCounts: Record<string, number> = {
  default: 156,
  aggressive: 42,
  safe: 28,
  "web-optimized": 89,
  "print-ready": 15,
  animation: 67,
  "icon-library": 124,
  accessibility: 31,
  minimal: 8,
  "react-native": 53,
};

export function PresetsTab() {
  const { presets } = usePluginStore();

  // Use mock data if no presets in store
  const displayPresets = presets.length > 0 ? presets : MOCK_PRESETS;

  // Placeholder action handlers
  const handlePin = (_id: string) => {
    // TODO: Implement pin functionality
  };

  const handleEdit = (_id: string) => {
    // TODO: Implement edit dialog
  };

  const handleDelete = (_id: string) => {
    // TODO: Implement delete confirmation
  };

  const handleDuplicate = (_id: string) => {
    // TODO: Implement duplicate preset
  };

  const handleCreate = () => {
    // TODO: Implement create preset dialog
  };

  if (displayPresets.length === 0) {
    return (
      <Empty className="min-h-[400px]">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <span className="i-hugeicons-file-add size-6" />
          </EmptyMedia>
          <EmptyTitle>暂无预设</EmptyTitle>
          <EmptyDescription>
            创建预设以保存常用的优化配置，方便在多个项目中复用。
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={handleCreate} type="button">
            <span className="i-hugeicons-add-01" />
            创建预设
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="px-3 py-2">
        <ItemGroup className="gap-2">
          {displayPresets.map((preset) => (
            <PresetListItem
              key={preset.id}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onEdit={handleEdit}
              onPin={handlePin}
              preset={preset}
              usageCount={mockUsageCounts[preset.id]}
            />
          ))}
        </ItemGroup>
      </div>
    </ScrollArea>
  );
}
