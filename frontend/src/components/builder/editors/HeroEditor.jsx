import { TextField, TextareaField, SelectField, ColorField, SectionTitle, Divider } from "../ui/EditorFields";
import { useBuilder, FONT_OPTIONS } from "../../../context/BuilderContext";

const TITLE_SIZE_OPTIONS = ["32","40","48","56","64","72","80","96"].map((v) => ({ value: v, label: `${v}px` }));
const SUB_SIZE_OPTIONS   = ["14","16","18","20","22","24"].map((v) => ({ value: v, label: `${v}px` }));
const HEIGHT_OPTIONS     = ["300","400","500","600","700","800","100vh"].map((v) => ({ value: String(v), label: v === "100vh" ? "Pantalla completa" : `${v}px` }));

export default function HeroEditor({ block }) {
  const { updateBlock } = useBuilder();
  const d = block.data;
  const up = (k, v) => updateBlock(block.id, { [k]: v });

  return (
    <>
      <SectionTitle>Contenido</SectionTitle>
      <TextField label="Título principal" value={d.title} onChange={(v) => up("title", v)} placeholder="Tu Título Principal" />
      <TextareaField label="Subtítulo" value={d.subtitle} onChange={(v) => up("subtitle", v)} placeholder="Descripción breve..." rows={2} />
      <TextField label="Texto del botón CTA" value={d.cta_text} onChange={(v) => up("cta_text", v)} placeholder="Comprar Ahora" />
      <TextField label="URL del botón" value={d.cta_url} onChange={(v) => up("cta_url", v)} placeholder="https://..." />

      <Divider />
      <SectionTitle>Fondo</SectionTitle>
      <SelectField
        label="Tipo de fondo"
        value={d.bg_type}
        onChange={(v) => up("bg_type", v)}
        options={[
          { value: "gradient", label: "Degradado" },
          { value: "image",    label: "Imagen" },
          { value: "color",    label: "Color sólido" },
        ]}
      />
      {d.bg_type === "gradient" && (
        <TextField
          label="Código CSS del degradado (sin 'linear-gradient')"
          value={d.bg_value}
          onChange={(v) => up("bg_value", v)}
          placeholder="135deg, #1a1a2e 0%, #16213e 100%"
        />
      )}
      {d.bg_type === "image" && (
        <TextField label="URL de la imagen de fondo" value={d.bg_image} onChange={(v) => up("bg_image", v)} placeholder="https://..." />
      )}
      {d.bg_type === "color" && (
        <ColorField label="Color de fondo" value={d.bg_value?.startsWith("#") ? d.bg_value : "#1a1a2e"} onChange={(v) => up("bg_value", v)} />
      )}
      <SelectField label="Altura mínima" value={String(d.min_height || 500)} onChange={(v) => up("min_height", v === "100vh" ? "100vh" : Number(v))} options={HEIGHT_OPTIONS} />

      <Divider />
      <SectionTitle>Tipografía</SectionTitle>
      <SelectField label="Fuente" value={d.title_font || "inherit"} onChange={(v) => up("title_font", v)} options={FONT_OPTIONS} />
      <div className="ef-row">
        <SelectField label="Tamaño título" value={d.title_size || "56"} onChange={(v) => up("title_size", v)} options={TITLE_SIZE_OPTIONS} />
        <SelectField label="Tamaño subtítulo" value={d.subtitle_size || "20"} onChange={(v) => up("subtitle_size", v)} options={SUB_SIZE_OPTIONS} />
      </div>
      <SelectField
        label="Alineación"
        value={d.text_align}
        onChange={(v) => up("text_align", v)}
        options={[
          { value: "center", label: "Centrado" },
          { value: "left",   label: "Izquierda" },
          { value: "right",  label: "Derecha" },
        ]}
      />
      <ColorField label="Color de texto" value={d.text_color} onChange={(v) => up("text_color", v)} />

      <Divider />
      <SectionTitle>Botón CTA</SectionTitle>
      <SelectField
        label="Estilo del botón"
        value={d.cta_style || "filled"}
        onChange={(v) => up("cta_style", v)}
        options={[
          { value: "filled",  label: "Relleno" },
          { value: "outline", label: "Contorno" },
          { value: "ghost",   label: "Sin borde (texto)" },
        ]}
      />
      {d.cta_style !== "ghost" && (
        <>
          <ColorField label="Fondo del botón" value={d.cta_bg_color || "#ffffff"} onChange={(v) => up("cta_bg_color", v)} />
          <ColorField label="Texto del botón" value={d.cta_text_color_btn || "#111111"} onChange={(v) => up("cta_text_color_btn", v)} />
        </>
      )}
    </>
  );
}
