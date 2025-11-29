import { useState } from "react";
import { Button } from "@/ui/components/base/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
} from "@/ui/components/base/drawer";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/ui/components/base/tabs";
import { usePluginStore } from "@/ui/store/plugin-store";
import { AboutTab } from "./about-tab";
import { PresetsTab } from "./presets-tab";

export function SettingsDrawer() {
  const { settingsOpen, closeSettings } = usePluginStore();
  const [activeTab, setActiveTab] = useState("presets");

  const handleCreatePreset = () => {
    // TODO: Open create preset dialog
  };

  return (
    <Drawer
      direction="left"
      onOpenChange={(open) => {
        if (!open) {
          closeSettings();
        }
      }}
      open={settingsOpen}
    >
      <DrawerContent className="w-full! max-w-full!">
        {/* Tabs */}
        <Tabs
          className="flex flex-1 flex-col"
          defaultValue="presets"
          onValueChange={setActiveTab}
          value={activeTab}
        >
          {/* Header with Title and Tabs */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-3">
              <h2 className="font-semibold">Settings</h2>

              <TabsList>
                <TabsTrigger value="presets">预设</TabsTrigger>
                <TabsTrigger value="about">关于</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex items-center gap-3">
              {activeTab === "presets" && (
                <Button
                  onClick={handleCreatePreset}
                  type="button"
                  variant="default"
                >
                  创建
                </Button>
              )}

              <DrawerClose asChild>
                <Button
                  aria-label="关闭"
                  size="icon"
                  title="关闭"
                  type="button"
                  variant="outline"
                >
                  <span className="i-hugeicons-cancel-01 size-4" />
                </Button>
              </DrawerClose>
            </div>
          </div>

          {/* Tabs Content */}
          <TabsContent className="flex-1" value="presets">
            <PresetsTab />
          </TabsContent>

          <TabsContent className="flex-1" value="about">
            <AboutTab />
          </TabsContent>
        </Tabs>
      </DrawerContent>
    </Drawer>
  );
}
