import { ArrowUp } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-ink pb-10 text-ink-foreground">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="display-xl border-t border-ink-foreground/15 pt-8 text-[clamp(2.5rem,11vw,9rem)] leading-none">
          Khushi Rawat<span className="text-primary">.</span>
        </div>
        <div className="mt-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <p className="min-w-0 text-xs tracking-[0.15em] uppercase text-ink-foreground/50">
            &copy; {new Date().getFullYear()} Khushi Rawat — All rights reserved
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border-2 border-ink-foreground/25 px-5 py-3 text-[0.65rem] font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            Back to top
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
