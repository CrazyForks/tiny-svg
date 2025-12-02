/**
 * Format a timestamp into a human-readable relative time string
 * @param timestamp - The timestamp to format (in milliseconds)
 * @param t - Translation function from useTranslation hook
 * @returns A formatted relative time string (e.g., "5 days ago", "2 hours ago")
 */
export function formatRelativeTime(
  timestamp: number,
  t: (key: string) => string
): string {
  const now = Date.now();
  const diff = now - timestamp;
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor(diff / 60_000);

  if (days > 0) {
    return `${days} ${t("presets.item.timeUnits.daysAgo")}`;
  }
  if (hours > 0) {
    return `${hours} ${t("presets.item.timeUnits.hoursAgo")}`;
  }
  if (minutes > 0) {
    return `${minutes} ${t("presets.item.timeUnits.minutesAgo")}`;
  }
  return t("presets.item.timeUnits.justNow");
}
