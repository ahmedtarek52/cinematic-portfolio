import { useState, useRef, useEffect } from "react";

/**
 * Lazy-mount wrapper that defers rendering children until the
 * placeholder enters the viewport (with a 200px look-ahead margin).
 *
 * Before the section is visible, a spacer `<div>` with `minHeight`
 * is rendered to preserve scroll-height and prevent layout shifts.
 *
 * Once visible the children are mounted and smoothly faded-in via a
 * CSS opacity transition (no Framer Motion overhead).
 */
const LazySection = ({ children, height = "400px", className = "" }) => {
  const [shouldMount, setShouldMount] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // After children are mounted, trigger the reveal on the next frame
  // so the browser paints the opacity:0 state first and the transition fires.
  useEffect(() => {
    if (!shouldMount) return;
    const raf = requestAnimationFrame(() => setHasRevealed(true));
    return () => cancelAnimationFrame(raf);
  }, [shouldMount]);

  if (!shouldMount) {
    return (
      <div
        ref={ref}
        className={className}
        style={{ minHeight: height }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: hasRevealed ? 1 : 0,
        transform: hasRevealed ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
};

export default LazySection;
