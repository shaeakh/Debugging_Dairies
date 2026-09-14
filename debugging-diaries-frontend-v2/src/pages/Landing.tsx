import CodePreviewBlock from '@/components/landing/CodePreviewBlock';
import Features from '@/components/landing/Features';
import Footer from '@/components/landing/Footer';
import HeroSection from '@/components/landing/HeroSection';
import LandingNavBar from '@/components/landing/LandingNavBar';
import { MdOutlineLeaderboard } from 'react-icons/md';
import { PiFlowArrowDuotone, PiFolderLight } from 'react-icons/pi';

const Landing = () => {
  const features = [
    {
      icon: <PiFolderLight />,
      title: 'Structured Journals',
      desc: 'Log bugs with context, steps, and resolutions — all in one place.',
    },
    {
      icon: <PiFlowArrowDuotone />,
      title: 'Pipeline flow',
      desc: 'Make your own pipeline & follow',
    },
    {
      icon: <MdOutlineLeaderboard />,
      title: 'Gamified Version of development',
      desc: 'Give Effort. Collect points. Compete with your peer circle',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <LandingNavBar />
      <HeroSection />
      <CodePreviewBlock />
      <Features features={features} />
      <Footer />
    </div>
  );
};

export default Landing;
