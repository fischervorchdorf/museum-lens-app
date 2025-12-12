import React from 'react';
import { Sparkles } from 'lucide-react';

interface HeaderProps {
  onHelpClick?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="bg-museum-charcoal text-museum-paper py-6 px-6 shadow-lg border-b-4 border-museum-gold">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-museum-gold rounded-xl text-museum-charcoal shadow-md">
              <Sparkles size={32} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-wide">
                Museum Lens
              </h1>
              <p className="text-sm text-museum-stone uppercase tracking-widest font-medium mt-1">
                Artefakte erzählen ihre Geschichte
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-museum-gold/10 border border-museum-gold/30">
            <Sparkles size={18} className="text-museum-gold" />
            <span className="text-sm text-museum-gold font-semibold">KI-Powered</span>
          </div>
        </div>


      </div>
    </header>
  );
};