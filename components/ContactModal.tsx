
import React, { useState, useEffect, useRef } from 'react';
import { Mail, Send, X, ShieldCheck, Building2, User, MessageSquare, AlertCircle, Fingerprint, Shield, Zap, Loader2 } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle?: string;
}

declare global {
  interface Window {
    grecaptcha: any;
  }
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, serviceTitle }) => {
  const [status, setStatus] = useState<'idle' | 'verifying' | 'sending' | 'success'>('idle');
  const [emailError, setEmailError] = useState<string | null>(null);
  
  // Anti-bot metrics
  const mountTime = useRef<number>(0);
  const interactionScore = useRef<number>(0);
  const keyIntervals = useRef<number[]>([]);
  const lastKeyTime = useRef<number>(0);
  const mouseMoved = useRef<boolean>(false);
  
  const [securityRating, setSecurityRating] = useState<number>(0);

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    message: '',
    website: '', 
    confirm_email: '' 
  });

  useEffect(() => {
    if (isOpen) {
      mountTime.current = Date.now();
      interactionScore.current = 0;
      keyIntervals.current = [];
      lastKeyTime.current = 0;
      mouseMoved.current = false;
      setSecurityRating(0);
      
      const handleMouseMove = () => {
        if (!mouseMoved.current) {
          mouseMoved.current = true;
          interactionScore.current += 20;
          updateSecurityRating();
        }
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isOpen]);

  const updateSecurityRating = () => {
    let score = 0;
    if (mouseMoved.current) score += 30;
    if (interactionScore.current > 5) score += 20;
    if (keyIntervals.current.length > 3) score += 20;
    setSecurityRating(Math.min(100, score));
  };

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleKeyDown = () => {
    const now = Date.now();
    if (lastKeyTime.current > 0) {
      const interval = now - lastKeyTime.current;
      keyIntervals.current.push(interval);
    }
    lastKeyTime.current = now;
    interactionScore.current += 1;
    updateSecurityRating();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);

    setStatus('verifying');

    // Artificial delay to simulate "Deep Packet Inspection"
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (!validateEmail(formData.email)) {
      setStatus('idle');
      setEmailError('Por favor ingresa un correo electrónico corporativo válido.');
      return;
    }

    setStatus('sending');
    
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setFormData({ name: '', company: '', email: '', message: '', website: '', confirm_email: '' });
        onClose();
      }, 3500);
    }, 2000);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, email: e.target.value });
    if (emailError) setEmailError(null);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 bg-slate-950/95 backdrop-blur-3xl animate-in fade-in duration-300">
      <div className="bg-[#020617] border border-white/10 rounded-[3rem] w-full max-w-2xl relative shadow-[0_0_100px_rgba(16,185,129,0.05)] overflow-hidden">
        
        {(status === 'sending' || status === 'verifying') && (
          <div className="absolute top-0 left-0 h-1 bg-emerald-500 animate-progress w-full z-20"></div>
        )}

        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all border border-white/5 z-30"
        >
          <X size={20} />
        </button>

        {status === 'success' ? (
          <div className="py-24 px-12 text-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-10 border border-emerald-500/20 shadow-2xl">
              <ShieldCheck size={48} />
            </div>
            <h3 className="text-4xl font-extrabold text-white mb-6 tracking-tight uppercase">Tráfico Validado</h3>
            <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-md mx-auto">
              Tu solicitud para <span className="text-emerald-400 font-bold">{serviceTitle}</span> ha sido encriptada y enviada exitosamente.
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row h-full">
            <div className="hidden lg:flex w-1/3 bg-slate-900/50 p-12 flex-col justify-between border-r border-white/5">
              <div className="space-y-8">
                <div>
                  <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-black mb-6 shadow-lg shadow-emerald-500/20">C</div>
                  <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em] mb-4">SOC SECURITY LAYER</h4>
                  <p className="text-slate-500 text-[10px] leading-relaxed font-bold uppercase tracking-widest">Bot prevention and behavioral analysis active.</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Trust Index</span>
                      <span className={`text-[9px] font-black ${securityRating > 50 ? 'text-emerald-500' : 'text-amber-500'}`}>{securityRating}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${securityRating}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 p-8 sm:p-12 relative">
              <div className="mb-10">
                <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                  {serviceTitle || 'Contacto Profesional'}
                </h2>
                <p className="text-slate-500 text-sm font-medium">Validación profunda de remitente requerida.</p>
              </div>

              <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 ml-1 flex items-center gap-2">
                      <User size={10} /> Nombre
                    </label>
                    <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all placeholder:text-slate-800 text-sm font-bold" placeholder="Tu nombre" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 ml-1 flex items-center gap-2">
                      <Building2 size={10} /> Empresa
                    </label>
                    <input required type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all placeholder:text-slate-800 text-sm font-bold" placeholder="Organización" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 ml-1 flex items-center gap-2">
                    <Mail size={10} /> Email Corporativo
                  </label>
                  <input required type="email" value={formData.email} onChange={handleEmailChange} className={`w-full bg-slate-950 border rounded-2xl px-5 py-4 text-white focus:ring-2 outline-none transition-all placeholder:text-slate-800 text-sm font-bold ${emailError ? 'border-red-500 focus:ring-red-500/30' : 'border-white/5 focus:ring-emerald-500/30'}`} placeholder="correo@empresa.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 ml-1 flex items-center gap-2">
                    <MessageSquare size={10} /> Requerimiento
                  </label>
                  <textarea required rows={3} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all placeholder:text-slate-800 resize-none text-sm font-bold" placeholder="Escribe aquí..."></textarea>
                </div>
                <div className="pt-2">
                  <button 
                    type="submit"
                    disabled={status !== 'idle'}
                    className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-70 group"
                  >
                    {status === 'sending' ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        ENVIANDO...
                      </>
                    ) : (
                      <>
                        <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        VALIDAR Y ENVIAR
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactModal;
