export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[90vh] sm:min-h-screen w-full flex items-center justify-center text-center px-4 sm:px-6"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#0b1a2f]/80"></div>

      {/* Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b1a2f]/40 to-[#0b1a2f]"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto">

        {/* Tagline */}
        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 leading-tight">
          <span className="text-white">Where talent meets </span>
          <span className="text-yellow-400">opportunity</span>
        </h1>

        {/* Subtag */}
        <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 md:mb-10 leading-relaxed px-2">
          A smarter placement management platform for colleges, recruiters, and students —
          from drive scheduling to offer letters, all in one place.
        </p>

        {/* CTA */}
        <button
          className="w-full sm:w-auto bg-yellow-400 text-[#0b1a2f] 
          px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg 
          font-semibold text-sm sm:text-base md:text-lg
          hover:bg-yellow-300 transition shadow-lg"
        >
          Get Started
        </button>

      </div>
    </section>
  );
}