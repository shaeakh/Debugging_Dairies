import logo from '@public/assets/images/logo.png';
import { FaFacebook, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const socials = [
    {
      aria_label: 'Github',
      icon: <FaGithub />,
      href: 'http://github.com/',
    },
    {
      aria_label: 'Twitter',
      icon: <FaTwitter />,
      href: 'https://x.com/',
    },
    {
      aria_label: 'LinkedIn',
      icon: <FaLinkedin />,
      href: 'https://www.linkedin.com/',
    },
    {
      aria_label: 'Facebook',
      icon: <FaFacebook />,
      href: 'https://www.facebook.com/',
    },
  ];
  const legalLinks = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'Contact Us', href: '#' },
  ];
  const resourceLinks = [
    { label: 'Documentation', href: '#' },
    { label: 'FAQ', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Support', href: '#' },
  ];

  return (
    <footer className="bg-primary w-full p-8 md:p-12 lg:p-20  text-primary-foreground mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 mb-8">
        <div className="col-span-1 sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-white rounded-lg p-1.5 flex items-center justify-center">
              <img src={logo} alt="Logo" className="h-6 w-6" />
            </div>
            <h3 className="text-lg md:text-xl font-bold">Debugging Diaries</h3>
          </div>
          <p className="text-sm md:text-base text-primary-foreground/80 mb-4 leading-relaxed">
            Share your debugging stories, learn from others' experiences, and
            build a community of problem solvers.
          </p>
          <div className="flex gap-4 text-xl">
            {socials.map((society) => {
              return (
                <a
                  href={society.href}
                  aria-label={society.aria_label}
                  className="text-primary-foreground hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  {society.icon}
                </a>
              );
            })}
          </div>
        </div>
        <div>
          <h4 className="text-base md:text-lg font-bold mb-4">Resources</h4>
          <ul className="space-y-2 md:space-y-3">
            {resourceLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className="text-sm md:text-base text-primary-foreground/80 hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-base md:text-lg font-bold mb-4">Legal</h4>

          <ul className="space-y-2 md:space-y-3">
            {legalLinks.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className="text-sm md:text-base text-primary-foreground/80 hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <hr className="border-white/20 mb-5 md:mb-5" />

      <p className="text-sm md:text-base text-primary-foreground/70">
        &copy; {currentYear} Debugging Diaries. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
