import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AnalysisResult } from '../types';
import { ArrowLeft, ExternalLink, RotateCcw, Printer, FileText } from 'lucide-react';

interface AnalysisViewProps {
  image: File;
  result: AnalysisResult;
  onReset: () => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ image, result, onReset }) => {
  const imageUrl = React.useMemo(() => URL.createObjectURL(image), [image]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex items-center justify-between mb-8 print:hidden bg-white p-4 rounded-lg shadow-sm border border-museum-stone/50">
        <button onClick={onReset} className="flex items-center gap-3 text-gray-500 hover:text-museum-charcoal transition-colors text-sm font-medium uppercase tracking-wider">
          <ArrowLeft size={16} /> <span>Zurück</span>
        </button>
        <div className="flex gap-3">
            <button onClick={onReset} className="btn-outline flex items-center gap-2">
              <RotateCcw size={14} /> <span className="hidden sm:inline">Neue Analyse</span>
            </button>
            <button onClick={handlePrint} className="btn-primary flex items-center gap-2">
              <Printer size={14} /> <span className="hidden sm:inline">Bericht Drucken</span>
            </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
        <div className="lg:col-span-4 flex flex-col gap-6 print:mb-8 print:break-inside-avoid">
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="bg-white p-3 shadow-2xl rounded-sm rotate-1 transform transition-transform hover:rotate-0 duration-500 border border-gray-200">
              <div className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden border border-gray-100">
                 <img src={imageUrl} alt="Artifact" className="w-full h-full object-contain p-2" />
              </div>
              <div className="mt-3 text-center">
                <p className="font-serif text-xs text-gray-500 italic">Fig. 1: Originalaufnahme</p>
              </div>
            </div>
            <div className="bg-museum-charcoal text-museum-paper p-6 rounded-sm shadow-lg print:hidden relative overflow-hidden">
               <div className="absolute top-0 right-0 -mt-4 -mr-4 w-16 h-16 bg-museum-gold opacity-20 rounded-full blur-xl"></div>
               <h4 className="font-serif text-museum-gold mb-4 text-sm tracking-widest uppercase border-b border-white/10 pb-2">Objekt-Daten</h4>
               <div className="space-y-3 font-mono text-xs text-gray-300">
                 <div className="flex justify-between"><span className="opacity-50">Datei:</span><span className="text-white truncate max-w-[150px]">{image.name}</span></div>
                 <div className="flex justify-between"><span className="opacity-50">Größe:</span><span className="text-white">{(image.size / 1024 / 1024).toFixed(2)} MB</span></div>
                 <div className="flex justify-between"><span className="opacity-50">Format:</span><span className="text-white uppercase">{image.type.split('/')[1]}</span></div>
               </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-8">
          <div className="bg-white shadow-card border border-museum-stone print:shadow-none print:border-0 min-h-[800px] relative">
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
            <div className="p-10 md:p-14 border-b border-museum-stone/50 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-4">
                   <FileText size={20} className="text-museum-gold" />
                   <span className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">Museum Lens AI</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif text-museum-charcoal mb-2">Kuratorischer Bericht</h2>
                <p className="text-sm text-gray-500 font-serif italic">Generiert am {new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div className="hidden md:block w-16 h-16 border border-museum-gold/30 rounded-full flex items-center justify-center">
                 <div className="w-12 h-12 border border-museum-gold/60 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-museum-gold rounded-full"></div>
                 </div>
              </div>
            </div>
            <div className="p-10 md:p-14 pt-8">
              <div className="prose prose-stone max-w-none prose-p:text-justify prose-headings:font-serif">
                <ReactMarkdown>{result.text}</ReactMarkdown>
              </div>
              {result.groundingChunks && result.groundingChunks.length > 0 && (
                <div className="mt-16 pt-8 border-t border-museum-stone/60 break-inside-avoid">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-museum-charcoal mb-6 flex items-center gap-2">
                    <ExternalLink size={14} className="text-museum-gold" /> Referenzen & Quellen
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {result.groundingChunks.map((chunk, idx) => (
                      <a key={idx} href={chunk.web?.uri} target="_blank" rel="noopener noreferrer" className="group flex items-baseline gap-3 p-3 rounded hover:bg-gray-50 transition-colors">
                        <span className="text-xs font-mono text-gray-400">[{idx + 1}]</span>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-museum-charcoal group-hover:text-museum-gold transition-colors block">{chunk.web?.title || "Web Reference"}</span>
                          <span className="text-xs text-gray-400 font-mono truncate block mt-0.5 opacity-60">{chunk.web?.uri}</span>
                        </div>
                        <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 text-museum-gold transition-opacity" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-20 pt-10 border-t-2 border-dotted border-gray-200 flex justify-between items-end print:flex">
                <div className="text-center">
                  <div className="h-12 border-b border-gray-300 w-48 mb-2"></div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Geprüft von</span>
                </div>
                <div className="text-right">
                   <p className="text-xs text-gray-300 font-mono">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};