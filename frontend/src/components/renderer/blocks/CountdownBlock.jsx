import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getVariants } from "../utils/animations";

function pad(n) { return String(n).padStart(2, "0"); }

function getTimeLeft(target) {
  const diff = new Date(target) - new Date();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function CountdownBlock({ block }) {
  const d = block.data;
  const v = getVariants(d.animation);
  const [t, setT] = useState(() => getTimeLeft(d.target_date));

  useEffect(() => {
    const id = setInterval(() => setT(getTimeLeft(d.target_date)), 1000);
    return () => clearInterval(id);
  }, [d.target_date]);

  const units = [
    { n: pad(t.days),    l: "DÍAS" },
    { n: pad(t.hours),   l: "HRS"  },
    { n: pad(t.minutes), l: "MIN"  },
    { n: pad(t.seconds), l: "SEG"  },
  ];

  return (
    <section
      className="rdr-countdown"
      style={{ background: d.bg_color || "#111" }}
    >
      <motion.div
        className="rdr-countdown-inner"
        initial={v.initial}
        whileInView={v.animate}
        viewport={{ once: true, amount: 0.15 }}
        transition={v.transition}
      >
        {d.title && (
          <h2 className="rdr-countdown-title" style={{ color: d.text_color || "#fff" }}>
            {d.title}
          </h2>
        )}
        {d.subtitle && (
          <p className="rdr-countdown-sub" style={{ color: d.text_color || "#fff" }}>
            {d.subtitle}
          </p>
        )}
        <div className="rdr-countdown-boxes">
          {units.map(({ n, l }) => (
            <div className="rdr-cd-box" key={l} style={{ borderColor: d.accent_color || "#f59e0b" }}>
              <span className="rdr-cd-num" style={{ color: d.accent_color || "#f59e0b" }}>{n}</span>
              <span className="rdr-cd-label" style={{ color: d.text_color || "#fff" }}>{l}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
