import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BuilderProvider, useBuilder } from "../context/BuilderContext";
import { useAutoSave } from "../hooks/useAutoSave";
import { api } from "../services/api";
import BlockPalette    from "../components/builder/BlockPalette";
import Canvas          from "../components/builder/Canvas";
import PropertiesPanel from "../components/builder/PropertiesPanel";
import PreviewModal    from "../components/builder/PreviewModal";
import "./Builder.css";

/* ── Inner layout that consumes BuilderProvider ── */
function BuilderLayout({ landingId, storeId, getIdToken }) {
  const { landing, blocks, isDirty, markSaved, updateTitle } = useBuilder();
  const navigate = useNavigate();
  const [publishing, setPublishing] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  useAutoSave({ blocks, landing, landingId, storeId, getIdToken, api, isDirty, markSaved });

  const isPublished = landing?.status === "published";

  async function handlePublish() {
    setPublishing(true);
    try {
      const token = await getIdToken();
      /* force-save current blocks first */
      await api.updateLanding(storeId, landingId, { blocks, title: landing?.title }, token);
      await api.publishLanding(storeId, landingId, !isPublished, token);
      /* refresh page to get updated status */
      window.location.reload();
    } catch (e) {
      console.error("Publish error:", e.message);
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="builder">
      {/* ── Header ── */}
      <header className="builder-header">
        <div className="builder-title-wrap">
          <button className="builder-back" onClick={() => navigate("/dashboard")}>
            ← Dashboard
          </button>
          <div className="builder-divider" />
          <input
            className="builder-title-input"
            value={landing?.title || ""}
            onChange={(e) => updateTitle(e.target.value)}
            onBlur={() => {}}
            size={Math.max(10, (landing?.title || "").length)}
          />
          <span className={`builder-badge ${isPublished ? "badge-published" : "badge-draft"}`}>
            {isPublished ? "Publicado" : "Borrador"}
          </span>
        </div>

        <div className="builder-header-right">
          <div className={`save-indicator ${isDirty ? "saving" : "saved"}`}>
            {isDirty ? "● Guardando..." : "✓ Guardado"}
          </div>

          <button
            className="hdr-btn hdr-btn-preview"
            onClick={() => setPreviewOpen(true)}
          >
            Vista previa
          </button>

          {isPublished && (
            <button
              className="hdr-btn hdr-btn-ghost"
              onClick={() => {
                const slug = landing?.slug || landingId;
                window.open(`/l/${slug}`, "_blank");
              }}
            >
              Ver página
            </button>
          )}

          <button
            className={`hdr-btn ${isPublished ? "hdr-btn-unpublish" : "hdr-btn-publish"}`}
            onClick={handlePublish}
            disabled={publishing}
          >
            {publishing ? "..." : isPublished ? "Despublicar" : "Publicar"}
          </button>
        </div>
      </header>

      {/* ── 3-panel body ── */}
      <div className="builder-body">
        <BlockPalette />
        <Canvas />
        <PropertiesPanel />
      </div>

      {previewOpen && <PreviewModal onClose={() => setPreviewOpen(false)} />}
    </div>
  );
}

/* ── Page wrapper — fetches landing data ── */
export default function Builder() {
  const { landingId } = useParams();
  const { storeId, getIdToken } = useAuth();
  const navigate = useNavigate();

  const [landing, setLanding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!storeId) return;
    (async () => {
      try {
        const token = await getIdToken();
        const data  = await api.getLanding(storeId, landingId, token);
        setLanding(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [storeId, landingId]);

  if (loading) {
    return (
      <div className="builder" style={{ alignItems: "center", justifyContent: "center" }}>
        <div className="spinner" style={{ borderTopColor: "#3b82f6" }} />
      </div>
    );
  }

  if (error || !landing) {
    return (
      <div className="builder" style={{ alignItems: "center", justifyContent: "center", gap: 16 }}>
        <p style={{ color: "#666", fontSize: 15 }}>No se pudo cargar la landing.</p>
        <button
          onClick={() => navigate("/dashboard")}
          style={{ background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontWeight: 600 }}
        >
          Volver al Dashboard
        </button>
      </div>
    );
  }

  return (
    <BuilderProvider initialLanding={landing}>
      <BuilderLayout landingId={landingId} storeId={storeId} getIdToken={getIdToken} />
    </BuilderProvider>
  );
}
