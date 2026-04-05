import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative bg-[#0b1a2f] text-white py-16 sm:py-20 md:py-24 px-4 sm:px-6 overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-glow opacity-30"></div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="relative z-10 max-w-4xl mx-auto rounded-2xl sm:rounded-3xl 
        p-6 sm:p-8 md:p-12 
        bg-white/5 border border-white/10 backdrop-blur-xl 
        shadow-[0_0_30px_rgba(250,204,21,0.08)] text-center group"
      >
        {/* Glow Hover */}
        <div
          className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 
          bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 transition duration-500"
        ></div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-4 sm:mb-6 leading-tight">
          Ready to transform your{" "}
          <span className="text-yellow-400">placement season?</span>
        </h2>

        <p className="text-white/70 text-sm sm:text-base mb-8 sm:mb-10 max-w-2xl mx-auto">
          Reach out to us directly — we’ll help you get started.
        </p>

        {/* Contact Info */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-6 md:gap-8">

          {/* Email */}
          <div
            className="flex items-center justify-center sm:justify-start gap-3 
            bg-white/5 px-4 sm:px-6 py-3 sm:py-4 rounded-xl border border-white/10 backdrop-blur-md 
            hover:border-yellow-400/40 hover:shadow-[0_0_15px_rgba(250,204,21,0.12)] transition w-full sm:w-auto"
          >
            <Mail className="text-yellow-400 shrink-0" size={20} />
            <span className="text-white/90 text-xs sm:text-sm md:text-base break-all">
              support@campushire.com
            </span>
          </div>

          {/* Phone */}
          <div
            className="flex items-center justify-center sm:justify-start gap-3 
            bg-white/5 px-4 sm:px-6 py-3 sm:py-4 rounded-xl border border-white/10 backdrop-blur-md 
            hover:border-yellow-400/40 hover:shadow-[0_0_15px_rgba(250,204,21,0.12)] transition w-full sm:w-auto"
          >
            <Phone className="text-yellow-400 shrink-0" size={20} />
            <span className="text-white/90 text-xs sm:text-sm md:text-base">
              +91 98765 43210
            </span>
          </div>

        </div>

        {/* CTA */}
        <div className="mt-8 sm:mt-10">
          <button
            className="w-full sm:w-auto border border-yellow-400 text-yellow-400 
            px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base
            hover:bg-yellow-400 hover:text-[#0b1a2f] transition"
          >
            Talk to us
          </button>
        </div>
      </motion.div>
    </section>
  );
}