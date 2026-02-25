import { TextField, ColorField, NumberField, SectionTitle, Divider } from "../ui/EditorFields";
import { useBuilder } from "../../../context/BuilderContext";

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

  return (
    <>
      <SectionTitle>Contenido</SectionTitle>
      <TextField label="Título de sección" value={d.title} onChange={(v) => up("title", v)} placeholder="Galería" />

      <Divider />
      <SectionTitle>Imágenes</SectionTitle>
      <div className="ef-item-list">
        {images.map((url, idx) => (
          <div key={idx} className="ef-item" style={{ padding: "8px 10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {url && (
                <img
                  src={url}
                  alt=""
                  className="ef-image-preview"
                />
              )}
              <input
                className="ef-input"
                value={url}
                onChange={(e) => updateImage(idx, e.target.value)}
                placeholder="https://... (URL de imagen)"
                style={{ flex: 1 }}
              />
              <button className="ef-item-del" onClick={() => removeImage(idx)}>✕</button>
            </div>
          </div>
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
