import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 " +
        (scrolled ? "backdrop-blur-md" : "")
      }
    >
      <div
        className={
          "mx-auto grid max-w-[1400px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 transition-all duration-500 md:px-8 " +
          (scrolled ? "py-3" : "py-6")
        }
      >
        <a
          href="#top"
          className="display-xl min-w-0 truncate text-[clamp(1.1rem,2vw,1.5rem)] tracking-tight"
        >
          Khushi<span className="text-primary">.</span>Rawat
        </a>

        <nav className="hidden shrink-0 items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative text-sm font-medium tracking-wide uppercase after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-full bg-ink px-6 py-3 text-sm font-bold tracking-wide text-ink-foreground uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
          >
            Let&apos;s Talk
          </a>
        </nav>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-ink-foreground md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="mx-4 mb-4 rounded-3xl border border-ink/10 bg-card p-6 shadow-xl md:hidden">
          <nav className="flex flex-col gap-4">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="display-xl text-3xl"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-primary px-6 py-4 text-center text-sm font-bold tracking-wide text-primary-foreground uppercase"
            >
              Let&apos;s Talk
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
