import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { ImagePreparation } from './components/ImagePreparation';
import { AnalysisView } from './components/AnalysisView';
import { LoadingState } from './components/LoadingState';
import { InstallGuide } from './components/InstallGuide';
import { analyzeImage } from './services/geminiService';
import { AppState, AnalysisResult, ArtifactImage } from './types';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [selectedImages, setSelectedImages] = useState<ArtifactImage[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  const handleImagesSelected = (files: File[]) => {
    const newImages: ArtifactImage[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      description: ''
    }));

    setSelectedImages(prev => [...prev, ...newImages].slice(0, 4));
    setError(null);
    setAppState(AppState.PREVIEW);
  };

  const handleAddImages = (files: File[]) => {
    handleImagesSelected(files);
  };

  const handleRemoveImage = (id: string) => {
    setSelectedImages(prev => prev.filter(img => img.id !== id));
    if (selectedImages.length <= 1) { // If removing the last one (state not updated yet)
      // actually if length becomes 0, should go back to IDLE? 
      // If prev.length was 1, now 0.
    }
  };

  // Effect to handle empty images list if needed, or just let users add more. 
  // If user removes all images, maybe stay in PREVIEW but show empty state? 
  // Or go back to IDLE. Let's go back to IDLE if empty.
  React.useEffect(() => {
    if (appState === AppState.PREVIEW && selectedImages.length === 0) {
      setAppState(AppState.IDLE);
    }
  }, [selectedImages, appState]);


  const handleUpdateDescription = (id: string, description: string) => {
    setSelectedImages(prev => prev.map(img =>
      img.id === id ? { ...img, description } : img
    ));
  };

  const handleAnalyze = async () => {
    if (selectedImages.length === 0) return;

    setAppState(AppState.ANALYZING);
    setError(null);

    try {
      const result = await analyzeImage(selectedImages);
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
    // Cleanup previews
    selectedImages.forEach(img => URL.revokeObjectURL(img.preview));
    setSelectedImages([]);
    setAnalysisResult(null);
    setError(null);
    setAppState(AppState.IDLE);
  };

  return (
    <div className="min-h-screen bg-museum-paper flex flex-col font-sans">
      <Header onHelpClick={() => setShowInstallGuide(true)} />

      {showInstallGuide && (
        <InstallGuide onClose={() => setShowInstallGuide(false)} />
      )}

      <main className="flex-grow container mx-auto max-w-7xl p-4 print:p-0">

        {appState === AppState.IDLE && (
          <div className="fade-in">
            <div className="max-w-3xl mx-auto text-center py-12 px-4">
              <h2 className="text-4xl md:text-6xl font-serif text-museum-charcoal leading-tight mb-4">
                Jedes Bild <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-amber-600 italic font-bold">
                  erzählt eine Geschichte
                </span>
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Nutzen Sie modernste KI, um Details, historische Kontexte und Hintergründe Ihrer Museumsexponate oder privaten Fotos zu entschlüsseln.
              </p>
            </div>
            <ImageUpload onImageSelected={handleImagesSelected} />
          </div>
        )}

        {appState === AppState.PREVIEW && (
          <ImagePreparation
            images={selectedImages}
            onAddImages={handleAddImages}
            onRemoveImage={handleRemoveImage}
            onUpdateDescription={handleUpdateDescription}
            onAnalyze={handleAnalyze}
            onCancel={handleReset}
          />
        )}

        {appState === AppState.ANALYZING && (
          <LoadingState />
        )}

        {appState === AppState.RESULTS && selectedImages.length > 0 && analysisResult && (
          <AnalysisView
            images={selectedImages}
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
              onClick={() => setAppState(AppState.PREVIEW)} // Go back to preview instead of reset?
              className="px-6 py-3 bg-[#2d2a26] text-white rounded-lg hover:bg-[#403d38] transition-colors"
            >
              Korrigieren
            </button>
            <button
              onClick={handleReset}
              className="mt-4 px-6 py-2 text-gray-500 hover:text-gray-800 transition-colors"
            >
              Neu starten
            </button>
          </div>
        )}

      </main>

      <footer className="bg-white border-t border-museum-stone/20 py-6 mt-auto print:hidden">
        <div className="container mx-auto text-center">
          <p className="text-sm text-gray-700">
            &copy; {new Date().getFullYear()} Museum Lens • Powered by{' '}
            <span className="font-semibold text-museum-charcoal">Heimatverein Vorchdorf</span>
            {' '}• Version 1.5
          </p>
          <p className="text-xs text-gray-600 mt-1">
            KI-gestützte Bildanalyse für Museumsexponate
          </p>
        </div>
      </footer>
    </div>
  );
};
export default App;