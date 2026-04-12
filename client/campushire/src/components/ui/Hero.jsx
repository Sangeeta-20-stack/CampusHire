export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[90vh] sm:min-h-screen w-full flex items-center justify-center text-center px-4 sm:px-6 font-sora"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* White → Sage Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F6F0D6]/90 via-[#EAE5D8]/70 to-[#6B8C72]/70"></div>

      {/* Soft Depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1E2E22]/20 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto">

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl 
        font-extrabold tracking-tight mb-4 sm:mb-6 leading-tight">
          <span className="text-[#1E2E22]">Where talent meets </span>
          <span className="text-[#6B8C72] font-black">opportunity</span>
        </h1>

        {/* Subtext */}
        <p className="text-[#3D5C45] 
        text-sm sm:text-base md:text-lg lg:text-xl 
        font-medium leading-relaxed mb-6 sm:mb-8 md:mb-10 px-2">
          A smarter placement management platform for colleges, recruiters, and students —
          from drive scheduling to offer letters, all in one place.
        </p>

        {/* CTA */}
        <button
          className="w-full sm:w-auto 
          bg-[#1E2E22] text-[#F6F0D6] 
          px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg 
          font-semibold text-sm sm:text-base md:text-lg
          tracking-wide
          hover:bg-[#3D5C45] 
          transition-all duration-300 
          shadow-md hover:shadow-xl hover:scale-105"
        >
          Get Started
        </button>

      </div>
    </section>
  );
}