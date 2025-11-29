import { create } from "zustand";
import type { Preset } from "@/types/messages";

// ============================================================================
// Types
// ============================================================================

export interface SvgItem {
  id: string;
  nodeId: string;
  name: string;
  originalSvg: string;
  compressedSvg?: string;
  preset: string; // 'inherit' or preset ID
  originalSize?: number;
  compressedSize?: number;
  compressionRatio?: number;
  error?: string;
}

export type TabType = "svg" | "image" | "code";
export type PreviewTabType = "view" | "code";
export type ImageFormat = "png" | "jpeg" | "webp" | "ico";
export type CodeFormat =
  | "react-jsx"
  | "react-tsx"
  | "vue"
  | "svelte"
  | "react-native"
  | "flutter"
  | "data-uri"
  | "base64";
export type SvgExportFormat = "zip" | "sprite";

interface PreviewModalState {
  isOpen: boolean;
  itemId: string | null;
  activeTab: PreviewTabType;
}

// ============================================================================
// State Interface
// ============================================================================

interface PluginState {
  // Items from Figma selection
  items: SvgItem[];

  // Preset management
  presets: Preset[];
  globalPreset: string;

  // UI state
  activeTab: TabType;
  selectedItemIds: string[];

  // Preview modal
  previewModal: PreviewModalState;

  // Settings
  settingsOpen: boolean;

  // Export options
  selectedImageFormats: ImageFormat[];
  selectedCodeFormat: CodeFormat;
  selectedSvgExportFormat: SvgExportFormat;

  // Processing state
  isCompressing: boolean;
  isExporting: boolean;
  compressionProgress: number; // 0-100

  // Error state
  error: {
    message: string;
    details?: string;
  } | null;
}

// ============================================================================
// Actions Interface
// ============================================================================

interface PluginActions {
  // Items
  setItems: (items: SvgItem[]) => void;
  updateItem: (id: string, updates: Partial<SvgItem>) => void;
  clearItems: () => void;

  // Presets
  setPresets: (presets: Preset[]) => void;
  setGlobalPreset: (presetId: string) => void;
  addPreset: (preset: Preset) => void;
  updatePreset: (preset: Preset) => void;
  deletePreset: (id: string) => void;

  // UI
  setActiveTab: (tab: TabType) => void;
  setSelectedItemIds: (ids: string[]) => void;
  toggleItemSelection: (id: string) => void;

  // Preview modal
  openPreview: (itemId: string, tab?: PreviewTabType) => void;
  closePreview: () => void;
  setPreviewTab: (tab: PreviewTabType) => void;
  setPreviewPreset: (itemId: string, presetId: string) => void;

  // Settings
  openSettings: () => void;
  closeSettings: () => void;
  toggleSettings: () => void;

  // Export options
  setImageFormats: (formats: ImageFormat[]) => void;
  toggleImageFormat: (format: ImageFormat) => void;
  setCodeFormat: (format: CodeFormat) => void;
  setSvgExportFormat: (format: SvgExportFormat) => void;

  // Processing
  setCompressing: (isCompressing: boolean) => void;
  setExporting: (isExporting: boolean) => void;
  setCompressionProgress: (progress: number) => void;

  // Error
  setError: (message: string, details?: string) => void;
  clearError: () => void;

  // Reset
  reset: () => void;
}

// ============================================================================
// Initial State
// ============================================================================

const initialState: PluginState = {
  items: [],
  presets: [],
  globalPreset: "default",
  activeTab: "svg",
  selectedItemIds: [],
  previewModal: {
    isOpen: false,
    itemId: null,
    activeTab: "view",
  },
  settingsOpen: false,
  selectedImageFormats: ["png"],
  selectedCodeFormat: "react-jsx",
  selectedSvgExportFormat: "zip",
  isCompressing: false,
  isExporting: false,
  compressionProgress: 0,
  error: null,
};

// ============================================================================
// Store
// ============================================================================

export const usePluginStore = create<PluginState & PluginActions>(
  (set, get) => ({
    ...initialState,

    // ========================================================================
    // Items Actions
    // ========================================================================

    setItems: (items) => {
      set({
        items: items.map((item) => ({
          ...item,
          preset: item.preset || "inherit",
        })),
      });
    },

    updateItem: (id, updates) => {
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
      }));
    },

    clearItems: () => {
      set({ items: [], selectedItemIds: [] });
    },

    // ========================================================================
    // Presets Actions
    // ========================================================================

    setPresets: (presets) => {
      set({ presets });
    },

    setGlobalPreset: (presetId) => {
      set({ globalPreset: presetId });
    },

    addPreset: (preset) => {
      set((state) => ({
        presets: [...state.presets, preset],
      }));
    },

    updatePreset: (preset) => {
      set((state) => ({
        presets: state.presets.map((p) => (p.id === preset.id ? preset : p)),
      }));
    },

    deletePreset: (id) => {
      set((state) => ({
        presets: state.presets.filter((p) => p.id !== id),
        // If global preset is deleted, reset to default
        globalPreset:
          state.globalPreset === id ? "default" : state.globalPreset,
        // If any item uses this preset, reset to inherit
        items: state.items.map((item) =>
          item.preset === id ? { ...item, preset: "inherit" } : item
        ),
      }));
    },

    // ========================================================================
    // UI Actions
    // ========================================================================

    setActiveTab: (tab) => {
      set({ activeTab: tab });
    },

    setSelectedItemIds: (ids) => {
      set({ selectedItemIds: ids });
    },

    toggleItemSelection: (id) => {
      set((state) => ({
        selectedItemIds: state.selectedItemIds.includes(id)
          ? state.selectedItemIds.filter((selectedId) => selectedId !== id)
          : [...state.selectedItemIds, id],
      }));
    },

    // ========================================================================
    // Preview Modal Actions
    // ========================================================================

    openPreview: (itemId, tab = "view") => {
      set({
        previewModal: {
          isOpen: true,
          itemId,
          activeTab: tab,
        },
      });
    },

    closePreview: () => {
      set({
        previewModal: {
          isOpen: false,
          itemId: null,
          activeTab: "view",
        },
      });
    },

    setPreviewTab: (tab) => {
      set((state) => ({
        previewModal: {
          ...state.previewModal,
          activeTab: tab,
        },
      }));
    },

    setPreviewPreset: (itemId, presetId) => {
      // Update the item's preset in the main list
      get().updateItem(itemId, { preset: presetId });
    },

    // ========================================================================
    // Settings Actions
    // ========================================================================

    openSettings: () => {
      set({ settingsOpen: true });
    },

    closeSettings: () => {
      set({ settingsOpen: false });
    },

    toggleSettings: () => {
      set((state) => ({ settingsOpen: !state.settingsOpen }));
    },

    // ========================================================================
    // Export Options Actions
    // ========================================================================

    setImageFormats: (formats) => {
      set({ selectedImageFormats: formats });
    },

    toggleImageFormat: (format) => {
      set((state) => ({
        selectedImageFormats: state.selectedImageFormats.includes(format)
          ? state.selectedImageFormats.filter((f) => f !== format)
          : [...state.selectedImageFormats, format],
      }));
    },

    setCodeFormat: (format) => {
      set({ selectedCodeFormat: format });
    },

    setSvgExportFormat: (format) => {
      set({ selectedSvgExportFormat: format });
    },

    // ========================================================================
    // Processing Actions
    // ========================================================================

    setCompressing: (isCompressing) => {
      set({ isCompressing });
    },

    setExporting: (isExporting) => {
      set({ isExporting });
    },

    setCompressionProgress: (progress) => {
      set({ compressionProgress: progress });
    },

    // ========================================================================
    // Error Actions
    // ========================================================================

    setError: (message, details) => {
      set({ error: { message, details } });
    },

    clearError: () => {
      set({ error: null });
    },

    // ========================================================================
    // Reset
    // ========================================================================

    reset: () => {
      set(initialState);
    },
  })
);

// ============================================================================
// Selectors
// ============================================================================

// Get effective preset for an item (resolves 'inherit')
export const getEffectivePreset = (
  item: SvgItem,
  globalPreset: string
): string => (item.preset === "inherit" ? globalPreset : item.preset);

// Get items count
export const useItemsCount = () =>
  usePluginStore((state) => state.items.length);

// Get compressed items count
export const useCompressedItemsCount = () =>
  usePluginStore(
    (state) => state.items.filter((item) => item.compressedSvg).length
  );

// Get total compression saved
export const useTotalCompressionSaved = () =>
  usePluginStore((state) => {
    let totalOriginal = 0;
    let totalCompressed = 0;

    for (const item of state.items) {
      if (item.originalSize && item.compressedSize) {
        totalOriginal += item.originalSize;
        totalCompressed += item.compressedSize;
      }
    }

    return totalOriginal - totalCompressed;
  });
