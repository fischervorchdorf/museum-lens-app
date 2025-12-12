import React from 'react';
import { Landmark, Camera, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onHelpClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onHelpClick }) => {
  return (
    <header className="bg-[#2d2a26] text-[#fdfcf8] py-4 px-6 shadow-md border-b-4 border-[#c5a059] print:hidden">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#c5a059] rounded-lg text-[#2d2a26]">
            <Landmark size={24} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-wider serif">MUSEUM LENS</h1>
            <p className="text-xs text-[#c5a059] uppercase tracking-widest font-medium">Digital Archivist AI</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
            <Camera size={16} />
            <span>Image Analysis System</span>
          </div>
          <button 
            onClick={onHelpClick}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            title="Installation Help"
          >
            <HelpCircle size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};