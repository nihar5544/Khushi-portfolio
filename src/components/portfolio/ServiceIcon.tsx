import { Compass } from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { DYNAMIC_ICON_NAMES, EAGER_ICONS, normalizeIconName } from "@/lib/service-icon";

type ServiceIconProps = {
  name?: string | null;
  size?: number;
  strokeWidth?: number;
  className?: string;
};

/**
 * Render a service icon from any Lucide icon name.
 * Unknown/empty names fall back to `Compass` instead of rendering nothing.
 */
export function ServiceIcon({ name, size = 34, strokeWidth = 1.5, className }: ServiceIconProps) {
  const key = normalizeIconName(name);
  const EagerIcon = Object.hasOwn(EAGER_ICONS, key) ? EAGER_ICONS[key] : undefined;

  if (EagerIcon) {
    return <EagerIcon size={size} strokeWidth={strokeWidth} className={className} />;
  }

  if (key && DYNAMIC_ICON_NAMES.has(key)) {
    return (
      <DynamicIcon
        name={key as IconName}
        size={size}
        strokeWidth={strokeWidth}
        className={className}
        fallback={() => <Compass size={size} strokeWidth={strokeWidth} className={className} />}
      />
    );
  }

  return <Compass size={size} strokeWidth={strokeWidth} className={className} />;
}
