import { useCountUp, useReveal } from "@/hooks/use-reveal";
import { Reveal } from "./Reveal";

type AboutCMS = {
  description1?: string;
  description2?: string;
  stats?: Array<{ value: number; suffix: string; label: string }>;
};

const DEFAULT_ABOUT_STATS = [
  { value: 3, suffix: "+", label: "Years Experience" },
  { value: 10, suffix: "+", label: "Brands Worked With" },
  { value: 50, suffix: "+", label: "Projects Delivered" },
];

export function About({ cms }: { cms?: AboutCMS }) {
  const description1 =
    cms?.description1 ||
    "I've spent the last 3+ years designing for brands, startups and growing businesses from brand identity and social media to websites and UI.";
  const description2 =
    cms?.description2 ||
    "I like turning ideas into design that feels clear, memorable and actually useful. I work mainly in Figma, Canva and Adobe tools, and enjoy being involved from the first idea to the final visual.";
  const stats = cms?.stats || DEFAULT_ABOUT_STATS;

  const STATS = stats;

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
            {description1}
          </p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            {description2}
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
