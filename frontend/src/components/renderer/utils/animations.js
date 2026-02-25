/* Framer Motion animation variants for renderer blocks */

export const ANIMATION_TYPES = [
  { value: "none",        label: "Sin animación" },
  { value: "fade",        label: "Fade in" },
  { value: "fade-up",     label: "Fade + subir" },
  { value: "fade-down",   label: "Fade + bajar" },
  { value: "slide-left",  label: "Deslizar desde izquierda" },
  { value: "slide-right", label: "Deslizar desde derecha" },
  { value: "zoom",        label: "Zoom in" },
];

export function getVariants(anim = {}) {
  const { type = "none", duration = 0.6, delay = 0 } = anim;
  const transition = { duration: Number(duration), delay: Number(delay), ease: [0.25, 0.46, 0.45, 0.94] };

  const map = {
    none:         { initial: {}, animate: {}, transition },
    fade:         { initial: { opacity: 0 }, animate: { opacity: 1 }, transition },
    "fade-up":    { initial: { opacity: 0, y: 48 }, animate: { opacity: 1, y: 0 }, transition },
    "fade-down":  { initial: { opacity: 0, y: -48 }, animate: { opacity: 1, y: 0 }, transition },
    "slide-left": { initial: { opacity: 0, x: -72 }, animate: { opacity: 1, x: 0 }, transition },
    "slide-right":{ initial: { opacity: 0, x: 72 },  animate: { opacity: 1, x: 0 }, transition },
    zoom:         { initial: { opacity: 0, scale: 0.82 }, animate: { opacity: 1, scale: 1 }, transition },
  };

  return map[type] || map.none;
}

export const DEFAULT_ANIMATION = { type: "fade-up", duration: 0.6, delay: 0 };
