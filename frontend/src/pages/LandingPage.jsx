import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import LandingRenderer from "../components/renderer/LandingRenderer";

export default function LandingPage() {
  const { slug } = useParams();
  const [landing, setLanding] = useState(null);
  const [blocks,  setBlocks]  = useState([]);
  const [status,  setStatus]  = useState("loading"); // loading | not_found | error | ok

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getPublicLanding(slug);
        if (!data || data.status !== "published") {
          setStatus("not_found");
          return;
        }
        /* Set page title & meta */
        document.title = data.seo?.title || data.title || "Landing";
        const desc = data.seo?.description;
        if (desc) {
          let meta = document.querySelector('meta[name="description"]');
          if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
          meta.content = desc;
        }
        const ogImg = data.seo?.og_image;
        if (ogImg) {
          let og = document.querySelector('meta[property="og:image"]');
          if (!og) { og = document.createElement("meta"); og.setAttribute("property", "og:image"); document.head.appendChild(og); }
          og.content = ogImg;
        }
        setLanding(data);
        setBlocks((data.blocks || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
        setStatus("ok");
      } catch (e) {
        console.error("LandingPage error:", e.message);
        setStatus(e.message?.includes("not found") || e.message?.includes("404") ? "not_found" : "error");
      }
    })();
  }, [slug]);

  if (status === "loading") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#fff" }}>
        <div className="spinner" style={{ borderTopColor: "#111" }} />
      </div>
    );
  }

  if (status === "not_found") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: 16, fontFamily: "Inter, sans-serif" }}>
        <div style={{ fontSize: 48 }}>404</div>
        <p style={{ color: "#666", fontSize: 18, margin: 0 }}>Esta página no existe o no está publicada.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: 16, fontFamily: "Inter, sans-serif" }}>
        <p style={{ color: "#999", fontSize: 16 }}>Error al cargar la página.</p>
      </div>
    );
  }

  return <LandingRenderer landing={landing} blocks={blocks} />;
}
