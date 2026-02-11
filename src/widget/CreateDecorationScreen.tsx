import { useState } from 'react';
import { StepTwo } from './creation-steps/StepTwo';
import { StepThree } from './creation-steps/StepThree';

interface CreateDecorationScreenProps {
  propertyImages: string[];
}

export type RoomType = 'living-room' | 'bedroom' | 'kitchen' | 'bathroom' | 'balcony' | 'office' | 'gourmet';
export type StyleType = 'minimalist' | 'modern' | 'rustic' | 'classic' | 'tropical' | 'industrial';

export function CreateDecorationScreen({ propertyImages }: CreateDecorationScreenProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<RoomType>('living-room');
  const [selectedStyle, setSelectedStyle] = useState<StyleType | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock generated image - in production this would come from the API
    const mockGeneratedImage = 'https://images.unsplash.com/photo-1636321667799-ddf30b3e1261?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwbGl2aW5nJTIwcm9vbSUyMHdoaXRlfGVufDF8fHx8MTc2OTUxMjgxNXww&ixlib=rb-4.1.0&q=80&w=1080';
    
    setGeneratedImages([mockGeneratedImage]);
    setIsGenerating(false);
    setCurrentStep(2);
  };

  const handleRefine = async (refinementPrompt: string) => {
    setIsGenerating(true);
    
    // Simulate refinement
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Add new version to history
    const mockRefinedImage = 'https://images.unsplash.com/photo-1705321963943-de94bb3f0dd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb250ZW1wb3JhcnklMjBpbnRlcmlvciUyMGRlc2lnbnxlbnwxfHx8fDE3Njk1MTkzNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080';
    setGeneratedImages([...generatedImages, mockRefinedImage]);
    setIsGenerating(false);
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setSelectedRoom('living-room');
    setSelectedStyle(null);
    setCustomPrompt('');
    setGeneratedImages([]);
  };

  return (
    <div>
      {currentStep === 1 && (
        <StepTwo
          selectedRoom={selectedRoom}
          selectedStyle={selectedStyle}
          customPrompt={customPrompt}
          onStyleSelect={setSelectedStyle}
          onPromptChange={setCustomPrompt}
          onGenerate={handleGenerate}
          propertyImages={propertyImages}
          selectedImageIndex={selectedImageIndex}
        />
      )}

      {currentStep === 2 && (
        <StepThree
          selectedRoom={selectedRoom}
          selectedStyle={selectedStyle}
          generatedImages={generatedImages}
          isGenerating={isGenerating}
          onRefine={handleRefine}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}