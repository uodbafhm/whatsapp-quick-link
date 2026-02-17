
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Phone, 
  Send, 
  Stethoscope, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  MessageSquarePlus,
  ArrowRight
} from 'lucide-react';
import { generateDentalMessages } from './services/geminiService';
import { MessageSuggestion } from './types';

const App: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [suggestions, setSuggestions] = useState<MessageSuggestion[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Simple validation for phone number (at least 7 digits)
  const isValidNumber = phoneNumber.replace(/[^0-9]/g, '').length >= 7;

  const handleFetchSuggestions = async () => {
    setIsLoading(true);
    const data = await generateDentalMessages();
    setSuggestions(data.map((item: any, index: number) => ({ ...item, id: index.toString() })));
    setIsLoading(false);
  };

  useEffect(() => {
    // Optional: Auto-fetch some cool messages when the user starts typing a valid number
    if (isValidNumber && suggestions.length === 0) {
      handleFetchSuggestions();
    }
  }, [isValidNumber]);

  const handleWhatsAppRedirect = () => {
    if (!isValidNumber) return;
    
    // Clean number: remove everything except numbers
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    const encodedMsg = encodeURIComponent(selectedMessage || "Salam Dr, bghit nchofek 3la wed wahed l'mouchkil f snani.");
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMsg}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyLink = () => {
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    const link = `https://wa.me/${cleanNumber}`;
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 md:p-8">
      {/* Header Section */}
      <header className="w-full max-w-2xl text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-teal-100 rounded-2xl mb-4">
          <Stethoscope className="w-8 h-8 text-teal-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
          Dentist<span className="text-teal-600">Connect</span>
        </h1>
        <p className="mt-2 text-slate-500 font-medium">
          Diri numra o tawasli m3a tbib f l7in
        </p>
      </header>

      {/* Main Card */}
      <main className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-6 md:p-8">
          <label className="block text-sm font-semibold text-slate-700 mb-2 px-1">
            Numéro de téléphone (avec code pays)
          </label>
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Ex: 212612345678"
              className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>

          {/* AI Message Suggestions (Dynamic) */}
          {isValidNumber && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between px-1">
                <span className="text-sm font-bold text-slate-600 flex items-center gap-1.5">
                  <MessageSquarePlus className="w-4 h-4 text-teal-500" />
                  Messages suggérés par IA
                </span>
                <button 
                  onClick={handleFetchSuggestions}
                  disabled={isLoading}
                  className="text-xs text-teal-600 font-semibold hover:underline disabled:opacity-50"
                >
                  {isLoading ? '...' : 'Actualiser'}
                </button>
              </div>
              
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                {suggestions.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg.text)}
                    className={`text-left p-3 rounded-xl border text-sm transition-all ${
                      selectedMessage === msg.text
                        ? 'border-teal-500 bg-teal-50 text-teal-800 ring-2 ring-teal-500/10'
                        : 'border-slate-100 bg-slate-50/50 text-slate-600 hover:border-teal-200'
                    }`}
                  >
                    <span className="font-bold text-xs uppercase text-teal-600 block mb-1">{msg.label}</span>
                    {msg.text}
                  </button>
                ))}
                {suggestions.length === 0 && !isLoading && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                    <p className="text-xs text-slate-400">Entrez un numéro pour voir les suggestions</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-8">
            <button
              onClick={handleWhatsAppRedirect}
              disabled={!isValidNumber}
              className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-white shadow-lg transition-all active:scale-[0.98] ${
                isValidNumber 
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 shadow-teal-200 hover:from-teal-600 hover:to-emerald-600' 
                  : 'bg-slate-300 cursor-not-allowed shadow-none'
              }`}
            >
              <span>Contact WhatsApp Direct</span>
              <Send className="w-5 h-5" />
            </button>
            
            {isValidNumber && (
              <button
                onClick={handleCopyLink}
                className="w-full mt-3 py-2 text-sm font-medium text-slate-500 hover:text-teal-600 flex items-center justify-center gap-1.5"
              >
                {isCopied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Lien copié !</span>
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    <span>Copier le lien direct</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          <p className="text-[11px] leading-tight text-slate-500 italic">
            Assurez-vous d'inclure l'indicatif pays (ex: 212 pour le Maroc) sans le signe +.
          </p>
        </div>
      </main>

      {/* Feature Section */}
      <section className="mt-12 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard 
          icon={<CheckCircle2 className="text-emerald-500" />}
          title="Direct & Rapide"
          description="Pas besoin d'enregistrer le contact dans votre répertoire."
        />
        <FeatureCard 
          icon={<AlertCircle className="text-blue-500" />}
          title="Assistance IA"
          description="Générez des messages polis et clairs en Darija pour le dentiste."
        />
        <FeatureCard 
          icon={<Stethoscope className="text-teal-500" />}
          title="Privé & Sûr"
          description="Vos données ne sont pas stockées. Le lien s'ouvre directement sur WhatsApp."
        />
      </section>

      <footer className="mt-auto py-8 text-slate-400 text-xs font-medium tracking-wider">
        © {new Date().getFullYear()} DENTIST CONNECT - MADE FOR HEALTH
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mb-3">
      {icon}
    </div>
    <h3 className="text-sm font-bold text-slate-800 mb-1">{title}</h3>
    <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
  </div>
);

export default App;
