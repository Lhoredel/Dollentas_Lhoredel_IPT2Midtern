import { NavLink } from "react-router-dom";
import {
  Beaker,
  Boxes,
  ClipboardList,
  FileBarChart,
  History,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/equipment", label: "Equipment", icon: Beaker },
  { to: "/borrowing", label: "Borrowing", icon: ClipboardList },
  { to: "/maintenance", label: "Maintenance", icon: Wrench },
  { to: "/users", label: "Users", icon: Users },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/audit-logs", label: "Audit Logs", icon: History },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon"><Beaker size={21} /></div>
        <div>
          <strong>LabTrack</strong>
          <small>Laboratory Inventory</small>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-label">MAIN MENU</div>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="security-card">
          <ShieldCheck size={18} />
          <div>
            <strong>System secure</strong>
            <span>All data is protected</span>
          </div>
        </div>
      </div>
    </aside>
  );
}