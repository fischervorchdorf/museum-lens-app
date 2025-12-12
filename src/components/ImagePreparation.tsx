import React, { useRef } from 'react';
import { ArtifactImage } from '../types';
import { Plus, X, Sparkles } from 'lucide-react';

interface ImagePreparationProps {
    images: ArtifactImage[];
    onAddImages: (files: File[]) => void;
    onRemoveImage: (id: string) => void;
    onUpdateDescription: (id: string, description: string) => void;
    onAnalyze: () => void;
    onCancel: () => void;
}

export const ImagePreparation: React.FC<ImagePreparationProps> = ({
    images,
    onAddImages,
    onRemoveImage,
    onUpdateDescription,
    onAnalyze,
    onCancel,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const maxImages = 4;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            onAddImages(filesArray);
            // Reset input value to allow selecting same file again if needed
            event.target.value = '';
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8 fade-in">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-serif font-bold text-[#2d2a26]">
                    Analyse vorbereiten
                </h2>
                <button
                    onClick={onCancel}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                >
                    Abbrechen
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {images.map((image, index) => (
                    <div key={image.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                        <div className="relative w-32 h-32 flex-shrink-0">
                            <img
                                src={image.preview}
                                alt={`Artefakt ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg border border-gray-200"
                            />
                            <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                                #{index + 1}
                            </div>
                            <button
                                onClick={() => onRemoveImage(image.id)}
                                className="absolute -top-2 -right-2 bg-white text-gray-500 hover:text-red-500 rounded-full p-1 shadow-md border border-gray-200 transition-colors"
                                title="Bild entfernen"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="flex-grow flex flex-col">
                            <label className="text-xs font-semibold uppercase text-gray-400 mb-1">
                                Zusatzinformation (Optional)
                            </label>
                            <textarea
                                value={image.description}
                                onChange={(e) => onUpdateDescription(image.id, e.target.value)}
                                placeholder="z.B. Detail der Rückseite, Unterschrift, Beschädigung..."
                                className="flex-grow w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c5a059] focus:border-transparent resize-none bg-[#fcfaf5]"
                            />
                        </div>
                    </div>
                ))}

                {images.length < maxImages && (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center min-h-[160px] cursor-pointer hover:border-[#c5a059] hover:bg-[#fcfaf5] transition-all group"
                    >
                        <div className="bg-[#f4f1ea] p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                            <Plus size={24} className="text-[#8c867a]" />
                        </div>
                        <p className="font-medium text-gray-600">Weiteres Bild hinzufügen</p>
                        <p className="text-xs text-gray-400 mt-1">
                            Noch {maxImages - images.length} möglich
                        </p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            multiple
                            className="hidden"
                        />
                    </div>
                )}
            </div>

            <div className="flex justify-center">
                <button
                    onClick={onAnalyze}
                    className="flex items-center gap-2 px-8 py-4 bg-[#2d2a26] text-white rounded-xl hover:bg-[#403d38] transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                    <Sparkles size={20} className="text-[#c5a059]" />
                    <span className="font-semibold text-lg">Jetzt Analysieren</span>
                </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-4">
                {images.length} Bild{images.length > 1 ? 'er' : ''} ausgewählt
            </p>
        </div>
    );
};
