import {
  ClipboardList,
  Target,
  BarChart3,
  FileText,
  Handshake,
  Bell,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: ClipboardList, title: "Drive management", desc: "Create and schedule placement drives, set eligibility criteria, and notify students in one click." },
  { icon: Target, title: "Smart matching", desc: "AI-powered student-to-role matching based on skills, CGPA, and preferences — no manual filtering." },
  { icon: BarChart3, title: "Analytics dashboard", desc: "Track placement rates, branch-wise performance, and recruiter activity in real time." },
  { icon: FileText, title: "Resume builder", desc: "Students build verified, ATS-friendly resumes directly on the platform using structured templates." },
  { icon: Handshake, title: "Recruiter portal", desc: "Companies post jobs, review shortlisted candidates, schedule interviews, and share offer letters." },
  { icon: Bell, title: "Notifications & alerts", desc: "Automated reminders for deadlines, interview slots, and offer acceptances via email and SMS." },
];

// 🔥 Animation
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.45,
      ease: "easeOut",
    },
  }),
};

export default function About() {
  return (
    <section
      id="about"
      className="relative bg-[#0b1a2f] text-white py-16 sm:py-20 md:py-24 px-4 sm:px-6 overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-glow opacity-30"></div>

      {/* Heading */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 text-center max-w-3xl mx-auto mb-12 sm:mb-16"
      >
        <motion.h2
          variants={fadeUp}
          custom={0}
          className="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-4 leading-tight"
        >
          Everything <span className="text-yellow-400">placement</span> needs
        </motion.h2>

        <motion.p
          variants={fadeUp}
          custom={1}
          className="text-white/80 text-sm sm:text-base md:text-lg"
        >
          From posting drives to tracking offers, CampusHire handles the entire cycle so your team spends less time on coordination and more on students.
        </motion.p>
      </motion.div>

      {/* Cards */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
        {features.map((item, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}

            // 🎯 Tilt only on desktop
            onMouseMove={(e) => {
              if (window.innerWidth < 768) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const rotateX = (y / rect.height - 0.5) * 6;
              const rotateY = (x / rect.width - 0.5) * -6;
              e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
            }}

            className="group relative rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 
            bg-white/5 border border-white/10 backdrop-blur-xl 
            hover:border-yellow-400/40 hover:shadow-[0_0_25px_rgba(250,204,21,0.18)] 
            transition-all duration-300 will-change-transform"
          >
            {/* Glow Layer */}
            <div
              className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 
              bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 transition duration-500"
            ></div>

            {/* Icon */}
            <div className="mb-3 sm:mb-4 text-yellow-400">
              <item.icon size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8" />
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 group-hover:text-yellow-400 transition">
              {item.title}
            </h3>

            {/* Desc */}
            <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}