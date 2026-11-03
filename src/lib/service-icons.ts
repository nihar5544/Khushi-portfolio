/**
 * Icons supported by the Services section.
 * Keep this list in sync with the icon map in `components/portfolio/Services.tsx`.
 */
export const SERVICE_ICONS = [
  "Compass",
  "Fingerprint",
  "Instagram",
  "LayoutGrid",
  "Layers",
] as const;

export type ServiceIconName = (typeof SERVICE_ICONS)[number];
