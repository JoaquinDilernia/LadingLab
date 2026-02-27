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

  /*
   * Product resolution priority:
   * 1. Live products injected from parent (preview/builder with auth)
   * 2. products_cache — snapshot stored in block data when user picked products
   * 3. Placeholders (editing with no data yet)
   */
  const selectedIds  = d.product_ids || [];
  const cache        = d.products_cache || [];

  let resolved;
  if (products.length > 0) {
    // Live: filter by selected IDs or show all
    resolved = selectedIds.length > 0
      ? products.filter((p) => selectedIds.includes(String(p.id)))
      : products;
  } else if (cache.length > 0) {
    // Cached: already filtered to selection at pick time
    resolved = cache;
  } else {
    resolved = [];
  }

  // Normalize to a common shape so the card can use one format
  const normalized = resolved.map((p) => ({
    id:        String(p.id),
    name:      p.name || "",
    price:     p.variants?.[0]?.price ?? p.price ?? "",
    image:     p.image || p.images?.[0]?.src || "",
    permalink: p.permalink || p.canonical_url || "#",
  }));

  const items = normalized.length > 0 ? normalized : Array(3).fill(null);

  return (
    <section
      className="rdr-products"
      style={{ background: d.bg_color || "#fff", padding: `${d.padding_v || 64}px 24px` }}
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
                  {product.image ? (
                    <img src={product.image} alt={product.name || ""} />
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
