import { useState } from "react";
import { TextField, SelectField, ColorField, ToggleField, NumberField, SectionTitle, Divider } from "../ui/EditorFields";
import { useBuilder } from "../../../context/BuilderContext";
import ProductPickerModal from "./ProductPickerModal";

export default function ProductsEditor({ block }) {
  const { updateBlock } = useBuilder();
  const d = block.data;
  const up = (k, v) => updateBlock(block.id, { [k]: v });
  const [pickerOpen, setPickerOpen] = useState(false);

  function handlePickerConfirm(ids, cache) {
    updateBlock(block.id, { product_ids: ids, products_cache: cache });
  }

  const selectedCount = (d.product_ids || []).length;

  return (
    <>
      <SectionTitle>Contenido</SectionTitle>
      <TextField label="Título de sección" value={d.title} onChange={(v) => up("title", v)} placeholder="Productos Destacados" />
      <TextField label="Subtítulo" value={d.subtitle} onChange={(v) => up("subtitle", v)} placeholder="Opcional..." />

      <Divider />
      <SectionTitle>Productos</SectionTitle>

      {/* Picker trigger */}
      <div className="ppicker-trigger-wrap">
        <div className="ppicker-trigger-info">
          {selectedCount === 0 ? (
            <span className="ppicker-trigger-all">Mostrando todos los productos</span>
          ) : (
            <span className="ppicker-trigger-count">{selectedCount} producto{selectedCount > 1 ? "s" : ""} seleccionado{selectedCount > 1 ? "s" : ""}</span>
          )}
        </div>
        <button className="ppicker-trigger-btn" onClick={() => setPickerOpen(true)}>
          🛍️ Elegir productos
        </button>
        {selectedCount > 0 && (
          <button className="ppicker-trigger-clear" onClick={() => updateBlock(block.id, { product_ids: [], products_cache: [] })}>
            Mostrar todos
          </button>
        )}
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
      <SelectField
        label="Espaciado vertical"
        value={String(d.padding_v || "64")}
        onChange={(v) => up("padding_v", Number(v))}
        options={["32","48","64","80","96","120"].map((n) => ({ value: n, label: `${n}px` }))}
      />
      <ColorField label="Color de fondo" value={d.bg_color} onChange={(v) => up("bg_color", v)} />

      {pickerOpen && (
        <ProductPickerModal
          selectedIds={d.product_ids || []}
          onConfirm={handlePickerConfirm}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </>
  );
}
