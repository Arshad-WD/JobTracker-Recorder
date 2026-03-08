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
  const baseStyles = "relative px-6 py-3 font-bold uppercase transition-all duration-75 active:translate-x-1 active:translate-y-1 active:shadow-none border-[3px] border-black text-black";
  
  const variants = {
    violet: "bg-[#8B5CF6] shadow-[4px_4px_0px_#000000] hover:bg-[#A78BFA]",
    green: "bg-[#22C55E] shadow-[4px_4px_0px_#000000] hover:bg-[#4ADE80]",
    black: "bg-black text-white shadow-[4px_4px_0px_#8B5CF6] hover:bg-[#1a1a1a] border-[#8B5CF6]",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${glitch ? 'glitch-hover' : ''} ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default MonolithButton;
