import { useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Instagram, Linkedin, Globe, Mail } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);      // static wrapper — stays in normal flow, never moves
  const clipRef = useRef(null);        // gets the expanding circular clip-path
  const location = useLocation();

  useEffect(() => {
    const footer = footerRef.current;
    const clipTarget = clipRef.current;
    if (!footer || !clipTarget) return;

    const ctx = gsap.context(() => {
      // The footer content is masked by an expanding circle centered on the block.
      // clip-path is GPU-accelerated and, unlike animating width/height or a mask image,
      // doesn't trigger layout — the footer stays static, only the visible region grows.
      //
      // NOTE on the end value: CSS resolves a circle() percentage against
      // sqrt(width² + height²) / sqrt(2) — the center-to-corner distance. So 100%
      // exactly reaches the corner. We go past that (150%) so wide/short footers on
      // large screens fully clear their corners with margin, instead of being cropped.
      gsap.fromTo(
        clipTarget,
        { clipPath: 'circle(0% at 50% 50%)' },
        {
          clipPath: 'circle(150% at 50% 50%)',
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 90%', // begins just before the footer reaches the bottom of the viewport
            end: 'top 25%',   // fully revealed once the footer has mostly settled into view
            scrub: 0.6,       // ties progress directly to scroll position, no free-running tween
          },
        }
      );
    }, footer);

    // Recalculate trigger positions after route content settles (e.g. images/fonts shifting layout)
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, [location.pathname]);

  return (
    <footer ref={footerRef} className="footer relative mt-0 overflow-hidden">
      <div ref={clipRef} style={{ clipPath: 'circle(0% at 50% 50%)' }}>
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