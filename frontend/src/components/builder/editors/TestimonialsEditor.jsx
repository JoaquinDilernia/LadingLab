import { useState } from "react";
import { TextField, TextareaField, SelectField, ColorField, SectionTitle, Divider, NumberField } from "../ui/EditorFields";
import { useBuilder } from "../../../context/BuilderContext";
import { v4 as uuid } from "uuid";

const COLUMNS_OPTIONS = [
  { value: "1", label: "1 columna" },
  { value: "2", label: "2 columnas" },
  { value: "3", label: "3 columnas" },
];

const STYLE_OPTIONS = [
  { value: "card",    label: "Tarjeta (con sombra)" },
  { value: "minimal", label: "Minimalista (sin fondo)" },
  { value: "border",  label: "Con borde" },
];

const PADDING_OPTIONS = ["32","48","64","80","96"].map((v) => ({ value: v, label: `${v}px` }));

const STAR_OPTIONS = [
  { value: "0", label: "Sin estrellas" },
  { value: "1", label: "★" },
  { value: "2", label: "★★" },
  { value: "3", label: "★★★" },
  { value: "4", label: "★★★★" },
  { value: "5", label: "★★★★★" },
];

export default function TestimonialsEditor({ block }) {
  const { updateBlock } = useBuilder();
  const d = block.data;
  const up = (k, v) => updateBlock(block.id, { [k]: v });
  const [expandedIdx, setExpandedIdx] = useState(null);

  const items = d.items || [];

  function addItem() {
    const next = [
      ...items,
      { id: uuid(), name: "Ana García", role: "Cliente verificada", text: "Excelente producto, lo recomiendo totalmente.", rating: 5, avatar_url: "" },
    ];
    up("items", next);
    setExpandedIdx(next.length - 1);
  }

  function removeItem(i) {
    up("items", items.filter((_, idx) => idx !== i));
  }

  function updateItem(i, patch) {
    up("items", items.map((item, idx) => idx === i ? { ...item, ...patch } : item));
  }

  return (
    <>
      <SectionTitle>Testimonios</SectionTitle>
      <TextField label="Título" value={d.title} onChange={(v) => up("title", v)} placeholder="Lo que dicen nuestros clientes" />
      <TextField label="Subtítulo" value={d.subtitle} onChange={(v) => up("subtitle", v)} placeholder="Más de 1000 clientes satisfechos" />

      <Divider />
      <SectionTitle>Estilo</SectionTitle>
      <SelectField label="Columnas" value={String(d.columns ?? 3)} onChange={(v) => up("columns", Number(v))} options={COLUMNS_OPTIONS} />
      <SelectField label="Estilo de tarjeta" value={d.style || "card"} onChange={(v) => up("style", v)} options={STYLE_OPTIONS} />
      <SelectField label="Espaciado vertical" value={String(d.padding_v ?? 64)} onChange={(v) => up("padding_v", Number(v))} options={PADDING_OPTIONS} />

      <Divider />
      <SectionTitle>Colores</SectionTitle>
      <ColorField label="Fondo de sección" value={d.bg_color || "#f9f9f9"} onChange={(v) => up("bg_color", v)} />
      <ColorField label="Color de texto" value={d.text_color || "#111111"} onChange={(v) => up("text_color", v)} />
      <ColorField label="Color de estrellas" value={d.accent_color || "#f59e0b"} onChange={(v) => up("accent_color", v)} />

      <Divider />
      <SectionTitle>Testimonios ({items.length})</SectionTitle>

      {items.map((item, i) => (
        <div key={item.id} className="testi-item-wrap">
          <div
            className="testi-item-header"
            onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
          >
            <span className="testi-item-label">"{item.name || `Testimonio ${i + 1}`}"</span>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <span style={{ fontSize: 12 }}>{expandedIdx === i ? "▲" : "▼"}</span>
              <button
                onClick={(e) => { e.stopPropagation(); removeItem(i); }}
                style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: 12, padding: "2px 6px" }}
              >
                ✕
              </button>
            </div>
          </div>

          {expandedIdx === i && (
            <div className="testi-item-body">
              <TextField label="Nombre" value={item.name} onChange={(v) => updateItem(i, { name: v })} placeholder="Ana García" />
              <TextField label="Rol / Empresa" value={item.role} onChange={(v) => updateItem(i, { role: v })} placeholder="Cliente verificada" />
              <TextareaField label="Testimonio" value={item.text} onChange={(v) => updateItem(i, { text: v })} placeholder="Excelente producto..." rows={3} />
              <SelectField label="Estrellas" value={String(item.rating ?? 5)} onChange={(v) => updateItem(i, { rating: Number(v) })} options={STAR_OPTIONS} />
              <TextField label="Avatar URL (opcional)" value={item.avatar_url} onChange={(v) => updateItem(i, { avatar_url: v })} placeholder="https://..." />
            </div>
          )}
        </div>
      ))}

      <button
        onClick={addItem}
        style={{
          width: "100%", padding: "8px", border: "1.5px dashed #ddd",
          borderRadius: 7, background: "none", color: "#888",
          cursor: "pointer", fontSize: 12, fontWeight: 600,
          fontFamily: "inherit", marginTop: 8,
        }}
      >
        + Agregar testimonio
      </button>
    </>
  );
}
