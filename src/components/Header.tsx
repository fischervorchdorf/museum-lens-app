import React from 'react';
import { Sparkles, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onHelpClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onHelpClick }) => {
  return (
    <header className="bg-museum-charcoal text-white shadow-lg sticky top-0 z-50 print:hidden">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="bg-museum-gold p-2 rounded-lg">
            <Sparkles size={24} className="text-museum-charcoal" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-serif font-bold tracking-wide">
              Museum Lens
            </h1>
            <p className="text-xs text-museum-stone/80 uppercase tracking-widest">
              Artefakte erzählen ihre Geschichte
            </p>
          </div>
        </div>

        {onHelpClick && (
          <button
            onClick={onHelpClick}
            className="flex items-center gap-2 px-3 py-2 bg-museum-gold/10 hover:bg-museum-gold/20 rounded-lg transition-colors border border-museum-gold/30"
            aria-label="Hilfe"
          >
            <HelpCircle size={20} className="text-museum-gold" />
            <span className="hidden sm:inline text-sm font-medium">Hilfe</span>
          </button>
        )}
      </div>
    </header>
  );
};