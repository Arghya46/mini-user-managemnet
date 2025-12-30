import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminDashboard() {
  const [data, setData] = useState({ users: [], page: 1, pages: 1 });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const load = async (page = 1) => { 
    setLoading(true); 
    try { 
        const token = localStorage.getItem("token"); 
        const res = await api.get(`/users/admin?page=${page}`, { 
            headers: { Authorization: `Bearer ${token}` } 
        }); 
        setData(res.data);
     } catch (err) { 
        console.error("Failed to load users:", err); 
        setToast(err.response?.data?.error || "Failed to load users"); 
    } finally { 
        setLoading(false); 
    } 
 };

  useEffect(() => {
    load(1);
  }, []); 

  const confirmAnd = async (id, action) => {
    if (!window.confirm(`Are you sure to ${action} this user?`)) return;
    const endpoint =
      action === "activate"
        ? `/users/admin/${id}/activate`
        : `/users/admin/${id}/deactivate`;
    try {
      await api.patch(endpoint);
      setToast(`User ${action}d`);
      load(data.page);
    } catch (err) {
      setToast(err.response?.data?.error || "Action failed");
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {toast && <div className="toast">{toast}</div>}
      {loading ? (
        <div className="spinner">Loading...</div>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Full name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((u) => (
                <tr key={u._id}>
                  <td>{u.email}</td>
                  <td>{u.fullName}</td>
                  <td>{u.role}</td>
                  <td>{u.status}</td>
                  <td>
                    <button onClick={() => confirmAnd(u._id, "activate")}>Activate</button>
                    <button onClick={() => confirmAnd(u._id, "deactivate")}>Deactivate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button disabled={data.page <= 1} onClick={() => load(data.page - 1)}>
              Prev
            </button>
            <span>
              {data.page} / {data.pages}
            </span>
            <button disabled={data.page >= data.pages} onClick={() => load(data.page + 1)}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
