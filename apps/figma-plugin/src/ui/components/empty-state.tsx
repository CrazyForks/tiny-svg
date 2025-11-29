export function EmptyState() {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 text-muted-foreground/30">
        <svg
          aria-label="Empty state icon"
          fill="none"
          height="64"
          viewBox="0 0 64 64"
          width="64"
        >
          <title>No SVG selected</title>
          <path
            d="M32 8L12 20V44L32 56L52 44V20L32 8Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="M32 8V32M32 32L12 20M32 32L52 20M32 32V56M12 44L32 56M52 44L32 56"
            opacity="0.3"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>
      <h3 className="mb-1 font-semibold text-lg">请选择元素</h3>
      <p className="text-muted-foreground text-sm">
        Select SVG layers in Figma to optimize and export
      </p>
    </div>
  );
}
