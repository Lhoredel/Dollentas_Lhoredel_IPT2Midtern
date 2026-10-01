import { useEffect, useMemo, useState } from "react";
import { Beaker, Plus, Search, Trash2, Edit3 } from "lucide-react";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import Badge from "../components/common/Badge";
import Loading from "../components/common/Loading";
import { equipmentService } from "../services/equipmentService";
import { useToast } from "../context/ToastContext";

const emptyForm = {
  name: "",
  serialNumber: "",
  condition: "Good",
  quantity: 1,
  location: "",
  category: "General",
  description: "",
  lastMaintenance: "",
};

export default function Equipment() {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  async function load() {
    setStatus("loading");
    try {
      setItems(await equipmentService.getAll());
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(term) ||
        item.serialNumber.toLowerCase().includes(term);
      const matchesFilter = filter === "All" || item.condition === filter;
      return matchesSearch && matchesFilter;
    });
  }, [items, search, filter]);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditing(item);
    setForm(item);
    setModalOpen(true);
  }

  async function save(event) {
    event.preventDefault();
    if (!form.name || !form.serialNumber || !form.location) {
      showToast("Please complete the required fields.", "error");
      return;
    }

    if (editing) {
      await equipmentService.update(editing.id, form);
      showToast("Equipment updated successfully.");
    } else {
      await equipmentService.create(form);
      showToast("Equipment added successfully.");
    }

    setModalOpen(false);
    await load();
  }

  async function remove(item) {
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    await equipmentService.remove(item.id);
    showToast("Equipment deleted.");
    await load();
  }

  return (
    <div className="page">
      <div className="page-heading page-heading-actions">
        <div>
          <h1>Laboratory Equipment Inventory</h1>
          <p>Track every item: name, serial number, condition, quantity, and location.</p>
        </div>
        <Button onClick={openAdd}><Plus size={18} /> Add Equipment</Button>
      </div>

      <div className="equipment-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or serial number"
          />
        </div>
        <div className="filter-pills">
          {["All", "Good", "Fair", "Needs Repair"].map((value) => (
            <button
              key={value}
              className={`filter-pill ${filter === value ? "selected" : ""}`}
              onClick={() => setFilter(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {status === "loading" && (
        <div className="feedback-card"><Loading text="Loading equipment..." /></div>
      )}

      {status === "error" && (
        <div className="feedback-card error-feedback">
          <div className="feedback-icon error">!</div>
          <h3>Couldn't load equipment</h3>
          <p>The server did not respond. Check your connection and try again.</p>
          <Button variant="secondary" onClick={load}>Try Again</Button>
        </div>
      )}

      {status === "ready" && filtered.length === 0 && (
        <div className="feedback-card empty-feedback">
          <Beaker size={48} />
          <h3>No equipment yet</h3>
          <p>Add your first item to start tracking the lab inventory.</p>
          <Button onClick={openAdd}>Add Equipment</Button>
        </div>
      )}

      {status === "ready" && filtered.length > 0 && (
        <div className="table-card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ITEM NAME</th>
                  <th>SERIAL NUMBER</th>
                  <th>CONDITION</th>
                  <th>QTY</th>
                  <th>LOCATION</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.name}</strong></td>
                    <td className="muted">{item.serialNumber}</td>
                    <td><Badge>{item.condition}</Badge></td>
                    <td>{item.quantity}</td>
                    <td>{item.location}</td>
                    <td>
                      <div className="action-links">
                        <button onClick={() => openEdit(item)} className="edit-link"><Edit3 size={14} /> Edit</button>
                        <button onClick={() => remove(item)} className="delete-link"><Trash2 size={14} /> Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-footer">Showing {filtered.length} of {items.length} items</div>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Equipment" : "Add Equipment"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" form="equipment-form">{editing ? "Save Changes" : "Add Equipment"}</Button>
          </>
        }
      >
        <form id="equipment-form" onSubmit={save} className="form-grid">
          <label className="field full">
            <span className="field-label">Item name *</span>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="field">
            <span className="field-label">Serial number *</span>
            <input className="input" value={form.serialNumber} onChange={(e) => setForm({ ...form, serialNumber: e.target.value })} />
          </label>
          <label className="field">
            <span className="field-label">Category</span>
            <input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </label>
          <label className="field">
            <span className="field-label">Condition</span>
            <select className="input" value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}>
              <option>Good</option>
              <option>Fair</option>
              <option>Needs Repair</option>
            </select>
          </label>
          <label className="field">
            <span className="field-label">Quantity</span>
            <input className="input" type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          </label>
          <label className="field full">
            <span className="field-label">Location *</span>
            <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </label>
          <label className="field full">
            <span className="field-label">Description</span>
            <textarea className="input textarea" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
        </form>
      </Modal>
    </div>
  );
}