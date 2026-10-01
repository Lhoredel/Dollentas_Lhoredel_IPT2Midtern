import { History, Search } from "lucide-react";
import { auditLogs } from "../data/mockData";
import { useState } from "react";

export default function AuditLogs() {
  const [search, setSearch] = useState("");
  const filtered = auditLogs.filter((log) => `${log.action} ${log.user} ${log.details}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page">
      <div className="page-heading">
        <div><h1>Audit Logs</h1><p>Review important actions performed in LabTrack.</p></div>
      </div>
      <div className="toolbar">
        <div className="search-box compact"><Search size={18} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search audit logs..." /></div>
      </div>
      <div className="table-card">
        <div className="table-wrap"><table>
          <thead><tr><th>ACTION</th><th>USER</th><th>DETAILS</th><th>DATE</th></tr></thead>
          <tbody>{filtered.map((log) => <tr key={log.id}><td><span className="audit-action"><History size={15} />{log.action}</span></td><td>{log.user}</td><td>{log.details}</td><td className="muted">{log.date}</td></tr>)}</tbody>
        </table></div>
        <div className="table-footer">Showing {filtered.length} audit records</div>
      </div>
    </div>
  );
}