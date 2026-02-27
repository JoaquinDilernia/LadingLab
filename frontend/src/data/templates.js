import { v4 as uuid } from "uuid";

const ANIM = { type: "none" };

/* Convierte definiciones de template en bloques reales con IDs únicos */
export function buildBlocks(defs) {
  return defs.map((def, i) => ({
    id: uuid(),
    type: def.type,
    order: i,
    data: def.data,
  }));
}

export const TEMPLATES = [
  /* ─────────────────────────────────────────
     0. En blanco
  ───────────────────────────────────────── */
  {
    id: "blank",
    name: "En blanco",
    description: "Empezá desde cero con tu propio diseño",
    emoji: "⬜",
    gradient: "linear-gradient(135deg, #e8e9ed 0%, #c8cad2 100%)",
    blocks: [],
  },

  /* ─────────────────────────────────────────
     1. Lanzamiento de producto
  ───────────────────────────────────────── */
  {
    id: "product_launch",
    name: "Lanzamiento",
    description: "Hero impactante, beneficios, productos y CTA",
    emoji: "🚀",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    blocks: [
      {
        type: "hero",
        data: {
          title: "Nuevo Lanzamiento",
          subtitle: "Descubrí nuestra nueva colección. Diseñada para vos.",
          cta_text: "Ver productos",
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
          min_height: 520,
          cta_style: "filled",
          cta_bg_color: "#ffffff",
          cta_text_color_btn: "#111111",
          animation: ANIM,
        },
      },
      {
        type: "features",
        data: {
          title: "Por qué elegir este producto",
          subtitle: "",
          items: [
            { id: "f1", icon: "⚡", title: "Envío rápido",         description: "Recibí tu pedido en 24-48hs" },
            { id: "f2", icon: "🛡️", title: "Calidad garantizada",  description: "30 días de garantía de devolución" },
            { id: "f3", icon: "✨", title: "Materiales premium",   description: "Los mejores materiales del mercado" },
          ],
          columns: 3,
          bg_color: "#f9f9f9",
          text_color: "#111111",
          animation: ANIM,
        },
      },
      {
        type: "products",
        data: {
          title: "Productos del lanzamiento",
          subtitle: "Seleccionados especialmente para esta colección",
          product_ids: [],
          columns: 3,
          show_price: true,
          show_btn: true,
          btn_text: "Ver producto",
          bg_color: "#ffffff",
          animation: ANIM,
        },
      },
      {
        type: "cta_banner",
        data: {
          text: "¡No te pierdas el lanzamiento!",
          subtext: "Cantidades limitadas. Pedí el tuyo hoy.",
          btn_label: "Comprar ahora",
          btn_url: "",
          bg_color: "#111111",
          text_color: "#ffffff",
          btn_color: "#ffffff",
          btn_text_color: "#111111",
          animation: ANIM,
        },
      },
    ],
  },

  /* ─────────────────────────────────────────
     2. Hot Sale
  ───────────────────────────────────────── */
  {
    id: "hot_sale",
    name: "Hot Sale",
    description: "Countdown de urgencia, ofertas y productos en descuento",
    emoji: "🔥",
    gradient: "linear-gradient(135deg, #7f0000 0%, #c0392b 100%)",
    blocks: [
      {
        type: "hero",
        data: {
          title: "🔥 Hot Sale",
          subtitle: "Las mejores ofertas del año. Solo por tiempo limitado.",
          cta_text: "Ver ofertas",
          cta_url: "",
          bg_type: "gradient",
          bg_value: "135deg, #7f0000 0%, #c0392b 100%",
          bg_image: "",
          overlay_opacity: 0,
          text_align: "center",
          text_color: "#ffffff",
          title_font: "inherit",
          title_size: "64",
          subtitle_size: "20",
          min_height: 480,
          cta_style: "filled",
          cta_bg_color: "#ffffff",
          cta_text_color_btn: "#c0392b",
          animation: ANIM,
        },
      },
      {
        type: "countdown",
        data: {
          title: "¡La oferta termina en!",
          subtitle: "Aprovechá antes que se acabe",
          target_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
          bg_color: "#111111",
          text_color: "#ffffff",
          accent_color: "#f59e0b",
          style: "boxes",
          animation: ANIM,
        },
      },
      {
        type: "products",
        data: {
          title: "Productos en oferta",
          subtitle: "Precios especiales por tiempo limitado",
          product_ids: [],
          columns: 4,
          show_price: true,
          show_btn: true,
          btn_text: "Aprovechar oferta",
          bg_color: "#ffffff",
          animation: ANIM,
        },
      },
      {
        type: "cta_banner",
        data: {
          text: "¡Última oportunidad para aprovechar el Hot Sale!",
          subtext: "La oferta termina pronto. ¡No te quedes sin el tuyo!",
          btn_label: "Comprar ya",
          btn_url: "",
          bg_color: "#c0392b",
          text_color: "#ffffff",
          btn_color: "#ffffff",
          btn_text_color: "#c0392b",
          animation: ANIM,
        },
      },
    ],
  },

  /* ─────────────────────────────────────────
     3. Colección completa
  ───────────────────────────────────────── */
  {
    id: "collection",
    name: "Colección",
    description: "Presentá una colección con historia, productos y testimonios",
    emoji: "🧥",
    gradient: "linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%)",
    blocks: [
      {
        type: "hero",
        data: {
          title: "Nueva Colección",
          subtitle: "Cada pieza, una historia. Descubrí la colección completa.",
          cta_text: "Explorar colección",
          cta_url: "",
          bg_type: "gradient",
          bg_value: "135deg, #0f3460 0%, #1a1a2e 100%",
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
          animation: ANIM,
        },
      },
      {
        type: "text",
        data: {
          title: "Nuestra historia",
          body: "Esta colección nació de la pasión por el diseño y la calidad. Cada producto fue cuidadosamente seleccionado para ofrecerte lo mejor.",
          layout: "centered",
          image_url: "",
          bg_color: "#ffffff",
          text_color: "#111111",
          title_font: "inherit",
          title_size: "36",
          title_weight: "700",
          title_align: "center",
          body_font: "inherit",
          body_size: "17",
          body_align: "center",
          padding_v: "64",
          max_width: "680",
          animation: ANIM,
        },
      },
      {
        type: "products",
        data: {
          title: "La colección",
          subtitle: "",
          product_ids: [],
          columns: 3,
          show_price: true,
          show_btn: true,
          btn_text: "Ver producto",
          bg_color: "#f9f9f9",
          animation: ANIM,
        },
      },
      {
        type: "testimonials",
        data: {
          title: "Lo que dicen nuestros clientes",
          subtitle: "Miles de clientes satisfechos",
          items: [
            { id: "t1", name: "Ana García",       role: "Cliente verificada",   text: "Excelente calidad, llegó antes de lo esperado. Lo recomiendo totalmente.", rating: 5, avatar_url: "" },
            { id: "t2", name: "Carlos Rodríguez", role: "Comprador frecuente",  text: "Muy buena relación precio-calidad. Ya compré varias veces.", rating: 5, avatar_url: "" },
            { id: "t3", name: "María López",      role: "Cliente nueva",        text: "Primera compra y quedé encantada. Atención excelente.", rating: 4, avatar_url: "" },
          ],
          columns: 3,
          style: "card",
          bg_color: "#ffffff",
          text_color: "#111111",
          accent_color: "#f59e0b",
          padding_v: 64,
          animation: ANIM,
        },
      },
    ],
  },

  /* ─────────────────────────────────────────
     4. Lookbook / Editorial
  ───────────────────────────────────────── */
  {
    id: "lookbook",
    name: "Lookbook",
    description: "Estilo editorial con columnas de imagen y texto, galería y CTA",
    emoji: "📸",
    gradient: "linear-gradient(135deg, #1a1a1a 0%, #444 100%)",
    blocks: [
      {
        type: "hero",
        data: {
          title: "Lookbook 2026",
          subtitle: "Explorá nuestra visión de moda y estilo para esta temporada.",
          cta_text: "Ver más",
          cta_url: "",
          bg_type: "color",
          bg_value: "#1a1a1a",
          bg_image: "",
          overlay_opacity: 40,
          text_align: "center",
          text_color: "#ffffff",
          title_font: "Montserrat, sans-serif",
          title_size: "72",
          subtitle_size: "18",
          min_height: 560,
          cta_style: "outline",
          cta_bg_color: "#ffffff",
          cta_text_color_btn: "#1a1a1a",
          animation: ANIM,
        },
      },
      {
        type: "columns",
        data: {
          ratio: "50-50",
          cols: 2,
          gap: 0,
          padding_v: 0,
          bg_color: "#ffffff",
          col1: {
            type: "image",
            data: { image_url: "", alt: "Look 1", width: "full", border_radius: "0", caption: "", bg_color: "#f0f0f0", padding_v: "0", animation: ANIM },
          },
          col2: {
            type: "text",
            data: { title: "Look 01", body: "Describí este look: prendas, colores, combinaciones y la historia que cuenta.", bg_color: "#fff", text_color: "#111", title_size: "32", body_size: "16", title_weight: "700", padding_v: "48", max_width: "100%", layout: "centered", animation: ANIM },
          },
          animation: ANIM,
        },
      },
      {
        type: "gallery",
        data: {
          title: "La campaña",
          images: [],
          columns: 3,
          gap: 4,
          bg_color: "#111111",
          animation: ANIM,
        },
      },
      {
        type: "cta_banner",
        data: {
          text: "Conseguí el look completo",
          subtext: "Todas las piezas disponibles en nuestra tienda",
          btn_label: "Ir a la tienda",
          btn_url: "",
          bg_color: "#1a1a1a",
          text_color: "#ffffff",
          btn_color: "#ffffff",
          btn_text_color: "#1a1a1a",
          animation: ANIM,
        },
      },
    ],
  },
];
