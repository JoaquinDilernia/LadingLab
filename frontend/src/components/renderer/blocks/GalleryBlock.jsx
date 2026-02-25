import { motion } from "framer-motion";
import { getVariants } from "../utils/animations";

export default function GalleryBlock({ block }) {
  const d = block.data;
  const v = getVariants(d.animation);
  const images = (d.images || []).filter(Boolean);
  const cols   = d.columns || 3;
  const gap    = d.gap ?? 8;

  return (
    <section
      className="rdr-gallery"
      style={{ background: d.bg_color || "#fff", padding: "48px 24px" }}
    >
      <div className="rdr-gallery-inner">
        {d.title && (
          <motion.h2
            className="rdr-section-title"
            initial={v.initial}
            whileInView={v.animate}
            viewport={{ once: true, amount: 0.2 }}
            transition={v.transition}
          >
            {d.title}
          </motion.h2>
        )}
        <motion.div
          className="rdr-gallery-grid"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: `${gap}px` }}
          initial={v.initial}
          whileInView={v.animate}
          viewport={{ once: true, amount: 0.1 }}
          transition={v.transition}
        >
          {images.map((src, i) => (
            <div key={i} className="rdr-gallery-cell">
              <img src={src} alt={`Gallery ${i + 1}`} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
