const ITEMS = [
  "BRAND STRATEGY",
  "SOCIAL MEDIA DESIGN",
  "UI DESIGN",
  "FIGMA",
  "CANVA",
  "BRAND IDENTITY",
  "DESIGN SYSTEMS",
];

export function Marquee({
  inverted = false,
  speed = 28,
}: {
  inverted?: boolean;
  speed?: number;
}) {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div
      className={
        "group relative flex overflow-hidden border-y py-4 " +
        (inverted
          ? "border-ink-foreground/20 bg-ink text-ink-foreground"
          : "border-ink/15 bg-primary text-primary-foreground")
      }
    >
      <div
        className="flex w-max shrink-0 animate-[marquee_var(--speed)_linear_infinite] items-center gap-8 pr-8 group-hover:[animation-play-state:paused]"
        style={{ "--speed": `${speed}s` } as React.CSSProperties}
      >
        {row.concat(row).map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="display-xl flex items-center gap-8 text-[clamp(1.1rem,2.2vw,1.9rem)] whitespace-nowrap"
          >
            {item}
            <span className="text-[0.6em] opacity-70">&#9679;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
