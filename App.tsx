import React, { useState } from 'react';
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
      const errorMessage = err instanceof Error ? err.message : "Ein unbekannter Fehler ist aufgetreten";
      setError(errorMessage);
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
                  Das digitale Auge <br />
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
export default App;