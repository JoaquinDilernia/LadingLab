import { motion } from "framer-motion";
import { getVariants } from "../utils/animations";

export default function SpacerBlock({ block }) {
  const d = block.data;
  const height    = d.height ?? 64;
  const hasDivider = d.show_divider;
  const divColor   = d.divider_color || "#e5e7eb";
  const divWidth   = d.divider_width || 80;
  const divThick   = d.divider_thickness || 1;

  return (
    <section
      className="rdr-spacer"
      style={{ background: d.bg_color || "transparent", height: `${height}px` }}
    >
      {hasDivider && (
        <hr
          style={{
            border: "none",
            borderTop: `${divThick}px solid ${divColor}`,
            width: `${divWidth}%`,
            margin: "0 auto",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
    </section>
  );
}
