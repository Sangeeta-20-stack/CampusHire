import { useState, useEffect } from "react";
import { loginUser } from "../../api/auth";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function LoginModal({
  open,
  setOpen,
  setSignupOpen,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!open) {
      setForm({ email: "", password: "" });
      setLoading(false);
    }
  }, [open]);

  const handleChange = (e) =>
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const payload = {
        email: form.email.trim(),
        password: form.password,
      };

      // ✅ DEBUG 1: request payload
      console.log("LOGIN PAYLOAD:", payload);

      const { data } = await loginUser(payload);

      // ✅ DEBUG 2: full response
      console.log("LOGIN RESPONSE:", data);

      // store auth data
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      // ✅ DEBUG 3: stored user
      console.log("STORED USER:", data.user);

      toast.success("Login successful");

      setOpen(false);

      const userRole = data?.user?.role;

      console.log("USER ROLE:", userRole);

      navigate(
        userRole === "admin"
          ? "/admin/dashboard"
          : "/student/dashboard"
      );
    } catch (err) {
      // ✅ DEBUG 4: full backend error
      console.log("LOGIN ERROR STATUS:", err?.response?.status);
      console.log("LOGIN ERROR DATA:", err?.response?.data);
      console.log("FULL ERROR OBJECT:", err);

      toast.error(
        err?.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const Icon = GraduationCap;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4 py-6 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-5xl rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
          >
            {/* LEFT */}
            <div
              className="relative md:w-1/2 h-52 sm:h-64 md:h-auto flex items-center justify-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-[#0b1a2f]/85"></div>

              <div className="relative z-10 text-center px-6">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-white/10 border border-white/20">
                  <Icon className="text-yellow-400" size={28} />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">
                  Login
                </h3>

                <p className="text-white/70 text-sm">
                  Access your dashboard
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="md:w-1/2 bg-white text-gray-800 p-6 sm:p-8 md:p-10 relative">
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold mb-6">
                Welcome Back
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:border-yellow-400 outline-none"
                />

                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:border-yellow-400 outline-none"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-400 text-[#0b1a2f] py-3 rounded-lg font-semibold hover:bg-yellow-300 transition disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                Don’t have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setSignupOpen(true);
                  }}
                  className="text-yellow-500 font-semibold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}