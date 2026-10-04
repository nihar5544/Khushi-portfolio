import { useCountUp, useReveal } from "@/hooks/use-reveal";
import { Reveal } from "./Reveal";

const STATS = [
  { value: 3, suffix: "+", label: "Years Experience" },
  { value: 10, suffix: "+", label: "Brands Worked With" },
  { value: 50, suffix: "+", label: "Projects Delivered" },
];

function Stat({ value, suffix, label }: (typeof STATS)[number]) {
  const { ref, visible } = useReveal<HTMLDivElement>(0.4);
  const n = useCountUp(value, visible);
  return (
    <div ref={ref} className="border-t-2 border-ink pt-4">
      <div className="display-xl text-[clamp(3rem,7vw,5.5rem)]">
        {n}
        <span className="text-primary">{suffix}</span>
      </div>
      <div className="mt-1 text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="mx-auto max-w-[1400px] px-5 py-24 md:px-8 md:py-36">
      <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <Reveal variant="left">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary">
            (01) About
          </p>
          <h2 className="display-xl mt-5 text-[clamp(2.5rem,6vw,5rem)]">
            Bold brands,
            <br />
            built on
            <br />
            <span className="text-primary">strategy</span>
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <p className="text-[clamp(1.15rem,2vw,1.6rem)] leading-snug font-medium">
            Three years designing across brand strategy, brand identity, social media and UI —
            for startups, studios and scaling businesses.
          </p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            I work fluently in Figma and Canva, translating positioning into visual systems that
            actually get used. I&apos;m passionate about building bold, memorable brands that
            connect and convert — never decoration for decoration&apos;s sake.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STATS.map((s) => (
              <Stat key={s.label} {...s} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
