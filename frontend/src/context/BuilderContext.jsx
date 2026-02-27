import { createContext, useContext, useState, useCallback } from "react";
import { v4 as uuid } from "uuid";

export const FONT_OPTIONS = [
  { value: "inherit",                   label: "Fuente del tema" },
  { value: "Inter, sans-serif",         label: "Inter" },
  { value: "Roboto, sans-serif",        label: "Roboto" },
  { value: "Montserrat, sans-serif",    label: "Montserrat" },
  { value: "Raleway, sans-serif",       label: "Raleway" },
  { value: "Lato, sans-serif",          label: "Lato" },
  { value: "Oswald, sans-serif",        label: "Oswald" },
  { value: "'Playfair Display', serif", label: "Playfair Display" },
  { value: "Georgia, serif",            label: "Georgia" },
];

const DEFAULT_ANIM = { type: "none" };

export const BLOCK_DEFAULTS = {
  hero: {
    title: "Tu Título Principal",
    subtitle: "Descripción breve de tu propuesta de valor",
    cta_text: "Comprar Ahora",
    cta_url: "",
    bg_type: "gradient",
    bg_value: "135deg, #1a1a2e 0%, #16213e 100%",
    bg_image: "",
    overlay_opacity: 40,
    text_align: "center",
    text_color: "#ffffff",
    title_font: "inherit",
    title_size: "56",
    subtitle_size: "20",
    min_height: 500,
    cta_style: "filled",
    cta_bg_color: "#ffffff",
    cta_text_color_btn: "#111111",
    animation: DEFAULT_ANIM,
  },
  products: {
    title: "Productos Destacados",
    subtitle: "",
    product_ids: [],
    columns: 3,
    show_price: true,
    show_btn: true,
    btn_text: "Ver producto",
    bg_color: "#ffffff",
    animation: DEFAULT_ANIM,
  },
  countdown: {
    title: "¡Oferta por tiempo limitado!",
    subtitle: "Aprovechá antes que se acabe",
    target_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    bg_color: "#111111",
    text_color: "#ffffff",
    accent_color: "#f59e0b",
    style: "boxes",
    animation: DEFAULT_ANIM,
  },
  text: {
    title: "Sobre esta colección",
    body: "Describí tu colección o producto. Contá la historia detrás de tu propuesta.",
    layout: "centered",
    image_url: "",
    bg_color: "#ffffff",
    text_color: "#111111",
    title_font: "inherit",
    title_size: "32",
    title_weight: "700",
    title_align: "left",
    body_font: "inherit",
    body_size: "16",
    body_align: "left",
    padding_v: "64",
    max_width: "720",
    animation: DEFAULT_ANIM,
  },
  image: {
    image_url: "",
    alt: "",
    width: "full",
    custom_width: 80,
    align: "center",
    border_radius: "0",
    caption: "",
    link_url: "",
    bg_color: "#ffffff",
    padding_v: "32",
    animation: DEFAULT_ANIM,
  },
  video: {
    url: "",
    title: "",
    full_width: true,
    bg_color: "#000000",
    animation: DEFAULT_ANIM,
  },
  cta_banner: {
    text: "¡No te pierdas esta oferta!",
    subtext: "Solo por tiempo limitado",
    btn_label: "Ver ahora",
    btn_url: "",
    bg_color: "#111111",
    text_color: "#ffffff",
    btn_color: "#ffffff",
    btn_text_color: "#111111",
    animation: DEFAULT_ANIM,
  },
  gallery: {
    title: "Galería",
    images: [],
    columns: 3,
    gap: 8,
    bg_color: "#ffffff",
    animation: DEFAULT_ANIM,
  },
  features: {
    title: "Por qué elegirnos",
    subtitle: "",
    items: [
      { id: "f1", icon: "⚡", title: "Envío rápido",    description: "Recibí tu pedido en 24-48hs" },
      { id: "f2", icon: "🛡️", title: "Compra segura",   description: "Múltiples medios de pago" },
      { id: "f3", icon: "✨", title: "Calidad premium", description: "Productos de primera calidad" },
    ],
    columns: 3,
    bg_color: "#f9f9f9",
    text_color: "#111111",
    animation: DEFAULT_ANIM,
  },
  spacer: {
    height: 64,
    bg_color: "transparent",
    show_divider: false,
    divider_color: "#e5e7eb",
    divider_thickness: 1,
    divider_width: 80,
    animation: DEFAULT_ANIM,
  },
  testimonials: {
    title: "Lo que dicen nuestros clientes",
    subtitle: "Más de 1000 clientes satisfechos",
    items: [
      { id: "t1", name: "Ana García",    role: "Cliente verificada",  text: "Excelente calidad, llegó antes de lo esperado. Lo recomiendo totalmente.", rating: 5, avatar_url: "" },
      { id: "t2", name: "Carlos Rodríguez", role: "Comprador frecuente", text: "Muy buena relación precio-calidad. Ya compré varias veces y siempre quedo satisfecho.", rating: 5, avatar_url: "" },
      { id: "t3", name: "María López",   role: "Cliente nueva",       text: "Primera compra y quedé encantada. Atención excelente y producto tal cual la foto.", rating: 4, avatar_url: "" },
    ],
    columns: 3,
    style: "card",
    bg_color: "#f9f9f9",
    text_color: "#111111",
    accent_color: "#f59e0b",
    padding_v: 64,
    animation: DEFAULT_ANIM,
  },
  columns: {
    ratio: "50-50",
    cols: 2,
    gap: 24,
    padding_v: 48,
    bg_color: "#ffffff",
    col1: { type: "text",  data: { title: "Título izquierda", body: "Texto de la columna izquierda.", bg_color: "#fff", text_color: "#111", title_size: "28", body_size: "16", title_weight: "700", padding_v: "0", max_width: "100%", layout: "centered", animation: DEFAULT_ANIM } },
    col2: { type: "image", data: { image_url: "", alt: "", width: "full", border_radius: "8", caption: "", bg_color: "transparent", padding_v: "0", animation: DEFAULT_ANIM } },
    animation: DEFAULT_ANIM,
  },
};

export const BLOCK_META = {
  hero:       { label: "Hero",         icon: "🖼️",  desc: "Cabecera con imagen y CTA" },
  products:   { label: "Productos",    icon: "🛍️",  desc: "Grid de productos de tu tienda" },
  countdown:  { label: "Countdown",    icon: "⏱️",  desc: "Temporizador de cuenta regresiva" },
  text:       { label: "Texto",        icon: "📝",  desc: "Título, cuerpo e imagen opcional" },
  image:      { label: "Imagen",       icon: "🌄",  desc: "Imagen sola con caption y enlace" },
  video:      { label: "Video",        icon: "▶️",  desc: "Embed YouTube o Vimeo" },
  cta_banner: { label: "Banner CTA",   icon: "📣",  desc: "Franja con llamada a la acción" },
  gallery:    { label: "Galería",      icon: "🗂️",  desc: "Grid de imágenes" },
  features:      { label: "Features",     icon: "✅",  desc: "Propuesta de valor con íconos" },
  spacer:        { label: "Separador",    icon: "➖",  desc: "Espacio vacío o línea divisoria" },
  testimonials:  { label: "Testimonios",  icon: "💬",  desc: "Reseñas de clientes" },
  columns:       { label: "Columnas",     icon: "⬜",  desc: "2 o 3 columnas lado a lado" },
};

const MAX_HISTORY = 50;

export const BuilderContext = createContext(null);

export function BuilderProvider({ children, initialLanding, storeId, getIdToken }) {
  const [landing, setLanding] = useState(initialLanding);

  const initialBlocks = (initialLanding?.blocks || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Historial: past = snapshots anteriores, present = estado actual, future = estados rehacibles
  const [history, setHistory] = useState({ past: [], present: initialBlocks, future: [] });

  const [activeBlockId, setActiveBlockId] = useState(null);
  const [isDirty, setIsDirty]             = useState(false);

  const blocks      = history.present;
  const canUndo     = history.past.length > 0;
  const canRedo     = history.future.length > 0;
  const activeBlock = blocks.find((b) => b.id === activeBlockId) ?? null;

  // Pushea el estado actual al historial y establece el nuevo presente
  const pushHistory = useCallback((newBlocks) => {
    setHistory((prev) => ({
      past: [...prev.past, prev.present].slice(-MAX_HISTORY),
      present: newBlocks,
      future: [],
    }));
  }, []);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;
      const previous = prev.past[prev.past.length - 1];
      return {
        past: prev.past.slice(0, -1),
        present: previous,
        future: [prev.present, ...prev.future],
      };
    });
    setIsDirty(true);
  }, []);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;
      const next = prev.future[0];
      return {
        past: [...prev.past, prev.present],
        present: next,
        future: prev.future.slice(1),
      };
    });
    setIsDirty(true);
  }, []);

  const addBlock = useCallback((type) => {
    const newBlock = {
      id: uuid(),
      type,
      order: blocks.length,
      data: { ...BLOCK_DEFAULTS[type] },
    };
    const newBlocks = [...blocks, newBlock];
    pushHistory(newBlocks);
    setActiveBlockId(newBlock.id);
    setIsDirty(true);
    return newBlock.id;
  }, [blocks, pushHistory]);

  const removeBlock = useCallback((id) => {
    const newBlocks = blocks.filter((b) => b.id !== id);
    pushHistory(newBlocks);
    setActiveBlockId((curr) => (curr === id ? null : curr));
    setIsDirty(true);
  }, [blocks, pushHistory]);

  // updateBlock NO pushea al historial (demasiado granular para cada keystroke)
  const updateBlock = useCallback((id, dataUpdates) => {
    setHistory((prev) => ({
      ...prev,
      present: prev.present.map((b) =>
        b.id === id ? { ...b, data: { ...b.data, ...dataUpdates } } : b
      ),
    }));
    setIsDirty(true);
  }, []);

  const reorderBlocks = useCallback((newBlocks) => {
    pushHistory(newBlocks.map((b, i) => ({ ...b, order: i })));
    setIsDirty(true);
  }, [pushHistory]);

  const duplicateBlock = useCallback((id) => {
    const original = blocks.find((b) => b.id === id);
    if (!original) return;
    const copy = { ...original, id: uuid(), order: original.order + 0.5 };
    const newBlocks = [...blocks, copy]
      .sort((a, b) => a.order - b.order)
      .map((b, i) => ({ ...b, order: i }));
    pushHistory(newBlocks);
    setActiveBlockId(copy.id);
    setIsDirty(true);
  }, [blocks, pushHistory]);

  const selectBlock = useCallback((id) => setActiveBlockId(id), []);
  const markSaved   = useCallback(() => setIsDirty(false), []);
  const updateTitle = useCallback((title) => {
    setLanding((prev) => ({ ...prev, title }));
    setIsDirty(true);
  }, []);
  const updateTheme = useCallback((updates) => {
    setLanding((prev) => ({ ...prev, theme: { ...(prev.theme || {}), ...updates } }));
    setIsDirty(true);
  }, []);

  return (
    <BuilderContext.Provider
      value={{
        landing, blocks, activeBlockId, activeBlock, isDirty,
        addBlock, removeBlock, updateBlock, reorderBlocks,
        duplicateBlock, selectBlock, markSaved, updateTitle, updateTheme,
        undo, redo, canUndo, canRedo,
        storeId, getIdToken,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  return useContext(BuilderContext);
}
