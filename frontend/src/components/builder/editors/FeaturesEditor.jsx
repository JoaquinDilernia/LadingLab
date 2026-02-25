import { TextField, TextareaField, ColorField, NumberField, SectionTitle, Divider } from "../ui/EditorFields";
import { useBuilder } from "../../../context/BuilderContext";
import { v4 as uuid } from "uuid";

export default function FeaturesEditor({ block }) {
  const { updateBlock } = useBuilder();
  const d = block.data;
  const up = (k, v) => updateBlock(block.id, { [k]: v });
  const items = d.items || [];

  const updateItem = (id, field, value) => {
    up("items", items.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = () => {
    up("items", [...items, { id: uuid(), icon: "⭐", title: "Nueva feature", description: "Descripción" }]);
  };

  const removeItem = (id) => {
    up("items", items.filter((item) => item.id !== id));
  };

  return (
    <>
      <SectionTitle>Sección</SectionTitle>
      <TextField label="Título" value={d.title} onChange={(v) => up("title", v)} placeholder="Por qué elegirnos" />
      <TextField label="Subtítulo" value={d.subtitle} onChange={(v) => up("subtitle", v)} placeholder="Opcional..." />

      <Divider />
      <SectionTitle>Features ({items.length})</SectionTitle>
      <div className="ef-item-list">
        {items.map((item) => (
          <div key={item.id} className="ef-item">
            <div className="ef-item-header">
              <input
                className="ef-input ef-item-icon"
                value={item.icon}
                onChange={(e) => updateItem(item.id, "icon", e.target.value)}
                placeholder="⭐"
                style={{ width: 44, textAlign: "center", fontSize: 18, padding: "4px 6px" }}
              />
              <input
                className="ef-input"
                value={item.title}
                onChange={(e) => updateItem(item.id, "title", e.target.value)}
                placeholder="Título de la feature"
                style={{ flex: 1 }}
              />
              <button className="ef-item-del" onClick={() => removeItem(item.id)}>✕</button>
            </div>
            <input
              className="ef-input"
              value={item.description}
              onChange={(e) => updateItem(item.id, "description", e.target.value)}
              placeholder="Breve descripción..."
            />
          </div>
        ))}
        <button className="ef-add-btn" onClick={addItem}>+ Agregar feature</button>
      </div>

      <Divider />
      <SectionTitle>Estilo</SectionTitle>
      <NumberField label="Columnas" value={d.columns} onChange={(v) => up("columns", v)} min={1} max={4} />
      <ColorField label="Color de fondo" value={d.bg_color} onChange={(v) => up("bg_color", v)} />
      <ColorField label="Color de texto" value={d.text_color} onChange={(v) => up("text_color", v)} />
    </>
  );
}
