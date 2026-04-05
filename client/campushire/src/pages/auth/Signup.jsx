import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { signupUser } from "../../api/auth";
import { motion } from "framer-motion";

export default function Signup() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const roleFromURL = params.get("role") || "student";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    secretKey: "", // only for admin
  });

  const [role, setRole] = useState(roleFromURL);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRole(roleFromURL);
  }, [roleFromURL]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role,
      };

      if (role === "admin") {
        payload.secretKey = form.secretKey;
      }

      const { data } = await signupUser(payload);

      // store user
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      navigate(role === "admin" ? "/admin/dashboard" : "/student/dashboard");

    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1a2f] px-4">

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-lg"
      >

        {/* Heading */}
        <h2 className="text-2xl font-bold text-center mb-6">
          Create your{" "}
          <span className="text-yellow-400">
            {role === "admin" ? "Admin" : "Student"}
          </span>{" "}
          account
        </h2>

        {/* Toggle Role */}
        <div className="flex mb-6 bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setRole("student")}
            className={`flex-1 py-2 rounded-md text-sm ${
              role === "student"
                ? "bg-yellow-400 text-[#0b1a2f]"
                : "text-white/70"
            }`}
          >
            Student
          </button>

          <button
            onClick={() => setRole("admin")}
            className={`flex-1 py-2 rounded-md text-sm ${
              role === "admin"
                ? "bg-yellow-400 text-[#0b1a2f]"
                : "text-white/70"
            }`}
          >
            Admin
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <input
            type="text"
            name="name"
            required
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            required
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
          />

          {/* Admin Secret Key */}
          {role === "admin" && (
            <input
              type="password"
              name="secretKey"
              required
              placeholder="Admin Secret Key"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-yellow-400/30 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
            />
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-[#0b1a2f] py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

        </form>

        {/* Footer */}
        <p className="text-center text-sm text-white/60 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-yellow-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </motion.div>
    </div>
  );
}