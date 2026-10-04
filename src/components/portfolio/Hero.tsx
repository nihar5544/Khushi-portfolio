import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Marquee } from "./Marquee";
import { Reveal } from "./Reveal";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-0 md:pt-44">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] glow-top opacity-70" />

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-8">
        <Reveal className="flex flex-wrap items-center gap-3 text-xs font-semibold tracking-[0.25em] uppercase">
          <span className="size-2 rounded-full bg-primary" />
          Available for freelance &amp; collaborations — 2026
        </Reveal>

        <h1 className="display-xl mt-8 -ml-[0.04em] text-[clamp(3.2rem,12.5vw,11rem)]">
          I&apos;m Khushi
          <br />
          Rawat <span className="text-primary">&mdash;</span>
          <br />
          <span className="text-primary">Brand Strategist</span>
          <br />
          &amp; Designer
        </h1>

        <div className="mt-10 grid gap-8 border-t border-ink/15 pt-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <Reveal delay={120}>
            <p className="max-w-xl text-[clamp(1.25rem,2.4vw,2rem)] leading-tight font-medium">
              I build brands that stop the scroll.
            </p>
            <p className="mt-3 max-w-lg text-base text-muted-foreground">
              Brand strategy, identity, social media and UI design for founders who refuse to
              blend in.
            </p>
          </Reveal>

          <Reveal delay={220} className="flex flex-wrap gap-3">
            <a
              href="#work"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-bold tracking-wide text-ink-foreground uppercase transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:text-primary-foreground"
            >
              View My Work
              <ArrowDownRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-y-0.5"
              />
            </a>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-ink px-7 py-4 text-sm font-bold tracking-wide uppercase transition-all duration-300 hover:-translate-y-1 hover:bg-ink hover:text-ink-foreground"
            >
              Let&apos;s Collaborate
              <ArrowUpRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </Reveal>
        </div>
      </div>

      <div className="mt-16">
        <Marquee />
      </div>
    </section>
  );
}
