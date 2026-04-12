import { useState, useEffect } from "react";
import { loginUser } from "../../api/auth";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function LoginModal({
  open,
  setOpen,
  setSignupOpen,
}) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!open) {
      setForm({ email: "", password: "" });
      setErrors({});
      setLoading(false);
    }
  }, [open]);

  const validate = () => {
    let err = {};
    if (!/\S+@\S+\.\S+/.test(form.email))
      err.email = "Invalid email";
    if (form.password.length < 6)
      err.password = "Min 6 characters";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      const { data } = await loginUser({
        email: form.email.trim(),
        password: form.password,
      });

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      toast.success("Login successful");

      setOpen(false);

      navigate(
        data?.user?.role === "admin"
          ? "/admin/dashboard"
          : "/dashboard"
      );
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* BACKDROP */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md"></div>

          {/* MODAL */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-5xl rounded-3xl overflow-hidden 
            backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl flex"
          >

            {/* LEFT SIDE */}
            <motion.div
              initial={{ x: -80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="hidden md:flex md:w-1/2 relative items-center justify-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1523580494863-6f3031224c94')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* softer overlay */}
              <div className="absolute inset-0 bg-[#6B8C72]/60 backdrop-blur-md"></div>

              <div className="relative z-10 text-center px-6 text-[#F6F0D6]">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center 
                rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                  <GraduationCap size={28} className="text-[#F6F0D6]" />
                </div>

                <h3 className="text-2xl font-bold mb-2">
                  Welcome Back
                </h3>

                <p className="text-[#F6F0D6]/80 text-sm">
                  Access your dashboard and continue your journey
                </p>
              </div>
            </motion.div>

            {/* RIGHT SIDE */}
            <motion.div
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="w-full md:w-1/2 bg-[#F6F0D6]/95 backdrop-blur-xl p-8 relative"
            >
              {/* CLOSE */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-[#6B8C72]"
              >
                ✕
              </button>

              {/* HEADER */}
              <h2 className="text-3xl font-extrabold text-[#1E2E22] mb-6">
                Login
              </h2>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* EMAIL */}
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-[#6B8C72]/30 
                    bg-white text-[#1E2E22] placeholder-[#6B8C72]/60 focus:border-[#6B8C72] outline-none"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* PASSWORD */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-[#6B8C72]/30 
                    bg-white text-[#1E2E22] placeholder-[#6B8C72]/60"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#6B8C72]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>

                  {errors.password && (
                    <p className="text-xs text-red-500">{errors.password}</p>
                  )}
                </div>

                {/* BUTTON */}
                <button
                  disabled={loading}
                  className="w-full bg-[#6B8C72] text-white py-3 rounded-lg font-semibold 
                  hover:bg-[#3D5C45] transition disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              {/* SWITCH */}
              <p className="text-center text-sm mt-6 text-[#3D5C45]">
                Don’t have an account?{" "}
                <span
                  onClick={() => {
                    setOpen(false);
                    setSignupOpen(true);
                  }}
                  className="text-[#6B8C72] font-semibold cursor-pointer"
                >
                  Sign Up
                </span>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}