import { Download, FileBarChart, Package, Wrench, ClipboardList } from "lucide-react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { equipment, borrowings, maintenance } from "../data/mockData";
import { useToast } from "../context/ToastContext";

export default function Reports() {
  const { showToast } = useToast();
  const reports = [
    { title: "Equipment Inventory Report", description: "Complete list of laboratory equipment and quantities.", icon: Package },
    { title: "Borrowing Report", description: "Current, returned, and overdue equipment records.", icon: ClipboardList },
    { title: "Maintenance Report", description: "Repairs, inspections, and maintenance history.", icon: Wrench },
  ];

  function exportReport(title) {
    const rows = title.includes("Equipment") ? equipment : title.includes("Borrowing") ? borrowings : maintenance;
    const csv = Object.keys(rows[0]).join(",") + "\n" + rows.map((row) => Object.values(row).map((v) => `"${String(v).replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${title.toLowerCase().replaceAll(" ", "-")}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    showToast("Report exported.");
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div><h1>Reports</h1><p>Generate and export laboratory inventory reports.</p></div>
      </div>
      <div className="reports-grid">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.title}>
              <div className="report-icon"><Icon size={23} /></div>
              <h3>{report.title}</h3>
              <p>{report.description}</p>
              <Button variant="secondary" onClick={() => exportReport(report.title)}><Download size={17} /> Export CSV</Button>
            </Card>
          );
        })}
      </div>
      <Card className="report-summary">
        <div className="card-heading"><div><h2>Inventory Summary</h2><p>Current laboratory overview</p></div><FileBarChart size={24} /></div>
        <div className="summary-grid">
          <div><strong>{equipment.length}</strong><span>Equipment types</span></div>
          <div><strong>{equipment.reduce((s, x) => s + x.quantity, 0)}</strong><span>Total units</span></div>
          <div><strong>{borrowings.length}</strong><span>Borrowings</span></div>
          <div><strong>{maintenance.length}</strong><span>Maintenance tasks</span></div>
        </div>
      </Card>
    </div>
  );
}