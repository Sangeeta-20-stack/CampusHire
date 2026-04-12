import { motion } from "framer-motion";
import { Mail, Phone, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("support@campushire.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="contact"
      className="relative bg-[#F6F0D6] text-[#1E2E22] py-16 sm:py-20 md:py-24 px-4 sm:px-6 overflow-hidden font-sora"
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(107,140,114,0.15),transparent_60%)]"></div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-4xl mx-auto rounded-3xl p-6 sm:p-8 md:p-12 
        bg-white border border-[#6B8C72]/30 shadow-md text-center group overflow-hidden"
      >
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
          Ready to transform your{" "}
          <span className="text-[#6B8C72]">placement season?</span>
        </h2>

        <p className="text-[#3D5C45] mb-8">
          Send us a message or reach out directly.
        </p>

        {/* Form */}
        <form className="grid gap-5 mb-8 text-left">
          {/* Name */}
          <div className="relative">
            <input
              type="text"
              required
              className="peer w-full border border-[#6B8C72]/30 rounded-lg px-4 pt-5 pb-2 bg-transparent outline-none focus:border-[#6B8C72]"
            />
            <label className="absolute left-4 top-2 text-xs text-[#6B8C72] 
            transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm 
            peer-placeholder-shown:text-[#3D5C45] peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#6B8C72]">
              Name
            </label>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              required
              className="peer w-full border border-[#6B8C72]/30 rounded-lg px-4 pt-5 pb-2 bg-transparent outline-none focus:border-[#6B8C72]"
            />
            <label className="absolute left-4 top-2 text-xs text-[#6B8C72] 
            transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm 
            peer-placeholder-shown:text-[#3D5C45] peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#6B8C72]">
              Email
            </label>
          </div>

          {/* Message */}
          <div className="relative">
            <textarea
              rows="4"
              required
              className="peer w-full border border-[#6B8C72]/30 rounded-lg px-4 pt-5 pb-2 bg-transparent outline-none focus:border-[#6B8C72]"
            />
            <label className="absolute left-4 top-2 text-xs text-[#6B8C72] 
            transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm 
            peer-placeholder-shown:text-[#3D5C45] peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#6B8C72]">
              Message
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 bg-[#6B8C72] text-white py-3 rounded-lg font-semibold 
            hover:bg-[#3D5C45] transition shadow hover:shadow-md"
          >
            Send Message
          </button>
        </form>

        {/* Contact Info */}
        <div className="flex flex-col sm:flex-row justify-center gap-6">

          {/* Email Box */}
          <div
            onClick={copyEmail}
            className="flex items-center gap-3 cursor-pointer 
            px-5 py-3 border border-[#6B8C72]/30 rounded-xl 
            hover:border-[#6B8C72] transition group"
          >
            <motion.div
              whileHover={{ rotate: 12 }}
              className="w-9 h-9 flex items-center justify-center rounded-full 
              bg-gradient-to-br from-[#6B8C72] to-[#3D5C45] text-white"
            >
              <Mail size={16} />
            </motion.div>

            <span className="text-sm">support@campushire.com</span>

            <motion.div
              animate={copied ? { scale: [1, 1.3, 1] } : {}}
              className="text-[#6B8C72]"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </motion.div>
          </div>

          {/* Phone Box */}
          <div
            className="flex items-center gap-3 px-5 py-3 border border-[#6B8C72]/30 rounded-xl"
          >
            <motion.div
              whileHover={{ y: [-2, 2, -2] }}
              className="w-9 h-9 flex items-center justify-center rounded-full 
              bg-gradient-to-br from-[#6B8C72] to-[#3D5C45] text-white"
            >
              <Phone size={16} />
            </motion.div>

            <span className="text-sm">+91 98765 43210</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}