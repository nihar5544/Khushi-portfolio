import { Quote } from "lucide-react";
import { Reveal } from "./Reveal";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

type TestimonialsCMS = {
  quotes?: Testimonial[];
};

export function Testimonials({ cms }: { cms?: TestimonialsCMS }) {
  const quotes = cms?.quotes;

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-8 md:py-36">
      <Reveal className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div>
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary">
            (05) Testimonials
          </p>
          <h2 className="display-xl mt-5 text-[clamp(2.5rem,7vw,6rem)]">Kind words</h2>
        </div>
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">
          Placeholder text — to be replaced
        </p>
      </Reveal>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {quotes?.map((q, i) => (
          <Reveal
            key={i}
            delay={i * 100}
            className="group flex flex-col justify-between rounded-3xl border-2 border-ink bg-card p-8 transition-all duration-400 hover:-translate-y-2 hover:bg-primary hover:text-primary-foreground"
          >
            <Quote size={30} className="text-primary group-hover:text-primary-foreground" />
            <p className="mt-6 text-lg leading-snug font-medium">&ldquo;{q.quote}&rdquo;</p>
            <div className="mt-8 border-t border-current/20 pt-4">
              <div className="text-sm font-bold tracking-wide uppercase">{q.name}</div>
              <div className="text-xs opacity-60">{q.role}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
