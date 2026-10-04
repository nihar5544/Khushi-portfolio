import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";

type Project = {
  name: string;
  tag: string;
  desc: string;
  url?: string;
};

const PROJECTS: Project[] = [
  {
    name: "Picsdrop",
    tag: "Branding / Social Media / Website Design",
    desc: "Built the visual direction for a photography business platform, from its brand presence and social content to the website experience.",
    url: "https://picsdrop.in",
  },
  {
    name: "Somenu Digital",
    tag: "Branding / Social Media / UI",
    desc: "Worked across the brand, social media and product interface to create a more consistent experience for a digital POS and menu platform.",
    url: "https://somenu.digital",
  },
  {
    name: "Spark Digishine",
    tag: "SOCIAL MEDIA / UI / WEBSITE DESIGN",
    desc: "Designed digital experiences and social content for a creative technology studio, keeping the work clear, modern and consistent across platforms.",
    url: "https://sparkdigishine.com",
  },
  {
    name: "Fishelly",
    tag: "UI / SOCIAL MEDIA",
    desc: "Designed the product experience and social visuals for a fish community platform, making complex features feel simple and approachable.",
    url: "https://fishelly.com",
  },
  {
    name: "Super Squirrels",
    tag: "Branding / Social Media",
    desc: "Created a playful visual direction across the brand and website, giving the initiative a more recognizable personality.",
    url: "https://supersquirrels.org",
  },
  {
    name: "ORIZA TEAS",
    tag: "WEBSITE DESIGN / PACKAGING DESIGN",
    desc: "Worked on the digital and packaging experience for a tea brand, bringing the products, visual identity and online presence together.",
  },
  // {
  //   name: "Barifit",
  //   tag: "Social Media",
  //   desc: "High-energy fitness social media design built for consistency.",
  // },
];

export function Work() {
  return (
    <section id="work" className="mx-auto max-w-[1400px] px-5 py-24 md:px-8 md:py-36">
      <Reveal className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div>
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary">
            (03) Selected Work
          </p>
          <h2 className="display-xl mt-5 text-[clamp(2.5rem,7vw,6rem)]">
            Brands I&apos;ve
            <br />
            shaped
          </h2>
        </div>
        <p className="max-w-sm text-sm text-muted-foreground">
          A selection of client work across identity, social and product design.
        </p>
      </Reveal>

      <div className="mt-16 border-t border-ink/15">
        {PROJECTS.map((p, i) => {
          const Wrapper = p.url ? "a" : "div";
          return (
            <Reveal key={p.name} delay={i * 60}>
              <Wrapper
                {...(p.url ? { href: p.url, target: "_blank", rel: "noreferrer noopener" } : {})}
                className="group relative block overflow-hidden border-b border-ink/15 py-8 md:py-10"
              >
                <span className="absolute inset-0 -z-0 translate-y-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
                <div className="relative z-10 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-2 transition-colors duration-400 group-hover:text-ink-foreground md:gap-8 md:px-6">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="display-xl text-[clamp(1.9rem,5.5vw,4.2rem)] transition-transform duration-500 group-hover:translate-x-3">
                        {p.name}
                      </h3>
                      <span className="rounded-full border border-current px-3 py-1 text-[0.65rem] font-semibold tracking-[0.15em] uppercase opacity-70">
                        {p.tag}
                      </span>
                    </div>
                    <p className="mt-2 max-w-xl text-sm text-muted-foreground transition-colors duration-400 group-hover:text-ink-foreground/70">
                      {p.desc}
                    </p>
                  </div>
                  <div className="shrink-0">
                    {p.url ? (
                      <span className="inline-flex items-center gap-2 rounded-full border-2 border-current px-4 py-2 text-[0.65rem] font-bold tracking-[0.15em] uppercase transition-colors duration-300 group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground">
                        <span className="hidden sm:inline">View Project</span>
                        <ArrowUpRight size={16} />
                      </span>
                    ) : (
                      <span className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase opacity-50">
                        Case study soon
                      </span>
                    )}
                  </div>
                </div>
              </Wrapper>
            </Reveal>
          );
        })}
      </div>

      <Reveal className="mt-10 text-center text-sm font-semibold tracking-[0.2em] uppercase text-muted-foreground">
        + many more ongoing projects
      </Reveal>
    </section>
  );
}
