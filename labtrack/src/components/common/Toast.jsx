import { useToast } from "../../context/ToastContext";

export default function ToastButton({ message = "Saved successfully." }) {
  const { showToast } = useToast();
  return (
    <button className="btn btn-secondary" onClick={() => showToast(message)}>
      Show Toast
    </button>
  );
}