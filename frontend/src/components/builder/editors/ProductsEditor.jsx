import { TextField, TextareaField, SelectField, ColorField, ToggleField, NumberField, SectionTitle, Divider } from "../ui/EditorFields";
import { useBuilder } from "../../../context/BuilderContext";

export default function ProductsEditor({ block }) {
  const { updateBlock } = useBuilder();
  const d = block.data;
  const up = (k, v) => updateBlock(block.id, { [k]: v });

  return (
    <>
      <SectionTitle>Contenido</SectionTitle>
      <TextField label="Título de sección" value={d.title} onChange={(v) => up("title", v)} placeholder="Productos Destacados" />
      <TextField label="Subtítulo" value={d.subtitle} onChange={(v) => up("subtitle", v)} placeholder="Opcional..." />

      <Divider />
      <SectionTitle>Productos</SectionTitle>
      <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5, background: "#f7f8fa", borderRadius: 7, padding: "10px 12px" }}>
        💡 Los productos se mostrarán automáticamente desde tu tienda TiendaNube. Los visitantes verán todos los productos activos.
      </div>
      <NumberField label="Columnas" value={d.columns} onChange={(v) => up("columns", v)} min={1} max={4} />

      <Divider />
      <SectionTitle>Opciones de visualización</SectionTitle>
      <ToggleField label="Mostrar precio" value={d.show_price} onChange={(v) => up("show_price", v)} />
      <ToggleField label="Mostrar botón" value={d.show_btn} onChange={(v) => up("show_btn", v)} />
      {d.show_btn && (
        <TextField label="Texto del botón" value={d.btn_text} onChange={(v) => up("btn_text", v)} placeholder="Ver producto" />
      )}

      <Divider />
      <SectionTitle>Estilo</SectionTitle>
      <ColorField label="Color de fondo" value={d.bg_color} onChange={(v) => up("bg_color", v)} />
    </>
  );
}
