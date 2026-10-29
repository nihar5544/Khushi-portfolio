import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  usePortfolioContent,
  DEFAULT_CONTENT,
  type SectionName,
  type SectionContentMap,
} from "@/admin/hooks/usePortfolioContent";
import { Save, Download, RefreshCw, RotateCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SERVICE_ICONS } from "@/lib/service-icons";

function useAdminAuth() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("khushi_admin_auth");
    setLoggedIn(!!token);
  }, []);

  const login = (password: string) => {
    if (password === "K9374320711") {
      localStorage.setItem("khushi_admin_auth", "verified");
      setLoggedIn(true);
      toast.success("Logged in successfully");
    } else {
      toast.error("Invalid password");
    }
  };

  const logout = () => {
    localStorage.removeItem("khushi_admin_auth");
    setLoggedIn(false);
    toast.success("Logged out");
  };

  return { loggedIn, login, logout };
}

const sections = [
  { id: "hero", title: "Hero", desc: "Tagline, title, subtitle, CTAs" },
  { id: "about", title: "About", desc: "Description + statistics" },
  { id: "services", title: "Services", desc: "5 services with icons" },
  { id: "projects", title: "Projects", desc: "6 projects with URLs" },
  { id: "process", title: "Process", desc: "4-step workflow" },
  { id: "testimonials", title: "Testimonials", desc: "3 client quotes" },
  { id: "navigation", title: "Navigation", desc: "Custom links" },
  { id: "socialLinks", title: "Social Links", desc: "Email, LinkedIn, Phone" },
  { id: "messages", title: "Messages", desc: "Contact form submissions" },
];

function HeroEditor({ content, onChange }: { content: any; onChange: (data: any) => void }) {
  const [titleLines, setTitleLines] = useState<string[]>(
    content?.titleLines || [
      "I'm Khushi",
      'Rawat <span class="text-primary">&mdash;</span>',
      '<span class="text-primary">Brand Strategist</span>',
      "& Designer",
    ],
  );
  const [subtitleLines, setSubtitleLines] = useState<string[]>(
    content?.subtitleLines || [
      "I build brands that stop the scroll.",
      "Brand strategy, identity, social media and UI design for founders who refuse to blend in.",
    ],
  );

  useEffect(() => {
    if (content?.titleLines) setTitleLines(content.titleLines);
  }, [content?.titleLines]);
  useEffect(() => {
    if (content?.subtitleLines) setSubtitleLines(content.subtitleLines);
  }, [content?.subtitleLines]);

  return (
    <div className="space-y-4">
      <Input
        placeholder="Tag line"
        value={content?.tag || "Available for freelance & collaborations — 2026"}
        onChange={(e) => onChange({ tag: e.target.value })}
        className="w-full"
      />
      <div className="space-y-2">
        <label className="text-sm font-medium">Title Lines (each on new line)</label>
        <textarea
          value={titleLines.join("\n")}
          onChange={(e) => {
            setTitleLines(e.target.value.split("\n"));
            onChange({ titleLines, subtitleLines });
          }}
          className="w-full h-[120px] resize-none"
          placeholder="Line 1\nLine 2\nLine 3"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Subtitle Lines (each on new line)</label>
        <textarea
          value={subtitleLines.join("\n")}
          onChange={(e) => {
            setSubtitleLines(e.target.value.split("\n"));
            onChange({ titleLines, subtitleLines });
          }}
          className="w-full h-[80px] resize-none"
          placeholder="Line 1\nLine 2"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          placeholder="Primary CTA"
          value={content?.ctaText || "View My Work"}
          onChange={(e) => onChange({ ctaText: e.target.value })}
          className="w-full"
        />
        <Input
          placeholder="Secondary CTA"
          value={content?.secondaryCtaText || "Let's Collaborate"}
          onChange={(e) => onChange({ secondaryCtaText: e.target.value })}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Hero Portrait Image</label>
        <Input
          placeholder="/hero-portrait.png"
          value={content?.heroImage ?? ""}
          onChange={(e) => onChange({ heroImage: e.target.value })}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Leave empty to use the default portrait (/hero-portrait.png).
        </p>
      </div>
    </div>
  );
}

function AboutEditor({ content, onChange }: { content: any; onChange: (data: any) => void }) {
  const stats = content?.stats || [
    { value: 3, suffix: "+", label: "Years Experience" },
    { value: 10, suffix: "+", label: "Brands Worked With" },
    { value: 50, suffix: "+", label: "Projects Delivered" },
  ];

  return (
    <div className="space-y-4">
      <textarea
        placeholder="Description 1"
        value={content?.description1 || ""}
        onChange={(e) => onChange({ description1: e.target.value })}
        className="w-full h-[120px] resize-none"
      />
      <textarea
        placeholder="Description 2"
        value={content?.description2 || ""}
        onChange={(e) => onChange({ description2: e.target.value })}
        className="w-full h-[120px] resize-none"
      />
      <div className="grid grid-cols-3 gap-4 mt-4">
        {[
          { key: "years", label: "Years Experience", index: 0 },
          { key: "brands", label: "Brands Worked With", index: 1 },
          { key: "projects", label: "Projects Delivered", index: 2 },
        ].map((statConfig) => (
          <div key={statConfig.key} className="space-y-2">
            <label className="text-sm font-medium">{statConfig.label}</label>
            <Input
              type="number"
              value={stats[statConfig.index]?.value || 0}
              onChange={(e) =>
                onChange({
                  stats: stats.map((s: any, i: number) =>
                    i === statConfig.index ? { ...s, value: parseInt(e.target.value) || 0 } : s,
                  ),
                })
              }
              className="w-full"
            />
            <Input
              placeholder="Suffix"
              value={stats[statConfig.index]?.suffix || "+"}
              onChange={(e) =>
                onChange({
                  stats: stats.map((s: any, i: number) =>
                    i === statConfig.index ? { ...s, suffix: e.target.value } : s,
                  ),
                })
              }
              className="w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ServicesEditor({ content, onChange }: { content: any; onChange: (data: any) => void }) {
  const [items, setItems] = useState(
    content?.items || [
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
  );

  useEffect(() => {
    if (content?.items) setItems(content.items);
  }, [content?.items]);

  useEffect(() => {
    onChange({ items });
  }, [items]);

  const moveItem = (index: number, direction: number) => {
    setItems((prev) => {
      const newItems = [...prev];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= newItems.length) return prev;
      [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
      return newItems;
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { icon: "Compass", title: "New Service", copy: "Service description" },
    ]);
  };

  return (
    <div className="space-y-4">
      {items.map((s: any, i: number) => (
        <div key={i} className="p-4 border rounded-lg bg-muted/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">Service {i + 1}</span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveItem(i, -1)}
                disabled={i === 0}
                aria-label="Move up"
              >
                ↑
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveItem(i, 1)}
                disabled={i === items.length - 1}
                aria-label="Move down"
              >
                ↓
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(i)}
                className="text-red-500"
                aria-label="Remove"
              >
                ×
              </Button>
            </div>
          </div>
          <Input
            placeholder="Title"
            value={s.title}
            onChange={(e) =>
              setItems((prev) =>
                prev.map((item: any, idx: number) =>
                  idx === i ? { ...item, title: e.target.value } : item,
                ),
              )
            }
            className="w-full"
          />
          <Input
            placeholder="Description"
            value={s.copy}
            onChange={(e) =>
              setItems((prev) =>
                prev.map((item: any, idx: number) =>
                  idx === i ? { ...item, copy: e.target.value } : item,
                ),
              )
            }
            className="w-full"
          />
          <Select
            value={SERVICE_ICONS.includes(s.icon) ? s.icon : ""}
            onValueChange={(value) =>
              setItems((prev) =>
                prev.map((item: any, idx: number) => (idx === i ? { ...item, icon: value } : item)),
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose an icon" />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_ICONS.map((icon) => (
                <SelectItem key={icon} value={icon}>
                  {icon}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
      <Button variant="outline" onClick={addItem} className="w-full">
        + Add Service
      </Button>
    </div>
  );
}

/**
 * Normalize section data that is expected to be an array.
 * The numeric-key object case recovers arrays accidentally saved via object spread
 * by older versions of the admin form (for example: {"0": {...}, "1": {...}}).
 */
function getArrayContent(content: unknown): any[] | null {
  if (Array.isArray(content)) return content;
  if (!content || typeof content !== "object") return null;

  const record = content as Record<string, unknown>;
  const keys = Object.keys(record);
  if (keys.length > 0 && keys.every((key) => /^\d+$/.test(key))) {
    return keys.sort((a, b) => Number(a) - Number(b)).map((key) => record[key]);
  }

  return null;
}

function ProjectsEditor({ content, onChange }: { content: any; onChange: (data: any) => void }) {
  const items = getArrayContent(content) ?? [
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
      url: "",
    },
  ];

  const moveItem = (index: number, direction: number) => {
    const nextItems = [...items];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= nextItems.length) return;
    [nextItems[index], nextItems[newIndex]] = [nextItems[newIndex], nextItems[index]];
    onChange(nextItems);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const addItem = () => {
    onChange([...items, { name: "New Project", tag: "", desc: "", url: "" }]);
  };

  return (
    <div className="space-y-4">
      {items.map((p: any, i: number) => (
        <div key={i} className="p-4 border rounded-lg bg-muted/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">{p.name || `Project ${i + 1}`}</span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveItem(i, -1)}
                disabled={i === 0}
                aria-label="Move up"
              >
                ↑
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveItem(i, 1)}
                disabled={i === items.length - 1}
                aria-label="Move down"
              >
                ↓
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(i)}
                className="text-red-500"
                aria-label="Remove"
              >
                ×
              </Button>
            </div>
          </div>
          <Input
            placeholder="Name"
            value={p.name ?? ""}
            onChange={(e) =>
              onChange(
                items.map((item: any, idx: number) =>
                  idx === i ? { ...item, name: e.target.value } : item,
                ),
              )
            }
            className="w-full"
          />
          <Input
            placeholder="Tag"
            value={p.tag ?? ""}
            onChange={(e) =>
              onChange(
                items.map((item: any, idx: number) =>
                  idx === i ? { ...item, tag: e.target.value } : item,
                ),
              )
            }
            className="w-full"
          />
          <textarea
            placeholder="Description"
            value={p.desc ?? ""}
            onChange={(e) =>
              onChange(
                items.map((item: any, idx: number) =>
                  idx === i ? { ...item, desc: e.target.value } : item,
                ),
              )
            }
            className="w-full h-[80px] resize-none"
          />
          <Input
            placeholder="URL (optional)"
            value={p.url ?? ""}
            onChange={(e) =>
              onChange(
                items.map((item: any, idx: number) =>
                  idx === i ? { ...item, url: e.target.value } : item,
                ),
              )
            }
            className="w-full"
          />
        </div>
      ))}
      <Button variant="outline" onClick={addItem} className="w-full">
        + Add Project
      </Button>
    </div>
  );
}

function ProcessEditor({ content, onChange }: { content: any; onChange: (data: any) => void }) {
  const items = content?.steps || [];
  return (
    <div className="space-y-4">
      {items.map((s: any, i: number) => (
        <div key={i} className="p-4 border rounded-lg bg-muted/50 space-y-2">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Number"
              value={s.n}
              onChange={(e) =>
                onChange({
                  steps: items.map((item: any, idx: number) =>
                    idx === i ? { ...item, n: e.target.value } : item,
                  ),
                })
              }
              className="w-[80px]"
            />
            <Input
              placeholder="Title"
              value={s.title}
              onChange={(e) =>
                onChange({
                  steps: items.map((item: any, idx: number) =>
                    idx === i ? { ...item, title: e.target.value } : item,
                  ),
                })
              }
              className="w-full"
            />
          </div>
          <Input
            placeholder="Description"
            value={s.copy}
            onChange={(e) =>
              onChange({
                steps: items.map((item: any, idx: number) =>
                  idx === i ? { ...item, copy: e.target.value } : item,
                ),
              })
            }
            className="w-full"
          />
        </div>
      ))}
    </div>
  );
}

function TestimonialsEditor({
  content,
  onChange,
}: {
  content: any;
  onChange: (data: any) => void;
}) {
  const [items, setItems] = useState(
    content?.quotes || [
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
          "Placeholder testimonial — sharp strategy, fast execution, and files our team could actually use.",
        name: "Client Name",
        role: "Co-founder, Company",
      },
    ],
  );

  useEffect(() => {
    if (content?.quotes) setItems(content.quotes);
  }, [content?.quotes]);

  useEffect(() => {
    onChange({ quotes: items });
  }, [items]);

  const moveItem = (index: number, direction: number) => {
    setItems((prev) => {
      const newItems = [...prev];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= newItems.length) return prev;
      [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
      return newItems;
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const addItem = () => {
    setItems((prev) => [...prev, { quote: "New testimonial", name: "Client Name", role: "Role" }]);
  };

  return (
    <div className="space-y-4">
      {items.map((t: any, i: number) => (
        <div key={i} className="p-4 border rounded-lg bg-muted/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">{t.name || `Testimonial ${i + 1}`}</span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveItem(i, -1)}
                disabled={i === 0}
                aria-label="Move up"
              >
                ↑
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveItem(i, 1)}
                disabled={i === items.length - 1}
                aria-label="Move down"
              >
                ↓
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(i)}
                className="text-red-500"
                aria-label="Remove"
              >
                ×
              </Button>
            </div>
          </div>
          <textarea
            placeholder="Quote"
            value={t.quote}
            onChange={(e) =>
              setItems((prev) =>
                prev.map((item: any, idx: number) =>
                  idx === i ? { ...item, quote: e.target.value } : item,
                ),
              )
            }
            className="w-full h-[80px] resize-none"
          />
          <div className="grid gap-2 md:grid-cols-2">
            <Input
              placeholder="Name"
              value={t.name}
              onChange={(e) =>
                setItems((prev) =>
                  prev.map((item: any, idx: number) =>
                    idx === i ? { ...item, name: e.target.value } : item,
                  ),
                )
              }
              className="w-full"
            />
            <Input
              placeholder="Role"
              value={t.role}
              onChange={(e) =>
                setItems((prev) =>
                  prev.map((item: any, idx: number) =>
                    idx === i ? { ...item, role: e.target.value } : item,
                  ),
                )
              }
              className="w-full"
            />
          </div>
        </div>
      ))}
      <Button variant="outline" onClick={addItem} className="w-full">
        + Add Testimonial
      </Button>
    </div>
  );
}

function NavigationEditor({ content, onChange }: { content: any; onChange: (data: any) => void }) {
  const items = getArrayContent(content) ?? [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Work", href: "/work" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <div className="space-y-4">
      {items.map((nav: any, i: number) => (
        <div key={i} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
          <Input
            placeholder="Label"
            value={nav.label ?? ""}
            onChange={(e) =>
              onChange(
                items.map((item: any, idx: number) =>
                  idx === i ? { ...item, label: e.target.value } : item,
                ),
              )
            }
            className="w-[200px]"
          />
          <Input
            placeholder="URL"
            value={nav.href ?? ""}
            onChange={(e) =>
              onChange(
                items.map((item: any, idx: number) =>
                  idx === i ? { ...item, href: e.target.value } : item,
                ),
              )
            }
            className="w-full"
          />
        </div>
      ))}
    </div>
  );
}

function SocialLinksEditor({ content, onChange }: { content: any; onChange: (data: any) => void }) {
  const items = getArrayContent(content) ?? [];

  return (
    <div className="space-y-4">
      {items.map((s: any, i: number) => (
        <div key={i} className="p-4 border rounded-lg bg-muted/50 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-[80px]">Icon: {s.icon}</span>
            <Input
              placeholder="Label"
              value={s.label ?? ""}
              onChange={(e) =>
                onChange(
                  items.map((item: any, idx: number) =>
                    idx === i ? { ...item, label: e.target.value } : item,
                  ),
                )
              }
              className="w-[150px]"
            />
            <Input
              placeholder="URL"
              value={s.href ?? ""}
              onChange={(e) =>
                onChange(
                  items.map((item: any, idx: number) =>
                    idx === i ? { ...item, href: e.target.value } : item,
                  ),
                )
              }
              className="w-full"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function MessagesEditor({ content, onChange }: { content: any; onChange: (data: any) => void }) {
  const items = getArrayContent(content) ?? [];

  return (
    <div className="space-y-4">
      {items.map((m: any, i: number) => (
        <div key={i} className="p-4 border rounded-lg bg-muted/50 space-y-2">
          <div>
            <span className="text-sm font-medium">From: {m.name}</span>
            <a href={`mailto:${m.email}`} className="text-primary hover:underline">
              {m.email}
            </a>
          </div>
          <p className="text-xs text-muted-foreground">{m.subject || "No subject"}</p>
          <p className="text-sm">
            {m.message?.substring(0, 100)}
            {m.message?.length > 100 ? "..." : ""}
          </p>
          <div className="mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onChange(
                  items.map((item: any, idx: number) =>
                    idx === i ? { ...item, read_status: !item.read_status } : item,
                  ),
                )
              }
            >
              {items[i]?.read_status ? "Unread" : "Mark Read"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function getEditorForSection(sectionId: string, content: any, onChange: (data: any) => void) {
  switch (sectionId) {
    case "hero":
      return <HeroEditor content={content} onChange={onChange} />;
    case "about":
      return <AboutEditor content={content} onChange={onChange} />;
    case "services":
      return <ServicesEditor content={content} onChange={onChange} />;
    case "projects":
      return <ProjectsEditor content={content} onChange={onChange} />;
    case "process":
      return <ProcessEditor content={content} onChange={onChange} />;
    case "testimonials":
      return <TestimonialsEditor content={content} onChange={onChange} />;
    case "navigation":
      return <NavigationEditor content={content} onChange={onChange} />;
    case "socialLinks":
      return <SocialLinksEditor content={content} onChange={onChange} />;
    case "messages":
      return <MessagesEditor content={content} onChange={onChange} />;
    default:
      return <p className="text-muted-foreground">Section not found</p>;
  }
}

function SectionEditor({
  sectionId,
  formData,
  onFormChange,
  onSave,
  onBack,
}: {
  sectionId: string;
  formData: any;
  onFormChange: (data: any) => void;
  onSave: () => void;
  onBack: () => void;
}) {
  const section = sections.find((s) => s.id === sectionId);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave();
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Back
        </Button>
        <h2 className="text-2xl font-bold text-foreground">{section?.title} Editor</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{section?.title} Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {getEditorForSection(sectionId, formData, onFormChange)}
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button variant="ghost" onClick={onBack}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <svg
                  className="mr-2 h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function AdminDashboard() {
  const { loggedIn, login, logout } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);

  // Supabase integration
  const {
    content: supabaseContent,
    loading,
    saving,
    error,
    fetchAllContent,
    saveSection,
    resetSection,
    resetAll,
    subscribeToChanges,
  } = usePortfolioContent();

  // Array-backed sections (projects, navigation, social links, messages) must
  // remain arrays. Object-backed sections send partial objects and are merged.
  const handleFormChange = (nextValue: any) => {
    if (Array.isArray(nextValue)) {
      setFormData(nextValue);
      return;
    }

    setFormData((prev: any) => ({
      ...(prev && typeof prev === "object" && !Array.isArray(prev) ? prev : {}),
      ...(nextValue && typeof nextValue === "object" ? nextValue : {}),
    }));
  };

  const handleSave = async () => {
    if (activeSection && formData) {
      const sectionKey = activeSection as SectionName;
      await saveSection(sectionKey, formData);
    }
  };

  const handleResetSection = async () => {
    if (activeSection) {
      const sectionKey = activeSection as SectionName;
      await resetSection(sectionKey);
      // Refresh form data after reset
      setFormData(supabaseContent[sectionKey]);
    }
  };

  const handleResetAll = async () => {
    if (confirm("Reset ALL sections to defaults? This cannot be undone.")) {
      await resetAll();
      if (activeSection) {
        setFormData(supabaseContent[activeSection as SectionName]);
      }
    }
  };

  const downloadForLive = () => {
    const json = JSON.stringify(supabaseContent, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "content.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded content.json - place in public/ and redeploy");
  };

  // Load form data when section changes
  useEffect(() => {
    if (activeSection && supabaseContent) {
      setFormData(supabaseContent[activeSection as SectionName]);
    }
  }, [activeSection, supabaseContent]);

  // Subscribe to real-time changes from other admin sessions
  useEffect(() => {
    return subscribeToChanges((section, data) => {
      // If we're currently editing this section, update form data
      if (activeSection === section) {
        setFormData(data);
        toast.info(`${section} updated from another session`);
      }
    });
  }, [activeSection, subscribeToChanges]);

  // Fetch messages from Supabase when messages section is selected
  useEffect(() => {
    if (activeSection !== "messages") return;

    fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/messages`, {
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched messages:", data);
        setFormData(data);
      })
      .catch((err) => {
        console.error("Failed to fetch messages:", err);
      });
  }, [activeSection]);

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6">Khushi Rawat Admin Panel</h2>
          <p className="text-muted-foreground mb-8">
            Password protected admin panel. Set credentials to access.
          </p>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4"
            onKeyDown={(e) => e.key === "Enter" && login(password)}
          />
          <Button onClick={() => login(password)} className="w-full">
            Login
          </Button>
        </div>
      </div>
    );
  }

  // Show loading state while fetching from Supabase
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-ink/15 bg-ink px-6 py-4 flex items-center gap-6">
        <h1 className="text-xl font-bold text-foreground">Admin Panel — Khushi Rawat</h1>
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-sm text-ink-foreground/60">Logged in as Khushi Rawat</span>
          <Button
            onClick={logout}
            variant="ghost"
            size="sm"
            className="text-ink-foreground/60 hover:text-ink"
          >
            Logout
          </Button>
        </div>
      </header>

      <main className="p-6">
        <div className="grid md:grid-cols-[300px_1fr] gap-6">
          {/* Sidebar */}
          <div className="bg-ink min-h-screen border-r border-ink/15">
            <nav className="p-4 space-y-2">
              {sections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "outline"}
                  className={cn(
                    "w-full justify-start gap-3",
                    activeSection === section.id && "bg-primary text-primary-foreground",
                  )}
                  onClick={() => setActiveSection(section.id)}
                  disabled={saving[section.id as SectionName]}
                >
                  <span>{section.title}</span>
                  <span className="text-xs opacity-60">{section.desc}</span>
                  {saving[section.id as SectionName] && (
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                    </svg>
                  )}
                </Button>
              ))}

              {/* Global actions */}
              <div className="pt-4 border-t border-ink/15 space-y-2">
                <Button
                  variant="outline"
                  onClick={downloadForLive}
                  className="w-full justify-start"
                  disabled={loading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download JSON
                </Button>
                <Button
                  variant="outline"
                  onClick={fetchAllContent}
                  className="w-full justify-start"
                  disabled={loading}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh from Server
                </Button>
                <Button
                  variant="outline"
                  onClick={handleResetAll}
                  className="w-full justify-start text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                  disabled={loading}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset All to Defaults
                </Button>
              </div>
            </nav>
          </div>

          {/* Content Area */}
          <div className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <strong>Error:</strong> {error}
              </div>
            )}

            {activeSection ? (
              <SectionEditor
                sectionId={activeSection}
                formData={formData}
                onFormChange={handleFormChange}
                onSave={handleSave}
                onBack={() => setActiveSection(null)}
              />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Select a section to edit</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={downloadForLive} disabled={loading}>
                      <Download className="mr-2 h-4 w-4" />
                      Download JSON
                    </Button>
                    <Button variant="outline" onClick={fetchAllContent} disabled={loading}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh
                    </Button>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {sections.map((section) => (
                    <Card
                      key={section.id}
                      className="p-4 cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => setActiveSection(section.id)}
                    >
                      <CardTitle className="text-sm">{section.title}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">{section.desc}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
