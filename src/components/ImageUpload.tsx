import React, { useRef, useState } from 'react';
import { Upload, Camera, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (files: File[]) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onImageSelected(Array.from(event.target.files));
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
      if (validFiles.length > 0) {
        onImageSelected(validFiles);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 md:p-16 text-center transition-all duration-300
          flex flex-col items-center justify-center gap-6 bg-white shadow-sm
          ${isDragging ? 'border-[#c5a059] bg-[#fcfaf5]' : 'border-gray-300 hover:border-[#c5a059] hover:bg-gray-50'}
        `}
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
            Ziehen Sie bis zu 4 Bilder hierher oder nutzen Sie die Buttons unten.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center pt-4">
          <input
            type="file"
            accept="image/*"
            multiple
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
};