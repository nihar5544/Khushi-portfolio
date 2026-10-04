import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hot, setHot] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf = 0;

    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target as HTMLElement | null;
      setHot(Boolean(t?.closest("a, button, input, textarea, [data-cursor]")));
    };

    const loop = () => {
      rx += (x - rx) * 0.15;
      ry += (y - ry) * 0.15;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dot}
        className="pointer-events-none fixed top-0 left-0 z-[100] -ml-1 -mt-1 size-2 rounded-full bg-primary mix-blend-normal"
      />
      <div
        ref={ring}
        className={
          "pointer-events-none fixed top-0 left-0 z-[100] rounded-full border-2 border-primary transition-[width,height,margin,opacity] duration-300 " +
          (hot ? "-ml-8 -mt-8 size-16 opacity-80" : "-ml-4 -mt-4 size-8 opacity-40")
        }
      />
    </>
  );
}
