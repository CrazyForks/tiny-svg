/**
 * PWA TypeScript Declarations
 * Type definitions for PWA features and service worker integration
 */

// Virtual module for vite-plugin-pwa (uncomment when package is installed)
// declare module "virtual:pwa-register/react" {
//   import type { Dispatch, SetStateAction } from "react";
//
//   export interface RegisterSWOptions {
//     immediate?: boolean;
//     onNeedRefresh?: () => void;
//     onOfflineReady?: () => void;
//     onRegistered?: (
//       registration: ServiceWorkerRegistration | undefined
//     ) => void;
//     onRegisterError?: (error: Error) => void;
//   }
//
//   export function useRegisterSW(options?: RegisterSWOptions): {
//     needRefresh: [boolean, Dispatch<SetStateAction<boolean>>];
//     offlineReady: [boolean, Dispatch<SetStateAction<boolean>>];
//     updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
//   };
// }

// Extend Navigator for standalone detection
interface Navigator {
  standalone?: boolean;
}

// BeforeInstallPromptEvent interface
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt: () => Promise<void>;
}

// Extend WindowEventMap for PWA events
interface WindowEventMap {
  beforeinstallprompt: BeforeInstallPromptEvent;
  appinstalled: Event;
}
