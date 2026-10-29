import { Compass, Fingerprint, Instagram, LayoutGrid, Layers, type LucideIcon } from "lucide-react";
import { Reveal } from "./Reveal";
import type { ServiceIconName } from "@/lib/service-icons";

type ServicesCMS = {
  items?: Array<{
    icon: ServiceIconName | string;
    title: string;
    copy: string;
  }>;
};

const iconMap: Record<string, LucideIcon> = {
  Compass,
  Fingerprint,
  Instagram,
  LayoutGrid,
  Layers,
};

/**
 * Resolve a CMS icon name defensively.
 * Content edited in the admin panel can contain any string (e.g. "Compass test"),
 * so always fall back to a valid icon instead of rendering `undefined`.
 */
function resolveServiceIcon(name?: string): LucideIcon {
  if (!name) return Compass;
  const normalized = name.trim().toLowerCase();
  const match = Object.keys(iconMap).find((key) => key.toLowerCase() === normalized);
  return match ? iconMap[match] : Compass;
}

const DEFAULT_SERVICES = [
  {
    icon: "Compass" as const,
    title: "Brand Strategy",
    copy: "Logos, visual identities, colour systems and brand assets that make a business recognizable.",
  },
  {
    icon: "Fingerprint" as const,
    title: "Brand Identity & Logo Design",
    copy: "Logos, type, colour and full identity kits built to last beyond a trend cycle.",
  },
  {
    icon: "Instagram" as const,
    title: "Social Media Design",
    copy: "Posts, carousels, stories and content systems that keep brands consistent and engaging.",
  },
  {
    icon: "LayoutGrid" as const,
    title: "UI/UX Design",
    copy: "Websites, SaaS products, dashboards and interfaces designed around real user needs.",
  },
  {
    icon: "Layers" as const,
    title: "Design Systems in Figma & Canva",
    copy: "Handoff-ready libraries your team can actually run with, solo or at scale.",
  },
];

export function Services({ cms }: { cms?: ServicesCMS }) {
  const services = Array.isArray(cms?.items) && cms.items.length > 0 ? cms.items : DEFAULT_SERVICES;

  return (
    <section id="services" className="bg-ink py-24 text-ink-foreground md:py-36 grain">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <Reveal className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary">
              (02) Services
            </p>
            <h2 className="display-xl mt-5 text-[clamp(2.5rem,7vw,6rem)]">What I do</h2>
          </div>
          <p className="max-w-sm text-sm text-ink-foreground/60">
            Five focused offers. Take one, or the whole stack from strategy to shipped interface.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl bg-ink-foreground/15 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = resolveServiceIcon(s.icon);
            return (
              <Reveal
                key={`${s.title}-${i}`}
                delay={i * 80}
                className="group relative bg-ink p-8 transition-colors duration-400 hover:bg-primary md:p-10"
              >
                <div className="flex items-start justify-between">
                  <Icon
                    size={34}
                    strokeWidth={1.5}
                    className="text-primary transition-colors duration-300 group-hover:text-primary-foreground"
                  />
                  <span className="text-xs font-semibold tracking-widest opacity-40">0{i + 1}</span>
                </div>
                <h3 className="display-xl mt-10 text-[clamp(1.5rem,2.6vw,2.1rem)]">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-foreground/60 transition-colors duration-300 group-hover:text-primary-foreground/80">
                  {s.copy}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
