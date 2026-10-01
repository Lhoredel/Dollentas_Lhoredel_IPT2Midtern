import { useState } from "react";
import { Bell, Database, Save, Shield } from "lucide-react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { useToast } from "../context/ToastContext";
import { equipmentService } from "../services/equipmentService";

export default function Settings() {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);

  return (
    <div className="page">
      <div className="page-heading">
        <div><h1>Settings</h1><p>Configure LabTrack preferences and system options.</p></div>
      </div>

      <div className="settings-grid">
        <Card>
          <div className="settings-title"><Bell size={20} /><div><h2>Notifications</h2><p>Choose which alerts you want to receive.</p></div></div>
          <label className="switch-row"><span><strong>System notifications</strong><small>Show success and warning messages.</small></span><input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} /></label>
          <label className="switch-row"><span><strong>Overdue reminders</strong><small>Notify administrators about overdue items.</small></span><input type="checkbox" defaultChecked /></label>
        </Card>

        <Card>
          <div className="settings-title"><Database size={20} /><div><h2>Data Management</h2><p>Local development data preferences.</p></div></div>
          <label className="switch-row"><span><strong>Automatic backup</strong><small>Keep browser data persisted between sessions.</small></span><input type="checkbox" checked={autoBackup} onChange={(e) => setAutoBackup(e.target.checked)} /></label>
          <Button variant="secondary" onClick={() => { equipmentService.reset(); showToast("Equipment demo data restored."); }}><Database size={17} /> Restore Demo Data</Button>
        </Card>

        <Card>
          <div className="settings-title"><Shield size={20} /><div><h2>Security</h2><p>Account and access configuration.</p></div></div>
          <div className="security-status"><span className="status-check">✓</span><div><strong>Authentication enabled</strong><small>Admin access is protected by login.</small></div></div>
          <Button onClick={() => showToast("Security settings saved.")}><Save size={17} /> Save Settings</Button>
        </Card>
      </div>
    </div>
  );
}