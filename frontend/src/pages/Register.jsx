import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", college: "", targetRole: "Software Engineer" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-amber flex items-center justify-center mb-3">
            <GraduationCap className="text-base" size={26} />
          </div>
          <h1 className="font-display text-2xl font-bold">Start your prep</h1>
          <p className="text-sm text-ink-faint mt-1">Track aptitude, coding & interviews in one place</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          {error && (
            <div className="rounded-lg border border-coral/40 bg-coral/10 px-3 py-2 text-sm text-coral">
              {error}
            </div>
          )}
          <div>
            <label className="label-eyebrow">Full name</label>
            <input required className="input-field mt-1.5" placeholder="Ananya Sharma"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label-eyebrow">Email</label>
            <input type="email" required className="input-field mt-1.5" placeholder="you@college.edu"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label-eyebrow">Password</label>
            <input type="password" required minLength={6} className="input-field mt-1.5" placeholder="At least 6 characters"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div>
            <label className="label-eyebrow">College</label>
            <input className="input-field mt-1.5" placeholder="Your college name"
              value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-ink-faint mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-amber font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
