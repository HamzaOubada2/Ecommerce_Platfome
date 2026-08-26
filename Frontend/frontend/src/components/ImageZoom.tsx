import { useRef, useState } from "react";

interface Props {
  src: string;
  alt: string;
}

export default function ImageZoom({ src, alt }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  };

  return (
    <div
      ref={containerRef}
      className="group/zoom relative cursor-crosshair overflow-hidden rounded-2xl bg-gray-100"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onMouseMove={handleMove}
    >
      {/* Main image */}
      <img
        src={src}
        alt={alt}
        className="aspect-square w-full object-cover transition duration-200"
        draggable={false}
      />

      {/* Lens ring indicator */}
      {active && (
        <div
          className="pointer-events-none absolute z-10 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/70 shadow-xl"
          style={{ left: `${position.x}%`, top: `${position.y}%` }}
        />
      )}

      {/* Zoomed preview panel */}
      {active && (
        <div className="pointer-events-none absolute left-full top-0 z-20 ml-4 hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl lg:block"
          style={{ width: 420, height: 420 }}
        >
          <img
            src={src}
            alt={alt}
            className="absolute max-w-none"
            draggable={false}
            style={{
              width: 840,
              height: 840,
              left: `${-position.x * 2}%`,
              top: `${-position.y * 2}%`,
              transform: "translate(25%, 25%)",
              transition: "left 0.05s ease-out, top 0.05s ease-out",
            }}
          />
        </div>
      )}

      {/* Hint */}
      {!active && (
        <div className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium text-gray-600 shadow backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
          </svg>
          Hover to zoom
        </div>
      )}
    </div>
  );
}
