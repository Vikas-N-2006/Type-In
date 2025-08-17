import React from "react";

interface TerminalWindowProps {
    children: React.ReactNode;
    title?: string;
}

export const TerminalWindow = ({ children, title = "bash" }: TerminalWindowProps) => (
  <div className="bg-[#1e293b] border border-slate-700 rounded-lg shadow-2xl shadow-indigo-500/10 overflow-hidden">
    <div className="bg-slate-800/80 px-4 py-2 flex items-center gap-2 border-b border-slate-700">
      <div className="w-3 h-3 rounded-full bg-red-500"></div>
      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
      <div className="w-3 h-3 rounded-full bg-green-500"></div>
      <p className="text-xs text-slate-400 ml-2 font-mono">{title}</p>
    </div>
    <div className="p-6">{children}</div>
  </div>
);