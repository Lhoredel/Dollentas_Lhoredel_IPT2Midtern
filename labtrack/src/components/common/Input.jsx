export default function Input({ label, error, ...props }) {
  return (
    <label className="field">
      {label && <span className="field-label">{label}</span>}
      <input className={`input ${error ? "input-error" : ""}`} {...props} />
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}