import { useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Instagram, Linkedin, Facebook } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const WhatsAppIcon = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12.01 2.002c-5.51 0-9.99 4.478-9.99 9.988 0 1.76.46 3.475 1.33 4.99L2 22l5.17-1.355c1.47.8 3.13 1.22 4.84 1.22 5.51 0 9.99-4.478 9.99-9.988 0-2.668-1.04-5.177-2.93-7.067A9.92 9.92 0 0 0 12.01 2.002zm0 18.3c-1.52 0-3-.41-4.31-1.18l-.31-.18-3.21.84.86-3.12-.2-.32a8.27 8.27 0 0 1-1.27-4.45c0-4.57 3.72-8.29 8.29-8.29 2.21 0 4.3 0.86 5.86 2.42a8.23 8.23 0 0 1 2.43 5.87c0 4.57-3.72 8.29-8.29 8.29zm4.54-6.2c-.25-.13-1.48-.73-1.71-.81-.23-.08-.4-.13-.57.13-.17.25-.65.81-.8 0.98-.15.16-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.49-1.4-1.74-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.57-1.37-.78-1.88-.2-.5-.41-.43-.57-.44l-.48-.01c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.78.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.48-.61 1.69-1.19.21-.58.21-1.08.15-1.19-.06-.11-.23-.17-.48-.3z" />
  </svg>
);

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);      // static wrapper — stays in normal flow, never moves
  const clipRef = useRef(null);        // gets the expanding circular clip-path
  const location = useLocation();

  useEffect(() => {
    const footer = footerRef.current;
    const clipTarget = clipRef.current;
    let ctx = null;

    const setupAnimation = () => {
      if (ctx) ctx.revert();

      // Check if page has sufficient scroll distance past the viewport
      const isScrollable =
        document.documentElement.scrollHeight > window.innerHeight + 100;

      if (!isScrollable) {
        // Page fits in viewport or is too short to scroll; ensure footer is fully visible
        gsap.set(clipTarget, { clipPath: 'circle(150% at 50% 50%)' });
        return;
      }

      ctx = gsap.context(() => {
        gsap.fromTo(
          clipTarget,
          { clipPath: 'circle(0% at 50% 50%)' },
          {
            clipPath: 'circle(150% at 50% 50%)',
            ease: 'power2.out',
            scrollTrigger: {
              trigger: footer,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          }
        );
      }, footer);
    };

    setupAnimation();

    // ResizeObserver catches dynamic page content changes (like filtering projects/trailers)
    const resizeObserver = new ResizeObserver(() => {
      setupAnimation();
      ScrollTrigger.refresh();
    });

    resizeObserver.observe(document.body);

    const refreshTimer = setTimeout(() => {
      setupAnimation();
      ScrollTrigger.refresh();
    }, 300);

    return () => {
      clearTimeout(refreshTimer);
      resizeObserver.disconnect();
      if (ctx) ctx.revert();
    };
  }, [location.pathname]);

  return (
    <footer ref={footerRef} className="footer relative mt-0 overflow-hidden">
      <div ref={clipRef} style={{ clipPath: 'circle(150% at 50% 50%)' }}>
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
                  <span className="text-sm font-medium text-white tracking-widest">
                    MAHMOUD
                  </span>
                  <span className="text-lg font-bold text-gray-300 tracking-wide">
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
                    {
                      icon: Instagram,
                      href: 'https://www.instagram.com/abohusseincolors?utm_source=qr',
                      label: 'Instagram',
                    },
                    {
                      icon: Facebook,
                      href: 'https://www.facebook.com/share/19HcuRYRE5/?mibextid=wwXIfr',
                      label: 'Facebook',
                    },
                    {
                      icon: WhatsAppIcon,
                      href: 'https://wa.me/201015627737',
                      label: 'WhatsApp',
                    },
                    {
                      icon: Linkedin,
                      href: 'https://www.linkedin.com/in/mahmoud-abo-hussein-08755111a/',
                      label: 'LinkedIn',
                    },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="w-10 h-10 rounded-full border border-border hover:border-zinc-300 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] cursor-pointer"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                    >
                      <item.icon size={16} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6" />

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