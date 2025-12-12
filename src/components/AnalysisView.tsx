import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AnalysisResult, ArtifactImage } from '../types';
import { ArrowLeft, ExternalLink, RotateCcw, Printer } from 'lucide-react';

interface AnalysisViewProps {
  images: ArtifactImage[];
  result: AnalysisResult;
  onReset: () => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ images, result, onReset }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-6xl mx-auto pt-6 pb-12 px-4">
      <button
        onClick={onReset}
        className="flex items-center gap-2 text-gray-500 hover:text-[#2d2a26] mb-6 transition-colors print:hidden"
      >
        <ArrowLeft size={20} />
        <span>Zurück zur Auswahl</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 print:block">

        <div className="flex flex-col gap-6 print:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map((img, idx) => (
              <div key={img.id} className={`relative rounded-lg overflow-hidden shadow-lg border-4 border-white bg-white print:shadow-none print:border-0 ${images.length === 1 ? 'sm:col-span-2' : ''}`}>
                <img
                  src={img.preview}
                  alt={`Artefakt Ansicht ${idx + 1}`}
                  className="w-full h-auto object-cover bg-black/5 print:max-h-[300px] print:object-contain"
                />
                {img.description && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 backdrop-blur-sm print:hidden">
                    {img.description}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-center lg:justify-start print:hidden">
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
            >
              <RotateCcw size={16} />
              <span>Neues Bild</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-[#2d2a26] text-white rounded-md hover:bg-[#403d38] transition-colors shadow-sm"
              title="Als PDF speichern oder Drucken"
            >
              <Printer size={16} />
              <span>Bericht Drucken / PDF</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden print:shadow-none print:border-0">
            <div className="bg-[#2d2a26] text-[#fdfcf8] px-6 py-4 border-b border-[#c5a059] print:bg-transparent print:text-[#2d2a26] print:px-0 print:border-b-2">
              <h2 className="text-xl font-serif tracking-wide flex items-center gap-2">
                <span className="text-[#c5a059] print:hidden">✦</span> Kuratoren-Analyse
              </h2>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto max-h-[800px] custom-scrollbar print:max-h-none print:overflow-visible print:px-0">
              <div className="prose prose-stone prose-headings:font-serif prose-a:text-[#c5a059] max-w-none text-justify">
                <ReactMarkdown>{result.text}</ReactMarkdown>
              </div>

              {result.groundingChunks && result.groundingChunks.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200 break-inside-avoid">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                    <ExternalLink size={14} />
                    Quellen & Referenzen
                  </h3>
                  <ul className="space-y-2">
                    {result.groundingChunks.map((chunk, idx) => (
                      <li key={idx}>
                        <a
                          href={chunk.web?.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#c5a059] hover:underline break-all whitespace-normal block print:text-black print:no-underline"
                        >
                          {chunk.web?.title || chunk.web?.uri} <span className="hidden print:inline text-xs text-gray-500">({chunk.web?.uri})</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};