import { Sparkles, ImagePlus, Palette, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { RoomType, StyleType } from '../CreateDecorationScreen';

interface StepTwoProps {
  selectedRoom: RoomType;
  selectedStyle: StyleType | null;
  customPrompt: string;
  onStyleSelect: (style: StyleType | null) => void;
  onPromptChange: (prompt: string) => void;
  onGenerate: () => void;
  propertyImages: string[];
  selectedImageIndex: number;
}

const styles = [
  {
    id: 'minimalist' as StyleType,
    name: 'Minimalista',
    image: 'https://images.unsplash.com/photo-1636321667799-ddf30b3e1261?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwbGl2aW5nJTIwcm9vbSUyMHdoaXRlfGVufDF8fHx8MTc2OTUxMjgxNXww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'modern' as StyleType,
    name: 'Moderno',
    image: 'https://images.unsplash.com/photo-1705321963943-de94bb3f0dd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb250ZW1wb3JhcnklMjBpbnRlcmlvciUyMGRlc2lnbnxlbnwxfHx8fDE3Njk1MTkzNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'rustic' as StyleType,
    name: 'Rústico',
    image: 'https://images.unsplash.com/photo-1768846316943-f8e58a34dc40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXN0aWMlMjB3b29kZW4lMjBpbnRlcmlvciUyMGNvenl8ZW58MXx8fHwxNzY5NTE5MzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'classic' as StyleType,
    name: 'Clássico',
    image: 'https://images.unsplash.com/photo-1707299231603-6c0a93e0f7fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwZWxlZ2FudCUyMGludGVyaW9yJTIwZGVzaWdufGVufDF8fHx8MTc2OTUxOTM0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'tropical' as StyleType,
    name: 'Tropical',
    image: 'https://images.unsplash.com/photo-1769473357493-319cbde6b248?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGludGVyaW9yJTIwcGxhbnRzJTIwcmF0dGFufGVufDF8fHx8MTc2OTUxOTM0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

export function StepTwo({
  selectedStyle,
  customPrompt,
  onStyleSelect,
  onPromptChange,
  onGenerate,
  propertyImages,
  selectedImageIndex,
}: StepTwoProps) {
  const [isCustomizeExpanded, setIsCustomizeExpanded] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(selectedImageIndex);
  
  // Lead form state
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  
  const canGenerate = selectedStyle !== null || (isCustomizeExpanded && customPrompt.trim().length > 0);

  const handleStyleClick = (styleId: StyleType) => {
    onStyleSelect(styleId);
    setIsCustomizeExpanded(false);
  };

  const handleCustomizeClick = () => {
    setIsCustomizeExpanded(!isCustomizeExpanded);
    onStyleSelect(null);
  };

  const handleGenerateClick = () => {
    if (canGenerate) {
      setShowLeadModal(true);
    }
  };

  const handleLeadSubmit = () => {
    // Validate form
    if (!leadName.trim() || !leadEmail.trim() || !leadPhone.trim()) {
      alert('Por favor, preencha todos os campos');
      return;
    }
    
    // Here you would send the lead data to your backend
    console.log('Lead data:', { leadName, leadEmail, leadPhone });
    
    setShowLeadModal(false);
    onGenerate();
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      (prev - 1 + propertyImages.length) % propertyImages.length
    );
  };

  return (
    <>
      <div className="p-6 flex flex-col max-h-[calc(90vh-80px)]">
        {/* Progress Indicator */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Escolha o ambiente</div>
        </div>

        {/* Main Image Viewer */}
        <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[4/3] md:aspect-[16/9] mb-2">
          <img
            src={propertyImages[currentImageIndex]}
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
              {currentImageIndex + 1} / {propertyImages.length}
            </div>
          )}

          {/* Image Indicators - Desktop only */}
          {propertyImages.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 gap-2 hidden md:flex">
              {propertyImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
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

        {/* Styles Horizontal Slideshow */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-3">Escolha o estilo:</h3>
          <div className="flex gap-3">
            {!isCustomizeExpanded ? (
              <>
                {/* Fixed "Seu Estilo" Button - Always visible on the left */}
                <button
                  onClick={handleCustomizeClick}
                  className="flex-shrink-0 ring-1 ring-gray-200 rounded-lg overflow-hidden transition-all hover:ring-[#f9c700] bg-gradient-to-br from-purple-50 to-pink-50"
                >
                  <div className="w-20 h-20 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="px-2 py-1 text-xs text-center bg-white font-medium">
                    Seu estilo
                  </div>
                </button>

                {/* Scrollable Styles Container */}
                <div className="flex gap-3 overflow-x-auto pb-2 flex-1">
                  {/* Regular Styles */}
                  {styles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => handleStyleClick(style.id)}
                      className={`flex-shrink-0 ${
                        selectedStyle === style.id ? 'ring-2 ring-[#f9c700]' : 'ring-1 ring-gray-200'
                      } rounded-lg overflow-hidden transition-all hover:ring-[#f9c700]`}
                    >
                      <div className="w-20 h-20">
                        <img
                          src={style.image}
                          alt={style.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="px-2 py-1 text-xs text-center bg-white font-medium">
                        {style.name}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Expanded Customize Section */}
                <div className="flex-1 max-w-md">
                  {/* Top Row: Estilos and Adicionar Referência Buttons */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {/* Collapsed Styles Button */}
                    <button
                      onClick={() => setIsCustomizeExpanded(false)}
                      className="ring-2 ring-[#f9c700] rounded-lg overflow-hidden transition-all hover:ring-[#e0b600] bg-white h-24"
                    >
                      <div className="h-full flex flex-col items-center justify-center">
                        <Palette className="w-8 h-8 text-gray-700 mb-2" />
                        <span className="text-sm font-medium">Estilos</span>
                      </div>
                    </button>

                    {/* Add Reference Button */}
                    <button className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-[#f9c700] transition-colors bg-white h-24">
                      <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Adicionar referência</span>
                    </button>
                  </div>

                  {/* Description Textarea - Full width below with Send Button */}
                  <div className="relative">
                    <textarea
                      value={customPrompt}
                      onChange={(e) => onPromptChange(e.target.value)}
                      placeholder="Descreva o estilo..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-14 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#f9c700] h-24"
                    />
                    {/* Send Button Inside Textarea */}
                    <button
                      onClick={handleGenerateClick}
                      disabled={!canGenerate}
                      className={`absolute right-2 bottom-2 p-3 rounded-lg transition-all ${
                        canGenerate
                          ? 'bg-[#f9c700] hover:bg-[#e0b600] text-black'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Sparkles className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4" />

        {/* Action Button - Only when style is selected (not in custom mode) */}
        {!isCustomizeExpanded && selectedStyle && (
          <div className="flex justify-end">
            <button
              onClick={handleGenerateClick}
              className="px-6 py-3 rounded-md font-medium transition-all flex items-center gap-2 bg-[#f9c700] hover:bg-[#e0b600] text-black"
            >
              <Sparkles className="w-5 h-5" />
              Gerar Decoração
            </button>
          </div>
        )}
      </div>

      {showLeadModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowLeadModal(false)} />
          
          <div className="relative bg-white rounded-lg w-full max-w-[480px] shadow-2xl">
            <div className="p-8">
              <div className="w-16 h-16 bg-[#f9c700] rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-black" />
              </div>
              
              <h3 className="text-2xl font-bold mb-2 text-center">Cadastre-se e Ganhe!</h3>
              <p className="text-gray-600 text-sm mb-6 text-center">
                Preencha seus dados para gerar sua decoração e receber:
              </p>
              
              {/* Benefits Section */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">15</span>
                  </div>
                  <span className="text-sm font-medium">Gerações de decoração gratuitas com IA</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#f9c700] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">⭐</span>
                  </div>
                  <span className="text-sm font-medium">Acesso prioritário na fila de visitas ao imóvel</span>
                </div>
              </div>

              {/* Contact Form */}
              <form onSubmit={(e) => { e.preventDefault(); handleLeadSubmit(); }} className="space-y-4">
                <div>
                  <label htmlFor="lead-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome completo
                  </label>
                  <input
                    id="lead-name"
                    type="text"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f9c700] text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="lead-email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail
                  </label>
                  <input
                    id="lead-email"
                    type="email"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f9c700] text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="lead-phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone/WhatsApp
                  </label>
                  <input
                    id="lead-phone"
                    type="tel"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    placeholder="(48) 99999-9999"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f9c700] text-sm"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#f9c700] hover:bg-[#e0b600] text-black py-4 rounded-lg font-bold transition-colors text-base"
                >
                  Gerar Decoração →
                </button>
              </form>

              <button
                onClick={() => setShowLeadModal(false)}
                className="w-full text-sm text-gray-500 hover:text-gray-700 mt-4"
              >
                Continuar sem cadastro
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}