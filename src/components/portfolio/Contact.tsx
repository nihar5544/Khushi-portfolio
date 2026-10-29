import { useState, type FormEvent } from "react";
import { ArrowUpRight, Linkedin, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "./Reveal";
import axios from "axios";

// Map string icon names from Supabase to actual React components
const iconMap: Record<string, React.ComponentType<{ size: number }>> = {
  Mail,
  Linkedin,
  Phone,
};

interface ContactProps {
  cms?: {
    socialLinks?: Array<{ icon: string; href: string; label: string }>;
  };
}

export function Contact({ cms }: ContactProps) {
  const [sending, setSending] = useState(false);
  const socialLinks = cms?.socialLinks || [];

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const message = formData.get("message") as string;

      // Save to Supabase via REST API
      const res = await axios.post(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/messages`,
        {
          name,
          email,
          subject: "Portfolio Inquiry",
          message,
          read_status: false,
        },
        {
          headers: {
            apikey:
              import.meta.env.VITE_SUPABASE_ANON_KEY ||
              "sb_publishable_1BJQ8eksQ3KqNrfCPVRZzw_Js546MQK",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_1BJQ8eksQ3KqNrfCPVRZzw_Js546MQK"}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to send message");
      }

      setSending(false);
      toast.success("Message sent! I'll get back to you soon.");
      form?.reset?.();
    } catch (err) {
      console.error("Failed to send message:", err);
      toast.error("Failed to send message. Please try again.");
    }
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
              {socialLinks.map((s: any) => {
                const IconComponent = iconMap[s.icon] || Mail;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    className="group flex items-center gap-4 border-b border-ink-foreground/15 pb-4"
                  >
                    <IconComponent size={20} className="shrink-0 text-primary" />
                    <span className="min-w-0 truncate text-lg font-medium">{s.href}</span>
                    <ArrowUpRight
                      size={18}
                      className="ml-auto shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </a>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3">
              {socialLinks.map((s: any) => {
                const IconComponent = iconMap[s.icon] || Mail;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer noopener"
                    className="group relative grid size-12 place-items-center rounded-full border-2 border-ink-foreground/25 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <IconComponent size={18} />
                    <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-ink-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      {s.href}
                    </span>
                  </a>
                );
              })}
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
