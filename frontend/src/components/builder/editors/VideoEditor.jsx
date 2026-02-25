import { TextField, ColorField, ToggleField, SectionTitle, Divider } from "../ui/EditorFields";
import { useBuilder } from "../../../context/BuilderContext";

export default function VideoEditor({ block }) {
  const { updateBlock } = useBuilder();
  const d = block.data;
  const up = (k, v) => updateBlock(block.id, { [k]: v });

  return (
    <>
      <SectionTitle>Video</SectionTitle>
      <TextField
        label="URL del video (YouTube o Vimeo)"
        value={d.url}
        onChange={(v) => up("url", v)}
        placeholder="https://www.youtube.com/watch?v=..."
      />
      <TextField label="Título (opcional)" value={d.title} onChange={(v) => up("title", v)} placeholder="Texto sobre el video" />

      <Divider />
      <SectionTitle>Opciones</SectionTitle>
      <ToggleField label="Ancho completo" value={d.full_width} onChange={(v) => up("full_width", v)} />
      <ColorField label="Color de fondo" value={d.bg_color} onChange={(v) => up("bg_color", v)} />

      {d.url && (
        <div style={{ fontSize: 11, color: "#888", background: "#f7f8fa", borderRadius: 7, padding: "8px 12px" }}>
          ✓ URL configurada. Se usará el embed de YouTube/Vimeo automáticamente.
        </div>
      )}
    </>
  );
}
