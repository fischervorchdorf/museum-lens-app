import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to create directory if it doesn't exist
const ensureDir = (filePath) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Define all file contents
const files = {
  'index.html': `<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="theme-color" content="#1C1B1A">
    <title>Museum Lens AI - Digital Archivist</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
  </head>
  <body class="bg-museum-paper text-museum-charcoal antialiased selection:bg-museum-gold selection:text-white">
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>`,

  'index.css': `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --museum-gold: #C5A059;
    --museum-charcoal: #1C1B1A;
    --museum-paper: #F9F8F6;
  }

  body {
    @apply bg-museum-paper text-museum-charcoal font-sans;
    /* Subtle paper noise texture */
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-serif tracking-tight;
  }
}

@layer components {
  .btn-primary {
    @apply bg-museum-charcoal text-white px-8 py-3 rounded-sm uppercase tracking-[0.15em] text-xs font-bold hover:bg-[#2c2c2c] transition-all duration-300 shadow-lg border border-transparent hover:border-museum-gold flex items-center justify-center gap-2 cursor-pointer;
  }

  .btn-outline {
    @apply bg-transparent text-museum-charcoal px-8 py-3 rounded-sm uppercase tracking-[0.15em] text-xs font-bold hover:bg-white transition-all duration-300 border border-museum-stone hover:border-museum-gold hover:text-museum-gold flex items-center justify-center gap-2 cursor-pointer;
  }

  .glass-panel {
    @apply bg-white/80 backdrop-blur-md border border-white/20 shadow-xl;
  }
}

/* Markdown Styles for the Report */
.prose h1, .prose h2, .prose h3 {
  font-family: 'Cinzel', serif;
  color: #1C1B1A;
  margin-top: 1.5em;
}

.prose p {
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  line-height: 1.8;
  color: #333;
}

.prose strong {
  color: #C5A059;
  font-weight: 600;
}

.fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}`,

  'index.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,

  'types.ts': `export interface AnalysisResult {
  text: string;
  groundingChunks?: GroundingChunk[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export enum AppState {
  IDLE = 'IDLE',
  PREVIEW = 'PREVIEW',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}

export interface AnalysisConfig {
  focusArea: 'general' | 'dating' | 'condition' | 'transcription';
}`,

  'tailwind.config.js': `import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        museum: {
          charcoal: '#1C1B1A', // Deep black-grey
          gold: '#C5A059',     // Muted antique gold
          paper: '#F9F8F6',    // Warm white
          stone: '#E6E2D3',    // Beige border color
          text: '#2C2C2C'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Cinzel', 'Georgia', 'serif'],
        display: ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C5A059 0%, #E5C57F 50%, #C5A059 100%)',
      },
      boxShadow: {
        'card': '0 10px 30px -10px rgba(28, 27, 26, 0.08)',
        'gold': '0 0 15px rgba(197, 160, 89, 0.2)',
      }
    },
  },
  plugins: [
    typography,
  ],
}`,

  'postcss.config.js': `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,

  'vite.config.ts': `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  }
});`,

  'package.json': `{
  "name": "museum-lens",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@google/genai": "^1.30.0",
    "lucide-react": "^0.454.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-markdown": "^9.0.1"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.10",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.5.3",
    "vite": "^5.4.1"
  }
}`,

  'metadata.json': `{
  "name": "Museum Lens AI",
  "description": "Advanced AI tool for museums to analyze historical images, providing detailed context, dating, and artistic analysis.",
  "requestFramePermissions": [
    "camera"
  ]
}`,

  'services/geminiService.ts': `import { GoogleGenAI, GenerateContentResponse, Tool } from "@google/genai";
import { AnalysisResult } from "../types";

const getApiKey = (): string => {
  if (typeof process !== 'undefined' && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }
  console.warn("API Key not found in environment variables");
  return "";
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      const base64Content = base64Data.split(',')[1];
      resolve({
        inlineData: {
          data: base64Content,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeImage = async (imageFile: File, promptOverride?: string): Promise<AnalysisResult> => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const tools = [{ googleSearch: {} }];

    const systemInstruction = "Sie sind ein KI-Experte für Kunstgeschichte, Archivierung und Museumskuratierung. Strukturieren Sie Ihre Analyse wie folgt in deutscher Sprache: 1. Zusammenfassung 2. Detaillierte Visuelle Analyse 3. Historischer Kontext & Datierung 4. Technische Merkmale 5. Erhaltungszustand 6. Recherche-Ergebnisse. Verwenden Sie einen professionellen, akademischen Tonfall.";

    const prompt = promptOverride || "Analysieren Sie dieses Bild ausführlich für unser Museumsarchiv.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        role: 'user',
        parts: [imagePart, { text: prompt }]
      },
      config: {
        systemInstruction: systemInstruction,
        tools: tools,
        temperature: 0.4,
      }
    });

    const text = response.text || "Keine Analyse generiert.";
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => {
        if (chunk.web) {
            return { web: chunk.web };
        }
        return undefined;
    }).filter((chunk) => chunk !== undefined);

    return {
      text,
      // @ts-ignore
      groundingChunks
    };

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    throw error;
  }
};`,

  'components/Header.tsx': `import React from 'react';
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
};`,

  'components/ImageUpload.tsx': `import React, { useRef, useState } from 'react';
import { Upload, Camera, Image as ImageIcon, Search, BookOpen, ShieldCheck } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (file: File) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageSelected(event.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageSelected(file);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div 
        className={\`relative p-1 transition-all duration-500 rounded-xl \${isDragging ? 'scale-[1.01]' : 'hover:shadow-gold'}\`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={\`bg-white rounded-lg p-10 md:p-16 text-center border-[3px] border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-8 relative overflow-hidden \${isDragging ? 'border-museum-gold bg-amber-50/30' : 'border-museum-stone'}\`}>
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-museum-gold opacity-50 m-2"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-museum-gold opacity-50 m-2"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-museum-gold opacity-50 m-2"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-museum-gold opacity-50 m-2"></div>

          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto bg-museum-paper rounded-full flex items-center justify-center border border-museum-stone mb-6 shadow-sm group">
              <Upload size={32} className="text-museum-gold group-hover:-translate-y-1 transition-transform duration-300" strokeWidth={1.5} />
            </div>
            <h3 className="text-3xl font-serif text-museum-charcoal mb-3 tracking-wide">Artefakt erfassen</h3>
            <p className="text-gray-500 max-w-md mx-auto font-sans font-light mb-8 leading-relaxed">
              Laden Sie ein Bild zur kuratorischen Analyse hoch. <br/>
              <span className="text-xs uppercase tracking-widest text-museum-gold mt-2 block opacity-70">Unterstützte Formate: JPG, PNG, WEBP</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              <button onClick={() => fileInputRef.current?.click()} className="btn-outline min-w-[160px] flex items-center justify-center gap-2">
                <ImageIcon size={18} /> <span>Datei wählen</span>
              </button>
              <input type="file" accept="image/*" capture="environment" className="hidden" ref={cameraInputRef} onChange={handleFileChange} />
              <button onClick={() => cameraInputRef.current?.click()} className="btn-primary min-w-[160px] flex items-center justify-center gap-2">
                <Camera size={18} /> <span>Foto aufnehmen</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Search, title: "Provenienz", desc: "Bestimmung von Herkunft und Datierung anhand stilistischer Merkmale." },
          { icon: BookOpen, title: "Ikonographie", desc: "Deutung von Symbolen, Szenen und historischen Referenzen." },
          { icon: ShieldCheck, title: "Zustand", desc: "Erste konservatorische Einschätzung des Erhaltungszustands." }
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center p-6 rounded-lg hover:bg-white hover:shadow-card transition-all duration-300 border border-transparent hover:border-museum-stone/50">
            <div className="mb-4 p-3 rounded-full bg-museum-paper border border-museum-stone text-museum-charcoal">
              <item.icon size={20} strokeWidth={1.5} />
            </div>
            <h4 className="font-serif font-semibold mb-2 text-museum-charcoal text-lg">{item.title}</h4>
            <p className="text-sm text-gray-500 leading-relaxed font-light">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};`,

  'components/AnalysisView.tsx': `import React from 'react';
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
};`,

  'components/LoadingState.tsx': `import React, { useEffect, useState } from 'react';
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
          <div key={i} className={\`w-2 h-2 rounded-full transition-all duration-500 \${i === step ? 'bg-museum-gold scale-125' : 'bg-gray-200'}\`} />
        ))}
      </div>
    </div>
  );
};`,

  'components/InstallGuide.tsx': `import React from 'react';
import { X, Share, Menu, PlusSquare, Smartphone } from 'lucide-react';

interface InstallGuideProps {
  onClose: () => void;
}

export const InstallGuide: React.FC<InstallGuideProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative">
        <div className="bg-[#2d2a26] text-[#fdfcf8] p-4 flex items-center justify-between">
           <div className="flex items-center gap-2"><Smartphone size={20} className="text-[#c5a059]" /><h3 className="font-serif font-bold tracking-wide">App Installieren</h3></div>
           <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-8 overflow-y-auto max-h-[60vh]">
           <div className="space-y-3">
             <h4 className="font-bold text-[#2d2a26] flex items-center gap-2 border-b border-gray-100 pb-2"><span className="text-[#c5a059]">01.</span> iOS (iPhone)</h4>
             <ol className="space-y-3 text-sm text-gray-600">
               <li className="flex items-start gap-3"><div className="p-1.5 bg-gray-100 rounded text-[#2d2a26]"><Share size={16} /></div><span>Tippen Sie unten in Safari auf den <strong>Teilen</strong>-Button.</span></li>
               <li className="flex items-start gap-3"><div className="p-1.5 bg-gray-100 rounded text-[#2d2a26]"><PlusSquare size={16} /></div><span>Scrollen Sie runter und wählen Sie <strong>Zum Home-Bildschirm</strong>.</span></li>
             </ol>
           </div>
           <div className="space-y-3">
             <h4 className="font-bold text-[#2d2a26] flex items-center gap-2 border-b border-gray-100 pb-2"><span className="text-[#c5a059]">02.</span> Android</h4>
             <ol className="space-y-3 text-sm text-gray-600">
               <li className="flex items-start gap-3"><div className="p-1.5 bg-gray-100 rounded text-[#2d2a26]"><Menu size={16} /></div><span>Tippen Sie oben rechts auf das <strong>Menü</strong> (Drei Punkte).</span></li>
               <li className="flex items-start gap-3"><div className="p-1.5 bg-gray-100 rounded text-[#2d2a26]"><PlusSquare size={16} /></div><span>Wählen Sie <strong>App installieren</strong> oder <strong>Zum Startbildschirm</strong>.</span></li>
             </ol>
           </div>
        </div>
        <div className="p-4 bg-[#fcfaf5] border-t border-[#e5e0d6] text-center">
          <button onClick={onClose} className="px-8 py-2 bg-[#2d2a26] text-white rounded-lg shadow-md hover:bg-[#403d38] transition-colors font-medium text-sm">Verstanden</button>
        </div>
      </div>
    </div>
  );
};`,

  'App.tsx': `import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { AnalysisView } from './components/AnalysisView';
import { LoadingState } from './components/LoadingState';
import { InstallGuide } from './components/InstallGuide';
import { analyzeImage } from './services/geminiService';
import { AppState, AnalysisResult } from './types';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  const handleImageSelected = async (file: File) => {
    setSelectedImage(file);
    setError(null);
    setAppState(AppState.ANALYZING);
    try {
      const result = await analyzeImage(file);
      setAnalysisResult(result);
      setAppState(AppState.RESULTS);
    } catch (err) {
      console.error(err);
      setError("Die Analyse konnte nicht durchgeführt werden. Bitte versuchen Sie es erneut oder überprüfen Sie Ihre Internetverbindung.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setError(null);
    setAppState(AppState.IDLE);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onHelpClick={() => setShowInstallGuide(true)} />
      {showInstallGuide && <InstallGuide onClose={() => setShowInstallGuide(false)} />}
      <main className="flex-grow w-full px-4 py-12 md:py-16 print:p-0">
        <div className="container mx-auto max-w-6xl">
          {appState === AppState.IDLE && (
            <div className="fade-in flex flex-col items-center">
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
                <div className="inline-block px-3 py-1 border border-museum-gold/30 rounded-full bg-amber-50/50 mb-4">
                   <span className="text-museum-gold text-xs font-bold tracking-[0.2em] uppercase">AI Supported History</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-serif text-museum-charcoal leading-tight">
                  Das digitale Auge <br/>
                  <span className="text-transparent bg-clip-text bg-gold-gradient italic pr-2">Ihres Museums</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed font-light max-w-2xl mx-auto font-sans">
                  Laden Sie ein Foto eines Artefakts hoch. Unsere KI analysiert Epoche, Material und historischen Kontext in Sekunden und erstellt einen kuratorischen Bericht.
                </p>
              </div>
              <ImageUpload onImageSelected={handleImageSelected} />
            </div>
          )}
          {appState === AppState.ANALYZING && (
            <div className="flex items-center justify-center min-h-[60vh]">
              <LoadingState />
            </div>
          )}
          {appState === AppState.RESULTS && selectedImage && analysisResult && (
            <AnalysisView image={selectedImage} result={analysisResult} onReset={handleReset} />
          )}
          {appState === AppState.ERROR && (
            <div className="flex flex-col items-center justify-center py-20 text-center fade-in">
              <div className="bg-red-50 p-8 rounded-full mb-6 border border-red-100 shadow-sm">
                <AlertCircle size={48} className="text-red-800" strokeWidth={1} />
              </div>
              <h3 className="text-3xl font-serif text-museum-charcoal mb-4">Analyse unterbrochen</h3>
              <p className="text-gray-600 max-w-md mb-10 leading-relaxed font-light">{error}</p>
              <button onClick={handleReset} className="btn-primary">Erneut versuchen</button>
            </div>
          )}
        </div>
      </main>
      <footer className="bg-white border-t border-museum-stone/60 py-10 mt-auto print:hidden">
        <div className="container mx-auto text-center px-4">
          <p className="text-museum-gold font-serif text-lg font-bold mb-2">MUSEUM LENS</p>
          <p className="text-xs text-gray-400 tracking-widest uppercase">© {new Date().getFullYear()} Digital Preservation Initiative</p>
        </div>
      </footer>
    </div>
  );
};
export default App;`
};

// Function to create file
const writeFile = (fileName, content) => {
  const filePath = path.join(__dirname, fileName);
  
  ensureDir(filePath);
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated: ${fileName}`);
};

console.log("Restoring Full Museum Lens Application...");

Object.entries(files).forEach(([fileName, content]) => {
  writeFile(fileName, content);
});

console.log("\nSuccess! Project restored. Please run: npm install && npm run dev");
