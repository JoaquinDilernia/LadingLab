import { TextField, ColorField, SelectField, SectionTitle, Divider } from "../ui/EditorFields";
import { useBuilder } from "../../../context/BuilderContext";

export default function CtaBannerEditor({ block }) {
  const { updateBlock } = useBuilder();
  const d = block.data;
  const up = (k, v) => updateBlock(block.id, { [k]: v });

  return (
    <>
      <SectionTitle>Contenido</SectionTitle>
      <TextField label="Título del banner" value={d.text} onChange={(v) => up("text", v)} placeholder="¡No te pierdas esta oferta!" />
      <TextField label="Subtexto" value={d.subtext} onChange={(v) => up("subtext", v)} placeholder="Solo por tiempo limitado" />
      <TextField label="Texto del botón" value={d.btn_label} onChange={(v) => up("btn_label", v)} placeholder="Ver ahora" />
      <TextField label="URL del botón" value={d.btn_url} onChange={(v) => up("btn_url", v)} placeholder="https://..." />

      <Divider />
      <SectionTitle>Colores del banner</SectionTitle>
      <ColorField label="Fondo" value={d.bg_color} onChange={(v) => up("bg_color", v)} />
      <ColorField label="Texto" value={d.text_color} onChange={(v) => up("text_color", v)} />
      <SelectField
        label="Espaciado vertical"
        value={String(d.padding_v || "56")}
        onChange={(v) => up("padding_v", Number(v))}
        options={["24","40","56","72","88"].map((n) => ({ value: n, label: `${n}px` }))}
      />

      <Divider />
      <SectionTitle>Colores del botón</SectionTitle>
      <ColorField label="Fondo del botón" value={d.btn_color} onChange={(v) => up("btn_color", v)} />
      <ColorField label="Texto del botón" value={d.btn_text_color} onChange={(v) => up("btn_text_color", v)} />
    </>
  );
}
