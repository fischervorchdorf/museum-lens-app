import React, { useRef, useState } from 'react';
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
        className={`relative p-1 transition-all duration-500 rounded-xl ${isDragging ? 'scale-[1.01]' : 'hover:shadow-gold'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={`bg-white rounded-lg p-10 md:p-16 text-center border-[3px] border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-8 relative overflow-hidden ${isDragging ? 'border-museum-gold bg-amber-50/30' : 'border-museum-stone'}`}>
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
};