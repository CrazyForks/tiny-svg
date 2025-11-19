/**
 * Online Status Indicator Component
 * Shows connection status and notifies users when offline
 */

import { Cloud, CloudOff, Wifi, WifiOff } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { useOnlineStatus } from "@/lib/pwa-utils";
import { cn } from "@/lib/utils";

export function OnlineStatusIndicator() {
  const isOnline = useOnlineStatus();
  const previousStatusRef = useRef(true);

  useEffect(() => {
    // Only show toast after initial render and when status actually changes
    if (previousStatusRef.current !== isOnline) {
      if (isOnline) {
        toast.success("Back Online", {
          description: "Your internet connection has been restored.",
          icon: <Wifi className="size-4" />,
          duration: 3000,
        });
      } else {
        toast.warning("Working Offline", {
          description:
            "No internet connection. SVG optimization still works offline!",
          icon: <WifiOff className="size-4" />,
          duration: 5000,
        });
      }
    }
    previousStatusRef.current = isOnline;
  }, [isOnline]);

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium text-xs transition-colors",
        isOnline
          ? "bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400"
          : "bg-orange-500/10 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400"
      )}
      title={isOnline ? "Online" : "Offline - Core features still work"}
    >
      {isOnline ? (
        <Cloud className="size-3.5" />
      ) : (
        <CloudOff className="size-3.5" />
      )}
      <span className="hidden sm:inline">
        {isOnline ? "Online" : "Offline"}
      </span>
    </div>
  );
}

/**
 * Simplified version for header/footer
 */
export function OnlineStatusBadge() {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null; // Don't show anything when online
  }

  return (
    <div
      className="flex items-center gap-1.5 rounded-md bg-orange-500/10 px-2 py-1 font-medium text-orange-700 text-xs dark:bg-orange-500/20 dark:text-orange-400"
      title="No internet connection - Core features still work"
    >
      <WifiOff className="size-3.5" />
      <span>Offline</span>
    </div>
  );
}
