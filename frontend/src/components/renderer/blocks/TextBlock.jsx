import { motion } from "framer-motion";
import { getVariants } from "../utils/animations";

export default function TextBlock({ block }) {
  const d = block.data;
  const v = getVariants(d.animation);
  const isLeft  = d.layout === "image-left";
  const isRight = d.layout === "image-right";
  const hasImage = (isLeft || isRight) && d.image_url;

  const textContent = (
    <motion.div
      className="rdr-text-content"
      initial={v.initial}
      whileInView={v.animate}
      viewport={{ once: true, amount: 0.15 }}
      transition={v.transition}
    >
      {d.title && (
        <h2
          className="rdr-text-title"
          style={{
            fontFamily: d.title_font !== "inherit" ? d.title_font : undefined,
            fontSize: `${d.title_size || 32}px`,
            fontWeight: d.title_weight || "700",
            textAlign: d.title_align || "left",
            color: d.text_color || "#111",
            marginBottom: 16,
          }}
        >
          {d.title}
        </h2>
      )}
      {d.body && (
        <div
          className="rdr-text-body"
          style={{
            fontFamily: d.body_font !== "inherit" ? d.body_font : undefined,
            fontSize: `${d.body_size || 16}px`,
            textAlign: d.body_align || "left",
            color: d.text_color || "#111",
            opacity: 0.8,
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
          }}
        >
          {d.body}
        </div>
      )}
    </motion.div>
  );

  return (
    <section
      className="rdr-text"
      style={{
        background: d.bg_color || "#fff",
        padding: `${d.padding_v || 64}px 24px`,
      }}
    >
      <div
        className="rdr-text-wrap"
        style={{
          maxWidth: d.max_width === "100%" ? "100%" : `${d.max_width || 720}px`,
          margin: "0 auto",
        }}
      >
        {hasImage ? (
          <div
            className="rdr-text-row"
            style={{ flexDirection: isLeft ? "row" : "row-reverse" }}
          >
            <motion.img
              src={d.image_url}
              alt=""
              className="rdr-text-img"
              initial={{ opacity: 0, x: isLeft ? -48 : 48 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={v.transition}
            />
            {textContent}
          </div>
        ) : (
          textContent
        )}
      </div>
    </section>
  );
}
