import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { RoomType } from './CreateDecorationScreen';

interface StepOneProps {
  selectedRoom: RoomType | null;
  onRoomSelect: (room: RoomType) => void;
  onNext: () => void;
  propertyImages: string[];
}

export function StepOne({ selectedRoom, onRoomSelect, onNext, propertyImages }: StepOneProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Auto-select first image on mount
  useEffect(() => {
    if (!selectedRoom) {
      onRoomSelect('living-room' as RoomType);
    }
  }, []);

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index);
    // Auto-select living room when image is selected
    if (!selectedRoom) {
      onRoomSelect('living-room' as RoomType);
    }
  };

  const nextImage = () => {
    const newIndex = (selectedImageIndex + 1) % propertyImages.length;
    handleImageSelect(newIndex);
  };

  const prevImage = () => {
    const newIndex = (selectedImageIndex - 1 + propertyImages.length) % propertyImages.length;
    handleImageSelect(newIndex);
  };

  return (
    <div className="p-6 flex flex-col max-h-[calc(90vh-80px)]">
      {/* Progress Indicator */}
      <div className="mb-4">
        <div className="text-sm font-medium mb-2">Passo 1 de 2: Selecione o ambiente</div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 bg-[#f9c700] rounded-full" />
          <div className="flex-1 h-1 bg-gray-300 rounded-full" />
        </div>
      </div>

      {/* Main Image Viewer */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[4/3] md:aspect-[16/10] mb-3">
        <img
          src={propertyImages[selectedImageIndex]}
          alt="Ambiente selecionado"
          className="w-full h-full object-cover"
        />

        {/* Navigation Arrows */}
        {propertyImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image Counter - Mobile only */}
        {propertyImages.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium md:hidden">
            {selectedImageIndex + 1} / {propertyImages.length}
          </div>
        )}

        {/* Image Indicators - Desktop only */}
        {propertyImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 gap-2 hidden md:flex">
            {propertyImages.map((_, index) => (
              <button
                key={index}
                onClick={() => handleImageSelect(index)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                  selectedImageIndex === index
                    ? 'bg-white text-black shadow-lg'
                    : 'bg-black/50 text-white hover:bg-black/70'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery - Desktop only */}
      {propertyImages.length > 1 && (
        <div className="mb-4 hidden md:block">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {propertyImages.map((image, index) => (
              <button
                key={index}
                onClick={() => handleImageSelect(index)}
                className={`flex-shrink-0 rounded-md overflow-hidden transition-all ${
                  selectedImageIndex === index ? 'ring-2 ring-[#f9c700]' : 'ring-1 ring-gray-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={image}
                  alt={`Ambiente ${index + 1}`}
                  className="w-20 h-14 object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-gray-200 my-4" />

      {/* Next Button - Always Visible */}
      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!selectedRoom}
          className={`px-6 py-3 rounded-md font-medium transition-all ${
            selectedRoom
              ? 'bg-[#f9c700] hover:bg-[#e0b600] text-black'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Próximo →
        </button>
      </div>
    </div>
  );
}