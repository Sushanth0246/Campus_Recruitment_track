import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Topbar from "../components/Topbar";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    college: user?.college || "",
    branch: user?.branch || "",
    graduationYear: user?.graduationYear || "",
    targetRole: user?.targetRole || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const { data } = await api.put("/auth/me", form);
      updateUser(data.user);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Topbar title="Profile" subtitle="Keep your details up to date for the leaderboard" />

      <form onSubmit={handleSubmit} className="card p-6 max-w-xl space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="h-14 w-14 rounded-full flex items-center justify-center text-xl font-display font-bold text-base"
            style={{ backgroundColor: user?.avatarColor }}
          >
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-medium">{user?.email}</p>
            <p className="text-xs text-ink-faint">Your email can't be changed</p>
          </div>
        </div>

        <div>
          <label className="label-eyebrow">Full name</label>
          <input className="input-field mt-1.5" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-eyebrow">College</label>
            <input className="input-field mt-1.5" value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} />
          </div>
          <div>
            <label className="label-eyebrow">Branch</label>
            <input className="input-field mt-1.5" value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-eyebrow">Graduation year</label>
            <input type="number" className="input-field mt-1.5" value={form.graduationYear} onChange={(e) => setForm({ ...form, graduationYear: e.target.value })} />
          </div>
          <div>
            <label className="label-eyebrow">Target role</label>
            <input className="input-field mt-1.5" value={form.targetRole} onChange={(e) => setForm({ ...form, targetRole: e.target.value })} />
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving..." : "Save changes"}
        </button>
        {saved && <span className="ml-3 text-sm text-teal">Saved.</span>}
      </form>
    </>
  );
}
