import { useState, useRef, useEffect } from "react";

/**
 * Lazy-mount wrapper that defers rendering children until the
 * placeholder enters the viewport (with a 200px look-ahead margin).
 *
 * Before the section is visible, a spacer `<div>` with `minHeight`
 * is rendered to preserve scroll-height and prevent layout shifts.
 */
const LazySection = ({ children, height = "400px", className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (isVisible) {
    return children;
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ minHeight: height }}
      aria-hidden="true"
    />
  );
};

export default LazySection;
