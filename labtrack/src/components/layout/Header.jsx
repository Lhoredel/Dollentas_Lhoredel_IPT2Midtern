import { Bell, ChevronDown, FlaskConical } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-title">
        <FlaskConical size={19} />
        <span>Science Laboratory</span>
      </div>
      <div className="topbar-actions">
        <button className="icon-button notification" title="Notifications">
          <Bell size={19} />
          <span className="notification-dot" />
        </button>
        <div className="profile">
          <div className="avatar">{user?.name?.charAt(0) || "A"}</div>
          <div className="profile-info">
            <strong>{user?.name || "Administrator"}</strong>
            <span>{user?.role || "Administrator"}</span>
          </div>
          <ChevronDown size={16} />
        </div>
      </div>
    </header>
  );
}