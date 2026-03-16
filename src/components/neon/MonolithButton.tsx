import React from 'react';

interface MonolithButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'violet' | 'green' | 'black';
  glitch?: boolean;
}

const MonolithButton: React.FC<MonolithButtonProps> = ({ 
  children, 
  variant = 'violet', 
  glitch = false,
  className = '', 
  ...props 
}) => {
  const baseStyles = "relative px-6 py-3 font-bold uppercase transition-all duration-300 active:scale-95 border rounded-xl flex items-center justify-center gap-2 overflow-hidden group";
  
  const variants = {
    violet: "bg-hologram-indigo/20 border-hologram-indigo/50 text-white hover:bg-hologram-indigo/30 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]",
    green: "bg-hologram-cyan/20 border-hologram-cyan/50 text-white hover:bg-hologram-cyan/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]",
    black: "bg-white/5 border-hologram-border text-white hover:bg-white/10 hover:border-hologram-cyan/30",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${glitch ? 'glitch-hover' : ''} ${className}`}
      {...props}
    >
      {/* Glossy overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default MonolithButton;
