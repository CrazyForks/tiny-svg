// Figma Plugin Sandbox Code
// This runs in Figma's isolated sandbox environment (not the browser)

import { emit, on } from "@create-figma-plugin/utilities";
import type {
  CloseHandler,
  DeletePresetHandler,
  ErrorHandler,
  FigmaNodeData,
  GetPresetsHandler,
  GetSelectionHandler,
  InitHandler,
  Preset,
  PresetDeletedHandler,
  PresetSavedHandler,
  PresetsLoadedHandler,
  SavePresetHandler,
  SelectionChangedHandler,
} from "./types/messages";
import { getDefaultPresets } from "./ui/lib/preset-utils";

// ============================================================================
// Constants
// ============================================================================

const PLUGIN_DATA_KEY = "tiny-svg-presets";
const UI_WIDTH = 400;
const UI_HEIGHT = 600;

// Get default presets from shared configuration
const DEFAULT_PRESETS: Preset[] = getDefaultPresets();

// ============================================================================
// Plugin Initialization
// ============================================================================

export default function () {
  // Show UI using Figma's native API
  figma.showUI(__html__, {
    width: UI_WIDTH,
    height: UI_HEIGHT,
    themeColors: true,
  });

  // Register message handlers
  on<InitHandler>("INIT", handleInit);
  on<GetSelectionHandler>("GET_SELECTION", handleGetSelection);
  on<GetPresetsHandler>("GET_PRESETS", handleGetPresets);
  on<SavePresetHandler>("SAVE_PRESET", handleSavePreset);
  on<DeletePresetHandler>("DELETE_PRESET", handleDeletePreset);
  on<CloseHandler>("CLOSE", () => {
    figma.closePlugin();
  });

  // Selection change listener with debounce
  let selectionChangeTimeout: ReturnType<typeof setTimeout> | null = null;

  figma.on("selectionchange", () => {
    if (selectionChangeTimeout) {
      clearTimeout(selectionChangeTimeout);
    }

    selectionChangeTimeout = setTimeout(() => {
      handleGetSelection();
    }, 150); // 150ms debounce
  });

  // Send initial data to UI
  handleInit();
}

// ============================================================================
// Message Handlers
// ============================================================================

async function handleInit(): Promise<void> {
  // Load presets and send to UI
  await handleGetPresets();

  // Get initial selection
  await handleGetSelection();
}

async function handleGetSelection(): Promise<void> {
  try {
    const selection = figma.currentPage.selection;
    const items: FigmaNodeData[] = [];

    for (const node of selection) {
      if (canExportAsSvg(node)) {
        const svgData = await exportNodeAsSvg(node);
        if (svgData) {
          items.push(svgData);
        }
      }
    }

    emit<SelectionChangedHandler>("SELECTION_CHANGED", items);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? `Failed to get selection: ${error.message}`
        : "Failed to get selection";
    sendError(errorMessage);
  }
}

async function handleGetPresets(): Promise<void> {
  try {
    const presets = loadPresets();
    emit<PresetsLoadedHandler>("PRESETS_LOADED", presets);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? `Failed to load presets: ${error.message}`
        : "Failed to load presets";
    sendError(errorMessage);
  }
}

async function handleSavePreset(preset: Preset): Promise<void> {
  try {
    const presets = loadPresets();

    // Check if preset with same ID exists
    const existingIndex = presets.findIndex((p) => p.id === preset.id);

    if (existingIndex >= 0) {
      // Update existing preset
      presets[existingIndex] = {
        ...preset,
        updatedAt: Date.now(),
      };
    } else {
      // Add new preset
      presets.push({
        ...preset,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    savePresets(presets);

    emit<PresetSavedHandler>("PRESET_SAVED", preset);

    figma.notify("Preset saved successfully");
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? `Failed to save preset: ${error.message}`
        : "Failed to save preset";
    sendError(errorMessage);
  }
}

async function handleDeletePreset(id: string): Promise<void> {
  try {
    const presets = loadPresets();

    // Prevent deleting default presets
    const preset = presets.find((p) => p.id === id);
    if (preset?.isDefault) {
      throw new Error("Cannot delete default preset");
    }

    const filtered = presets.filter((p) => p.id !== id);

    savePresets(filtered);

    emit<PresetDeletedHandler>("PRESET_DELETED", id);

    figma.notify("Preset deleted successfully");
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? `Failed to delete preset: ${error.message}`
        : "Failed to delete preset";
    sendError(errorMessage);
  }
}

// ============================================================================
// SVG Export Utilities
// ============================================================================

function canExportAsSvg(node: SceneNode): boolean {
  return "exportAsync" in node;
}

async function exportNodeAsSvg(node: SceneNode): Promise<FigmaNodeData | null> {
  try {
    const svgBytes = await (node as ExportMixin).exportAsync({
      format: "SVG",
      contentsOnly: false,
    });

    // Convert Uint8Array to string (TextDecoder not available in Figma sandbox)
    let svgString = "";
    for (const byte of svgBytes) {
      svgString += String.fromCharCode(byte);
    }

    return {
      id: node.id,
      nodeId: node.id,
      name: node.name || "Untitled",
      svg: svgString,
    };
  } catch (error) {
    console.error(`Failed to export node "${node.name}":`, error);
    return null;
  }
}

// ============================================================================
// Preset Storage (Figma Plugin Data)
// ============================================================================

function loadPresets(): Preset[] {
  const data = figma.root.getPluginData(PLUGIN_DATA_KEY);

  if (!data) {
    // No saved presets, return defaults
    return [...DEFAULT_PRESETS];
  }

  try {
    const savedPresets: Preset[] = JSON.parse(data);

    // Merge with defaults (ensure defaults are always present)
    const mergedPresets = [...DEFAULT_PRESETS];

    for (const preset of savedPresets) {
      // Only add non-default presets from storage
      if (!preset.isDefault) {
        mergedPresets.push(preset);
      }
    }

    return mergedPresets;
  } catch (error) {
    console.error("Failed to parse presets:", error);
    return [...DEFAULT_PRESETS];
  }
}

function savePresets(presets: Preset[]): void {
  const data = JSON.stringify(presets);
  figma.root.setPluginData(PLUGIN_DATA_KEY, data);
}

// ============================================================================
// Utility Functions
// ============================================================================

function sendError(message: string, details?: string): void {
  emit<ErrorHandler>("ERROR", message, details);
  figma.notify(message, { error: true });
}
