import { useState } from "react";
import { ClipboardList, Plus, Search } from "lucide-react";
import { borrowings as initialBorrowings } from "../data/mockData";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import { useToast } from "../context/ToastContext";

export default function Borrowing() {
  const { showToast } = useToast();
  const [items, setItems] = useState(initialBorrowings);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = items.filter((item) =>
    `${item.equipment} ${item.borrower}`.toLowerCase().includes(search.toLowerCase())
  );

  function returnItem(id) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, status: "Returned" } : item));
    showToast("Equipment marked as returned.");
  }

  return (
    <div className="page">
      <div className="page-heading page-heading-actions">
        <div><h1>Borrowing</h1><p>Manage equipment check-outs, due dates, and returns.</p></div>
        <Button onClick={() => setOpen(true)}><Plus size={18} /> New Borrowing</Button>
      </div>

      <div className="toolbar">
        <div className="search-box compact"><Search size={18} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search borrowings..." /></div>
      </div>

      <div className="table-card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>EQUIPMENT</th><th>BORROWER</th><th>QTY</th><th>BORROWED</th><th>DUE DATE</th><th>STATUS</th><th>ACTION</th></tr></thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.equipment}</strong></td>
                  <td>{item.borrower}</td>
                  <td>{item.quantity}</td>
                  <td>{item.borrowedDate}</td>
                  <td>{item.dueDate}</td>
                  <td><Badge>{item.status}</Badge></td>
                  <td>{item.status !== "Returned" && <button className="edit-link" onClick={() => returnItem(item.id)}>Mark returned</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">Showing {filtered.length} borrowing records</div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New Borrowing" footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => { setOpen(false); showToast("Borrowing record created."); }}>Create Record</Button></>}>
        <div className="empty-modal">
          <ClipboardList size={42} />
          <h3>Borrowing form</h3>
          <p>Select an equipment item and borrower to create a check-out record.</p>
          <div className="form-grid">
            <label className="field full"><span className="field-label">Equipment</span><select className="input"><option>Olympus Compound Microscope</option><option>Digital Multimeter</option><option>Glass Beaker Set (250 mL)</option></select></label>
            <label className="field"><span className="field-label">Borrower</span><select className="input"><option>Maria Santos</option><option>John Reyes</option><option>Angela Cruz</option></select></label>
            <label className="field"><span className="field-label">Quantity</span><input className="input" type="number" min="1" defaultValue="1" /></label>
            <label className="field full"><span className="field-label">Due date</span><input className="input" type="date" /></label>
          </div>
        </div>
      </Modal>
    </div>
  );
}