import { useState, useEffect } from "react";
import { signupUser } from "../../api/auth";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Shield } from "lucide-react";
import toast from "react-hot-toast";

export default function SignupModal({
  open,
  setOpen,
  role,
  setLoginOpen,
}) {
  const [currentRole, setCurrentRole] = useState(role || "student");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    secretKey: "",
  });

  useEffect(() => {
    if (role) setCurrentRole(role);
  }, [role]);

  useEffect(() => {
    if (!open) {
      setForm({
        name: "",
        email: "",
        password: "",
        secretKey: "",
      });
      setLoading(false);
    }
  }, [open]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (form.name.trim().length < 3) {
      toast.error("Name must be at least 3 characters");
      return;
    }

    if (!form.email || !form.password) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: currentRole,
      };

      // IMPORTANT FIX: backend expects adminSecret
      if (currentRole === "admin") {
        payload.adminSecret = form.secretKey;
      }

      const promise = signupUser(payload);

      toast.promise(promise, {
        loading: "Creating account...",
        success: "Account created successfully 🎉",
        error: (err) =>
          err?.response?.data?.message || "Signup failed",
      });

      const { data } = await promise;

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const Icon = currentRole === "admin" ? Shield : GraduationCap;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
          >
            {/* LEFT */}
            <div className="relative md:w-1/2 h-56 md:h-auto flex items-center justify-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-[#0b1a2f]/85"></div>

              <div className="relative z-10 text-center px-6 text-white">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-white/10 border border-white/20">
                  <Icon className="text-yellow-400" size={30} />
                </div>

                <h3 className="text-2xl font-bold mb-2">
                  {currentRole === "admin" ? "Admin Portal" : "Student Portal"}
                </h3>

                <p className="text-white/70 text-sm">
                  {currentRole === "admin"
                    ? "Manage drives, recruiters & analytics"
                    : "Apply, track and build your career"}
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="md:w-1/2 bg-white text-gray-800 p-6 sm:p-8 md:p-10 relative">

              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold mb-6">
                Create account
              </h2>

              {/* ROLE SWITCH */}
              <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                {["student", "admin"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setCurrentRole(r)}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                      currentRole === r
                        ? "bg-yellow-400 text-[#0b1a2f]"
                        : "text-gray-500"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-4">

                <input
                  name="name"
                  value={form.name}
                  placeholder="Full Name"
                  required
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border"
                />

                <input
                  name="email"
                  value={form.email}
                  type="email"
                  placeholder="Email"
                  required
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border"
                />

                <input
                  name="password"
                  value={form.password}
                  type="password"
                  placeholder="Password"
                  required
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border"
                />

                {currentRole === "admin" && (
                  <input
                    name="secretKey"
                    value={form.secretKey}
                    type="password"
                    placeholder="Admin Secret Key"
                    required
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-yellow-400"
                  />
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-400 text-[#0b1a2f] py-3 rounded-lg font-semibold"
                >
                  {loading ? "Creating..." : "Sign Up"}
                </button>
              </form>

              {/* LOGIN SWITCH */}
              <p className="text-sm text-gray-500 mt-6 text-center">
                Already have an account?{" "}
                <span
                  onClick={() => {
                    setOpen(false);
                    setLoginOpen(true);
                  }}
                  className="text-yellow-500 font-medium cursor-pointer"
                >
                  Login
                </span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}