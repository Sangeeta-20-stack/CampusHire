import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Shield, Check } from "lucide-react";
import { useState, useEffect } from "react";

export default function RoleModal({ open, setOpen, setSelectedRole }) {
  const roles = [
    {
      title: "Student",
      icon: GraduationCap,
      desc: "Browse drives, apply to companies, and track your applications.",
      role: "student",
      gradient: "from-[#6B8C72]/20 to-[#3D5C45]/10",
    },
    {
      title: "Admin / TPO",
      icon: Shield,
      desc: "Manage drives, recruiters, and monitor placement analytics.",
      role: "admin",
      gradient: "from-[#3D5C45]/20 to-[#6B8C72]/10",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (!open) return;

      if (e.key === "ArrowDown") {
        setActiveIndex((prev) => (prev + 1) % roles.length);
      }
      if (e.key === "ArrowUp") {
        setActiveIndex((prev) =>
          prev === 0 ? roles.length - 1 : prev - 1
        );
      }
      if (e.key === "Enter") {
        handleSelect(activeIndex);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, activeIndex]);

  const handleSelect = (index) => {
    setSelectedIndex(index);
    setTimeout(() => {
      setSelectedRole(roles[index].role);
      setOpen(false);
    }, 400);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-xl bg-[#F6F0D6] border border-[#6B8C72]/30 rounded-2xl p-6 relative shadow-lg font-sora"
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-[#3D5C45] hover:text-[#1E2E22]"
            >
              ✕
            </button>

            {/* Heading */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-extrabold text-[#1E2E22]">
                Select Role
              </h2>
              <p className="text-[#3D5C45] text-sm">
                Use ↑ ↓ keys and Enter to select
              </p>
            </div>

            {/* Roles */}
            <div className="flex flex-col gap-4">
              {roles.map((role, i) => {
                const Icon = role.icon;
                const isActive = i === activeIndex;
                const isSelected = i === selectedIndex;

                return (
                  <div
                    key={i}
                    onClick={() => handleSelect(i)}
                    className={`group cursor-pointer p-5 rounded-xl relative overflow-hidden
                    bg-gradient-to-br ${role.gradient}
                    border transition-all duration-300
                    ${
                      isActive
                        ? "border-[#6B8C72] shadow-md"
                        : "border-[#6B8C72]/30"
                    }
                    hover:border-[#6B8C72] hover:-translate-y-1`}
                  >
                    {/* Left Accent */}
                    <div className={`absolute left-0 top-0 h-full w-1 bg-[#6B8C72] 
                    transition-transform duration-300 origin-top
                    ${isActive ? "scale-y-100" : "scale-y-0"}`}></div>

                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 flex items-center justify-center rounded-full 
                      bg-gradient-to-br from-[#6B8C72] to-[#3D5C45] text-white 
                      transition-all duration-300
                      ${isActive ? "scale-110 rotate-12" : ""}`}>
                        <Icon size={20} />
                      </div>

                      {/* Text */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#1E2E22]">
                          {role.title}
                        </h3>
                        <p className="text-xs text-[#3D5C45]">
                          {role.desc}
                        </p>
                      </div>

                      {/* Checkmark */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0 }}
                            className="text-[#6B8C72]"
                          >
                            <Check size={22} />
                          </motion.div>
                        )}
                      </AnimatePresence>
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