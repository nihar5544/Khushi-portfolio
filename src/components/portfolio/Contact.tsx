import { useState, type FormEvent } from "react";
import { ArrowUpRight, Linkedin, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "./Reveal";

export function Contact() {
  const [sending, setSending] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Thanks! Your message is ready to send.", {
        description: "Email delivery isn't wired up yet — reach me at rawatkhushi2910@gmail.com.",
      });
      e.currentTarget?.reset?.();
    }, 600);
  };

  const field =
    "w-full rounded-2xl border-2 border-ink-foreground/20 bg-transparent px-5 py-4 text-base outline-none transition-colors duration-300 placeholder:text-ink-foreground/40 focus:border-primary";

  return (
    <section id="contact" className="bg-ink py-24 text-ink-foreground md:py-36 grain">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary">
            (06) Contact
          </p>
          <h2 className="display-xl mt-5 text-[clamp(2.6rem,9vw,8rem)]">
            Let&apos;s build
            <br />
            something
            <br />
            <span className="text-primary">bold</span> together.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-14 md:grid-cols-2 md:gap-20">
          <Reveal variant="left" className="space-y-8">
            <div className="space-y-4">
              <a
                href="mailto:rawatkhushi2910@gmail.com"
                className="group flex items-center gap-4 border-b border-ink-foreground/15 pb-4"
              >
                <Mail size={20} className="shrink-0 text-primary" />
                <span className="min-w-0 truncate text-lg font-medium">
                  rawatkhushi2910@gmail.com
                </span>
                <ArrowUpRight
                  size={18}
                  className="ml-auto shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </a>
              <a
                href="tel:+916353561585"
                className="group flex items-center gap-4 border-b border-ink-foreground/15 pb-4"
              >
                <Phone size={20} className="shrink-0 text-primary" />
                <span className="text-lg font-medium">+91 63535 61585</span>
                <ArrowUpRight
                  size={18}
                  className="ml-auto shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </a>
              <a
                href="https://www.linkedin.com/in/khushi-rawat-712290208/"
                target="_blank"
                rel="noreferrer noopener"
                className="group flex items-center gap-4 border-b border-ink-foreground/15 pb-4"
              >
                <Linkedin size={20} className="shrink-0 text-primary" />
                <span className="text-lg font-medium">LinkedIn</span>
                <ArrowUpRight
                  size={18}
                  className="ml-auto shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </a>
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                { icon: Mail, href: "mailto:rawatkhushi2910@gmail.com", label: "Email" },
                {
                  icon: Linkedin,
                  href: "https://www.linkedin.com/in/khushi-rawat-712290208/",
                  label: "LinkedIn",
                },
                { icon: Phone, href: "tel:+916353561585", label: "Phone" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer noopener"
                  className="grid size-12 place-items-center rounded-full border-2 border-ink-foreground/25 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <s.icon size={18} />
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <form onSubmit={onSubmit} className="space-y-4">
              <input required name="name" placeholder="Your name" className={field} />
              <input
                required
                type="email"
                name="email"
                placeholder="Your email"
                className={field}
              />
              <textarea
                required
                name="message"
                rows={5}
                placeholder="Tell me about your brand"
                className={field + " resize-none"}
              />
              <button
                type="submit"
                disabled={sending}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-5 text-sm font-bold tracking-[0.15em] text-primary-foreground uppercase transition-all duration-300 hover:-translate-y-1 disabled:opacity-60"
              >
                {sending ? "Sending…" : "Send Message"}
                <ArrowUpRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
