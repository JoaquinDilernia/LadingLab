import { motion } from "framer-motion";
import { getVariants } from "../utils/animations";

/* Static placeholder card when no products loaded */
function PlaceholderCard({ bg }) {
  return (
    <div className="rdr-product-card">
      <div className="rdr-product-img" style={{ background: bg || "#e8eaef" }} />
      <div className="rdr-product-info">
        <div className="rdr-product-name-ph" />
        <div className="rdr-product-price-ph" />
      </div>
    </div>
  );
}

export default function ProductsBlock({ block, products = [] }) {
  const d = block.data;
  const v = getVariants(d.animation);
  const cols = d.columns || 3;

  /* Use injected products or show 3 placeholders */
  const items = products.length > 0 ? products : Array(3).fill(null);

  return (
    <section
      className="rdr-products"
      style={{ background: d.bg_color || "#fff", padding: "64px 24px" }}
    >
      <div className="rdr-products-inner">
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
        {d.subtitle && (
          <p className="rdr-section-sub">{d.subtitle}</p>
        )}
        <div
          className="rdr-products-grid"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {items.map((product, i) =>
            product ? (
              <motion.a
                key={product.id || i}
                href={product.permalink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="rdr-product-card"
                initial={v.initial}
                whileInView={v.animate}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ ...v.transition, delay: (v.transition?.delay || 0) + i * 0.07 }}
              >
                <div className="rdr-product-img">
                  {product.images?.[0]?.src ? (
                    <img src={product.images[0].src} alt={product.name || ""} />
                  ) : (
                    <div className="rdr-product-img-ph" />
                  )}
                </div>
                <div className="rdr-product-info">
                  <p className="rdr-product-name">{product.name}</p>
                  {d.show_price && product.price && (
                    <p className="rdr-product-price">${product.price}</p>
                  )}
                  {d.show_btn && (
                    <span className="rdr-product-btn">{d.btn_text || "Ver producto"}</span>
                  )}
                </div>
              </motion.a>
            ) : (
              <PlaceholderCard key={i} />
            )
          )}
        </div>
      </div>
    </section>
  );
}
