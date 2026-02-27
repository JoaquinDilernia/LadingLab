import { motion } from "framer-motion";
import { getVariants } from "../utils/animations";

export default function CtaBannerBlock({ block }) {
  const d = block.data;
  const v = getVariants(d.animation);

  return (
    <section
      className="rdr-cta"
      style={{
        background: d.bg_color || "#111",
        padding: `${d.padding_v || 56}px 32px`,
      }}
    >
      <motion.div
        className="rdr-cta-inner"
        initial={v.initial}
        whileInView={v.animate}
        viewport={{ once: true, amount: 0.2 }}
        transition={v.transition}
      >
        <div className="rdr-cta-text">
          {d.text && (
            <h2 style={{ color: d.text_color || "#fff" }}>{d.text}</h2>
          )}
          {d.subtext && (
            <p style={{ color: d.text_color || "#fff", opacity: 0.8 }}>{d.subtext}</p>
          )}
        </div>
        {d.btn_label && (
          <a
            href={d.btn_url || "#"}
            className="rdr-cta-btn"
            style={{
              background: d.btn_color || "#fff",
              color: d.btn_text_color || "#111",
            }}
          >
            {d.btn_label}
          </a>
        )}
      </motion.div>
    </section>
  );
}
