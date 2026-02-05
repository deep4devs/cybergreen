
import React, { useState } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle?: string;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, serviceTitle }) => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // Simulación de envío
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        onClose();
      }, 2500);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="bg-[#0f172a] border border-white/10 rounded-[2.5rem] w-full max-w-xl p-8 sm:p-12 relative shadow-[0_0_100px_rgba(16,185,129,0.1)] overflow-hidden">
        
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all border border-white/10"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M6 18L18 6M6 6l12 12" strokeWidth={2} strokeLinecap="round" />
          </svg>
        </button>

        {status === 'success' ? (
          <div className="py-12 text-center animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-8 shadow-2xl shadow-emerald-500/20">✓</div>
            <h3 className="text-3xl font-extrabold text-white mb-4 tracking-tight">¡Mensaje Enviado!</h3>
            <p className="text-slate-400 font-medium">Hemos recibido tu solicitud. Un consultor de CyberGuard se pondrá en contacto contigo a través de contacto@cyberguard.mx</p>
          </div>
        ) : (
          <>
            <div className="mb-10">
              <div className="inline-flex px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em] mb-4">
                Contacto Directo
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                {serviceTitle ? `Solicitar ${serviceTitle}` : 'Contactar con un Experto'}
              </h2>
              <p className="text-slate-400 text-sm font-medium">Tu solicitud será enviada directamente a nuestro equipo de respuesta rápida.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Nombre</label>
                  <input required type="text" className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-slate-800" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Empresa</label>
                  <input required type="text" className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-slate-800" placeholder="Tech Corp" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Corporativo</label>
                <input required type="email" className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-slate-800" placeholder="john@techcorp.com" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Mensaje o Requerimientos</label>
                <textarea required rows={4} className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-slate-800 resize-none" placeholder="Cuéntanos sobre tus necesidades de seguridad..."></textarea>
              </div>
              
              <button 
                type="submit"
                disabled={status === 'sending'}
                className="w-full mt-6 bg-emerald-500 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-emerald-500/20 hover:bg-emerald-400 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:translate-y-0"
              >
                {status === 'sending' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ENVIANDO SOLICITUD...
                  </>
                ) : (
                  'ENVIAR A CONTACTO@CYBERGUARD.MX'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactModal;
