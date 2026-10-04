import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";
import type { ElementType, ReactNode } from "react";

export function Reveal({
  children,
  className,
  delay = 0,
  variant = "up",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "up" | "left";
  as?: ElementType;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <Tag
      ref={ref}
      data-visible={visible}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(variant === "up" ? "reveal" : "reveal-left", className)}
    >
      {children}
    </Tag>
  );
}
