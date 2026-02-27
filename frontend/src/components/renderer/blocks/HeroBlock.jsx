import { motion } from "framer-motion";
import { getVariants } from "../utils/animations";

export default function HeroBlock({ block }) {
  const d = block.data;
  const v = getVariants(d.animation);

  /* ── Background ── */
  let bg = {};
  if (d.bg_type === "gradient") {
    bg = { background: `linear-gradient(${d.bg_value || "135deg, #1a1a2e, #16213e"})` };
  } else if (d.bg_type === "image" && d.bg_image) {
    bg = {
      backgroundImage: `url(${d.bg_image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  } else if (d.bg_type === "color") {
    bg = { background: d.bg_value || "#1a1a2e" };
  } else {
    bg = { background: `linear-gradient(${d.bg_value || "135deg, #1a1a2e, #16213e"})` };
  }

  const ctaStyle = () => {
    if (d.cta_style === "outline") {
      return {
        background: "transparent",
        border: `2px solid ${d.cta_bg_color || "#fff"}`,
        color: d.cta_bg_color || "#fff",
      };
    }
    if (d.cta_style === "ghost") {
      return { background: "transparent", border: "none", color: d.text_color || "#fff", textDecoration: "underline" };
    }
    return { background: d.cta_bg_color || "#fff", border: "none", color: d.cta_text_color_btn || "#111" };
  };

  return (
    <section
      className="rdr-hero"
      style={{
        ...bg,
        minHeight: d.min_height === "100vh" ? "100vh" : `${d.min_height || 500}px`,
      }}
    >
      {d.bg_type === "image" && d.overlay_opacity > 0 && (
        <div
          className="rdr-hero-overlay"
          style={{
            opacity: d.overlay_opacity / 100,
            background: d.overlay_color || "#000",
          }}
        />
      )}
      <motion.div
        className="rdr-hero-inner"
        style={{
          textAlign: d.text_align || "center",
          padding: `${d.padding_v || 80}px 32px`,
        }}
        initial={v.initial}
        whileInView={v.animate}
        viewport={{ once: true, amount: 0.1 }}
        transition={v.transition}
      >
        {d.title && (
          <h1
            className="rdr-hero-title"
            style={{
              fontFamily: d.title_font !== "inherit" ? d.title_font : undefined,
              fontSize: `${d.title_size || 56}px`,
              color: d.text_color || "#fff",
            }}
          >
            {d.title}
          </h1>
        )}
        {d.subtitle && (
          <p
            className="rdr-hero-sub"
            style={{
              fontSize: `${d.subtitle_size || 20}px`,
              color: d.text_color || "#fff",
              opacity: 0.85,
            }}
          >
            {d.subtitle}
          </p>
        )}
        {d.cta_text && (
          <a
            href={d.cta_url || "#"}
            className="rdr-hero-cta"
            style={{ ...ctaStyle() }}
          >
            {d.cta_text}
          </a>
        )}
      </motion.div>
    </section>
  );
}
