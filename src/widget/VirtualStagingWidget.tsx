import { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { ModeSelectionScreen } from './components/ModeSelectionScreen';
import { DecoratedGalleryScreen } from './components/DecoratedGalleryScreen';
import { CreateDecorationScreen } from './components/CreateDecorationScreen';
import "../styles/index.css";
import "../styles/theme.css";

type Screen = 'selection' | 'ready-made' | 'ai-creation';

export default function VirtualStagingWidget() {
  const [screen, setScreen] = useState<Screen>('selection');
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const imagesData = params.get('images');
    if (imagesData) {
      try {
        setImages(JSON.parse(decodeURIComponent(imagesData)));
      } catch (e) {
        console.error('Error parsing images', e);
      }
    }
  }, []);

  const closeWidget = () => {
    window.parent.postMessage({ type: 'KTIRIO_WIDGET_CLOSE' }, '*');
  };

  return (
    <div className="h-screen w-full bg-white flex flex-col text-[#1a1a1b] font-sans overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          {screen !== 'selection' && (
            <button
              onClick={() => setScreen('selection')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-xl font-medium">
            {screen === 'selection' && "Visualize seu futuro lar"}
            {screen === 'ready-made' && "Decorados Prontos"}
            {screen === 'ai-creation' && "Criar Decoração"}
          </h1>
        </div>
        <button onClick={closeWidget} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X className="w-6 h-6 text-gray-400" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-white">
        {screen === 'selection' && (
          <ModeSelectionScreen
            onSelectDecoratedGallery={() => setScreen('ready-made')}
            onSelectCreateDecoration={() => setScreen('ai-creation')}
          />
        )}
        {screen === 'ready-made' && (
          <DecoratedGalleryScreen propertyImages={images} />
        )}
        {screen === 'ai-creation' && (
          <CreateDecorationScreen propertyImages={images} />
        )}
      </main>
    </div>
  );
}
