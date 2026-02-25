import { useRef, useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS }         from "@dnd-kit/utilities";
import { useBuilder, BLOCK_META } from "../../context/BuilderContext";
import BlockRenderer from "../renderer/BlockRenderer";

const RENDER_WIDTH = 1200; /* virtual render width for the preview */

/* ─────── Live scaled preview of the real renderer ─────── */
function LivePreview({ block }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.65);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.offsetWidth;
      if (w > 0) setScale(w / RENDER_WIDTH);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Strip animations so the preview shows the final state immediately */
  const noAnim = { type: "none" };
  const stripCol = (col) =>
    col ? { ...col, data: { ...(col.data || {}), animation: noAnim } } : col;

  const previewBlock = {
    ...block,
    data: {
      ...block.data,
      animation: noAnim,
      ...(block.type === "columns" && {
        col1: stripCol(block.data.col1),
        col2: stripCol(block.data.col2),
        col3: stripCol(block.data.col3),
      }),
    },
  };

  const PREVIEW_HEIGHT = 200; /* visible height in px */

  return (
    <div
      ref={containerRef}
      className="canvas-live-preview"
      style={{ height: PREVIEW_HEIGHT }}
    >
      <div
        className="canvas-live-scaler"
        style={{ width: RENDER_WIDTH, transform: `scale(${scale})` }}
      >
        <BlockRenderer block={previewBlock} />
      </div>
    </div>
  );
}

/* ─────── Drag handle SVG ─────── */
function DragIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="5" r="1.5" />
      <circle cx="7" cy="10" r="1.5" />
      <circle cx="7" cy="15" r="1.5" />
      <circle cx="13" cy="5" r="1.5" />
      <circle cx="13" cy="10" r="1.5" />
      <circle cx="13" cy="15" r="1.5" />
    </svg>
  );
}

/* ─────── Block Card ─────── */
export default function BlockCard({ block }) {
  const { activeBlockId, selectBlock, removeBlock, duplicateBlock } = useBuilder();
  const meta     = BLOCK_META[block.type];
  const isActive = activeBlockId === block.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`block-card ${isActive ? "active" : ""} ${isDragging ? "dragging" : ""}`}
      onClick={() => selectBlock(block.id)}
    >
      {/* Header bar */}
      <div className="block-card-bar">
        <div
          className="drag-handle"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
        >
          <DragIcon />
        </div>
        <span className="block-type-icon">{meta?.icon}</span>
        <span className="block-type-name">{meta?.label}</span>

        <div className="block-actions" onClick={(e) => e.stopPropagation()}>
          <button
            className="block-action"
            title="Duplicar"
            onClick={() => duplicateBlock(block.id)}
          >
            ⧉
          </button>
          <button
            className="block-action danger"
            title="Eliminar"
            onClick={() => removeBlock(block.id)}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Live renderer preview — real output scaled down */}
      <LivePreview block={block} />
    </div>
  );
}
