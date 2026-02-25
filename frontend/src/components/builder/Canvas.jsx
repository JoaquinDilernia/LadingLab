import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useBuilder } from "../../context/BuilderContext";
import BlockCard from "./BlockCard";

export default function Canvas() {
  const { blocks, reorderBlocks, addBlock } = useBuilder();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    reorderBlocks(arrayMove(blocks, oldIndex, newIndex));
  }

  if (blocks.length === 0) {
    return (
      <div className="canvas-area">
        <div className="canvas-empty">
          <div className="canvas-empty-icon">🧱</div>
          <h3>Tu landing está vacía</h3>
          <p>Hacé clic en un bloque del panel izquierdo para empezar a diseñar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="canvas-area">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <div className="canvas-list">
            {blocks.map((block) => (
              <BlockCard key={block.id} block={block} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add block shortcut */}
      <div style={{ marginTop: 12 }}>
        <button
          onClick={() => addBlock("hero")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(0,0,0,0.04)",
            border: "1.5px dashed #c8c8d2",
            borderRadius: 8,
            padding: "9px 20px",
            fontSize: 12,
            fontWeight: 600,
            color: "#999",
            cursor: "pointer",
            fontFamily: "inherit",
            width: "100%",
            maxWidth: 780,
            justifyContent: "center",
            transition: "border-color 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.color = "#3b82f6"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#c8c8d2"; e.currentTarget.style.color = "#999"; }}
        >
          + Agregar bloque desde el panel izquierdo
        </button>
      </div>
    </div>
  );
}
