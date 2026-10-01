const normalize = (value) => String(value).toLowerCase().replace(/\s+/g, "-");

export default function Badge({ children }) {
  return <span className={`badge badge-${normalize(children)}`}>{children}</span>;
}