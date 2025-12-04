import { ClientOnly } from "@tanstack/react-router";
import { Toaster } from "@tiny-svg/ui/components/sonner";

export function ClientToaster() {
  return (
    <ClientOnly fallback={null}>
      <Toaster richColors />
    </ClientOnly>
  );
}
