import React from 'react';

const SectionTitle = ({
  badge,
  title,
  subtitle,
  centered = false,
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${centered ? 'text-center mx-auto' : ''} ${className}`}>
      {badge && (
        <p className="text-gray-400 text-xs sm:text-sm font-semibold tracking-widest uppercase">
          {badge}
        </p>
      )}
      {title && (
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
