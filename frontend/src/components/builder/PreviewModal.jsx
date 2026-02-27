import { useState, useEffect } from "react";
import { useBuilder } from "../../context/BuilderContext";
import LandingRenderer from "../renderer/LandingRenderer";
import { api } from "../../services/api";

const DEVICES = [
  {
    id: "desktop", label: "Desktop", width: "100%",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
  },
  {
    id: "tablet", label: "Tablet", width: 768,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
  },
  {
    id: "mobile", label: "Móvil", width: 390,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="2" width="12" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
  },
];

export default function PreviewModal({ onClose }) {
  const { blocks, landing, storeId, getIdToken } = useBuilder();
  const [device, setDevice]     = useState("desktop");
  const [products, setProducts] = useState([]);

  /* Fetch products if any products block exists */
  useEffect(() => {
    const hasProducts = blocks.some((b) => b.type === "products");
    if (!hasProducts || !storeId) return;
    (async () => {
      try {
        const token = await getIdToken();
        const data  = await api.getProducts(storeId, token, { per_page: 200 });
        setProducts(Array.isArray(data) ? data : (data.products || []));
      } catch {
        /* preview still works via products_cache */
      }
    })();
  }, [blocks, storeId, getIdToken]);

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* Close on Escape */
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const current  = DEVICES.find((d) => d.id === device);
  const frameW   = current.width === "100%" ? "100%" : `${current.width}px`;

  return (
    <div className="preview-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      {/* Toolbar */}
      <div className="preview-toolbar">
        <div className="preview-toolbar-left">
          <span className="preview-toolbar-title">Vista previa</span>
          {landing?.slug && (
            <span className="preview-url">/l/{landing.slug}</span>
          )}
        </div>
        <div className="preview-device-tabs">
          {DEVICES.map((d) => (
            <button
              key={d.id}
              className={`preview-device-btn ${device === d.id ? "active" : ""}`}
              onClick={() => setDevice(d.id)}
              title={d.label}
            >
              <span>{d.icon}</span>
              <span>{d.label}</span>
            </button>
          ))}
        </div>
        <div className="preview-toolbar-right">
          {landing?.status === "published" && (
            <a
              href={`/l/${landing.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="preview-open-btn"
            >
              Abrir ↗
            </a>
          )}
          <button className="preview-close-btn" onClick={onClose}>✕ Cerrar</button>
        </div>
      </div>

      {/* Frame container */}
      <div className="preview-frame-container">
        <div
          className="preview-frame"
          style={{ width: frameW, maxWidth: frameW }}
        >
          <LandingRenderer landing={landing} blocks={blocks} products={products} />
        </div>
      </div>
    </div>
  );
}
