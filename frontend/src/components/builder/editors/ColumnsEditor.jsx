import { useContext } from "react";
import { SelectField, SectionTitle, Divider, ColorField } from "../ui/EditorFields";
import { useBuilder, BLOCK_DEFAULTS, BuilderContext } from "../../../context/BuilderContext";
import HeroEditor      from "./HeroEditor";
import TextEditor      from "./TextEditor";
import ImageEditor     from "./ImageEditor";
import VideoEditor     from "./VideoEditor";
import CtaBannerEditor from "./CtaBannerEditor";
import GalleryEditor   from "./GalleryEditor";
import FeaturesEditor  from "./FeaturesEditor";
import CountdownEditor from "./CountdownEditor";
import ProductsEditor  from "./ProductsEditor";

const COL_TYPES = [
  { value: "",           label: "— Vacía —" },
  { value: "text",       label: "Texto" },
  { value: "image",      label: "Imagen" },
  { value: "hero",       label: "Hero" },
  { value: "cta_banner", label: "Banner CTA" },
  { value: "video",      label: "Video" },
  { value: "gallery",    label: "Galería" },
  { value: "features",   label: "Features" },
  { value: "countdown",  label: "Countdown" },
  { value: "products",   label: "Productos" },
];

const RATIO_OPTIONS = [
  { value: "50-50",    label: "50% / 50%  (igual)" },
  { value: "40-60",    label: "40% / 60%" },
  { value: "60-40",    label: "60% / 40%" },
  { value: "30-70",    label: "30% / 70%" },
  { value: "70-30",    label: "70% / 30%" },
  { value: "33-33-33", label: "33% / 33% / 33%  (3 columnas)" },
];

const GAP_OPTIONS     = ["0","8","16","24","32","48","64"].map((v) => ({ value: v, label: v === "0" ? "Sin espacio" : `${v}px` }));
const PADDING_OPTIONS = ["0","16","24","32","48","64","80","96"].map((v) => ({ value: v, label: v === "0" ? "Sin espaciado" : `${v}px` }));

const SUB_EDITORS = {
  hero: HeroEditor, text: TextEditor, image: ImageEditor,
  video: VideoEditor, cta_banner: CtaBannerEditor, gallery: GalleryEditor,
  features: FeaturesEditor, countdown: CountdownEditor, products: ProductsEditor,
};

/* Sub-editor rendered inside a patched context so updateBlock
   writes to the column's data instead of the root blocks array */
function ColDataEditor({ colKey, col, blockId }) {
  const parentCtx = useContext(BuilderContext);
  const Sub = SUB_EDITORS[col?.type];
  if (!Sub) return null;

  const fakeBlock = {
    id:   `${blockId}__${colKey}`,
    type: col.type,
    data: col.data || {},
  };

  const patchedCtx = {
    ...parentCtx,
    updateBlock: (_id, patch) => {
      parentCtx.updateBlock(blockId, {
        [colKey]: { ...col, data: { ...(col?.data || {}), ...patch } },
      });
    },
  };

  return (
    <BuilderContext.Provider value={patchedCtx}>
      <Sub block={fakeBlock} />
    </BuilderContext.Provider>
  );
}

export default function ColumnsEditor({ block }) {
  const { updateBlock } = useBuilder();
  const d = block.data;
  const up = (k, v) => updateBlock(block.id, { [k]: v });

  const isTri   = d.ratio === "33-33-33";
  const colKeys = isTri ? ["col1", "col2", "col3"] : ["col1", "col2"];

  function setColType(colKey, type) {
    up(colKey, type ? { type, data: { ...(BLOCK_DEFAULTS[type] || {}), padding_v: "0" } } : null);
  }

  return (
    <>
      <SectionTitle>Layout de columnas</SectionTitle>

      <SelectField
        label="Proporción de columnas"
        value={d.ratio || "50-50"}
        onChange={(v) => up("ratio", v)}
        options={RATIO_OPTIONS}
      />
      <SelectField
        label="Espacio entre columnas"
        value={String(d.gap ?? 24)}
        onChange={(v) => up("gap", Number(v))}
        options={GAP_OPTIONS}
      />

      <Divider />
      <SectionTitle>Espaciado y fondo</SectionTitle>
      <SelectField
        label="Espaciado vertical de la sección"
        value={String(d.padding_v ?? 48)}
        onChange={(v) => up("padding_v", Number(v))}
        options={PADDING_OPTIONS}
      />
      <ColorField
        label="Color de fondo"
        value={d.bg_color || "#ffffff"}
        onChange={(v) => up("bg_color", v)}
      />

      {colKeys.map((colKey, i) => {
        const col = d[colKey];
        return (
          <div key={colKey}>
            <Divider />
            <SectionTitle>Columna {i + 1}</SectionTitle>
            <SelectField
              label="Tipo de contenido"
              value={col?.type || ""}
              onChange={(v) => setColType(colKey, v)}
              options={COL_TYPES}
            />
            {col?.type && (
              <ColDataEditor colKey={colKey} col={col} blockId={block.id} />
            )}
          </div>
        );
      })}
    </>
  );
}
