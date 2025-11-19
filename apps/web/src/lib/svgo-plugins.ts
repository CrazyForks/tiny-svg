export type SvgoPluginConfig = {
  name: string;
  enabled: boolean;
  params?: Record<string, unknown>;
};

export type SvgoGlobalSettings = {
  showOriginal: boolean;
  compareGzipped: boolean;
  prettifyMarkup: boolean;
  multipass: boolean;
  floatPrecision: number;
  transformPrecision: number;
};

export const defaultGlobalSettings: SvgoGlobalSettings = {
  showOriginal: false,
  compareGzipped: false,
  prettifyMarkup: true,
  multipass: true,
  floatPrecision: 2,
  transformPrecision: 4,
};

export const allSvgoPlugins: SvgoPluginConfig[] = [
  { name: "removeDoctype", enabled: true },
  { name: "removeXMLProcInst", enabled: true },
  { name: "removeComments", enabled: true },
  { name: "removeMetadata", enabled: true },
  { name: "removeXMLNS", enabled: true },
  { name: "removeEditorsNSData", enabled: true },
  { name: "cleanupAttrs", enabled: true },
  { name: "mergeStyles", enabled: true },
  { name: "inlineStyles", enabled: true },
  { name: "minifyStyles", enabled: true },
  { name: "convertStyleToAttrs", enabled: false },
  { name: "cleanupIds", enabled: true },
  { name: "removeRasterImages", enabled: false },
  { name: "removeUselessDefs", enabled: true },
  { name: "cleanupNumericValues", enabled: true },
  { name: "cleanupListOfValues", enabled: true },
  { name: "convertColors", enabled: true },
  { name: "removeUnknownsAndDefaults", enabled: true },
  { name: "removeNonInheritableGroupAttrs", enabled: true },
  { name: "removeUselessStrokeAndFill", enabled: true },
  { name: "removeViewBox", enabled: false },
  { name: "cleanupEnableBackground", enabled: true },
  { name: "removeHiddenElems", enabled: true },
  { name: "removeEmptyText", enabled: true },
  { name: "convertShapeToPath", enabled: false },
  { name: "moveElemsAttrsToGroup", enabled: true },
  { name: "moveGroupAttrsToElems", enabled: true },
  { name: "collapseGroups", enabled: true },
  { name: "convertPathData", enabled: true },
  { name: "convertEllipseToCircle", enabled: true },
  { name: "convertTransform", enabled: true },
  { name: "removeEmptyAttrs", enabled: true },
  { name: "removeEmptyContainers", enabled: true },
  { name: "mergePaths", enabled: true },
  { name: "removeUnusedNS", enabled: true },
  { name: "reusePaths", enabled: false },
  { name: "sortAttrs", enabled: false },
  { name: "sortDefsChildren", enabled: false },
  { name: "removeTitle", enabled: false },
  { name: "removeDesc", enabled: false },
  { name: "removeDimensions", enabled: false },
  { name: "removeStyleElement", enabled: false },
  { name: "removeScriptElement", enabled: false },
  { name: "removeOffCanvasPaths", enabled: false },
  { name: "removeAttributesBySelector", enabled: false },
];
