import React from 'react';

interface MonolithCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  tag?: string;
}

const MonolithCard: React.FC<MonolithCardProps> = ({ 
  title, 
  subtitle, 
  children, 
  className = '', 
  tag 
}) => {
  return (
    <div className={`relative bg-hologram-glass backdrop-blur-xl border border-hologram-border rounded-2xl overflow-hidden transition-all hover:border-hologram-cyan/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] group ${className}`}>
      {/* Scanning light effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
      {/* Header with technical feel */}
      {/* Header with technical feel */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-hologram-border bg-white/5">
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-hologram-cyan/40 animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-hologram-indigo/40 animate-pulse [animation-delay:0.5s]" />
        </div>
        {tag && (
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-hologram-cyan/60 font-mono">
            {tag}
          </span>
        )}
      </div>

      <div className="p-6">
        {(title || subtitle) && (
          <div className="mb-4">
            {title && (
              <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1 leading-none hologram-heading">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-hologram-cyan/60 text-[10px] font-mono uppercase tracking-widest">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className="text-white/80 font-mono text-sm">
          {children}
        </div>
      </div>

      {/* Decorative details */}
      <div className="absolute bottom-3 right-3 flex gap-1 items-end h-4">
        <div className="w-[1px] h-full bg-hologram-cyan/20" />
        <div className="w-[3px] h-2 bg-hologram-indigo/40" />
      </div>
    </div>
  );
};

export default MonolithCard;
