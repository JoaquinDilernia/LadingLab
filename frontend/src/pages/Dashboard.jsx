import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { TEMPLATES, buildBlocks } from "../data/templates";
import "./Dashboard.css";

/* ─── Helpers ─── */
function getCardBackground(landing) {
  const hero = landing.blocks?.find((b) => b.type === "hero");
  if (!hero?.data) return "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)";
  const { bg_type, bg_value } = hero.data;
  if (bg_type === "gradient" && bg_value) return `linear-gradient(${bg_value})`;
  if (bg_type === "color" && bg_value) return bg_value;
  return "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)";
}

function fmtDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function Dashboard() {
  const { storeId, logout, getIdToken } = useAuth();
  const navigate = useNavigate();

  const [landings, setLandings] = useState([]);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [duplicating, setDuplicating] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0].id);
  const [error, setError] = useState("");

  useEffect(() => {
    if (storeId) loadData();
  }, [storeId]);

  async function loadData() {
    setLoading(true);
    try {
      const token = await getIdToken();
      const [landingsData, storeData] = await Promise.all([
        api.getLandings(storeId, token),
        api.getStore(storeId, token),
      ]);
      setLandings(landingsData.landings || []);
      setStore(storeData);
    } catch (err) {
      console.error("loadData error:", err);
      setError("Error al cargar los datos.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const token = await getIdToken();
      const tpl = TEMPLATES.find((t) => t.id === selectedTemplate);
      const blocks = tpl && tpl.blocks.length > 0 ? buildBlocks(tpl.blocks) : undefined;
      const created = await api.createLanding(storeId, newTitle.trim(), token, blocks);
      setShowNewModal(false);
      setNewTitle("");
      setSelectedTemplate(TEMPLATES[0].id);
      navigate(`/builder/${created.id}`);
    } catch (err) {
      setError("Error al crear la landing.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(landingId, e) {
    e.stopPropagation();
    if (!confirm("¿Eliminar esta landing? Esta acción no se puede deshacer.")) return;
    try {
      const token = await getIdToken();
      await api.deleteLanding(storeId, landingId, token);
      setLandings((prev) => prev.filter((l) => l.id !== landingId));
    } catch (err) {
      setError("Error al eliminar.");
    }
  }

  async function handleDuplicate(landingId, e) {
    e.stopPropagation();
    setDuplicating(landingId);
    try {
      const token = await getIdToken();
      const copy = await api.duplicateLanding(storeId, landingId, token);
      const now = new Date().toISOString();
      setLandings((prev) => [{ ...copy, id: copy.id, created_at: now, updated_at: now }, ...prev]);
    } catch (err) {
      setError("Error al duplicar.");
    } finally {
      setDuplicating(null);
    }
  }

  async function handlePublishToggle(landing, e) {
    e.stopPropagation();
    try {
      const token = await getIdToken();
      const newPublish = landing.status !== "published";
      await api.publishLanding(storeId, landing.id, newPublish, token);
      setLandings((prev) =>
        prev.map((l) =>
          l.id === landing.id ? { ...l, status: newPublish ? "published" : "draft" } : l
        )
      );
    } catch (err) {
      setError("Error al cambiar estado.");
    }
  }

  function copyUrl(slug, e) {
    e.stopPropagation();
    const url = `${window.location.origin}/l/${slug}`;
    navigator.clipboard.writeText(url);
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <span className="dashboard-logo">LandingLab</span>
          {store && (
            <span className="dashboard-store">
              {store.store_name || `Tienda #${storeId}`}
            </span>
          )}
        </div>
        <div className="dashboard-header-right">
          <button className="btn-primary" onClick={() => setShowNewModal(true)}>
            + Nueva landing
          </button>
          <button className="btn-ghost" onClick={logout}>
            Salir
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {error && (
          <div className="error-banner" onClick={() => setError("")}>
            {error} <span style={{ float: "right", cursor: "pointer" }}>✕</span>
          </div>
        )}

        {loading ? (
          <div className="dashboard-loading">
            <div className="spinner" />
            <p>Cargando landings...</p>
          </div>
        ) : landings.length === 0 ? (
          <div className="dashboard-empty">
            <div className="empty-icon">🚀</div>
            <h2>Todavía no tenés landings</h2>
            <p>Creá tu primera landing para un lanzamiento, hot sale o producto destacado.</p>
            <button className="btn-primary large" onClick={() => setShowNewModal(true)}>
              Crear primera landing
            </button>
          </div>
        ) : (
          <div className="landings-grid">
            {landings.map((landing) => (
              <div
                key={landing.id}
                className="landing-card"
                onClick={() => navigate(`/builder/${landing.id}`)}
              >
                {/* Preview con gradiente extraído del primer hero */}
                <div
                  className="landing-card-preview"
                  style={{ background: getCardBackground(landing) }}
                >
                  <div className="landing-card-preview-info">
                    <span className="landing-card-blocks">
                      {landing.blocks?.length > 0
                        ? `${landing.blocks.length} bloque${landing.blocks.length !== 1 ? "s" : ""}`
                        : "Sin bloques"}
                    </span>
                  </div>
                </div>

                <div className="landing-card-info">
                  <h3>{landing.title}</h3>
                  <div className="landing-card-meta">
                    <span className={`status-badge status-${landing.status}`}>
                      {landing.status === "published" ? "Publicada" : "Borrador"}
                    </span>
                    <span className="views-count">👁 {landing.views || 0}</span>
                    {landing.updated_at && (
                      <span className="landing-date">{fmtDate(landing.updated_at)}</span>
                    )}
                  </div>

                  <div className="landing-card-actions">
                    {landing.status === "published" && (
                      <>
                        <a
                          className="btn-icon"
                          title="Ver página"
                          href={`/l/${landing.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          ↗
                        </a>
                        <button
                          className="btn-icon"
                          title="Copiar URL"
                          onClick={(e) => copyUrl(landing.slug, e)}
                        >
                          🔗
                        </button>
                      </>
                    )}
                    <button
                      className="btn-sm btn-ghost-dark"
                      title="Duplicar landing"
                      onClick={(e) => handleDuplicate(landing.id, e)}
                      disabled={duplicating === landing.id}
                    >
                      {duplicating === landing.id ? "..." : "Duplicar"}
                    </button>
                    <button
                      className={`btn-sm ${landing.status === "published" ? "btn-outline" : "btn-success"}`}
                      onClick={(e) => handlePublishToggle(landing, e)}
                    >
                      {landing.status === "published" ? "Despublicar" : "Publicar"}
                    </button>
                    <button
                      className="btn-sm btn-danger"
                      onClick={(e) => handleDelete(landing.id, e)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showNewModal && (
        <div className="modal-overlay" onClick={() => setShowNewModal(false)}>
          <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
            <h2>Nueva landing</h2>
            <p>Elegí un template para empezar o comenzá en blanco.</p>

            <div className="template-grid">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  className={`template-card ${selectedTemplate === tpl.id ? "selected" : ""}`}
                  onClick={() => setSelectedTemplate(tpl.id)}
                >
                  <div className="template-preview" style={{ background: tpl.gradient }}>
                    <span className="template-emoji">{tpl.emoji}</span>
                    {tpl.blocks.length > 0 && (
                      <span className="template-block-count">{tpl.blocks.length} bloques</span>
                    )}
                  </div>
                  <div className="template-info">
                    <span className="template-name">{tpl.name}</span>
                    <span className="template-desc">{tpl.description}</span>
                  </div>
                  {selectedTemplate === tpl.id && (
                    <span className="template-check">✓</span>
                  )}
                </button>
              ))}
            </div>

            <form onSubmit={handleCreate} style={{ marginTop: 20 }}>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Nombre de la landing — Ej: Lanzamiento Verano 2026"
                autoFocus
                required
              />
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setShowNewModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={creating || !newTitle.trim()}>
                  {creating ? "Creando..." : "Crear y editar →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
