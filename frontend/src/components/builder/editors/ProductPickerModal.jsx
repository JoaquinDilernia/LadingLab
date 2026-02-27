import { useState, useEffect, useRef } from "react";
import { useBuilder } from "../../../context/BuilderContext";
import { api } from "../../../services/api";

export default function ProductPickerModal({ selectedIds = [], onConfirm, onClose }) {
  const { storeId, getIdToken } = useBuilder();

  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [search, setSearch]       = useState("");
  const [selected, setSelected]   = useState(new Set(selectedIds.map(String)));
  const [page, setPage]           = useState(1);
  const [hasMore, setHasMore]     = useState(false);
  const loadingMore               = useRef(false);

  async function fetchPage(p, reset = false) {
    try {
      const token = await getIdToken();
      const data  = await api.getProducts(storeId, token, { page: p, per_page: 24, q: search || undefined });
      const list  = Array.isArray(data) ? data : (data.products || []);
      setProducts((prev) => reset ? list : [...prev, ...list]);
      setHasMore(list.length === 24);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      loadingMore.current = false;
    }
  }

  /* Initial load + re-fetch when search changes */
  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchPage(1, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function loadMore() {
    if (loadingMore.current || !hasMore) return;
    loadingMore.current = true;
    const next = page + 1;
    setPage(next);
    fetchPage(next, false);
  }

  function toggle(id) {
    const sid = String(id);
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(sid) ? next.delete(sid) : next.add(sid);
      return next;
    });
  }

  function handleConfirm() {
    const ids = [...selected];
    // Build cache: snapshot of selected product data for rendering without auth
    const cache = products
      .filter((p) => selected.has(String(p.id)))
      .map((p) => ({
        id:        String(p.id),
        name:      p.name || "",
        price:     p.variants?.[0]?.price ?? p.price ?? "",
        image:     p.images?.[0]?.src || "",
        permalink: p.permalink || p.canonical_url || "",
      }));
    onConfirm(ids, cache);
    onClose();
  }

  return (
    <div className="ppicker-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ppicker-modal">
        {/* Header */}
        <div className="ppicker-header">
          <span className="ppicker-title">🛍️ Seleccionar productos</span>
          <button className="ppicker-close" onClick={onClose}>✕</button>
        </div>

        {/* Search */}
        <div className="ppicker-search-wrap">
          <input
            className="ppicker-search"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          {selected.size > 0 && (
            <button className="ppicker-clear" onClick={() => setSelected(new Set())}>
              Limpiar selección ({selected.size})
            </button>
          )}
        </div>

        {/* Grid */}
        <div className="ppicker-body">
          {loading && (
            <div className="ppicker-status">
              <div className="ppicker-spinner" />
              <span>Cargando productos...</span>
            </div>
          )}
          {error && (
            <div className="ppicker-status ppicker-error">
              ⚠️ {error}
            </div>
          )}
          {!loading && !error && products.length === 0 && (
            <div className="ppicker-status">No se encontraron productos</div>
          )}
          {!loading && !error && products.length > 0 && (
            <>
              <div className="ppicker-grid">
                {products.map((p) => {
                  const sid = String(p.id);
                  const isSelected = selected.has(sid);
                  const img = p.images?.[0]?.src || "";
                  const price = p.variants?.[0]?.price ?? p.price ?? "";
                  return (
                    <button
                      key={p.id}
                      className={`ppicker-card${isSelected ? " selected" : ""}`}
                      onClick={() => toggle(p.id)}
                    >
                      <div className="ppicker-img-wrap">
                        {img ? (
                          <img src={img} alt={p.name || ""} className="ppicker-img" />
                        ) : (
                          <div className="ppicker-img-ph">📦</div>
                        )}
                        {isSelected && <div className="ppicker-check">✓</div>}
                      </div>
                      <div className="ppicker-card-info">
                        <span className="ppicker-card-name">{p.name || "Sin nombre"}</span>
                        {price && <span className="ppicker-card-price">${price}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
              {hasMore && (
                <button className="ppicker-load-more" onClick={loadMore}>
                  Cargar más
                </button>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="ppicker-footer">
          <span className="ppicker-sel-count">
            {selected.size === 0
              ? "Se mostrarán todos los productos"
              : `${selected.size} producto${selected.size > 1 ? "s" : ""} seleccionado${selected.size > 1 ? "s" : ""}`}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="ppicker-btn ppicker-btn-cancel" onClick={onClose}>Cancelar</button>
            <button className="ppicker-btn ppicker-btn-confirm" onClick={handleConfirm}>
              Confirmar selección
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
