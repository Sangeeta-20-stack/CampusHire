import Navbar from "../../components/ui/Navbar";
import Hero from "../../components/ui/Hero";
import About from "../../components/ui/About";
import Contact from "../../components/ui/Contact";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0b1a2f] overflow-hidden">
      <Navbar />
      <Hero />
      <About />
      <Contact />
    </div>
  );
}