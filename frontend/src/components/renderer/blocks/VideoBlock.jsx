import { motion } from "framer-motion";
import { getVariants } from "../utils/animations";

function getEmbedUrl(url) {
  if (!url) return null;
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
  // Vimeo
  const vmMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vmMatch) return `https://player.vimeo.com/video/${vmMatch[1]}`;
  return url;
}

export default function VideoBlock({ block }) {
  const d = block.data;
  const v = getVariants(d.animation);
  const embedUrl = getEmbedUrl(d.url);

  return (
    <section
      className="rdr-video"
      style={{ background: d.bg_color || "#000" }}
    >
      <motion.div
        className={`rdr-video-wrap ${d.full_width ? "rdr-video-full" : "rdr-video-contained"}`}
        initial={v.initial}
        whileInView={v.animate}
        viewport={{ once: true, amount: 0.1 }}
        transition={v.transition}
      >
        {d.title && (
          <h2 className="rdr-video-title">{d.title}</h2>
        )}
        <div className="rdr-video-frame">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={d.title || "Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="rdr-video-placeholder">
              <span>▶ Sin URL de video</span>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
