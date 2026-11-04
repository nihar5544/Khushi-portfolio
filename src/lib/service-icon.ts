import { Compass, Fingerprint, Layers, LayoutGrid, type LucideIcon } from "lucide-react";
import { Instagram, Linkedin } from "@/lib/brand-icons";
import { iconNames } from "lucide-react/dynamic";

/**
 * Icons used by the default services list. They are imported eagerly so the
 * server-rendered markup already contains the real icon (no loading flash for
 * the most common case). Every other valid Lucide icon is loaded dynamically.
 */
export const EAGER_ICONS: Record<string, LucideIcon> = {
  compass: Compass,
  fingerprint: Fingerprint,
  instagram: Instagram,
  "layout-grid": LayoutGrid,
  layers: Layers,
  linkedin: Linkedin,
};

/** All icon names supported by `lucide-react/dynamic`, in kebab-case. */
export const DYNAMIC_ICON_NAMES = new Set<string>(iconNames);

const PASCAL_BOUNDARY = /([a-z0-9])([A-Z])/g;

/**
 * Normalize whatever the admin types into a Lucide icon name.
 * Accepts "LayoutGrid", "layout-grid", "layout_grid", "layout grid" and
 * returns "layout-grid".
 */
export function normalizeIconName(name?: string | null): string {
  if (!name) return "";

  return name
    .trim()
    .replace(PASCAL_BOUNDARY, "$1-$2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Whether the given value resolves to an icon we can actually render. */
export function isKnownIconName(name?: string | null): boolean {
  const key = normalizeIconName(name);
  return key.length > 0 && (Object.hasOwn(EAGER_ICONS, key) || DYNAMIC_ICON_NAMES.has(key));
}
