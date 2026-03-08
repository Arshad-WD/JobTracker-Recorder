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
    <div className={`relative bg-black border-[3px] border-white shadow-[8px_8px_0px_#8B5CF6] transition-all hover:shadow-[12px_12px_0px_#22C55E] hover:-translate-x-1 hover:-translate-y-1 ${className}`}>
      {/* Header with technical feel */}
      <div className="flex items-center justify-between px-4 py-2 border-b-[3px] border-white bg-[#1a1a1a]">
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-white" />
          <div className="w-2 h-2 bg-white" />
        </div>
        {tag && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B5CF6]">
            [{tag}]
          </span>
        )}
      </div>

      <div className="p-6">
        {(title || subtitle) && (
          <div className="mb-6">
            {title && (
              <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-1 leading-none">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-[#8B5CF6] text-xs font-mono uppercase tracking-widest">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className="text-white/80 font-mono text-sm">
          {children}
        </div>
      </div>

      {/* Footer detail */}
      <div className="absolute bottom-2 right-2 flex gap-1">
        <div className="w-1 h-1 bg-[#22C55E]" />
        <div className="w-1 h-3 bg-[#22C55E]" />
      </div>
    </div>
  );
};

export default MonolithCard;
