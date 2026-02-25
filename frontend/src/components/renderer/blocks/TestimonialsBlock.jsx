import { motion } from "framer-motion";
import { getVariants } from "../utils/animations";

function StarRating({ rating, color }) {
  return (
    <div className="rdr-testi-stars">
      {[1,2,3,4,5].map((n) => (
        <span key={n} style={{ color: n <= rating ? (color || "#f59e0b") : "#ddd", fontSize: 16 }}>★</span>
      ))}
    </div>
  );
}

export default function TestimonialsBlock({ block }) {
  const d    = block.data;
  const v    = getVariants(d.animation);
  const items = d.items || [];
  const cols  = d.columns || 3;

  return (
    <section
      className="rdr-testimonials"
      style={{
        background: d.bg_color || "#f9f9f9",
        padding: `${d.padding_v || 64}px 24px`,
      }}
    >
      <div className="rdr-testimonials-inner">
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
          className="rdr-testimonials-grid"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {items.map((item, i) => (
            <motion.div
              key={item.id || i}
              className={`rdr-testi-card rdr-testi-${d.style || "card"}`}
              initial={v.initial}
              whileInView={v.animate}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ ...v.transition, delay: (v.transition?.delay || 0) + i * 0.1 }}
            >
              {item.rating > 0 && (
                <StarRating rating={item.rating} color={d.accent_color} />
              )}
              <p className="rdr-testi-text" style={{ color: d.text_color || "#111" }}>
                "{item.text}"
              </p>
              <div className="rdr-testi-author">
                {item.avatar_url && (
                  <img
                    src={item.avatar_url}
                    alt={item.name}
                    className="rdr-testi-avatar"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                )}
                <div>
                  <p className="rdr-testi-name" style={{ color: d.text_color || "#111" }}>
                    {item.name}
                  </p>
                  {item.role && (
                    <p className="rdr-testi-role">{item.role}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
