import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { configuration, getPrefix } from "intlayer";
import { IntlayerProvider, useLocale } from "react-intlayer";
import { useI18nHTMLAttributes } from "@/hooks/use-i18n-html-attrs";
import { NotFoundComponent } from "./404";

const { defaultLocale, locales } = configuration.internationalization;
const { mode } = configuration.routing;

export const Route = createFileRoute("/{-$locale}")({
  beforeLoad: async ({ params }) => {
    // Get locale from route params (not from server headers, as beforeLoad runs on both client and server)
    const localeParam = params.locale;

    // If no locale provided (optional param), it's valid (will use default)
    // In prefix-all mode, the locale is required to be a valid locale
    const { localePrefix } = getPrefix(localeParam ?? defaultLocale, { mode });
    if (localePrefix === localeParam && localeParam === undefined) {
      return;
    }

    // Check if the provided locale is valid
    const isValidLocale = locales.some((localeEl) => localeEl === localeParam);

    if (!isValidLocale) {
      throw redirect({
        params: { locale: undefined }, // Locale param is undefined in routing.mode = 'prefix-no-default', but can be changed by defaultLocale in routing.mode = 'prefix-all'
        to: "/{-$locale}/404",
      });
    }
  },
  component: LayoutComponent,
  notFoundComponent: NotFoundComponent,
});

function LayoutComponent() {
  useI18nHTMLAttributes();

  const { defaultLocale } = useLocale();
  const { locale } = Route.useParams();

  // 强制使用英语作为默认语言，防止服务器端渲染错误
  const safeLocale = locale ?? defaultLocale ?? "en";

  return (
    <IntlayerProvider locale={safeLocale}>
      <Outlet />
    </IntlayerProvider>
  );
}
