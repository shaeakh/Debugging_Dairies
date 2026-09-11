import type { ReactNode } from 'react';

interface FeatureItem {
  icon: ReactNode;
  title: string;
  desc: string;
}

interface FeaturesProps {
  features: FeatureItem[];
}

const Features = ({ features }: FeaturesProps) => {
  return (
    <section className="border-t border-border bg-secondary/30 px-6 py-20">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-card border border-border rounded-xl p-6 
            hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-primary text-3xl mb-4">{f.icon}</div>

            <h3 className="font-semibold text-lg mb-2">{f.title}</h3>

            <p className="text-muted-foreground text-sm leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
