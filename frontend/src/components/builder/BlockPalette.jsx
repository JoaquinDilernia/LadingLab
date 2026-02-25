import { BLOCK_META } from "../../context/BuilderContext";
import { useBuilder } from "../../context/BuilderContext";

export default function BlockPalette() {
  const { addBlock } = useBuilder();

  return (
    <aside className="block-palette">
      <div className="palette-header">Bloques</div>
      <div className="palette-list">
        {Object.entries(BLOCK_META).map(([type, meta]) => (
          <button
            key={type}
            className="palette-item"
            onClick={() => addBlock(type)}
            title={`Agregar bloque ${meta.label}`}
          >
            <div className="palette-icon">{meta.icon}</div>
            <div className="palette-info">
              <span className="palette-name">{meta.label}</span>
              <span className="palette-desc">{meta.desc}</span>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
