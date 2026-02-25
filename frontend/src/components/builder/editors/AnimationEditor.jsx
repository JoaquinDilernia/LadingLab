import { SelectField, SectionTitle, Divider } from "../ui/EditorFields";
import { useBuilder } from "../../../context/BuilderContext";
import { ANIMATION_TYPES } from "../../renderer/utils/animations";

const DURATION_OPTIONS = ["0.3","0.4","0.5","0.6","0.8","1.0","1.2","1.5"].map((v) => ({ value: v, label: `${v}s` }));
const DELAY_OPTIONS    = ["0","0.1","0.15","0.2","0.3","0.4","0.5","0.7","1.0"].map((v) => ({ value: v, label: v === "0" ? "Sin delay" : `${v}s` }));

export default function AnimationEditor({ block }) {
  const { updateBlock } = useBuilder();
  const anim = block.data.animation || {};
  const up = (k, v) => updateBlock(block.id, { animation: { ...anim, [k]: v } });

  return (
    <>
      <Divider />
      <SectionTitle>Animación al hacer scroll</SectionTitle>
      <SelectField
        label="Tipo de animación"
        value={anim.type || "none"}
        onChange={(v) => up("type", v)}
        options={ANIMATION_TYPES}
      />
      {anim.type && anim.type !== "none" && (
        <div className="ef-row">
          <SelectField
            label="Duración"
            value={String(anim.duration ?? 0.6)}
            onChange={(v) => up("duration", Number(v))}
            options={DURATION_OPTIONS}
          />
          <SelectField
            label="Delay"
            value={String(anim.delay ?? 0)}
            onChange={(v) => up("delay", Number(v))}
            options={DELAY_OPTIONS}
          />
        </div>
      )}
    </>
  );
}
