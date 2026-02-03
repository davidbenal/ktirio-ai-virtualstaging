import { useState } from 'react';
import { Menu, ChevronRight, Bed, Car, Bath, Ruler, Calendar } from 'lucide-react';


const propertyImages = [
  'https://images.unsplash.com/photo-1706808849802-8f876ade0d1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBob3VzZSUyMHBvb2wlMjBleHRlcmlvcnxlbnwxfHx8fDE3Njk1NDExMDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1762195804027-04a19d9d3ab6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob21lJTIwZmFjYWRlJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc2OTUxNDQyMnww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/flagged/photo-1556438758-872c68902f60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBlbXB0eSUyMGxpdmluZyUyMHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3Njk1MTkyNjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
];

export function PropertyDetailPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#4a4a4a] text-white px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button className="md:hidden">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl font-light">brognoli</span>
            <div className="w-5 h-5 border-2 border-yellow-500" />
          </div>
          <nav className="hidden md:flex gap-6 text-sm absolute left-1/2 -translate-x-1/2">
            <a href="#" className="hover:text-gray-300">Início</a>
            <a href="#" className="hover:text-gray-300">Comprar</a>
            <a href="#" className="hover:text-gray-300">Alugar</a>
            <a href="#" className="hover:text-gray-300">Lançamentos</a>
            <a href="#" className="hover:text-gray-300">Preço de Custo</a>
            <a href="#" className="hover:text-gray-300">Anunciar</a>
            <a href="#" className="hover:text-gray-300">Blog</a>
          </nav>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="text-sm text-gray-600">
          Brognoli &gt; Imóveis para comprar
        </div>
      </div>

      {/* Image Gallery - 3 Images Side by Side */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8">
        {/* Mobile: Single Image with Navigation */}
        <div className="md:hidden relative rounded-lg overflow-hidden shadow-lg aspect-[3/4] bg-gray-100 mb-4 property-gallery">
          <img
            src={propertyImages[currentImageIndex]}
            alt={`Property view ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />

          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium">
            {currentImageIndex + 1} / {propertyImages.length}
          </div>
        </div>

        {/* Desktop: 3 Images Side by Side */}
        <div className="hidden md:grid grid-cols-3 gap-4 property-gallery">
          {/* Left Image */}
          <div className="relative rounded-lg overflow-hidden shadow-lg aspect-[4/3] bg-gray-100">
            <img
              src={propertyImages[0]}
              alt="Property view 1"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Center Image */}
          <div className="relative rounded-lg overflow-hidden shadow-lg aspect-[4/3] bg-gray-100">
            <img
              src={propertyImages[1]}
              alt="Property view 2"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Image with Navigation Arrow */}
          <div className="relative rounded-lg overflow-hidden shadow-lg aspect-[4/3] bg-gray-100">
            <img
              src={propertyImages[2]}
              alt="Property view 3"
              className="w-full h-full object-cover"
            />

            {/* Navigation Arrow for More Images */}
            <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h1 className="text-2xl md:text-3xl font-normal mb-2">
              Casa Residencial com 607m², 4 quartos, 4 suítes, 6 garagens, no bairro Lagoa Da Conceição em Florianópolis
            </h1>
            <p className="text-gray-600 mb-6">
              Rua Doutel de Andrade - Lagoa Da Conceição - Florianópolis, SC
            </p>

            <div className="flex flex-wrap gap-6 text-sm mb-8">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-[#4a4a4a]" />
                <span>607m²</span>
              </div>
              <div className="flex items-center gap-2">
                <Bed className="w-5 h-5 text-[#4a4a4a]" />
                <span>4 quartos</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-[#4a4a4a]" />
                <span>6 garagens</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="w-5 h-5 text-[#4a4a4a]" />
                <span>7 banheiros</span>
              </div>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-xl font-medium mb-4">Sobre o imóvel</h2>
              <p className="text-gray-700 leading-relaxed">
                Magnífica casa de alto padrão localizada no coração da Lagoa da Conceição,
                um dos bairros mais valorizados de Florianópolis. Com arquitetura contemporânea
                e acabamentos de primeira linha, esta propriedade oferece amplos espaços,
                piscina aquecida, área gourmet completa e vista privilegiada.
                Ideal para quem busca qualidade de vida, conforto e sofisticação.
              </p>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 sticky top-4">
              <div className="text-3xl font-medium mb-2">R$ 7.500.000</div>
              <div className="text-sm text-gray-600 mb-1">Simular Financiamento</div>
              <div className="text-xs text-gray-500 mb-6">IPTU: R$ 7.200</div>

              <button className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg mb-3 transition-colors font-medium">
                Fale com um Especialista
              </button>

              <button className="w-full border border-gray-300 hover:bg-gray-50 py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                Agendar Visita
              </button>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="mb-4">
                  <label className="block text-xs text-gray-500 mb-2">
                    Seu nome completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border-b-2 border-gray-300 px-0 py-2 text-sm bg-transparent focus:outline-none focus:border-[#f9c700]"
                    placeholder=""
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-xs text-gray-500 mb-2">
                    Seu WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    className="w-full border-b-2 border-gray-300 px-0 py-2 text-sm bg-transparent focus:outline-none focus:border-[#f9c700]"
                    placeholder=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}