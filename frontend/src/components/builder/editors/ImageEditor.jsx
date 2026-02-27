import { ImageUploadField, TextField, SelectField, ColorField, SectionTitle, Divider } from "../ui/EditorFields";
import { useBuilder } from "../../../context/BuilderContext";

const RADIUS_OPTIONS  = ["0","4","8","12","16","24","9999"].map((v) => ({ value: v, label: v === "9999" ? "Circular" : `${v}px` }));
const WIDTH_OPTIONS   = [
  { value: "full",      label: "Ancho completo" },
  { value: "contained", label: "Contenido (max 960px)" },
  { value: "custom",    label: "Personalizado (%)" },
];
const ALIGN_OPTIONS   = [
  { value: "left",   label: "Izquierda" },
  { value: "center", label: "Centro" },
  { value: "right",  label: "Derecha" },
];
const PADDING_OPTIONS = ["0","8","16","24","32","48","64","80"].map((v) => ({ value: v, label: v === "0" ? "Sin espaciado" : `${v}px` }));

export default function ImageEditor({ block }) {
  const { updateBlock } = useBuilder();
  const d = block.data;
  const up = (k, v) => updateBlock(block.id, { [k]: v });

  return (
    <>
      <SectionTitle>Imagen</SectionTitle>
      <ImageUploadField label="Imagen" value={d.image_url} onChange={(v) => up("image_url", v)} />
      <TextField label="Texto alternativo (SEO)" value={d.alt} onChange={(v) => up("alt", v)} placeholder="Descripción de la imagen" />
      <TextField label="Enlace al hacer clic (opcional)" value={d.link_url} onChange={(v) => up("link_url", v)} placeholder="https://..." />
      <TextField label="Caption (pie de foto)" value={d.caption} onChange={(v) => up("caption", v)} placeholder="Descripción bajo la imagen..." />

      <Divider />
      <SectionTitle>Tamaño y posición</SectionTitle>
      <SelectField label="Ancho" value={d.width || "full"} onChange={(v) => up("width", v)} options={WIDTH_OPTIONS} />
      {d.width === "custom" && (
        <div className="ef-group">
          <label className="ef-label">Ancho personalizado (%)</label>
          <input
            className="ef-input"
            type="range"
            min={10}
            max={100}
            step={5}
            value={d.custom_width || 80}
            onChange={(e) => up("custom_width", Number(e.target.value))}
            style={{ padding: "4px 0" }}
          />
          <span style={{ fontSize: 12, color: "#888", textAlign: "right" }}>{d.custom_width || 80}%</span>
        </div>
      )}
      {d.width !== "full" && (
        <SelectField label="Alineación" value={d.align || "center"} onChange={(v) => up("align", v)} options={ALIGN_OPTIONS} />
      )}
      <SelectField label="Bordes redondeados" value={d.border_radius || "0"} onChange={(v) => up("border_radius", v)} options={RADIUS_OPTIONS} />

      <Divider />
      <SectionTitle>Espaciado y fondo</SectionTitle>
      <SelectField label="Espaciado vertical" value={d.padding_v || "32"} onChange={(v) => up("padding_v", v)} options={PADDING_OPTIONS} />
      <ColorField label="Color de fondo" value={d.bg_color} onChange={(v) => up("bg_color", v)} />
    </>
  );
}

