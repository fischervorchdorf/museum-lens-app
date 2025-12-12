const fs = require('fs');
const path = require('path');

// Hilfsfunktion, um Verzeichnisse zu erstellen
function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) return true;
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

const files = {
  'package.json': `{
  "name": "museum-lens",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@google/genai": "^0.1.1",
    "lucide-react": "^0.344.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-markdown": "^9.0.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.64",
    "@types/react-dom": "^18.2.21",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "vite": "^5.1.4",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1"
  }
}`,

  'vite.config.ts': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`,

  'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`,

  'tsconfig.node.json': `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`,

  'vite-env.d.ts': `/// <reference types="vite/client" />`,

  'postcss.config.js': `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,

  'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}`,

  'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="theme-color" content="#2d2a26">
    <title>Museum Lens AI</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>`,

  'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Inter', sans-serif;
  background-color: #fdfcf8;
  color: #2d2a26;
}
h1, h2, h3, .serif {
  font-family: 'Cinzel', serif;
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e5e0d6;
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #c5a059;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}`,

  'src/index.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,

  'src/types.ts': `export interface AnalysisResult {
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

  'src/services/geminiService.ts': `import { GoogleGenAI, GenerateContentResponse, Tool } from "@google/genai";
import { AnalysisResult } from "../types";

// WICHTIG: Für lokale Entwicklung nutzen wir import.meta.env
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

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
    
    const tools: Tool[] = [{ googleSearch: {} }];

    const systemInstruction = \`
      Sie sind ein KI-Experte für Kunstgeschichte, Archivierung und Museumskuratierung. 
      Ihre Aufgabe ist es, historische Fotografien, Gemälde oder Artefakte zu analysieren.
      
      Strukturieren Sie Ihre Analyse wie folgt in deutscher Sprache:
      
      1. **Zusammenfassung**: Eine prägnante Beschreibung des Bildes.
      2. **Detaillierte Visuelle Analyse**: Beschreiben Sie Kleidung, Objekte, Architektur, Landschaft und Personen im Detail.
      3. **Historischer Kontext & Datierung**: Versuchen Sie, das Entstehungsdatum und den Ort so genau wie möglich einzugrenzen. Begründen Sie dies anhand visueller Hinweise (z.B. Modestil, Technik).
      4. **Technische Merkmale**: Art der Fotografie (z.B. Daguerreotypie, Albuminabzug) oder Maltechnik, falls erkennbar.
      5. **Erhaltungszustand**: Notieren Sie sichtbare Schäden, Vergilbungen oder Restaurierungsbedarf.
      6. **Recherche-Ergebnisse**: Nutzen Sie Ihr Wissen und die Google-Suche, um potenzielle Orte, Ereignisse oder Personen zu identifizieren.

      Verwenden Sie einen professionellen, akademischen, aber verständlichen Tonfall.
    \`;

    const prompt = promptOverride || "Analysieren Sie dieses Bild ausführlich für unser Museumsarchiv.";

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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
    }).filter((chunk): chunk is { web: { uri: string; title: string } } => chunk !== undefined);

    return {
      text,
      groundingChunks
    };

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    throw error;
  }
};`,

  'src/components/Header.tsx': `import React from 'react';
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
};`,

  'src/components/ImageUpload.tsx': `import React, { useRef, useState } from 'react';
import { Upload, Camera, Image as ImageIcon } from 'lucide-react';

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
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div 
        className={\`
          relative border-2 border-dashed rounded-xl p-8 md:p-16 text-center transition-all duration-300
          flex flex-col items-center justify-center gap-6 bg-white shadow-sm
          \${isDragging ? 'border-[#c5a059] bg-[#fcfaf5]' : 'border-gray-300 hover:border-[#c5a059] hover:bg-gray-50'}
        \`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="p-4 rounded-full bg-[#f4f1ea] text-[#8c867a]">
          <Upload size={48} strokeWidth={1.5} />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-serif font-semibold text-[#2d2a26]">
            Artefakt hochladen
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            Ziehen Sie ein Bild hierher oder nutzen Sie die Buttons unten für Upload oder Kamera.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center pt-4">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2d2a26] text-white rounded-lg hover:bg-[#403d38] transition-colors shadow-md"
          >
            <ImageIcon size={20} />
            <span>Galerie öffnen</span>
          </button>

          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            ref={cameraInputRef}
            onChange={handleFileChange}
          />
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#c5a059] text-[#2d2a26] rounded-lg hover:bg-[#d4b06a] transition-colors shadow-md font-semibold"
          >
            <Camera size={20} />
            <span>Foto aufnehmen</span>
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <h4 className="font-serif font-semibold mb-1 text-[#c5a059]">Historische Einordnung</h4>
          <p className="text-sm text-gray-500">Datierung und Kontextanalyse durch KI.</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <h4 className="font-serif font-semibold mb-1 text-[#c5a059]">Detailerkennung</h4>
          <p className="text-sm text-gray-500">Identifikation von Objekten und Symbolen.</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <h4 className="font-serif font-semibold mb-1 text-[#c5a059]">Zustandsbericht</h4>
          <p className="text-sm text-gray-500">Einschätzung von Schäden und Technik.</p>
        </div>
      </div>
    </div>
  );
};`,

  'src/components/AnalysisView.tsx': `import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AnalysisResult } from '../types';
import { ArrowLeft, ExternalLink, RotateCcw, Printer } from 'lucide-react';

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
          <div className="relative rounded-lg overflow-hidden shadow-lg border-8 border-white bg-white print:shadow-none print:border-0">
            <img 
              src={imageUrl} 
              alt="Uploaded artifact" 
              className="w-full h-auto max-h-[70vh] object-contain bg-black/5 print:max-h-[500px] print:object-contain print:mx-auto"
            />
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
                          className="text-sm text-[#c5a059] hover:underline truncate block print:text-black print:no-underline"
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
};`,

  'src/components/LoadingState.tsx': `import React, { useEffect, useState } from 'react';
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
            className={\`w-2 h-2 rounded-full transition-colors duration-500 \${i === step ? 'bg-[#c5a059]' : 'bg-gray-200'}\`}
          />
        ))}
      </div>
    </div>
  );
};`,

  'src/components/InstallGuide.tsx': `import React from 'react';
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
};`,

  'src/App.tsx': `import React, { useState } from 'react';
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
      setError("Die Analyse konnte nicht durchgeführt werden.");
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
    <div className="min-h-screen bg-[#fdfcf8] flex flex-col font-sans">
      <Header onHelpClick={() => setShowInstallGuide(true)} />
      
      {showInstallGuide && (
        <InstallGuide onClose={() => setShowInstallGuide(false)} />
      )}
      
      <main className="flex-grow container mx-auto max-w-7xl p-4 print:p-0">
        
        {appState === AppState.IDLE && (
          <div className="fade-in">
            <div className="max-w-3xl mx-auto text-center py-12">
              <h2 className="text-3xl md:text-4xl font-serif text-[#2d2a26] mb-4">
                Entdecken Sie die Geschichte hinter dem Bild
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Nutzen Sie modernste KI, um Details, historische Kontexte und Hintergründe Ihrer Museumsexponate oder privaten Fotos zu entschlüsseln.
              </p>
            </div>
            <ImageUpload onImageSelected={handleImageSelected} />
          </div>
        )}

        {appState === AppState.ANALYZING && (
          <LoadingState />
        )}

        {appState === AppState.RESULTS && selectedImage && analysisResult && (
          <AnalysisView 
            image={selectedImage} 
            result={analysisResult} 
            onReset={handleReset} 
          />
        )}

        {appState === AppState.ERROR && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-red-50 p-6 rounded-full mb-4">
              <AlertCircle size={48} className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Ein Fehler ist aufgetreten</h3>
            <p className="text-gray-600 max-w-md mb-8">{error}</p>
            <button 
              onClick={handleReset}
              className="px-6 py-3 bg-[#2d2a26] text-white rounded-lg hover:bg-[#403d38] transition-colors"
            >
              Erneut versuchen
            </button>
          </div>
        )}

      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-auto print:hidden">
        <div className="container mx-auto text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Museum Lens AI. Powered by Gemini.</p>
        </div>
      </footer>
    </div>
  );
};
export default App;`
};

// Dateien erstellen
Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  ensureDirectoryExistence(fullPath);
  fs.writeFileSync(fullPath, content);
  console.log(`Erstellt: ${filePath}`);
});

console.log('Alle Dateien erstellt! Jetzt "npm install" ausführen.');