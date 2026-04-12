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
      className="relative bg-[#F6F0D6] text-[#1E2E22] py-16 sm:py-20 md:py-24 px-4 sm:px-6 overflow-hidden font-sora"
    >
      {/* Soft Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(107,140,114,0.15),transparent_60%)]"></div>

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
          className="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-4 tracking-tight"
        >
          Everything <span className="text-[#6B8C72]">placement</span> needs
        </motion.h2>

        <motion.p
          variants={fadeUp}
          custom={1}
          className="text-[#3D5C45] text-sm sm:text-base md:text-lg"
        >
          From posting drives to tracking offers, CampusHire handles the entire cycle so your team spends less time on coordination and more on students.
        </motion.p>
      </motion.div>

      {/* Cards */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {features.map((item, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}

            onMouseMove={(e) => {
              if (window.innerWidth < 768) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const rotateX = (y / rect.height - 0.5) * 5;
              const rotateY = (x / rect.width - 0.5) * -5;
              e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.02)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)";
            }}

            className="group relative rounded-xl sm:rounded-2xl p-5 sm:p-6 
            bg-white border border-[#6B8C72]/30 
            hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]
            transition-all duration-300 will-change-transform overflow-hidden
            hover:-translate-y-2"
          >
            {/* Left Border Accent */}
            <div className="absolute left-0 top-0 h-full w-1 bg-[#6B8C72] scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300"></div>

            {/* Icon (Circle + Gradient + Rotation) */}
            <div className="mb-4 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center 
            rounded-full bg-gradient-to-br from-[#6B8C72] to-[#3D5C45] text-white 
            shadow-md transition-all duration-300 
            group-hover:scale-110 group-hover:rotate-12">
              <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg font-semibold mb-2 group-hover:text-[#6B8C72] transition">
              {item.title}
            </h3>

            {/* Desc */}
            <p className="text-[#3D5C45] text-xs sm:text-sm leading-relaxed">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}