import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { useIntlayer } from "react-intlayer";
import { LocalizedLink } from "@/components/intlayer/localized-link";

export const Route = createFileRoute("/{-$locale}/404")({
  component: NotFoundComponent,
});

export function NotFoundComponent() {
  const { backHome, title } = useIntlayer("not-found");

  return (
    <div className="flex min-h-screen items-center px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="w-full space-y-6 text-center">
        <div className="space-y-3">
          <h1 className="font-bold text-4xl tracking-tighter transition-transform hover:scale-110 sm:text-5xl">
            404
          </h1>
          <p className="text-gray-500">{title}</p>
        </div>

        <Button asChild>
          <LocalizedLink className="mt-4" to="/">
            {backHome}
          </LocalizedLink>
        </Button>
      </div>
    </div>
  );
}
