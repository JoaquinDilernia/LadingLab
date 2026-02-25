import { motion } from "framer-motion";
import { getVariants } from "../utils/animations";
import BlockRenderer from "../BlockRenderer";

const RATIO_MAP = {
  "50-50": "1fr 1fr",
  "40-60": "2fr 3fr",
  "60-40": "3fr 2fr",
  "30-70": "3fr 7fr",
  "70-30": "7fr 3fr",
  "33-33-33": "1fr 1fr 1fr",
};

export default function ColumnsBlock({ block, products = [] }) {
  const d = block.data;
  const v = getVariants(d.animation);

  const ratio     = RATIO_MAP[d.ratio] || "1fr 1fr";
  const cols      = d.cols === 3 ? [d.col1, d.col2, d.col3] : [d.col1, d.col2];
  const validCols = cols.filter(Boolean);

  return (
    <section
      className="rdr-columns"
      style={{
        background: d.bg_color || "#fff",
        padding: `${d.padding_v || 48}px 24px`,
      }}
    >
      <motion.div
        className="rdr-columns-grid"
        style={{ gridTemplateColumns: ratio, gap: `${d.gap || 24}px` }}
        initial={v.initial}
        whileInView={v.animate}
        viewport={{ once: true, amount: 0.08 }}
        transition={v.transition}
      >
        {validCols.map((col, i) =>
          col?.type ? (
            <div key={i} className="rdr-columns-col">
              <BlockRenderer
                block={{ id: `${block.id}-col${i}`, type: col.type, data: col.data || {}, order: 0 }}
                products={products}
                isNested
              />
            </div>
          ) : (
            <div key={i} className="rdr-columns-col rdr-columns-empty">
              <span>Columna vacía</span>
            </div>
          )
        )}
      </motion.div>
    </section>
  );
}
