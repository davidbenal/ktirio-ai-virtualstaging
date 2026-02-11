import { useState } from 'react';
import { LeadCaptureModal } from './LeadCaptureModal';

interface ModeSelectionScreenProps {
  onSelectDecoratedGallery: () => void;
  onSelectCreateDecoration: () => void;
}

export function ModeSelectionScreen({ 
  onSelectDecoratedGallery, 
  onSelectCreateDecoration 
}: ModeSelectionScreenProps) {
  return (
    <div className="p-8">
      {/* Mode Selection Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Decorated Gallery Option */}
        <button
          onClick={onSelectDecoratedGallery}
          className="group border-2 border-gray-200 rounded-lg p-6 hover:border-gray-400 hover:shadow-lg transition-all text-left"
        >
          <div className="aspect-video bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg mb-4 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1730991568977-0d3fa9d4af35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzdHlsZWQlMjBsaXZpbmclMjByb29tJTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzY5NTE5MzExfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Decorados Prontos"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h3 className="text-xl font-medium mb-2">Veja os decorados prontos</h3>
          <p className="text-gray-600 text-sm">
            Explore 5 estilos criados por designers
          </p>
        </button>

        {/* Create Decoration Option */}
        <button
          onClick={onSelectCreateDecoration}
          className="group border-2 border-gray-200 rounded-lg p-6 hover:border-gray-400 hover:shadow-lg transition-all text-left"
        >
          <div className="aspect-video bg-gradient-to-br from-pink-50 to-orange-50 rounded-lg mb-4 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1764258560164-97f682adef36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaSUyMHRlY2hub2xvZ3klMjB2aXJ0dWFsJTIwZGVzaWdufGVufDF8fHx8MTc2OTUxOTMxMnww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Criar Decoração"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h3 className="text-xl font-medium mb-2">Criar Minha Decoração</h3>
          <p className="text-gray-600 text-sm">
            Personalize com IA em segundos
          </p>
        </button>
      </div>
    </div>
  );
}