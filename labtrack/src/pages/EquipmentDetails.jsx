import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Beaker, MapPin, Hash, Package, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import Badge from "../components/common/Badge";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { equipmentService } from "../services/equipmentService";
import { formatDate } from "../utils/helpers";

export default function EquipmentDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    equipmentService.getById(id).then(setItem);
  }, [id]);

  if (!item) {
    return <div className="feedback-card"><h3>Equipment not found</h3><Link to="/equipment">Back to Equipment</Link></div>;
  }

  return (
    <div className="page">
      <Link className="back-link" to="/equipment"><ArrowLeft size={17} /> Back to Equipment</Link>
      <div className="detail-heading">
        <div className="detail-icon"><Beaker size={34} /></div>
        <div>
          <h1>{item.name}</h1>
          <p>{item.description}</p>
        </div>
        <Badge>{item.condition}</Badge>
      </div>
      <div className="detail-grid">
        <Card><div className="detail-item"><Hash /><span>Serial Number</span><strong>{item.serialNumber}</strong></div></Card>
        <Card><div className="detail-item"><Package /><span>Quantity</span><strong>{item.quantity}</strong></div></Card>
        <Card><div className="detail-item"><MapPin /><span>Location</span><strong>{item.location}</strong></div></Card>
        <Card><div className="detail-item"><Wrench /><span>Last Maintenance</span><strong>{formatDate(item.lastMaintenance)}</strong></div></Card>
      </div>
      <Button onClick={() => window.print()}>Print Details</Button>
    </div>
  );
}