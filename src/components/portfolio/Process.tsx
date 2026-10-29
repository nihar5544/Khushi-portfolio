import { Reveal } from "./Reveal";

type ProcessStep = {
  n: string;
  title: string;
  copy: string;
};

type ProcessCMS = {
  steps?: ProcessStep[];
};

const DEFAULT_STEPS: ProcessStep[] = [
  { n: "01", title: "Discover", copy: "Understand the business, audience and problem." },
  { n: "02", title: "Strategize", copy: "Find the right direction before designing." },
  { n: "03", title: "Design", copy: "Turn the direction into a clear visual experience." },
  { n: "04", title: "Deliver", copy: "Files, guidelines and handoff your team can run with." },
];

export function Process({ cms }: { cms?: ProcessCMS }) {
  const steps = cms?.steps || DEFAULT_STEPS;

  return (
    <section className="border-y border-ink/15 bg-secondary py-24 md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary">
            (04) Process
          </p>
          <h2 className="display-xl mt-5 text-[clamp(2.5rem,7vw,6rem)]">How it works</h2>
        </Reveal>

        <div className="mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 120} className="relative">
              <div className="flex items-center gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-ink text-sm font-bold text-ink-foreground">
                  {s.n}
                </span>
                <span className="h-px w-full bg-ink/20" />
              </div>
              <h3 className="display-xl mt-6 text-[clamp(1.8rem,3.2vw,2.6rem)]">{s.title}</h3>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">{s.copy}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
