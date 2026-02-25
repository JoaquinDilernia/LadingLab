import { useEffect } from "react";
import BlockRenderer from "./BlockRenderer";
import "./renderer.css";

/* Load Google Fonts referenced by blocks */
function loadGoogleFonts(blocks) {
  const systemFonts = new Set(["inherit", "Georgia, serif", "-apple-system"]);
  const families = new Set();

  blocks.forEach((b) => {
    const d = b.data || {};
    [d.title_font, d.body_font].forEach((f) => {
      if (f && !systemFonts.has(f)) {
        const name = f.split(",")[0].replace(/['"]/g, "").trim();
        families.add(name);
      }
    });
    // Columns sub-blocks
    if (b.type === "columns") {
      [d.col1, d.col2, d.col3].forEach((col) => {
        if (!col?.data) return;
        [col.data.title_font, col.data.body_font].forEach((f) => {
          if (f && !systemFonts.has(f)) {
            const name = f.split(",")[0].replace(/['"]/g, "").trim();
            families.add(name);
          }
        });
      });
    }
  });

  if (families.size === 0) return;
  const qs = [...families].map((n) => `family=${encodeURIComponent(n)}:wght@400;500;600;700;800`).join("&");
  const href = `https://fonts.googleapis.com/css2?${qs}&display=swap`;
  if (!document.querySelector(`link[data-gf="${href}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.dataset.gf = href;
    document.head.appendChild(link);
  }
}

export default function LandingRenderer({ landing, blocks, products = [] }) {
  useEffect(() => {
    loadGoogleFonts(blocks);
  }, [blocks]);

  const sorted = [...blocks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div
      className="landing-renderer"
      style={{
        fontFamily: landing?.theme?.font || "Inter, sans-serif",
        "--primary": landing?.theme?.primary_color || "#111",
      }}
    >
      {sorted.map((block) => (
        <BlockRenderer key={block.id} block={block} products={products} />
      ))}
    </div>
  );
}
