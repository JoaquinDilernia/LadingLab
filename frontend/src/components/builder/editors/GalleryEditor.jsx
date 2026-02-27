import { useState, useRef } from "react";
import { ColorField, NumberField, SectionTitle, Divider, TextField } from "../ui/EditorFields";
import { useBuilder } from "../../../context/BuilderContext";
import { uploadImage } from "../../../services/uploadImage";

function GalleryImageItem({ url, index, total, onChange, onRemove, onMoveUp, onMoveDown }) {
  const [draft, setDraft]       = useState(url);
  const [focused, setFocused]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef                 = useRef(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await uploadImage(file);
      onChange(uploaded);
      setDraft(uploaded);
    } catch {
      /* silent — user can try again */
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function commit(val) {
    const trimmed = val.trim();
    setDraft(trimmed);
    onChange(trimmed);
  }

  return (
    <div className="gal-item">
      {/* Thumbnail — click to upload */}
      <div
        className="gal-thumb-wrap"
        onClick={() => !uploading && fileRef.current?.click()}
        title="Clic para subir imagen"
        style={{ cursor: "pointer" }}
      >
        {uploading ? (
          <div className="ef-imgup-spinner" />
        ) : url ? (
          <img src={url} alt="" className="gal-thumb" onError={(e) => { e.target.style.display = "none"; }} />
        ) : (
          <div className="gal-thumb-ph">📁</div>
        )}
        <span className="gal-thumb-num">{index + 1}</span>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
      </div>

      {/* URL input */}
      <div className="gal-input-col">
        <input
          className={`ef-input gal-url-input${focused ? " focused" : ""}`}
          value={focused ? draft : url}
          placeholder="https://... o clic en thumbnail para subir"
          onChange={(e) => setDraft(e.target.value)}
          onFocus={() => { setDraft(url); setFocused(true); }}
          onBlur={(e) => { setFocused(false); commit(e.target.value); }}
          onKeyDown={(e) => { if (e.key === "Enter") { e.target.blur(); } }}
        />
      </div>

      {/* Controls */}
      <div className="gal-item-actions">
        <button className="gal-act-btn" onClick={onMoveUp}   disabled={index === 0}        title="Subir">↑</button>
        <button className="gal-act-btn" onClick={onMoveDown} disabled={index === total - 1} title="Bajar">↓</button>
        <button className="gal-act-btn danger" onClick={onRemove} title="Eliminar">✕</button>
      </div>
    </div>
  );
}

export default function GalleryEditor({ block }) {
  const { updateBlock } = useBuilder();
  const d = block.data;
  const up = (k, v) => updateBlock(block.id, { [k]: v });
  const images = d.images || [];

  const updateImage = (idx, url) => {
    const next = [...images];
    next[idx] = url;
    up("images", next);
  };

  const addImage = () => up("images", [...images, ""]);

  const removeImage = (idx) => up("images", images.filter((_, i) => i !== idx));

  const moveImage = (idx, dir) => {
    const next = [...images];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    up("images", next);
  };

  return (
    <>
      <SectionTitle>Contenido</SectionTitle>
      <TextField label="Título de sección" value={d.title} onChange={(v) => up("title", v)} placeholder="Galería" />

      <Divider />
      <SectionTitle>Imágenes ({images.filter(Boolean).length})</SectionTitle>

      <div className="gal-list">
        {images.map((url, idx) => (
          <GalleryImageItem
            key={idx}
            url={url}
            index={idx}
            total={images.length}
            onChange={(v) => updateImage(idx, v)}
            onRemove={() => removeImage(idx)}
            onMoveUp={() => moveImage(idx, -1)}
            onMoveDown={() => moveImage(idx, 1)}
          />
        ))}
        <button className="ef-add-btn" onClick={addImage}>+ Agregar imagen</button>
      </div>

      <Divider />
      <SectionTitle>Estilo</SectionTitle>
      <NumberField label="Columnas" value={d.columns} onChange={(v) => up("columns", v)} min={2} max={4} />
      <NumberField label="Separación (px)" value={d.gap} onChange={(v) => up("gap", v)} min={0} max={32} />
      <ColorField label="Color de fondo" value={d.bg_color} onChange={(v) => up("bg_color", v)} />
    </>
  );
}
