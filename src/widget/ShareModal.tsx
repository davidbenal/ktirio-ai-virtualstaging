import { X, Share2, Mail, Link2, Check } from 'lucide-react';
import { useState } from 'react';

interface ShareModalProps {
  imageUrl: string;
  onClose: () => void;
}

export function ShareModal({ imageUrl, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const propertyUrl = window.location.href;
  const shareText = 'Olha como ficaria esse imóvel decorado!';

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + propertyUrl)}`;
    window.open(url, '_blank');
  };

  const handleEmailShare = () => {
    const subject = 'Confira esta decoração virtual';
    const body = `${shareText}\n\n${propertyUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(propertyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg w-[90vw] md:w-[400px] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="font-medium">Compartilhar Decoração</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image Preview */}
          <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video mb-4">
            <img
              src={imageUrl}
              alt="Decoração"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Property Info */}
          <div className="mb-4">
            <h4 className="font-medium mb-1">Casa Lagoa da Conceição</h4>
            <p className="text-sm text-gray-600">607m² • 4 quartos • R$ 7.500.000</p>
          </div>

          <div className="border-t border-gray-200 my-4" />

          {/* Share Options */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <button
              onClick={handleWhatsAppShare}
              className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xl">📱</span>
              </div>
              <span className="text-xs font-medium">WhatsApp</span>
            </button>

            <button
              onClick={handleEmailShare}
              className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs font-medium">Email</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                {copied ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Link2 className="w-5 h-5 text-purple-600" />
                )}
              </div>
              <span className="text-xs font-medium">{copied ? 'Copiado!' : 'Link'}</span>
            </button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            Link do imóvel incluído automaticamente
          </div>
        </div>
      </div>
    </div>
  );
}
