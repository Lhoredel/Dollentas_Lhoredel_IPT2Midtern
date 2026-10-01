import { UserPlus, Search } from "lucide-react";
import { users } from "../data/mockData";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import { useToast } from "../context/ToastContext";
import { useState } from "react";

export default function Users() {
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const filtered = users.filter((user) => `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page">
      <div className="page-heading page-heading-actions">
        <div><h1>Users</h1><p>Manage laboratory system users and access roles.</p></div>
        <Button onClick={() => showToast("User creation form opened.")}><UserPlus size={18} /> Add User</Button>
      </div>
      <div className="toolbar">
        <div className="search-box compact"><Search size={18} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." /></div>
      </div>
      <div className="table-card">
        <div className="table-wrap"><table>
          <thead><tr><th>NAME</th><th>EMAIL</th><th>ROLE</th><th>STATUS</th></tr></thead>
          <tbody>{filtered.map((user) => <tr key={user.id}><td><strong>{user.name}</strong></td><td>{user.email}</td><td>{user.role}</td><td><Badge>{user.status}</Badge></td></tr>)}</tbody>
        </table></div>
        <div className="table-footer">Showing {filtered.length} users</div>
      </div>
    </div>
  );
}