export default function Loading({ text = "Loading..." }) {
  return (
    <div className="loading-state">
      <span className="spinner" />
      <span>{text}</span>
    </div>
  );
}