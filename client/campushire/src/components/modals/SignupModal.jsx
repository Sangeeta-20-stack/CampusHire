import { useState, useEffect } from "react";
import { signupUser } from "../../api/auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function SignupModal({
  open,
  setOpen,
  role,
  setLoginOpen,
}) {
  const [currentRole, setCurrentRole] = useState(role || "student");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    secretKey: "",
  });

  useEffect(() => {
    if (role) setCurrentRole(role);
  }, [role]);

  const validate = () => {
    let err = {};
    if (form.name.trim().length < 3) err.name = "Minimum 3 characters";
    if (!/\S+@\S+\.\S+/.test(form.email)) err.email = "Invalid email";
    if (form.password.length < 6) err.password = "Min 6 characters";
    if (currentRole === "admin" && !form.secretKey)
      err.secretKey = "Required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const strength = () => {
    const p = form.password;
    if (p.length > 10 && /\d/.test(p)) return "strong";
    if (p.length >= 6) return "medium";
    return "weak";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await signupUser({ ...form, role: currentRole });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setOpen(false);
      }, 2000);
    } catch {
      toast.error("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const Icon = currentRole === "admin" ? Shield : GraduationCap;

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">

          <div className="w-full max-w-5xl flex rounded-3xl overflow-hidden">

            {/* LEFT SIDE (FIXED) */}
            <div
              className="hidden md:flex md:w-1/2 relative items-center justify-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* overlay */}
             <div className="absolute inset-0 bg-[#6B8C72]/60 backdrop-blur-md"></div>

              {/* content */}
             <div className="relative z-10 text-center px-6 text-[#F6F0D6]">
               <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center 
rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
  <Icon size={30} className="text-[#F6F0D6]" />
</div>

                <h3 className="text-2xl font-bold mb-2">
                  {currentRole === "admin" ? "Admin Portal" : "Student Portal"}
                </h3>

                <p className="text-white/80 text-sm">
                  {currentRole === "admin"
                    ? "Manage drives & analytics"
                    : "Apply and track your career"}
                </p>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="w-full md:w-1/2 bg-[#F6F0D6] p-8 relative">

              {/* SUCCESS */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-[#F6F0D6] z-20"
                  >
                    <CheckCircle className="text-[#6B8C72]" size={50} />
                    <p className="mt-2 font-semibold text-[#1E2E22]">
                      Account Created!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* HEADER */}
              <div className="mb-6">
                <h2 className="text-3xl font-extrabold text-[#1E2E22]">
                  Create account
                </h2>
                <p className="text-[#3D5C45] text-sm mt-1">
                  Start your journey with CampusHire
                </p>
              </div>

              {/* ROLE SWITCH */}
              <div className="flex bg-white rounded-lg p-1 mb-6 shadow-sm">
                {["student", "admin"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setCurrentRole(r)}
                    className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${
                      currentRole === r
                        ? "bg-[#6B8C72] text-white"
                        : "text-[#3D5C45]"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* NAME */}
                <div>
                  <input
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-[#6B8C72]/30 
                    bg-white text-[#1E2E22] placeholder-[#6B8C72]/60 focus:border-[#6B8C72] outline-none"
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                {/* EMAIL */}
                <div>
                  <input
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-[#6B8C72]/30 
                    bg-white text-[#1E2E22] placeholder-[#6B8C72]/60 focus:border-[#6B8C72] outline-none"
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
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
                    bg-white text-[#1E2E22] placeholder-[#6B8C72]/60 focus:border-[#6B8C72] outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#6B8C72]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>

                  {/* strength */}
                  <div className="h-1 mt-2 bg-gray-200 rounded">
                    <div
                      className={`h-1 ${
                        strength() === "strong"
                          ? "bg-green-500 w-full"
                          : strength() === "medium"
                          ? "bg-yellow-400 w-2/3"
                          : "bg-red-400 w-1/3"
                      }`}
                    />
                  </div>

                  {errors.password && (
                    <p className="text-xs text-red-500">{errors.password}</p>
                  )}
                </div>

                {/* ADMIN KEY */}
                {currentRole === "admin" && (
                  <div>
                    <input
                      placeholder="Admin Secret Key"
                      value={form.secretKey}
                      onChange={(e) =>
                        setForm({ ...form, secretKey: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-[#6B8C72]/30 
                      bg-white text-[#1E2E22] placeholder-[#6B8C72]/60"
                    />
                    {errors.secretKey && (
                      <p className="text-xs text-red-500">{errors.secretKey}</p>
                    )}
                  </div>
                )}

                {/* BUTTON */}
                <button className="w-full bg-[#6B8C72] text-white py-3 rounded-lg font-semibold hover:bg-[#3D5C45] transition">
                  {loading ? "Creating..." : "Sign Up"}
                </button>
              </form>

              {/* LOGIN */}
              <p className="text-sm text-center mt-6 text-[#3D5C45]">
                Already have an account?{" "}
                <span
                  onClick={() => {
                    setOpen(false);
                    setLoginOpen(true);
                  }}
                  className="text-[#6B8C72] font-semibold cursor-pointer"
                >
                  Login
                </span>
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}