import { useBuilder, BLOCK_META } from "../../context/BuilderContext";
import HeroEditor         from "./editors/HeroEditor";
import ProductsEditor     from "./editors/ProductsEditor";
import CountdownEditor    from "./editors/CountdownEditor";
import TextEditor         from "./editors/TextEditor";
import ImageEditor        from "./editors/ImageEditor";
import VideoEditor        from "./editors/VideoEditor";
import CtaBannerEditor    from "./editors/CtaBannerEditor";
import GalleryEditor      from "./editors/GalleryEditor";
import FeaturesEditor     from "./editors/FeaturesEditor";
import SpacerEditor       from "./editors/SpacerEditor";
import TestimonialsEditor from "./editors/TestimonialsEditor";
import ColumnsEditor      from "./editors/ColumnsEditor";
import AnimationEditor    from "./editors/AnimationEditor";

const EDITORS = {
  hero:         HeroEditor,
  products:     ProductsEditor,
  countdown:    CountdownEditor,
  text:         TextEditor,
  image:        ImageEditor,
  video:        VideoEditor,
  cta_banner:   CtaBannerEditor,
  gallery:      GalleryEditor,
  features:     FeaturesEditor,
  spacer:       SpacerEditor,
  testimonials: TestimonialsEditor,
  columns:      ColumnsEditor,
};

export default function PropertiesPanel() {
  const { activeBlock } = useBuilder();

  if (!activeBlock) {
    return (
      <aside className="prop-panel">
        <div className="prop-empty">
          <div className="prop-empty-icon">👈</div>
          <p>Seleccioná un bloque en el canvas para editar sus propiedades</p>
        </div>
      </aside>
    );
  }

  const meta   = BLOCK_META[activeBlock.type];
  const Editor = EDITORS[activeBlock.type];

  return (
    <aside className="prop-panel">
      <div className="prop-header">
        <div className="prop-block-icon">{meta?.icon}</div>
        <div>
          <div className="prop-block-name">{meta?.label}</div>
          <div className="prop-block-sub">{meta?.desc}</div>
        </div>
      </div>

      <div className="prop-body">
        {Editor ? (
          <>
            <Editor block={activeBlock} />
            {/* Animation section — shown for every block type except columns
                (columns manages animation per sub-block via sub-editors) */}
            {activeBlock.type !== "columns" && (
              <AnimationEditor block={activeBlock} />
            )}
          </>
        ) : (
          <p style={{ fontSize: 13, color: "#aaa" }}>Editor no disponible</p>
        )}
      </div>
    </aside>
  );
}
