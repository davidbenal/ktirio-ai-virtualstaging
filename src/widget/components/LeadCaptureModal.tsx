import { X, Phone } from 'lucide-react';
import { useState } from 'react';

interface LeadCaptureModalProps {
  onClose: () => void;
  context: 'specialist' | 'visit';
}

export function LeadCaptureModal({ onClose, context }: LeadCaptureModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    message: '',
    privacyAccepted: false,
    receiveNews: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const title = context === 'visit' ? 'Agendar Visita' : 'Fale com um Especialista';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.privacyAccepted) {
      alert('Você precisa concordar com a Política de Privacidade');
      return;
    }
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);

    // Close after 2 seconds
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handleWhatsAppDirect = () => {
    const message = encodeURIComponent(
      context === 'specialist'
        ? 'Olá! Gostaria de falar com um especialista sobre a Casa Lagoa da Conceição.'
        : 'Olá! Gostaria de agendar uma visita à Casa Lagoa da Conceição.'
    );
    window.open(`https://wa.me/5548999999999?text=${message}`, '_blank');
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60" onClick={onClose} />
        <div className="relative bg-white rounded-lg w-[90vw] md:w-[400px] shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h3 className="text-xl font-medium mb-2">Recebemos seu contato!</h3>
          <p className="text-gray-600 text-sm">
            Em breve um de nossos especialistas entrará em contato.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg w-full max-w-[500px] shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-white sticky top-0 z-10">
          <h3 className="text-xl font-medium text-black">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-2">
                Seu nome completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border-b-2 border-gray-300 px-0 py-2 text-sm focus:outline-none focus:border-[#f9c700] transition-colors"
                placeholder=""
              />
            </div>

            {/* WhatsApp */}
            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-2">
                Seu WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full border-b-2 border-gray-300 px-0 py-2 text-sm focus:outline-none focus:border-[#f9c700] transition-colors"
                placeholder=""
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-2">
                Seu melhor e-mail <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border-b-2 border-gray-300 px-0 py-2 text-sm focus:outline-none focus:border-[#f9c700] transition-colors"
                placeholder=""
              />
            </div>

            {/* Message (only for visit scheduling) */}
            {context === 'visit' && (
              <div className="mb-4">
                <label className="block text-sm text-gray-500 mb-2">
                  [Lead] Data e hora de agendamento <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full border-b-2 border-gray-300 px-0 py-2 text-sm focus:outline-none focus:border-[#f9c700] transition-colors"
                  placeholder=""
                />
              </div>
            )}

            {/* Privacy Policy Checkbox */}
            <div className="mb-3">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.privacyAccepted}
                  onChange={(e) => setFormData({ ...formData, privacyAccepted: e.target.checked })}
                  className="w-5 h-5 mt-0.5 text-[#7c3aed] bg-white border-2 border-[#7c3aed] rounded focus:ring-[#7c3aed] focus:ring-2 accent-[#7c3aed]"
                  style={{
                    accentColor: '#7c3aed'
                  }}
                />
                <span className="text-sm text-gray-700">
                  <a href="#" className="text-blue-600 underline">Ao clicar no botão de envio, concordo com a Política de Privacidade</a> <span className="text-red-500">*</span>
                </span>
              </label>
            </div>

            {/* Newsletter Checkbox */}
            <div className="mb-6">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.receiveNews}
                  onChange={(e) => setFormData({ ...formData, receiveNews: e.target.checked })}
                  className="w-5 h-5 mt-0.5 text-[#7c3aed] bg-white border-2 border-[#7c3aed] rounded focus:ring-[#7c3aed] focus:ring-2 accent-[#7c3aed]"
                  style={{
                    accentColor: '#7c3aed'
                  }}
                />
                <span className="text-sm text-gray-700">
                  Aceito receber novidades e ofertas por e-mail do Grupo Brognoli, conforme meus interesses.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#f9c700] hover:bg-[#e0b600] disabled:bg-gray-300 text-black py-3 rounded-md font-bold transition-colors mb-3"
            >
              {isSubmitting ? 'Enviando...' : context === 'visit' ? 'Agendar Visita' : 'Enviar'}
            </button>

            {/* Report Abuse Link */}
            <div className="text-center">
              <a href="#" className="text-sm text-gray-500 underline hover:text-gray-700 inline-flex items-center gap-1">
                Relatar abuso
                <span className="inline-block w-4 h-4 rounded-full bg-gray-300 text-white text-xs flex items-center justify-center">?</span>
              </a>
            </div>
          </form>

          <div className="border-t border-gray-200 my-6" />

          {/* Direct WhatsApp */}
          <div className="text-center">
            <button
              onClick={handleWhatsAppDirect}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 border-2 border-green-500 text-green-600 hover:bg-green-50 rounded-md transition-colors font-medium"
            >
              <Phone className="w-5 h-5" />
              <span>WhatsApp</span>
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">Este site é seguro</p>
          </div>
        </div>
      </div>
    </div>
  );
}