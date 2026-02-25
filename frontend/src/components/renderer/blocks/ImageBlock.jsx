import { motion } from "framer-motion";
import { getVariants } from "../utils/animations";

export default function ImageBlock({ block }) {
  const d = block.data;
  const v = getVariants(d.animation);

  const isContained = d.width === "contained";
  const isCustom    = d.width === "custom";
  const imgWidth    = isContained ? "min(960px, 100%)" : isCustom ? `${d.custom_width || 80}%` : "100%";

  const img = (
    <motion.img
      src={d.image_url}
      alt={d.alt || ""}
      className="rdr-image-img"
      style={{
        width: imgWidth,
        borderRadius: `${d.border_radius || 0}px`,
        display: "block",
        margin: d.width !== "full" ? "0 auto" : undefined,
      }}
      initial={v.initial}
      whileInView={v.animate}
      viewport={{ once: true, amount: 0.1 }}
      transition={v.transition}
    />
  );

  return (
    <section
      className="rdr-image"
      style={{
        background: d.bg_color || "#fff",
        padding: `${d.padding_v || 32}px 0`,
        textAlign: d.align || "center",
      }}
    >
      {d.link_url ? (
        <a href={d.link_url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block" }}>
          {img}
        </a>
      ) : img}
      {d.caption && (
        <p className="rdr-image-caption">{d.caption}</p>
      )}
    </section>
  );
}
