import { Beaker, ClipboardCheck, TriangleAlert, Users, Wrench } from "lucide-react";
import { equipment, borrowings, maintenance } from "../data/mockData";
import StatCard from "../components/dashboard/StatCard";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import { ActivityChart, ConditionChart } from "../components/dashboard/Charts";
import { formatDate, todayLabel } from "../utils/helpers";

export default function Dashboard() {
  const totalItems = equipment.reduce((sum, item) => sum + item.quantity, 0);
  const needsRepair = equipment.filter((item) => item.condition === "Needs Repair").length;
  const overdue = borrowings.filter((item) => item.status === "Overdue").length;

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">{todayLabel()}</span>
          <h1>Dashboard</h1>
          <p>Overview of your science laboratory inventory and operations.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Equipment" value={totalItems} subtitle="Across all laboratory locations" icon={Beaker} trend="8.4%" />
        <StatCard title="Active Borrowings" value={borrowings.length} subtitle="Items currently checked out" icon={ClipboardCheck} trend="4.2%" />
        <StatCard title="Needs Repair" value={needsRepair} subtitle="Equipment requiring attention" icon={Wrench} trend="2.1%" trendUp={false} />
        <StatCard title="Overdue Items" value={overdue} subtitle="Borrowings past due date" icon={TriangleAlert} trend="1.8%" trendUp={false} />
      </div>

      <div className="dashboard-grid">
        <Card>
          <div className="card-heading">
            <div>
              <h2>Equipment Condition</h2>
              <p>Current inventory condition breakdown</p>
            </div>
          </div>
          <ConditionChart
            data={[
              { label: "Good", value: equipment.filter((x) => x.condition === "Good").length },
              { label: "Fair", value: equipment.filter((x) => x.condition === "Fair").length },
              { label: "Needs Repair", value: equipment.filter((x) => x.condition === "Needs Repair").length },
            ]}
          />
        </Card>

        <Card>
          <div className="card-heading">
            <div>
              <h2>Weekly Activity</h2>
              <p>Borrowing activity this week</p>
            </div>
          </div>
          <ActivityChart />
        </Card>
      </div>

      <div className="dashboard-grid lower">
        <Card>
          <div className="card-heading">
            <div>
              <h2>Recent Borrowings</h2>
              <p>Latest equipment activity</p>
            </div>
            <span className="card-link">{borrowings.length} records</span>
          </div>
          <div className="mini-list">
            {borrowings.map((item) => (
              <div className="mini-row" key={item.id}>
                <div className="mini-icon"><Beaker size={17} /></div>
                <div className="mini-main">
                  <strong>{item.equipment}</strong>
                  <span>{item.borrower} · {item.quantity} item(s)</span>
                </div>
                <div className="mini-meta">
                  <Badge>{item.status}</Badge>
                  <small>Due {formatDate(item.dueDate)}</small>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="card-heading">
            <div>
              <h2>Maintenance</h2>
              <p>Latest maintenance tasks</p>
            </div>
          </div>
          <div className="mini-list">
            {maintenance.map((item) => (
              <div className="mini-row" key={item.id}>
                <div className="mini-icon"><Wrench size={17} /></div>
                <div className="mini-main">
                  <strong>{item.equipment}</strong>
                  <span>{item.issue}</span>
                </div>
                <div className="mini-meta">
                  <Badge>{item.status}</Badge>
                  <small>{formatDate(item.date)}</small>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}