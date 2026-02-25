import { SelectField, ColorField, SectionTitle, Divider, ToggleField, NumberField } from "../ui/EditorFields";
import { useBuilder } from "../../../context/BuilderContext";

const HEIGHT_OPTIONS = ["16","24","32","48","64","80","96","120","160","200","240"].map((v) => ({ value: v, label: `${v}px` }));
const THICKNESS_OPTIONS = ["1","2","3","4"].map((v) => ({ value: v, label: `${v}px` }));
const WIDTH_OPTIONS = ["20","40","60","80","100"].map((v) => ({ value: v, label: `${v}%` }));

export default function SpacerEditor({ block }) {
  const { updateBlock } = useBuilder();
  const d = block.data;
  const up = (k, v) => updateBlock(block.id, { [k]: v });

  return (
    <>
      <SectionTitle>Separador</SectionTitle>
      <SelectField
        label="Altura"
        value={String(d.height ?? 64)}
        onChange={(v) => up("height", Number(v))}
        options={HEIGHT_OPTIONS}
      />
      <ColorField
        label="Color de fondo"
        value={d.bg_color || "transparent"}
        onChange={(v) => up("bg_color", v)}
      />

      <Divider />
      <SectionTitle>Línea divisoria</SectionTitle>
      <ToggleField
        label="Mostrar línea"
        value={d.show_divider || false}
        onChange={(v) => up("show_divider", v)}
      />
      {d.show_divider && (
        <>
          <ColorField label="Color de línea" value={d.divider_color || "#e5e7eb"} onChange={(v) => up("divider_color", v)} />
          <SelectField label="Grosor" value={String(d.divider_thickness ?? 1)} onChange={(v) => up("divider_thickness", Number(v))} options={THICKNESS_OPTIONS} />
          <SelectField label="Ancho de línea" value={String(d.divider_width ?? 80)} onChange={(v) => up("divider_width", Number(v))} options={WIDTH_OPTIONS} />
        </>
      )}
    </>
  );
}
