import { toast } from "sonner";

const STORAGE_KEY = "khushi_portfolio_cms_v1";
const DEFAULT_CONTENT = {
  hero: {
    tag: "Available for freelance & collaborations — 2026",
    title: "I'm Khushi Rawat &mdash; Brand Strategist & Designer",
    subtitle:
      "I build brands that stop the scroll. Brand strategy, identity, social media and UI design for founders who refuse to blend in.",
    ctaText: "View My Work",
    secondaryCtaText: "Let's Collaborate",
    heroImage: "/hero-portrait.png",
  },
  about: {
    description1:
      "I've spent the last 3+ years designing for brands, startups and growing businesses from brand identity and social media to websites and UI.",
    description2:
      "I like turning ideas into design that feels clear, memorable and actually useful. I work mainly in Figma, Canva and Adobe tools, and enjoy being involved from the first idea to the final visual.",
    stats: [
      { value: 3, suffix: "+", label: "Years Experience" },
      { value: 10, suffix: "+", label: "Brands Worked With" },
      { value: 50, suffix: "+", label: "Projects Delivered" },
    ],
  },
  services: {
    items: [
      {
        icon: "Compass",
        title: "Brand Strategy",
        copy: "Logos, visual identities, colour systems and brand assets that make a business recognizable.",
      },
      {
        icon: "Fingerprint",
        title: "Brand Identity & Logo Design",
        copy: "Logos, type, colour and full identity kits built to last beyond a trend cycle.",
      },
      {
        icon: "Instagram",
        title: "Social Media Design",
        copy: "Posts, carousels, stories and content systems that keep brands consistent and engaging.",
      },
      {
        icon: "LayoutGrid",
        title: "UI/UX Design",
        copy: "Websites, SaaS products, dashboards and interfaces designed around real user needs.",
      },
      {
        icon: "Layers",
        title: "Design Systems in Figma & Canva",
        copy: "Handoff-ready libraries your team can actually run with, solo or at scale.",
      },
    ],
  },
  projects: [
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
  ],
  process: {
    steps: [
      { n: "01", title: "Discover", copy: "Understand the business, audience and problem." },
      { n: "02", title: "Strategize", copy: "Find the right direction before designing." },
      { n: "03", title: "Design", copy: "Turn the direction into a clear visual experience." },
      { n: "04", title: "Deliver", copy: "Files, guidelines and handoff your team can run with." },
    ],
  },
  testimonials: {
    quotes: [
      {
        quote:
          "Placeholder testimonial — Khushi turned a vague idea into a brand our audience instantly recognised.",
        name: "Client Name",
        role: "Founder, Company",
      },
      {
        quote:
          "Placeholder testimonial — the social system she designed doubled how consistent our feed looks.",
        name: "Client Name",
        role: "Marketing Lead, Company",
      },
      {
        quote:
          "Placeholder testimorial — sharp strategy, fast execution, and files our team could actually use.",
        name: "Client Name",
        role: "Co-founder, Company",
      },
    ],
  },
  navigation: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Work", href: "/work" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Contact", href: "/contact" },
  ],
  socialLinks: [
    {
      icon: "Mail",
      href: "rawatkhushi2910@gmail.com",
      label: "Email",
    },
    {
      icon: "Linkedin",
      href: "https://www.linkedin.com/in/khushi-rawat-712290208/",
      label: "LinkedIn",
    },
    {
      icon: "Phone",
      href: "tel:+916353561585",
      label: "Phone",
    },
  ],
} as const;

// Type-safe content state
type ContentKey =
  | "hero"
  | "about"
  | "services"
  | "projects"
  | "process"
  | "testimonials"
  | "navigation"
  | "socialLinks";

interface ContentState {
  [key in ContentKey]: any;
}

interface CmsStorage {
  getState: () => ContentState;
  setState: (partial: Partial<ContentState>) => void;
  reset: () => void;
  import: (json: any) => void;
  export: () => any;
}

// Initialize from localStorage or defaults, then fetch live content
async function initStorage(): Promise<ContentState> {
  // Start with localStorage or defaults
  let initialState: ContentState;
  try {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const hasAllKeys = Object.keys(DEFAULT_CONTENT).every((k) => k in parsed);
        if (hasAllKeys) initialState = parsed;
        else initialState = { ...DEFAULT_CONTENT } as ContentState;
      } else {
        initialState = { ...DEFAULT_CONTENT } as ContentState;
      }
    } else {
      initialState = { ...DEFAULT_CONTENT } as ContentState;
    }
  } catch (e) {
    console.warn("CMS storage read error, using defaults", e);
    initialState = { ...DEFAULT_CONTENT } as ContentState;
  }

  // On client, fetch live content from /content.json
  if (typeof window !== "undefined") {
    try {
      const response = await fetch("/content.json");
      if (response.ok) {
        const liveContent = await response.json();
        // Merge live content with initial state (live takes precedence)
        Object.keys(liveContent).forEach((key) => {
          if (key in initialState) {
            initialState[key as keyof ContentState] = liveContent[key as keyof ContentState];
          }
        });
      }
    } catch (e) {
      console.warn("Failed to load live content from /content.json", e);
    }
  }

  return initialState;
}

// Persist to localStorage
function persistState(state: ContentState) {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch (e) {
    console.error("CMS storage write error", e);
    toast.error("Failed to save CMS state");
  }
}

// Initialize state asynchronously
let state: ContentState = { ...DEFAULT_CONTENT } as ContentState;
let initPromise: Promise<ContentState> = initStorage().then((s) => {
  state = s;
  subscribers.forEach((cb) => cb(cms.getState()));
  return s;
});
const subscribers: ((state: ContentState) => void)[] = [];

// Wait for initialization
export const cmsReady = initPromise;

export const cms = {
  // Get current state
  getState: (): ContentState => ({ ...state }),

  // Subscribe to changes
  subscribe: (callback: (state: ContentState) => void) => {
    subscribers.push(callback);
    return () => {
      const idx = subscribers.indexOf(callback);
      if (idx > -1) subscribers.splice(idx, 1);
    };
  },

  // Set partial state and notify
  setState: (partial: Partial<ContentState>) => {
    Object.assign(state, partial);
    persistState(state);
    subscribers.forEach((cb) => cb(cms.getState()));
    toast.success("Content updated");
  },

  // Reset to defaults
  reset: () => {
    state.__proto__ = DEFAULT_CONTENT.__proto__; // reset to defaults structure
    // Actually, replace with fresh defaults
    const defaults = { ...DEFAULT_CONTENT } as ContentState;
    Object.keys(defaults).forEach((key) => (state[key as keyof ContentState] = defaults[key]));
    persistState(state);
    subscribers.forEach((cb) => cb(cms.getState()));
    toast.info("Content reset to defaults");
  },

  // Import JSON
  import: (json: any) => {
    try {
      // Validate structure has required keys
      const valid = { ...DEFAULT_CONTENT, ...json } as ContentState;
      Object.keys(valid).forEach((key) => (state[key as keyof ContentState] = valid[key]));
      persistState(state);
      toast.success("Content imported");
    } catch (e) {
      toast.error("Invalid content format");
      console.error("CMS import error", e);
    }
  },

  // Export current content
  export: (): any => {
    const { ...content } = cms.getState();
    return content;
  },

  // Reset entire localStorage
  resetStorage: () => {
    localStorage.removeItem(STORAGE_KEY);
    const defaults = { ...DEFAULT_CONTENT } as ContentState;
    Object.keys(defaults).forEach((key) => (state[key as keyof ContentState] = defaults[key]));
    persistState(state);
    toast.success("Storage reset");
  },
};

// Auto-sync: whenever state changes, components can re-render
// This is a simple pub/sub - components should read from cms.getState()
export const useContent = <T extends keyof ContentState>(key: T) => {
  const [value, setValue] = React.useState<ContentState[T]>(state[key] as ContentState[T]);
  cms.subscribe(() => {
    setValue(state[key] as ContentState[T]);
  });
  return value;
};
