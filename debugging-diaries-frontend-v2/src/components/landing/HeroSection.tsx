const HeroSection = () => {
  return (
    <section className="flex flex-col items-center justify-center text-center px-6 pt-10 pb-20 max-w-3xl mx-auto">
      <h1 className="text-5xl font-bold tracking-tight leading-tight mb-5">
        Debug faster.
        <br />
        <span className="text-primary">Ship with confidence.</span>
      </h1>

      <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mb-10">
        Debugging Diaries helps you trace, document, and resolve bugs faster —
        with a structured journal built for developers who care about quality.
      </p>

      <div className="flex items-center gap-3">
        <button className="bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm shadow-sm">
          Start for free
        </button>
        <button className="text-sm text-foreground border border-border px-6 py-2.5 rounded-lg hover:bg-secondary transition-colors">
          View docs →
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
