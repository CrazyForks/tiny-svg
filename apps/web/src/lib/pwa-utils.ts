/**
 * PWA Utilities for Tiny SVG
 * Handles service worker registration, updates, and install prompts
 */

import { useEffect, useState } from "react";

// Types for service worker events
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/**
 * Hook to manage PWA service worker updates
 * TODO: Uncomment after installing vite-plugin-pwa
 */
export function usePWA() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    // This will be implemented once vite-plugin-pwa is installed
    // import { useRegisterSW } from "virtual:pwa-register/react";

    // For now, return basic offline detection
    const updateOnlineStatus = () => {
      if (typeof navigator !== "undefined") {
        setOfflineReady(!navigator.onLine);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("online", updateOnlineStatus);
      window.addEventListener("offline", updateOnlineStatus);
      updateOnlineStatus();
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("online", updateOnlineStatus);
        window.removeEventListener("offline", updateOnlineStatus);
      }
    };
  }, []);

  const updateServiceWorker = async () => {
    // Will be implemented with vite-plugin-pwa
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration?.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
        window.location.reload();
      }
    }
  };

  const closePrompt = () => {
    setNeedRefresh(false);
  };

  return {
    needRefresh,
    offlineReady,
    updateServiceWorker,
    closePrompt,
  };
}

/**
 * Hook to manage PWA install prompt
 */
export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show install button
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      // Hide the install button
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.addEventListener("appinstalled", handleAppInstalled);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "beforeinstallprompt",
          handleBeforeInstallPrompt
        );
        window.removeEventListener("appinstalled", handleAppInstalled);
      }
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    // Reset the deferred prompt variable
    setDeferredPrompt(null);
    setShowInstallButton(false);

    return outcome;
  };

  const dismissInstall = () => {
    setShowInstallButton(false);
  };

  return {
    showInstallButton,
    promptInstall,
    dismissInstall,
    isInstallable: Boolean(deferredPrompt),
  };
}

/**
 * Check if the app is running as a PWA (standalone mode)
 */
export function isPWA(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari specific property
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
}

/**
 * Check if the browser is online
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateOnlineStatus = () => {
      if (typeof navigator !== "undefined") {
        setIsOnline(navigator.onLine);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("online", updateOnlineStatus);
      window.addEventListener("offline", updateOnlineStatus);
      updateOnlineStatus();
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("online", updateOnlineStatus);
        window.removeEventListener("offline", updateOnlineStatus);
      }
    };
  }, []);

  return isOnline;
}
