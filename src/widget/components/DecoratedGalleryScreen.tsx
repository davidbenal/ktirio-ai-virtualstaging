import { useState } from 'react';
import { Share2, MessageCircle, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { ShareModal } from './ShareModal';
import { LeadCaptureModal } from './LeadCaptureModal';

interface DecoratedGalleryScreenProps {
  propertyImages: string[];
}

const decoratedStyles = [
  {
    id: 'minimalist',
    name: 'Minimalista',
    images: [
      'https://images.unsplash.com/photo-1636321667799-ddf30b3e1261?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwbGl2aW5nJTIwcm9vbSUyMHdoaXRlfGVufDF8fHx8MTc2OTUxMjgxNXww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1705321963943-de94bb3f0dd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwbW9kZXJuJTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3Njk1NDIxNjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1744974256549-8ece7cdb5dd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwd2hpdGUlMjBpbnRlcmlvciUyMGJlZHJvb218ZW58MXx8fHwxNzY5NTQyMTg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
  },
  {
    id: 'modern',
    name: 'Moderno',
    images: [
      'https://images.unsplash.com/photo-1705321963943-de94bb3f0dd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb250ZW1wb3JhcnklMjBpbnRlcmlvciUyMGRlc2lnbnxlbnwxfHx8fDE3Njk1MTkzNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1685644201646-9e836c398c92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb250ZW1wb3JhcnklMjBkaW5pbmclMjByb29tfGVufDF8fHx8MTc2OTU0MjE4NHww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
  },
  {
    id: 'rustic',
    name: 'Rústico',
    images: [
      'https://images.unsplash.com/photo-1768846316943-f8e58a34dc40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXN0aWMlMjB3b29kZW4lMjBpbnRlcmlvciUyMGNvenl8ZW58MXx8fHwxNzY5NTE5MzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1673905373555-5c08337c06a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXN0aWMlMjBjb3p5JTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzY5NTQyMTY5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1726091097680-5da84f593ccd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXN0aWMlMjB3b29kZW4lMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc2OTU0MjE4NXww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
  },
  {
    id: 'classic',
    name: 'Clássico',
    images: [
      'https://images.unsplash.com/photo-1707299231603-6c0a93e0f7fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwZWxlZ2FudCUyMGludGVyaW9yJTIwZGVzaWdufGVufDF8fHx8MTc2OTUxOTM0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1759691321555-94fed84288fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwZWxlZ2FudCUyMGJlZHJvb218ZW58MXx8fHwxNzY5NTQyMTcwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
  },
  {
    id: 'tropical',
    name: 'Tropical',
    images: [
      'https://images.unsplash.com/photo-1769473357493-319cbde6b248?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGludGVyaW9yJTIwcGxhbnRzJTIwcmF0dGFufGVufDF8fHx8MTc2OTUxOTM0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
  },
];

export function DecoratedGalleryScreen({ propertyImages }: DecoratedGalleryScreenProps) {
  const [selectedStyle, setSelectedStyle] = useState(decoratedStyles[0]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState<'specialist' | 'visit' | null>(null);

  const handleStyleSelect = (style: typeof decoratedStyles[0]) => {
    setSelectedStyle(style);
    setCurrentImageIndex(0);
  };

  const handleImageSelect = (index: number) => {
    setCurrentImageIndex(index);
  };

  const nextImage = () => {
    if (selectedStyle.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedStyle.images.length);
    }
  };

  const prevImage = () => {
    if (selectedStyle.images.length > 1) {
      setCurrentImageIndex((prev) => 
        (prev - 1 + selectedStyle.images.length) % selectedStyle.images.length
      );
    }
  };

  return (
    <>
      <div className="p-6 flex flex-col max-h-[calc(90vh-80px)]">
        {/* Main Image Viewer - Reduced Size */}
        <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[16/10] mb-3">
          <img
            src={selectedStyle.images[currentImageIndex]}
            alt={selectedStyle.name}
            className="w-full h-full object-cover"
          />

          {/* Navigation Arrows */}
          {selectedStyle.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Image Indicators Inside Bottom of Image */}
          {selectedStyle.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {selectedStyle.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleImageSelect(index)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    currentImageIndex === index
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

        {/* Style Selector - More Compact */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Estilos de Decoração</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {decoratedStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => handleStyleSelect(style)}
                className={`flex-shrink-0 ${
                  selectedStyle.id === style.id ? 'ring-2 ring-[#f9c700]' : 'ring-1 ring-gray-200'
                } rounded-lg overflow-hidden transition-all hover:ring-gray-400`}
              >
                <div className="w-16 h-16">
                  <img
                    src={style.images[0]}
                    alt={style.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="px-2 py-1 text-xs text-center bg-white">
                  {style.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-3" />

        {/* CTAs - Always Visible */}
        <div className="flex flex-col md:flex-row gap-2">
          <button 
            onClick={() => setShowShareModal(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 hover:bg-gray-50 rounded-md transition-colors text-sm"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartilhar</span>
          </button>
          <button 
            onClick={() => setShowLeadModal('specialist')}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 hover:bg-gray-50 rounded-md transition-colors text-sm">
            <MessageCircle className="w-4 h-4" />
            <span>Fale com Especialista</span>
          </button>
          <button 
            onClick={() => setShowLeadModal('visit')}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#f9c700] hover:bg-[#e0b600] text-black rounded-md transition-colors text-sm font-medium">
            <Calendar className="w-4 h-4" />
            <span>Agendar Visita</span>
          </button>
        </div>
      </div>

      {showShareModal && (
        <ShareModal
          imageUrl={selectedStyle.images[currentImageIndex]}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {showLeadModal && (
        <LeadCaptureModal
          context={showLeadModal}
          onClose={() => setShowLeadModal(null)}
        />
      )}
    </>
  );
}