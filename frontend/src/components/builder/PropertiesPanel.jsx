import { useBuilder, BLOCK_META, FONT_OPTIONS } from "../../context/BuilderContext";
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
import { ColorField, SelectField, SectionTitle, Divider } from "./ui/EditorFields";

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

function GlobalThemePanel() {
  const { landing, updateTheme } = useBuilder();
  const theme = landing?.theme || {};

  return (
    <aside className="prop-panel">
      <div className="prop-header">
        <div className="prop-block-icon">🎨</div>
        <div>
          <div className="prop-block-name">Configuración global</div>
          <div className="prop-block-sub">Fuente y colores del sitio</div>
        </div>
      </div>
      <div className="prop-body">
        <SectionTitle>Tipografía</SectionTitle>
        <SelectField
          label="Fuente principal"
          value={theme.font || "inherit"}
          onChange={(v) => updateTheme({ font: v })}
          options={FONT_OPTIONS}
        />

        <Divider />
        <SectionTitle>Colores</SectionTitle>
        <ColorField
          label="Color primario"
          value={theme.primary_color || "#3b82f6"}
          onChange={(v) => updateTheme({ primary_color: v })}
        />
        <ColorField
          label="Color secundario"
          value={theme.secondary_color || "#111111"}
          onChange={(v) => updateTheme({ secondary_color: v })}
        />
        <ColorField
          label="Fondo del sitio"
          value={theme.bg_color || "#ffffff"}
          onChange={(v) => updateTheme({ bg_color: v })}
        />

        <Divider />
        <div className="global-theme-hint">
          💡 Estos valores se aplican como defaults a nuevos bloques y permiten mantener coherencia visual en toda la landing.
        </div>
      </div>
    </aside>
  );
}

export default function PropertiesPanel() {
  const { activeBlock } = useBuilder();

  if (!activeBlock) {
    return <GlobalThemePanel />;
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
