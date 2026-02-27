import { TextField, TextareaField, SelectField, ColorField, ImageUploadField, SectionTitle, Divider } from "../ui/EditorFields";
import { useBuilder, FONT_OPTIONS } from "../../../context/BuilderContext";

const FONT_SIZE_TITLE  = ["20","24","28","32","36","40","48","56","64"].map((v) => ({ value: v, label: `${v}px` }));
const FONT_SIZE_BODY   = ["13","14","15","16","17","18","20","22"].map((v) => ({ value: v, label: `${v}px` }));
const FONT_WEIGHTS     = [
  { value: "400", label: "Normal (400)" },
  { value: "500", label: "Medio (500)" },
  { value: "600", label: "Semi-negrita (600)" },
  { value: "700", label: "Negrita (700)" },
  { value: "800", label: "Extra-negrita (800)" },
];
const ALIGN_OPTIONS    = [
  { value: "left",    label: "Izquierda" },
  { value: "center",  label: "Centro" },
  { value: "right",   label: "Derecha" },
];
const PADDING_OPTIONS  = ["16","24","32","48","64","80","96"].map((v) => ({ value: v, label: `${v}px` }));
const MAX_WIDTH_OPTIONS = [
  { value: "480",  label: "480px — Estrecho" },
  { value: "600",  label: "600px" },
  { value: "720",  label: "720px — Estándar" },
  { value: "840",  label: "840px" },
  { value: "960",  label: "960px — Amplio" },
  { value: "1200", label: "1200px — Máximo" },
  { value: "100%", label: "Ancho completo" },
];

export default function TextEditor({ block }) {
  const { updateBlock } = useBuilder();
  const d = block.data;
  const up = (k, v) => updateBlock(block.id, { [k]: v });

  return (
    <>
      <SectionTitle>Contenido</SectionTitle>
      <TextField label="Título" value={d.title} onChange={(v) => up("title", v)} placeholder="Título de la sección" />
      <TextareaField label="Cuerpo" value={d.body} onChange={(v) => up("body", v)} placeholder="Descripción..." rows={5} />

      <Divider />
      <SectionTitle>Layout</SectionTitle>
      <SelectField
        label="Disposición"
        value={d.layout}
        onChange={(v) => up("layout", v)}
        options={[
          { value: "centered",    label: "Centrado (sin imagen)" },
          { value: "image-left",  label: "Imagen a la izquierda" },
          { value: "image-right", label: "Imagen a la derecha" },
        ]}
      />
      {d.layout !== "centered" && (
        <ImageUploadField label="Imagen" value={d.image_url} onChange={(v) => up("image_url", v)} />
      )}
      <SelectField label="Ancho máximo del contenido" value={d.max_width || "720"} onChange={(v) => up("max_width", v)} options={MAX_WIDTH_OPTIONS} />
      <SelectField label="Espaciado vertical" value={d.padding_v || "64"} onChange={(v) => up("padding_v", v)} options={PADDING_OPTIONS} />

      <Divider />
      <SectionTitle>Tipografía — Título</SectionTitle>
      <SelectField label="Fuente" value={d.title_font || "inherit"} onChange={(v) => up("title_font", v)} options={FONT_OPTIONS} />
      <div className="ef-row">
        <SelectField label="Tamaño" value={d.title_size || "32"} onChange={(v) => up("title_size", v)} options={FONT_SIZE_TITLE} />
        <SelectField label="Peso" value={d.title_weight || "700"} onChange={(v) => up("title_weight", v)} options={FONT_WEIGHTS} />
      </div>
      <SelectField label="Alineación del título" value={d.title_align || "left"} onChange={(v) => up("title_align", v)} options={ALIGN_OPTIONS} />

      <Divider />
      <SectionTitle>Tipografía — Cuerpo</SectionTitle>
      <SelectField label="Fuente" value={d.body_font || "inherit"} onChange={(v) => up("body_font", v)} options={FONT_OPTIONS} />
      <div className="ef-row">
        <SelectField label="Tamaño" value={d.body_size || "16"} onChange={(v) => up("body_size", v)} options={FONT_SIZE_BODY} />
      </div>
      <SelectField label="Alineación del cuerpo" value={d.body_align || "left"} onChange={(v) => up("body_align", v)} options={ALIGN_OPTIONS} />

      <Divider />
      <SectionTitle>Colores</SectionTitle>
      <ColorField label="Fondo" value={d.bg_color} onChange={(v) => up("bg_color", v)} />
      <ColorField label="Texto" value={d.text_color} onChange={(v) => up("text_color", v)} />
    </>
  );
}

