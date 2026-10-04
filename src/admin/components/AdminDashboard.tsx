import { useEffect, useState } from "react";
import { useSearchParams } from "@tanstack/react-router";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { cms } from "@/lib/cms";

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
];

function HeroEditor({ content, onChange }: { content: any; onChange: (data: any) => void }) {
  const [titleLines, setTitleLines] = useState<string[]>(
    content?.titleLines || [
      "I'm Khushi",
      'Rawat <span className="text-primary">&mdash;</span>',
      '<span className="text-primary">Brand Strategist</span>',
      "& Designer",
    ],
  );
  const [subtitleLines, setSubtitleLines] = useState<string[]>(
    content?.subtitleLines || [
      "I build brands that stop the scroll.",
      "Brand strategy, identity, social media and UI design for founders who refuse to blend in.",
    ],
  );

  return (
    <div className="space-y-4">
      <Input
        placeholder="Tag line"
        value={content?.tag || "Available for freelance & collaborations — 2026"}
        onChange={(e) => onChange({ ...content, tag: e.target.value })}
        className="w-full"
      />
      <div className="space-y-2">
        <label className="text-sm font-medium">Title Lines (each on new line)</label>
        <textarea
          value={titleLines.join("\n")}
          onChange={(e) => setTitleLines(e.target.value.split("\n"))}
          className="w-full h-[120px] resize-none"
          placeholder="Line 1\nLine 2\nLine 3"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Subtitle Lines (each on new line)</label>
        <textarea
          value={subtitleLines.join("\n")}
          onChange={(e) => setSubtitleLines(e.target.value.split("\n"))}
          className="w-full h-[80px] resize-none"
          placeholder="Line 1\nLine 2"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          placeholder="Primary CTA"
          value={content?.ctaText || "View My Work"}
          onChange={(e) => onChange({ ...content, ctaText: e.target.value })}
          className="w-full"
        />
        <Input
          placeholder="Secondary CTA"
          value={content?.secondaryCtaText || "Let's Collaborate"}
          onChange={(e) => onChange({ ...content, secondaryCtaText: e.target.value })}
          className="w-full"
        />
      </div>
      <input
        type="hidden"
        value={JSON.stringify({ ...content, titleLines, subtitleLines })}
        onChange={(e) => onChange(JSON.parse(e.target.value))}
      />
    </div>
  );
}

function AboutEditor({ content, onChange }: { content: any; onChange: (data: any) => void }) {
  return (
    <div className="space-y-4">
      <textarea
        placeholder="Description 1"
        value={content?.description1 || ""}
        onChange={(e) => onChange({ ...content, description1: e.target.value })}
        className="w-full h-[120px] resize-none"
      />
      <textarea
        placeholder="Description 2"
        value={content?.description2 || ""}
        onChange={(e) => onChange({ ...content, description2: e.target.value })}
        className="w-full h-[120px] resize-none"
      />
      <div className="grid grid-cols-3 gap-4 mt-4">
        {[
          {
            key: "years",
            label: "Years",
            value: content?.stats?.[0]?.value || 3,
            suffix: content?.stats?.[0]?.suffix || "+",
          },
          {
            key: "brands",
            label: "Brands",
            value: content?.stats?.[1]?.value || 10,
            suffix: content?.stats?.[1]?.suffix || "+",
          },
          {
            key: "projects",
            label: "Projects",
            value: content?.stats?.[2]?.value || 50,
            suffix: content?.stats?.[2]?.suffix || "+",
          },
        ].map((stat) => (
          <div key={stat.key} className="space-y-2">
            <label className="text-sm font-medium">{stat.label}</label>
            <Input
              type="number"
              value={stat.value}
              onChange={(e) =>
                onChange({
                  ...content,
                  stats: content.stats.map((s: any, i: number) =>
                    i === ["years", "brands", "projects"].indexOf(stat.key)
                      ? { ...s, value: parseInt(e.target.value) || 0 }
                      : s,
                  ),
                })
              }
              className="w-full"
            />
            <Input
              placeholder="Suffix"
              value={stat.suffix}
              onChange={(e) =>
                onChange({
                  ...content,
                  stats: content.stats.map((s: any, i: number) =>
                    i === ["years", "brands", "projects"].indexOf(stat.key)
                      ? { ...s, suffix: e.target.value }
                      : s,
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
  const [items, setItems] = useState(content?.items || [
    { icon: "Compass", title: "Brand Strategy", copy: "Logos, visual identities, colour systems and brand assets that make a business recognizable." },
    { icon: "Fingerprint", title: "Brand Identity & Logo Design", copy: "Logos, type, colour and full identity kits built to last beyond a trend cycle." },
    { icon: "Instagram", title: "Social Media Design", copy: "Posts, carousels, stories and content systems that keep brands consistent and engaging." },
    { icon: "LayoutGrid", title: "UI/UX Design", copy: "Websites, SaaS products, dashboards and interfaces designed around real user needs." },
    { icon: "Layers", title: "Design Systems in Figma & Canva", copy: "Handoff-ready libraries your team can actually run with, solo or at scale." },
  ]);

  useEffect(() => {
    onChange({ ...content, items });
  }, [items, content]);

  const moveItem = (index: number, direction: number) => {
    setItems(prev => {
      const newItems = [...prev];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= newItems.length) return prev;
      [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
      return newItems;
    });
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const addItem = () => {
    setItems(prev => [...prev, { icon: "Compass", title: "New Service", copy: "Service description" }]);
  };

  return (
    <div className="space-y-4">
      {items.map((s: any, i: number) => (
        <div key={i} className="p-4 border rounded-lg bg-muted/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">Service {i + 1}</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => moveItem(i, -1)} disabled={i === 0} aria-label="Move up">
                ↑
              </Button>
              <Button variant="ghost" size="icon" onClick={() => moveItem(i, 1)} disabled={i === items.length - 1} aria-label="Move down">
                ↓
              </Button>
              <Button variant="ghost" size="icon" onClick={() => removeItem(i)} className="text-red-500" aria-label="Remove">
                ×
              </Button>
            </div>
          </div>
          <Input
            placeholder="Title"
            value={s.title}
            onChange={(e) =>
              setItems(prev =>
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
              setItems(prev =>
                prev.map((item: any, idx: number) =>
                  idx === i ? { ...item, copy: e.target.value } : item,
                ),
              )
            }
            className="w-full"
          />
          <Input
            placeholder="Icon name (e.g., Compass, Fingerprint, Instagram, LayoutGrid, Layers)"
            value={s.icon}
            onChange={(e) =>
              setItems(prev =>
                prev.map((item: any, idx: number) =>
                  idx === i ? { ...item, icon: e.target.value } : item,
                ),
              )
            }
            className="w-full"
          />
        </div>
      ))}
      <Button variant="outline" onClick={addItem} className="w-full">
        + Add Service
      </Button>
    </div>
  );
}

function ProjectsEditor({ content, onChange }: { content: any; onChange: (data: any) => void }) {
  const [items, setItems] = useState(content || [
    { name: "Picsdrop", tag: "Branding / Social Media / Website Design", desc: "Built the visual direction for a photography business platform, from its brand presence and social content to the website experience.", url: "https://picsdrop.in" },
    { name: "Somenu Digital", tag: "Branding / Social Media / UI", desc: "Worked across the brand, social media and product interface to create a more consistent experience for a digital POS and menu platform.", url: "https://somenu.digital" },
    { name: "Spark Digishine", tag: "SOCIAL MEDIA / UI / WEBSITE DESIGN", desc: "Designed digital experiences and social content for a creative technology studio, keeping the work clear, modern and consistent across platforms.", url: "https://sparkdigishine.com" },
    { name: "Fishelly", tag: "UI / SOCIAL MEDIA", desc: "Designed the product experience and social visuals for a fish community platform, making complex features feel simple and approachable.", url: "https://fishelly.com" },
    { name: "Super Squirrels", tag: "Branding / Social Media", desc: "Created a playful visual direction across the brand and website, giving the initiative a more recognizable personality.", url: "https://supersquirrels.org" },
    { name: "ORIZA TEAS", tag: "WEBSITE DESIGN / PACKAGING DESIGN", desc: "Worked on the digital and packaging experience for a tea brand, bringing the products, visual identity and online presence together.", url: "" },
  ]);

  useEffect(() => {
    onChange(items);
  }, [items]);

  const moveItem = (index: number, direction: number) => {
    setItems(prev => {
      const newItems = [...prev];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= newItems.length) return prev;
      [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
      return newItems;
    });
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const addItem = () => {
    setItems(prev => [...prev, { name: "New Project", tag: "", desc: "", url: "" }]);
  };

  return (
    <div className="space-y-4">
      {items.map((p: any, i: number) => (
        <div key={i} className="p-4 border rounded-lg bg-muted/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">{p.name || `Project ${i + 1}`}</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => moveItem(i, -1)} disabled={i === 0} aria-label="Move up">
                ↑
              </Button>
              <Button variant="ghost" size="icon" onClick={() => moveItem(i, 1)} disabled={i === items.length - 1} aria-label="Move down">
                ↓
              </Button>
              <Button variant="ghost" size="icon" onClick={() => removeItem(i)} className="text-red-500" aria-label="Remove">
                ×
              </Button>
            </div>
          </div>
          <Input
            placeholder="Name"
            value={p.name}
            onChange={(e) =>
              setItems(prev =>
                prev.map((item: any, idx: number) =>
                  idx === i ? { ...item, name: e.target.value } : item,
                ),
              )
            }
            className="w-full"
          />
          <Input
            placeholder="Tag"
            value={p.tag}
            onChange={(e) =>
              setItems(prev =>
                prev.map((item: any, idx: number) =>
                  idx === i ? { ...item, tag: e.target.value } : item,
                ),
              )
            }
            className="w-full"
          />
          <textarea
            placeholder="Description"
            value={p.desc}
            onChange={(e) =>
              setItems(prev =>
                prev.map((item: any, idx: number) =>
                  idx === i ? { ...item, desc: e.target.value } : item,
                ),
              )
            }
            className="w-full h-[80px] resize-none"
          />
          <Input
            placeholder="URL (optional)"
            value={p.url || ""}
            onChange={(e) =>
              setItems(prev =>
                prev.map((item: any, idx: number) =>
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
                  ...content,
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
                  ...content,
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
                ...content,
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
  const [items, setItems] = useState(content?.quotes || [
    { quote: "Placeholder testimonial — Khushi turned a vague idea into a brand our audience instantly recognised.", name: "Client Name", role: "Founder, Company" },
    { quote: "Placeholder testimonial — the social system she designed doubled how consistent our feed looks.", name: "Client Name", role: "Marketing Lead, Company" },
    { quote: "Placeholder testimonial — sharp strategy, fast execution, and files our team could actually use.", name: "Client Name", role: "Co-founder, Company" },
  ]);

  useEffect(() => {
    onChange({ ...content, quotes: items });
  }, [items, content]);

  const moveItem = (index: number, direction: number) => {
    setItems(prev => {
      const newItems = [...prev];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= newItems.length) return prev;
      [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
      return newItems;
    });
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const addItem = () => {
    setItems(prev => [...prev, { quote: "New testimonial", name: "Client Name", role: "Role" }]);
  };

  return (
    <div className="space-y-4">
      {items.map((t: any, i: number) => (
        <div key={i} className="p-4 border rounded-lg bg-muted/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">{t.name || `Testimonial ${i + 1}`}</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => moveItem(i, -1)} disabled={i === 0} aria-label="Move up">
                ↑
              </Button>
              <Button variant="ghost" size="icon" onClick={() => moveItem(i, 1)} disabled={i === items.length - 1} aria-label="Move down">
                ↓
              </Button>
              <Button variant="ghost" size="icon" onClick={() => removeItem(i)} className="text-red-500" aria-label="Remove">
                ×
              </Button>
            </div>
          </div>
          <textarea
            placeholder="Quote"
            value={t.quote}
            onChange={(e) =>
              setItems(prev =>
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
                setItems(prev =>
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
                setItems(prev =>
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
  const items = content || [];
  return (
    <div className="space-y-4">
      {items.map((nav: any, i: number) => (
        <div key={i} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
          <Input
            placeholder="Label"
            value={nav.label}
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
            value={nav.href}
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
  const items = content || [];
  return (
    <div className="space-y-4">
      {items.map((s: any, i: number) => (
        <div key={i} className="p-4 border rounded-lg bg-muted/50 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-[80px]">Icon: {s.icon}</span>
            <Input
              placeholder="Label"
              value={s.label}
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
              value={s.href}
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
    default:
      return <p className="text-muted-foreground">Section not found</p>;
  }
}

export default function AdminDashboard() {
  const { loggedIn, login, logout } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (activeSection) {
      const state = cms.getState();
      setFormData(state[activeSection]);
    }
  }, [activeSection]);

  const handleSave = () => {
    if (activeSection && formData) {
      cms.setState({ [activeSection]: formData });
      toast.success(`${sections.find((s) => s.id === activeSection)?.title} saved!`);
    }
  };

  const downloadForLive = () => {
    const state = cms.getState();
    const json = JSON.stringify(state, null, 2);
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
                >
                  <span>{section.title}</span>
                  <span className="text-xs opacity-60">{section.desc}</span>
                </Button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="space-y-6">
            {activeSection ? (
              <SectionEditor
                sectionId={activeSection}
                formData={formData}
                onFormChange={setFormData}
                onSave={handleSave}
                onBack={() => setActiveSection(null)}
              />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Select a section to edit</h3>
                  <Button variant="outline" onClick={downloadForLive}>
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download for Live
                  </Button>
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
      onSave();
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
                <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
