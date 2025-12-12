import React, { useEffect, useState } from 'react';
import { Scan, Search, Hourglass } from 'lucide-react';

export const LoadingState: React.FC = () => {
  const [step, setStep] = useState(0);
  const steps = ["Artefakt wird gescannt...", "Visuelle Merkmale werden extrahiert...", "Abgleich mit historischen Datenbanken...", "Kuratorenbericht wird verfasst..."];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center px-4 w-full max-w-md mx-auto bg-white rounded-xl shadow-lg border border-museum-stone/50">
      <div className="relative w-20 h-20 mb-8">
        <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-museum-gold rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-museum-charcoal">
          {step % 3 === 0 && <Scan size={28} className="animate-pulse" />}
          {step % 3 === 1 && <Search size={28} className="animate-pulse" />}
          {step % 3 === 2 && <Hourglass size={28} className="animate-pulse" />}
        </div>
      </div>
      <h3 className="text-xl font-serif font-bold text-museum-charcoal mb-2 tracking-wide">Analyse läuft</h3>
      <div className="h-8 flex items-center justify-center">
        <p className="text-gray-500 text-sm transition-all duration-500 ease-in-out italic">{steps[step]}</p>
      </div>
      <div className="mt-8 flex gap-2 justify-center">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-all duration-500 ${i === step ? 'bg-museum-gold scale-125' : 'bg-gray-200'}`} />
        ))}
      </div>
    </div>
  );
};