import { useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Instagram, Linkedin, Globe, Mail } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);
  const footerInnerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const footer = footerRef.current;
    const inner = footerInnerRef.current;
    if (!footer || !inner) return;

    // --- Initial hidden state: footer sits below its resting position ---
    gsap.set(inner, { y: 120, opacity: 0 });

    // --- Bounce-in animation, played once when the footer enters the viewport ---
    const ctx = gsap.context(() => {
      gsap.to(inner, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'bounce.out', // built-in GSAP ease, no extra plugin needed
        scrollTrigger: {
          trigger: footer,
          start: 'top 85%',       // fires a bit before the footer fully enters view
          toggleActions: 'play none none reverse', // play on enter, reverse on scroll back up
          // markers: true,        // uncomment while tuning
        },
      });
    }, footer);

    // Refresh ScrollTrigger after a short delay to account for new page content rendering
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, [location.pathname]);

  return (
    <footer ref={footerRef} className="footer relative mt-0 overflow-hidden">
      <div ref={footerInnerRef}>
        {/* Footer body */}
        <div className="relative bg-space-900">
          {/* Noise / grain overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")',
              backgroundSize: '128px 128px',
            }}
          />

          {/* Subtle top glow line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

          <div className="relative px-4 md:px-6 pt-12 pb-8">
            {/* Upper footer grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              {/* Brand */}
              <div className="space-y-3">
                <Link to="/" className="flex flex-col flex-shrink-0 leading-tight">
                  <span className="text-lg font-bold text-white tracking-wider">
                    MAHMOUD
                  </span>
                  <span className="text-xs font-medium text-gray-300 tracking-widest">
                    ABO HUSSEIN
                  </span>
                </Link>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                  Cinematic colorist &amp; editor — shaping emotion through light,
                  hue, and narrative.
                </p>
              </div>

              {/* Quick links */}
              <div>
                <h4 className="text-gray-400 text-xs uppercase tracking-widest mb-4 font-semibold">
                  Navigate
                </h4>
                <ul className="flex flex-wrap gap-4">
                  {['Home', 'Work', 'About', 'Contact'].map((link) => (
                    <li key={link}>
                      <a
                        href={`/${link.toLowerCase()}`}
                        className="text-gray-500 hover:text-white text-sm transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Connect */}
              <div>
                <h4 className="text-gray-400 text-xs uppercase tracking-widest mb-4 font-semibold">
                  Connect
                </h4>
                <div className="flex gap-3">
                  {[
                    { icon: Instagram, href: '#', label: 'Instagram' },
                    { icon: Globe, href: '#', label: 'Behance' },
                    { icon: Linkedin, href: '#', label: 'LinkedIn' },
                    { icon: Mail, href: 'mailto:hello@example.com', label: 'Email' },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="w-10 h-10 rounded-full border border-gray-700 hover:border-white flex items-center justify-center text-gray-500 hover:text-white transition-all duration-200"
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      aria-label={item.label}
                    >
                      <item.icon size={16} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-6" />

            {/* Bottom bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-gray-600 text-xs">
                © {new Date().getFullYear()} Mahmoud Abo Hussein. All rights
                reserved.
              </p>
              <p className="text-gray-700 text-xs">
                Crafted with passion &amp; precision
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;