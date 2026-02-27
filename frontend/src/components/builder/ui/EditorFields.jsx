import { useRef } from "react";

export function TextField({ label, value, onChange, placeholder }) {
  return (
    <div className="ef-group">
      {label && <label className="ef-label">{label}</label>}
      <input
        className="ef-input"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export function TextareaField({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <div className="ef-group">
      {label && <label className="ef-label">{label}</label>}
      <textarea
        className="ef-input ef-textarea"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  );
}

export function SelectField({ label, value, onChange, options }) {
  return (
    <div className="ef-group">
      {label && <label className="ef-label">{label}</label>}
      <select
        className="ef-input ef-select"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

/* ── Color Field with swatches ── */
const COLOR_SWATCHES = [
  "#111111", "#333333", "#ffffff", "#f9f9f9",
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4",
];

export function ColorField({ label, value, onChange }) {
  const inputRef = useRef(null);
  const color = value || "#000000";
  const safeColor = color.startsWith("#") && color.length === 7 ? color : "#000000";

  return (
    <div className="ef-group">
      {label && <label className="ef-label">{label}</label>}
      <div className="ef-color-row" onClick={() => inputRef.current?.click()}>
        <div className="ef-color-swatch" style={{ background: color }} />
        <input
          className="ef-color-hex"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          maxLength={7}
        />
        <input
          ref={inputRef}
          type="color"
          value={safeColor}
          onChange={(e) => onChange(e.target.value)}
          style={{ position: "absolute", opacity: 0, width: 0, height: 0, pointerEvents: "none" }}
        />
      </div>
      <div className="ef-swatches">
        {COLOR_SWATCHES.map((c) => (
          <button
            key={c}
            type="button"
            className={`ef-swatch${c === color ? " active" : ""}`}
            style={{ background: c }}
            onClick={() => onChange(c)}
            title={c}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Slider Field ── */
export function SliderField({ label, value, onChange, min = 0, max = 100, step = 1, unit = "%" }) {
  return (
    <div className="ef-group">
      {label && <label className="ef-label">{label}</label>}
      <div className="ef-slider-row">
        <input
          type="range"
          className="ef-slider"
          min={min}
          max={max}
          step={step}
          value={value ?? min}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <span className="ef-slider-val">{value ?? min}{unit}</span>
      </div>
    </div>
  );
}

/* ── Gradient Field ── */
const GRADIENT_PRESETS = [
  { label: "Noche",      value: "135deg, #1a1a2e 0%, #16213e 100%" },
  { label: "Fuego",      value: "135deg, #7f0000 0%, #c0392b 100%" },
  { label: "Océano",     value: "135deg, #0f3460 0%, #1a1a2e 100%" },
  { label: "Cielo",      value: "135deg, #2980b9 0%, #6dd5fa 100%" },
  { label: "Puesta sol", value: "135deg, #f6416c 0%, #ffcd3c 100%" },
  { label: "Bosque",     value: "135deg, #134e5e 0%, #71b280 100%" },
  { label: "Gris",       value: "135deg, #373b44 0%, #8a8a8a 100%" },
  { label: "Aurora",     value: "135deg, #a8edea 0%, #fed6e3 100%" },
];

function parseGradient(str) {
  const fallback = { angle: 135, stops: [{ color: "#1a1a2e", pos: 0 }, { color: "#16213e", pos: 100 }] };
  if (!str) return fallback;
  try {
    const firstComma = str.indexOf(",");
    if (firstComma === -1) return fallback;
    const angle = parseInt(str.slice(0, firstComma).trim()) || 135;
    const rest = str.slice(firstComma + 1).trim();
    const stopRegex = /(#[a-fA-F0-9]{3,8})\s+(\d+(?:\.\d+)?)%/g;
    const stops = [];
    let m;
    while ((m = stopRegex.exec(rest)) !== null) {
      stops.push({ color: m[1], pos: parseFloat(m[2]) });
    }
    return stops.length >= 2 ? { angle, stops } : fallback;
  } catch {
    return fallback;
  }
}

function buildGradientStr({ angle, stops }) {
  return `${angle}deg, ${stops.map((s) => `${s.color} ${s.pos}%`).join(", ")}`;
}

export function GradientField({ label, value, onChange }) {
  const { angle, stops } = parseGradient(value);
  const colorRefs = useRef([]);

  function updateAngle(v) {
    onChange(buildGradientStr({ angle: v, stops }));
  }

  function updateStop(i, patch) {
    const next = stops.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
    onChange(buildGradientStr({ angle, stops: next }));
  }

  function addStop() {
    if (stops.length >= 5) return;
    const mid = Math.round((stops[0].pos + stops[stops.length - 1].pos) / 2);
    const next = [...stops, { color: "#888888", pos: mid }].sort((a, b) => a.pos - b.pos);
    onChange(buildGradientStr({ angle, stops: next }));
  }

  function removeStop(i) {
    if (stops.length <= 2) return;
    const next = stops.filter((_, idx) => idx !== i);
    onChange(buildGradientStr({ angle, stops: next }));
  }

  const previewGradient = `linear-gradient(${buildGradientStr({ angle, stops })})`;

  return (
    <div className="ef-group">
      {label && <label className="ef-label">{label}</label>}

      <div className="ef-gradient-preview" style={{ background: previewGradient }} />

      <div className="ef-gradient-presets">
        {GRADIENT_PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            className="ef-gradient-preset"
            style={{ background: `linear-gradient(${p.value})` }}
            title={p.label}
            onClick={() => onChange(p.value)}
          />
        ))}
      </div>

      <div className="ef-slider-row">
        <span className="ef-slider-label">Ángulo</span>
        <input
          type="range"
          className="ef-slider"
          min={0}
          max={360}
          step={5}
          value={angle}
          onChange={(e) => updateAngle(Number(e.target.value))}
        />
        <span className="ef-slider-val">{angle}°</span>
      </div>

      <div className="ef-gradient-stops">
        {stops.map((stop, i) => (
          <div key={i} className="ef-gradient-stop">
            <input
              ref={(el) => (colorRefs.current[i] = el)}
              type="color"
              value={stop.color.startsWith("#") && stop.color.length === 7 ? stop.color : "#000000"}
              onChange={(e) => updateStop(i, { color: e.target.value })}
              className="ef-stop-color"
              title="Color del punto"
            />
            <div className="ef-stop-pos-wrap">
              <input
                type="range"
                className="ef-slider"
                min={0}
                max={100}
                value={stop.pos}
                onChange={(e) => updateStop(i, { pos: Number(e.target.value) })}
              />
              <span className="ef-slider-val">{stop.pos}%</span>
            </div>
            {stops.length > 2 && (
              <button type="button" className="ef-stop-del" onClick={() => removeStop(i)}>✕</button>
            )}
          </div>
        ))}
        {stops.length < 5 && (
          <button type="button" className="ef-add-btn" style={{ fontSize: 11, padding: "5px" }} onClick={addStop}>
            + Color
          </button>
        )}
      </div>
    </div>
  );
}

export function ToggleField({ label, value, onChange }) {
  return (
    <div className="ef-toggle-row">
      <span className="ef-toggle-label">{label}</span>
      <button
        type="button"
        className={`ef-toggle${value ? " on" : ""}`}
        onClick={() => onChange(!value)}
      />
    </div>
  );
}

export function NumberField({ label, value, onChange, min = 1, max = 10 }) {
  return (
    <div className="ef-group">
      {label && <label className="ef-label">{label}</label>}
      <input
        className="ef-input"
        type="number"
        min={min}
        max={max}
        value={value ?? min}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: 80 }}
      />
    </div>
  );
}

export function SectionTitle({ children }) {
  return <div className="ef-section-title">{children}</div>;
}

export function Divider() {
  return <hr className="ef-divider" />;
}
