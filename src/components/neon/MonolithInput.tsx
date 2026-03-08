import React from 'react';

interface MonolithInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const MonolithInput: React.FC<MonolithInputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-[10px] font-black uppercase tracking-widest text-[#8B5CF6]">
          {label}
        </label>
      ) }
      <input
        className={`bg-black border-[3px] border-white px-4 py-3 text-white font-mono focus:outline-none focus:border-[#8B5CF6] focus:shadow-[4px_4px_0px_#22C55E] -mb-1 transition-all ${className}`}
        {...props}
      />
    </div>
  );
};

export default MonolithInput;
