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

export function ColorField({ label, value, onChange }) {
  const inputRef = useRef(null);
  const color = value || "#000000";

  return (
    <div className="ef-group">
      {label && <label className="ef-label">{label}</label>}
      <div className="ef-color-row" onClick={() => inputRef.current?.click()}>
        <div
          className="ef-color-swatch"
          style={{ background: color }}
        />
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
          value={color}
          onChange={(e) => onChange(e.target.value)}
          style={{ position: "absolute", opacity: 0, width: 0, height: 0, pointerEvents: "none" }}
        />
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
