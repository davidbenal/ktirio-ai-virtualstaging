import { useState } from 'react';
import { RotateCcw, Share2, Calendar, Loader2, Sparkles } from 'lucide-react';
import type { RoomType, StyleType } from './CreateDecorationScreen';
import { ShareModal } from './ShareModal';
import { LeadCaptureModal } from './LeadCaptureModal';

interface StepThreeProps {
  selectedRoom: RoomType;
  selectedStyle: StyleType | null;
  generatedImages: string[];
  isGenerating: boolean;
  onRefine: (prompt: string) => void;
  onRestart: () => void;
}

const roomLabels: Record<RoomType, string> = {
  'living-room': 'Sala de Estar',
  'bedroom': 'Quarto',
  'kitchen': 'Cozinha',
  'bathroom': 'Banheiro',
  'balcony': 'Varanda',
  'office': 'Escritório',
  'gourmet': 'Área Gourmet',
};

const styleLabels: Record<StyleType, string> = {
  'minimalist': 'Minimalista',
  'modern': 'Moderno',
  'rustic': 'Rústico',
  'classic': 'Clássico',
  'tropical': 'Tropical',
  'industrial': 'Industrial',
};

export function StepThree({
  selectedRoom,
  selectedStyle,
  generatedImages,
  isGenerating,
  onRefine,
  onRestart,
}: StepThreeProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(generatedImages.length - 1);
  const [refinementPrompt, setRefinementPrompt] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);

  const handleRefine = () => {
    if (refinementPrompt.trim()) {
      onRefine(refinementPrompt);
      setRefinementPrompt('');
    }
  };

  if (isGenerating) {
    return (
      <div className="p-6">
        <div className="bg-gray-100 rounded-lg aspect-[16/10] flex flex-col items-center justify-center mb-6">
          <Loader2 className="w-12 h-12 text-[#f9c700] animate-spin mb-4" />
          <div className="text-xl font-medium mb-2">✨ Criando sua decoração...</div>
          <div className="w-64 bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-[#f9c700] h-2 rounded-full animate-pulse" style={{ width: '70%' }} />
          </div>
        </div>

        <div className="text-center text-sm text-gray-600 mb-4">
          Preparando: {roomLabels[selectedRoom]} • Estilo {selectedStyle ? styleLabels[selectedStyle] : 'Personalizado'}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-gray-700">
          <span className="font-medium">💡 Dica:</span> Após a geração, você pode pedir ajustes como
          "adicionar mais plantas" ou "mudar sofá para azul"
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 flex flex-col max-h-[calc(90vh-80px)]">
        {/* Generated Image with History Indicators */}
        <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[16/10] mb-3">
          <img
            src={generatedImages[selectedImageIndex]}
            alt="Decoração Gerada"
            className="w-full h-full object-cover"
          />

          {/* Image Indicators Inside Bottom of Image */}
          {generatedImages.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {generatedImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
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

        {/* Refinement Input */}
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={refinementPrompt}
              onChange={(e) => setRefinementPrompt(e.target.value)}
              placeholder='Peça ajustes: "mais plantas", "sofá azul", "parede mais clara"'
              className="flex-1 border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f9c700]"
              onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
            />
            <button
              onClick={handleRefine}
              disabled={!refinementPrompt.trim()}
              className={`px-4 py-2.5 rounded-md font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                refinementPrompt.trim()
                  ? 'bg-[#f9c700] hover:bg-[#e0b600] text-black'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Refinar
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-3" />

        {/* CTAs - Always Visible */}
        <div className="flex flex-col md:flex-row gap-2">
          <button
            onClick={onRestart}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 hover:bg-gray-50 rounded-md transition-colors text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Recomeçar</span>
          </button>
          <button 
            onClick={() => setShowShareModal(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 hover:bg-gray-50 rounded-md transition-colors text-sm"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartilhar</span>
          </button>
          <button 
            onClick={() => setShowLeadModal(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#f9c700] hover:bg-[#e0b600] text-black rounded-md transition-colors text-sm font-medium">
            <Calendar className="w-4 h-4" />
            <span>Agendar Visita</span>
          </button>
        </div>
      </div>

      {showShareModal && (
        <ShareModal
          imageUrl={generatedImages[selectedImageIndex]}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {showLeadModal && (
        <LeadCaptureModal
          context="visit"
          onClose={() => setShowLeadModal(false)}
        />
      )}
    </>
  );
}
