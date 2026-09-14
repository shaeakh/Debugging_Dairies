import { LuPlus } from 'react-icons/lu';

interface HeroSectionProps {
  onWriteStoryClick?: () => void;
}

const HeroSection = ({ onWriteStoryClick }: HeroSectionProps) => {
  return (
    <section className="bg-card border border-border rounded-2xl p-8 flex justify-between items-center shadow-sm">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Share your journey.
        </h1>
        <p className="text-muted-foreground text-sm">
          Got a bug that kept you up all night? Document it here.
        </p>
      </div>
      <button
        onClick={onWriteStoryClick}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
      >
        <LuPlus className="w-5 h-5" />
        Write Story
      </button>
    </section>
  );
};

export default HeroSection;
