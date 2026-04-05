import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Shield } from "lucide-react";

export default function RoleModal({ open, setOpen, setSelectedRole }) {
  const roles = [
    {
      title: "Student",
      icon: GraduationCap,
      desc: "Browse drives, apply to companies, and track your applications.",
      features: ["Apply to drives", "Resume builder", "Interview tracker"],
      role: "student",
      gradient: "from-indigo-500/20 to-purple-500/10",
    },
    {
      title: "Admin / TPO",
      icon: Shield,
      desc: "Manage drives, recruiters, and monitor placement analytics.",
      features: ["Manage drives", "Recruiter portal", "Analytics"],
      role: "admin",
      gradient: "from-yellow-400/20 to-amber-500/10",
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-xl bg-[#0b1a2f] border border-white/10 rounded-2xl p-6 relative"
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-white/50 hover:text-white"
            >
              ✕
            </button>

            {/* Heading */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Select Role</h2>
              <p className="text-white/60 text-sm">
                Choose how you want to continue
              </p>
            </div>

            {/* Roles */}
            <div className="flex flex-col gap-4">
              {roles.map((role, i) => {
                const Icon = role.icon;

                return (
                  <div
                    key={i}
                    onClick={() => {
                      setSelectedRole(role.role); // 🔥 pass role
                      setOpen(false); // close role modal
                    }}
                    className={`cursor-pointer p-5 rounded-xl bg-gradient-to-br ${role.gradient} border border-white/10 hover:border-yellow-400/40 transition`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10">
                        <Icon className="text-yellow-400" />
                      </div>

                      <div>
                        <h3 className="font-semibold">{role.title}</h3>
                        <p className="text-xs text-white/60">{role.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}