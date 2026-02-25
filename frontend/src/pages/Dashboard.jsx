import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, storeId, logout, getIdToken } = useAuth();
  const navigate = useNavigate();

  const [landings, setLandings] = useState([]);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);
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
      const created = await api.createLanding(storeId, newTitle.trim(), token);
      setShowNewModal(false);
      setNewTitle("");
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
        {error && <div className="error-banner">{error}</div>}

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
                <div className="landing-card-preview">
                  <div className="landing-card-preview-placeholder">
                    {landing.blocks?.length > 0
                      ? `${landing.blocks.length} bloque${landing.blocks.length !== 1 ? "s" : ""}`
                      : "Sin bloques"}
                  </div>
                </div>
                <div className="landing-card-info">
                  <h3>{landing.title}</h3>
                  <div className="landing-card-meta">
                    <span className={`status-badge status-${landing.status}`}>
                      {landing.status === "published" ? "Publicada" : "Borrador"}
                    </span>
                    <span className="views-count">{landing.views || 0} vistas</span>
                  </div>
                  <div className="landing-card-actions">
                    {landing.status === "published" && (
                      <button
                        className="btn-icon"
                        title="Copiar URL"
                        onClick={(e) => copyUrl(landing.slug, e)}
                      >
                        🔗
                      </button>
                    )}
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
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Nueva landing</h2>
            <p>Dale un nombre a tu landing para identificarla en el panel.</p>
            <form onSubmit={handleCreate}>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ej: Lanzamiento Colección Verano 2026"
                autoFocus
                required
              />
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setShowNewModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={creating}>
                  {creating ? "Creando..." : "Crear y editar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
