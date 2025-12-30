import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ fullName: "", email: "" });
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "" });
  const [toast, setToast] = useState("");

  useEffect(() => {
    api.get("/users/me").then((res) => {
      setUser(res.data.user);
      setForm({ fullName: res.data.user.fullName, email: res.data.user.email });
    });
  }, []);

  const saveProfile = async () => {
    try {
      const res = await api.put("/users/me", form);
      setToast(res.data.message);
    } catch (err) {
      setToast(err.response?.data?.error || "Update failed");
    }
  };

  const changePassword = async () => {
    try {
      const res = await api.patch("/users/me/change-password", pw);
      setToast(res.data.message);
      setPw({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setToast(err.response?.data?.error || "Password change failed");
    }
  };

  if (!user) return null;

  return (
    <div>
      <h1>My Profile</h1>
      {toast && <div className="toast">{toast}</div>}
      <section>
        <h2>Details</h2>
        <input
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <button onClick={saveProfile}>Save</button>
        <button onClick={() => setForm({ fullName: user.fullName, email: user.email })}>
          Cancel
        </button>
      </section>
      <section>
        <h2>Change Password</h2>
        <input
          type="password"
          placeholder="Current password"
          value={pw.currentPassword}
          onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })}
        />
        <input
          type="password"
          placeholder="New password"
          value={pw.newPassword}
          onChange={(e) => setPw({ ...pw, newPassword: e.target.value })}
        />
        <button onClick={changePassword}>Change password</button>
      </section>
    </div>
  );
}
