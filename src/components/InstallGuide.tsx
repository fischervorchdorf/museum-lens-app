import React from 'react';
import { X, Share, Menu, PlusSquare, Smartphone } from 'lucide-react';

interface InstallGuideProps {
  onClose: () => void;
}

export const InstallGuide: React.FC<InstallGuideProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative">
        <div className="bg-[#2d2a26] text-[#fdfcf8] p-4 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <Smartphone size={20} className="text-[#c5a059]" />
             <h3 className="font-serif font-bold tracking-wide">App Installieren</h3>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
             <X size={20} />
           </button>
        </div>
        
        <div className="p-6 space-y-8 overflow-y-auto max-h-[60vh]">
           <div className="space-y-3">
             <h4 className="font-bold text-[#2d2a26] flex items-center gap-2 border-b border-gray-100 pb-2">
               <span className="text-[#c5a059]">01.</span> iOS (iPhone)
             </h4>
             <ol className="space-y-3 text-sm text-gray-600">
               <li className="flex items-start gap-3">
                 <div className="p-1.5 bg-gray-100 rounded text-[#2d2a26]"><Share size={16} /></div>
                 <span>Tippen Sie unten in Safari auf den <strong>Teilen</strong>-Button.</span>
               </li>
               <li className="flex items-start gap-3">
                 <div className="p-1.5 bg-gray-100 rounded text-[#2d2a26]"><PlusSquare size={16} /></div>
                 <span>Scrollen Sie runter und wählen Sie <strong>Zum Home-Bildschirm</strong>.</span>
               </li>
             </ol>
           </div>

           <div className="space-y-3">
             <h4 className="font-bold text-[#2d2a26] flex items-center gap-2 border-b border-gray-100 pb-2">
               <span className="text-[#c5a059]">02.</span> Android
             </h4>
             <ol className="space-y-3 text-sm text-gray-600">
               <li className="flex items-start gap-3">
                 <div className="p-1.5 bg-gray-100 rounded text-[#2d2a26]"><Menu size={16} /></div>
                 <span>Tippen Sie oben rechts auf das <strong>Menü</strong> (Drei Punkte).</span>
               </li>
               <li className="flex items-start gap-3">
                 <div className="p-1.5 bg-gray-100 rounded text-[#2d2a26]"><PlusSquare size={16} /></div>
                 <span>Wählen Sie <strong>App installieren</strong> oder <strong>Zum Startbildschirm</strong>.</span>
               </li>
             </ol>
           </div>
        </div>

        <div className="p-4 bg-[#fcfaf5] border-t border-[#e5e0d6] text-center">
          <button 
            onClick={onClose}
            className="px-8 py-2 bg-[#2d2a26] text-white rounded-lg shadow-md hover:bg-[#403d38] transition-colors font-medium text-sm"
          >
            Verstanden
          </button>
        </div>
      </div>
    </div>
  );
};