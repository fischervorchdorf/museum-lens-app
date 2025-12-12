import React from 'react';
import { Landmark, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onHelpClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onHelpClick }) => {
  return (
    <header className="bg-museum-charcoal text-museum-paper py-5 px-6 shadow-xl border-b-2 border-museum-gold/50 print:hidden sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4 group cursor-default">
          <div className="relative">
            <div className="absolute inset-0 bg-museum-gold blur opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
            <div className="relative p-2.5 border border-museum-gold/30 rounded-sm text-museum-gold bg-white/5 backdrop-blur-sm">
              <Landmark size={24} strokeWidth={1.5} />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold tracking-[0.15em] font-serif leading-none text-white">
              MUSEUM<span className="text-museum-gold">LENS</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-[1px] w-6 bg-museum-gold/50"></div>
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-sans">Digital Archivist</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] text-gray-300 uppercase tracking-wider font-medium">System Active</span>
          </div>
          <button 
            onClick={onHelpClick}
            className="text-museum-gold hover:text-white transition-colors duration-300 hover:rotate-12 transform"
            title="Hilfe & Anleitung"
          >
            <HelpCircle size={24} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>
  );
};