import { Button } from "@tiny-svg/ui/components/button";
import { ButtonGroup } from "@tiny-svg/ui/components/button-group";
import { memo } from "react";
import { cn } from "@/ui/lib/utils";

interface ActionButtonProps {
  label: string;
  onDownload: () => void;
  onCopy: () => void;
  isLoading?: boolean;
  className?: string;
  buttonClassName?: string;
}

/**
 * Reusable action button with hover interaction
 * Shows label by default, reveals download/copy buttons on hover
 */
export const ActionButton = memo(function ActionButtonComponent({
  label,
  onDownload,
  onCopy,
  isLoading = false,
  className = "w-full",
  buttonClassName = "h-6 rounded-lg",
}: ActionButtonProps) {
  return (
    <div className={cn("group relative", className)}>
      <Button
        className={cn(
          buttonClassName,
          "w-full font-medium text-xs group-hover:text-transparent"
        )}
        size="sm"
        type="button"
        variant="outline"
      >
        {label}
      </Button>
      <ButtonGroup
        className={cn(
          "absolute inset-0 hidden w-full group-hover:flex",
          buttonClassName
        )}
      >
        <Button
          aria-label={`Download ${label}`}
          className={cn(buttonClassName, "grow p-0")}
          disabled={isLoading}
          onClick={onDownload}
          title={`Download ${label}`}
          type="button"
          variant="outline"
        >
          <span className="i-hugeicons-download-01 size-3.5" />
        </Button>
        <Button
          aria-label={`Copy ${label}`}
          className={cn(buttonClassName, "grow p-0")}
          disabled={isLoading}
          onClick={onCopy}
          title={`Copy ${label}`}
          type="button"
          variant="outline"
        >
          <span className="i-hugeicons-copy-01 size-3.5" />
        </Button>
      </ButtonGroup>
    </div>
  );
});
