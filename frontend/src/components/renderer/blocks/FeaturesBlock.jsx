import { motion } from "framer-motion";
import { getVariants } from "../utils/animations";

export default function FeaturesBlock({ block }) {
  const d = block.data;
  const v = getVariants(d.animation);
  const items = d.items || [];
  const cols  = d.columns || 3;

  return (
    <section
      className="rdr-features"
      style={{
        background: d.bg_color || "#f9f9f9",
        padding: `${d.padding_v || 64}px 24px`,
      }}
    >
      <div className="rdr-features-inner">
        {d.title && (
          <motion.h2
            className="rdr-section-title"
            style={{ color: d.text_color || "#111" }}
            initial={v.initial}
            whileInView={v.animate}
            viewport={{ once: true, amount: 0.2 }}
            transition={v.transition}
          >
            {d.title}
          </motion.h2>
        )}
        {d.subtitle && (
          <p className="rdr-section-sub" style={{ color: d.text_color || "#111" }}>
            {d.subtitle}
          </p>
        )}
        <div
          className="rdr-features-grid"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {items.map((item, i) => (
            <motion.div
              key={item.id || i}
              className="rdr-feature-card"
              initial={v.initial}
              whileInView={v.animate}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ ...v.transition, delay: (v.transition?.delay || 0) + i * 0.1 }}
            >
              <div className="rdr-feature-icon">{item.icon}</div>
              <h3 className="rdr-feature-title" style={{ color: d.text_color || "#111" }}>
                {item.title}
              </h3>
              {item.description && (
                <p className="rdr-feature-desc" style={{ color: d.text_color || "#111" }}>
                  {item.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
