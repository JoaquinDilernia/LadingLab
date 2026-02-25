import { TextField, TextareaField, SelectField, ColorField, SectionTitle, Divider } from "../ui/EditorFields";
import { useBuilder } from "../../../context/BuilderContext";

export default function CountdownEditor({ block }) {
  const { updateBlock } = useBuilder();
  const d = block.data;
  const up = (k, v) => updateBlock(block.id, { [k]: v });

  return (
    <>
      <SectionTitle>Contenido</SectionTitle>
      <TextField label="Título" value={d.title} onChange={(v) => up("title", v)} placeholder="¡Oferta por tiempo limitado!" />
      <TextField label="Subtítulo" value={d.subtitle} onChange={(v) => up("subtitle", v)} placeholder="Opcional..." />

      <Divider />
      <SectionTitle>Fecha objetivo</SectionTitle>
      <div className="ef-group">
        <label className="ef-label">Fecha y hora de fin</label>
        <input
          className="ef-input"
          type="datetime-local"
          value={d.target_date || ""}
          onChange={(e) => up("target_date", e.target.value)}
        />
      </div>

      <Divider />
      <SectionTitle>Estilo</SectionTitle>
      <SelectField
        label="Estilo del contador"
        value={d.style}
        onChange={(v) => up("style", v)}
        options={[
          { value: "boxes",   label: "Cajas" },
          { value: "minimal", label: "Minimalista" },
        ]}
      />
      <ColorField label="Color de fondo" value={d.bg_color} onChange={(v) => up("bg_color", v)} />
      <ColorField label="Color de texto" value={d.text_color} onChange={(v) => up("text_color", v)} />
      <ColorField label="Color de acento" value={d.accent_color} onChange={(v) => up("accent_color", v)} />
    </>
  );
}
