import { Wrench, Plus } from "lucide-react";
import { maintenance } from "../data/mockData";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import { useToast } from "../context/ToastContext";

export default function Maintenance() {
  const { showToast } = useToast();
  return (
    <div className="page">
      <div className="page-heading page-heading-actions">
        <div><h1>Maintenance</h1><p>Track repairs, inspections, and preventive maintenance.</p></div>
        <Button onClick={() => showToast("Maintenance task created.")}><Plus size={18} /> Schedule Maintenance</Button>
      </div>
      <div className="maintenance-grid">
        {maintenance.map((item) => (
          <Card key={item.id}>
            <div className="maintenance-card-top">
              <div className="maintenance-icon"><Wrench size={20} /></div>
              <Badge>{item.status}</Badge>
            </div>
            <h3>{item.equipment}</h3>
            <p>{item.issue}</p>
            <div className="maintenance-meta"><span>Technician</span><strong>{item.technician}</strong></div>
            <div className="maintenance-meta"><span>Date</span><strong>{item.date}</strong></div>
          </Card>
        ))}
      </div>
    </div>
  );
}