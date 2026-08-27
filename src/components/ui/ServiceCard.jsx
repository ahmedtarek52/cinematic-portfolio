import React from 'react';

const ServiceCard = ({
  title,
  description,
  icon: Icon,
  details = [],
  className = '',
}) => {
  return (
    <div
      className={`p-6 sm:p-8 rounded-2xl bg-space-800/90 border border-border hover:border-zinc-500/80 transition-all duration-300 shadow-lg hover:shadow-2xl space-y-4 ${className}`}
    >
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-space-900 border border-border flex items-center justify-center text-white">
          <Icon className="w-6 h-6 text-zinc-200" />
        </div>
      )}
      {title && <h3 className="text-xl font-bold text-white">{title}</h3>}
      {description && (
        <p className="text-zinc-300 text-sm leading-relaxed">{description}</p>
      )}
      {details.length > 0 && (
        <ul className="space-y-2 pt-2">
          {details.map((detail, idx) => (
            <li key={idx} className="text-xs text-zinc-400">
              • {detail}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ServiceCard;
