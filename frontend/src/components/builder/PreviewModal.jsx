import { useState, useEffect } from "react";
import { useBuilder } from "../../context/BuilderContext";
import LandingRenderer from "../renderer/LandingRenderer";

const DEVICES = [
  { id: "desktop", label: "Desktop",  icon: "🖥️",  width: "100%" },
  { id: "tablet",  label: "Tablet",   icon: "📱",  width: 768 },
  { id: "mobile",  label: "Móvil",    icon: "📱",  width: 390 },
];

export default function PreviewModal({ onClose }) {
  const { blocks, landing } = useBuilder();
  const [device, setDevice] = useState("desktop");

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
          <LandingRenderer landing={landing} blocks={blocks} />
        </div>
      </div>
    </div>
  );
}
