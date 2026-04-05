import { useState } from "react";
import { Menu, X } from "lucide-react";
import RoleModal from "../modals/RoleModal";
import SignupModal from "../modals/SignupModal";
import LoginModal from "../modals/LoginModal";

export default function Navbar() {
  const [roleModal, setRoleModal] = useState(false);
  const [signupModal, setSignupModal] = useState(false);
  const [loginModal, setLoginModal] = useState(false);

  const [selectedRole, setSelectedRole] = useState("student");
  const [mobileMenu, setMobileMenu] = useState(false);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileMenu(false);
  };

  const handleSignupFlow = () => {
    setMobileMenu(false);
    setRoleModal(true);
  };

  return (
    <>
      <nav className="w-full flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 
      bg-[#0b1a2f]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">

        {/* Brand */}
        <div
          onClick={() => scrollTo("home")}
          className="text-xl sm:text-2xl md:text-3xl font-extrabold cursor-pointer"
        >
          <span className="text-white">Campus</span>
          <span className="text-yellow-400">Hire</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-white text-sm md:text-base">
          <button onClick={() => scrollTo("home")} className="hover:text-yellow-400 transition">
            Home
          </button>
          <button onClick={() => scrollTo("about")} className="hover:text-yellow-400 transition">
            About
          </button>
          <button onClick={() => scrollTo("contact")} className="hover:text-yellow-400 transition">
            Contact
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          {/* Signup Button */}
          <button
            onClick={handleSignupFlow}
            className="px-4 sm:px-5 py-2 text-sm sm:text-base border border-yellow-400 text-yellow-400 rounded-lg 
            hover:bg-yellow-400 hover:text-[#0b1a2f] transition"
          >
            Sign Up
          </button>

          {/* Mobile Menu */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden text-white"
          >
            {mobileMenu ? <X size={26} /> : <Menu size={26} />}
          </button>

        </div>
      </nav>

      {/* 📱 Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden bg-[#0b1a2f]/95 backdrop-blur-md border-b border-white/10 px-6 py-6 space-y-5 text-white">

          <button
            onClick={() => scrollTo("home")}
            className="block w-full text-left text-lg hover:text-yellow-400 transition"
          >
            Home
          </button>

          <button
            onClick={() => scrollTo("about")}
            className="block w-full text-left text-lg hover:text-yellow-400 transition"
          >
            About
          </button>

          <button
            onClick={() => scrollTo("contact")}
            className="block w-full text-left text-lg hover:text-yellow-400 transition"
          >
            Contact
          </button>

          {/* Mobile Signup */}
          <button
            onClick={handleSignupFlow}
            className="w-full mt-4 px-5 py-3 border border-yellow-400 text-yellow-400 rounded-lg 
            hover:bg-yellow-400 hover:text-[#0b1a2f] transition"
          >
            Sign Up
          </button>
        </div>
      )}

      {/* 🔥 Role Modal */}
      <RoleModal
        open={roleModal}
        setOpen={setRoleModal}
        setSelectedRole={(role) => {
          setSelectedRole(role);
          setRoleModal(false);
          setSignupModal(true);
        }}
      />

      {/* 🔥 Signup Modal */}
      <SignupModal
        open={signupModal}
        setOpen={setSignupModal}
        role={selectedRole}
        setLoginOpen={setLoginModal}   // 👈 needed for switching
      />

      {/* 🔥 Login Modal (only opened from signup) */}
      <LoginModal
        open={loginModal}
        setOpen={setLoginModal}
        role={selectedRole}
        setSignupOpen={setSignupModal}
      />
    </>
  );
}