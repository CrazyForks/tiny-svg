import { useLocation } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@tiny-svg/ui/components/dropdown-menu";
import {
  getLocaleName,
  getPathWithoutLocale,
  Locales,
  type LocalesValues,
} from "intlayer";
import type { FC } from "react";
import { setLocaleInStorage, useLocale } from "react-intlayer";

const localeFlags: Partial<Record<LocalesValues, string>> = {
  [Locales.ENGLISH]: "🇺🇸",
  [Locales.CHINESE]: "🇨🇳",
  [Locales.KOREAN]: "🇰🇷",
  [Locales.GERMAN]: "🇩🇪",
  [Locales.FRENCH]: "🇫🇷",
};

const TRAILING_SLASH_REGEX = /\/$/;

export const LocaleSwitcher: FC = () => {
  const { availableLocales, locale } = useLocale();
  const { pathname } = useLocation();

  const currentFlag = localeFlags[locale as LocalesValues] || "🌐";
  const currentLabel = getLocaleName(locale);

  const handleLocaleChange = (newLocale: LocalesValues) => {
    // Set storage for persistence
    setLocaleInStorage(newLocale);

    // Get path without locale prefix
    const pathWithoutLocale = getPathWithoutLocale(pathname);

    // Remove trailing slash if present
    const cleanPath =
      pathWithoutLocale === "/"
        ? ""
        : pathWithoutLocale.replace(TRAILING_SLASH_REGEX, "");

    // Construct new URL with locale prefix
    const newPath = `/${newLocale}${cleanPath}`;

    // Use setTimeout to ensure storage is set before navigation
    // This prevents SSR hydration mismatch causing language flash
    setTimeout(() => {
      window.location.href = newPath;
    }, 0);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Change language"
          className="flex items-center justify-center gap-1.5 rounded-md p-2 transition-colors hover:bg-accent"
          type="button"
        >
          <span className="text-lg leading-none">{currentFlag}</span>
          <span className="hidden text-sm md:inline">{currentLabel}</span>
          <span className="i-hugeicons-arrow-down-01 size-3.5 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableLocales.map((localeEl) => (
          <DropdownMenuItem
            className={locale === localeEl ? "bg-accent" : ""}
            key={localeEl}
            onClick={() => handleLocaleChange(localeEl as LocalesValues)}
          >
            <span className="mr-2 text-base">
              {localeFlags[localeEl as LocalesValues] || "🌐"}
            </span>
            <span>{getLocaleName(localeEl)}</span>
            {locale === localeEl && (
              <span className="i-hugeicons-tick-02 ml-auto size-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
