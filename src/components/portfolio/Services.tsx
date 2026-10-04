import { Compass, Fingerprint, Instagram, LayoutGrid, Layers } from "lucide-react";
import { Reveal } from "./Reveal";

const SERVICES = [
  {
    icon: Compass,
    title: "Brand Strategy",
    copy: "Positioning, audience, messaging and tone — the thinking before the pretty.",
  },
  {
    icon: Fingerprint,
    title: "Brand Identity & Logo Design",
    copy: "Logos, type, colour and full identity kits built to last beyond a trend cycle.",
  },
  {
    icon: Instagram,
    title: "Social Media Design",
    copy: "Scroll-stopping content systems, templates and campaigns that stay on brand.",
  },
  {
    icon: LayoutGrid,
    title: "UI/UX Design",
    copy: "Websites and product interfaces that look sharp and behave even better.",
  },
  {
    icon: Layers,
    title: "Design Systems in Figma & Canva",
    copy: "Handoff-ready libraries your team can actually run with, solo or at scale.",
  },
];

export function Services() {
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
            Five focused offers. Take one, or the whole stack from strategy to shipped
            interface.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl bg-ink-foreground/15 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal
              key={s.title}
              delay={i * 80}
              className="group relative bg-ink p-8 transition-colors duration-400 hover:bg-primary md:p-10"
            >
              <div className="flex items-start justify-between">
                <s.icon
                  size={34}
                  strokeWidth={1.5}
                  className="text-primary transition-colors duration-300 group-hover:text-primary-foreground"
                />
                <span className="text-xs font-semibold tracking-widest opacity-40">
                  0{i + 1}
                </span>
              </div>
              <h3 className="display-xl mt-10 text-[clamp(1.5rem,2.6vw,2.1rem)]">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-foreground/60 transition-colors duration-300 group-hover:text-primary-foreground/80">
                {s.copy}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
