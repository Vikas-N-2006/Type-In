import React from "react";

interface GlitchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const GlitchButton = ({ children, ...props }: GlitchButtonProps) => (
    <button
        {...props}
        className={`relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-mono font-bold text-indigo-300 bg-indigo-900/50 border-2 border-indigo-500 rounded-lg overflow-hidden transition-all duration-300 hover:bg-indigo-800/70 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed group ${props.className}`}
    >
        <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-indigo-600 group-hover:w-full group-hover:h-full"></span>
        <span className="relative flex items-center gap-2">{children}</span>
    </button>
);
