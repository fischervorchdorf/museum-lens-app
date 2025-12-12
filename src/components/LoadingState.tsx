import React, { useEffect, useState } from 'react';
import { Scan, Search, Hourglass } from 'lucide-react';

export const LoadingState: React.FC = () => {
  const [step, setStep] = useState(0);
  const steps = [
    "Bild wird gescannt...",
    "Details werden extrahiert...",
    "Historische Datenbanken werden abgefragt...",
    "Kuratorenbericht wird erstellt..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-[#c5a059] rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-[#2d2a26]">
          {step % 3 === 0 && <Scan size={32} className="animate-pulse" />}
          {step % 3 === 1 && <Search size={32} className="animate-pulse" />}
          {step % 3 === 2 && <Hourglass size={32} className="animate-pulse" />}
        </div>
      </div>
      
      <h3 className="text-2xl font-serif font-medium text-[#2d2a26] mb-2">
        Analysiere Artefakt
      </h3>
      <p className="text-gray-500 h-6 transition-all duration-500 ease-in-out">
        {steps[step]}
      </p>
      
      <div className="mt-8 flex gap-2 justify-center">
        {[0, 1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`w-2 h-2 rounded-full transition-colors duration-500 ${i === step ? 'bg-[#c5a059]' : 'bg-gray-200'}`}
          />
        ))}
      </div>
    </div>
  );
};