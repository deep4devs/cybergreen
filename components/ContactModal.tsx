
import React, { useState, useEffect, useRef } from 'react';
import { Mail, Send, X, ShieldCheck, Building2, User, MessageSquare, AlertCircle } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle?: string;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, serviceTitle }) => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [emailError, setEmailError] = useState<string | null>(null);
  
  // Anti-bot metrics
  const mountTime = useRef<number>(0);
  const interactionScore = useRef<number>(0);
  const keyIntervals = useRef<number[]>([]);
  const lastKeyTime = useRef<number>(0);
  const mouseMoved = useRef<boolean>(false);

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    message: '',
    website: '', // Honeypot 1: Deceptive URL field
    confirm_email: '' // Honeypot 2: Deceptive confirmation field
  });

  useEffect(() => {
    if (isOpen) {
      mountTime.current = Date.now();
      interactionScore.current = 0;
      keyIntervals.current = [];
      lastKeyTime.current = 0;
      mouseMoved.current = false;
      
      const handleMouseMove = () => {
        if (!mouseMoved.current) {
          mouseMoved.current = true;
          interactionScore.current += 20;
        }
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isOpen]);

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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);

    // Calculate Typing Consistency (Bots often type with perfect intervals)
    let typingConsistencyScore = 0;
    if (keyIntervals.current.length > 5) {
      const average = keyIntervals.current.reduce((a, b) => a + b) / keyIntervals.current.length;
      const variance = keyIntervals.current.reduce((a, b) => a + Math.pow(b - average, 2), 0) / keyIntervals.current.length;
      const stdDev = Math.sqrt(variance);
      // Humans have high stdDev in typing. If stdDev is extremely low (< 5ms), it's likely a script.
      if (stdDev > 10) typingConsistencyScore = 30;
    }

    const timeDiff = Date.now() - mountTime.current;

    // Advanced Bot Scoring
    // 1. Honeypots: Immediate fail
    // 2. Interaction Score: Humans move mice and press keys
    // 3. Velocity: Humans take time to read and fill forms
    const botDetected = 
      formData.website !== '' || 
      formData.confirm_email !== '' || 
      timeDiff < 3000 || // Form submitted in less than 3 seconds
      (interactionScore.current < 15 && timeDiff > 1000) || // Low interaction for the time taken
      (keyIntervals.current.length > 0 && typingConsistencyScore === 0); // Perfectly consistent typing

    if (botDetected) {
      console.warn('[CYBERGUARD-SOC] Intercepted suspicious submission pattern. Analyzing fingerprints...');
      setStatus('sending');
      // Silently discard data but show success to the "user" (the bot)
      setTimeout(() => {
        setStatus('success');
        setTimeout(() => {
          setStatus('idle');
          setFormData({ name: '', company: '', email: '', message: '', website: '', confirm_email: '' });
          onClose();
        }, 2000);
      }, 1500);
      return;
    }

    if (!validateEmail(formData.email)) {
      setEmailError('Por favor ingresa un correo electrónico corporativo válido.');
      return;
    }

    setStatus('sending');
    
    console.debug(`[SOC-ROUTING] Secure Transmission: ${serviceTitle || 'General'}`, {
      ...formData,
      metrics: {
        time_to_submit: `${(timeDiff / 1000).toFixed(2)}s`,
        interaction_score: interactionScore.current,
        mouse_active: mouseMoved.current
      }
    });
    
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
        
        {status === 'sending' && (
          <div className="absolute top-0 left-0 h-1 bg-emerald-500 animate-progress w-full"></div>
        )}

        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all border border-white/5 z-10"
        >
          <X size={20} />
        </button>

        {status === 'success' ? (
          <div className="py-20 px-12 text-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-10 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
              <ShieldCheck size={48} />
            </div>
            <h3 className="text-4xl font-extrabold text-white mb-6 tracking-tight uppercase">Transmisión Exitosa</h3>
            <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-md mx-auto">
              Tu solicitud para <span className="text-emerald-400 font-bold">{serviceTitle}</span> ha sido enrutada al SOC de <span className="text-white border-b border-emerald-500/30">CyberGuard</span>.
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row h-full">
            <div className="hidden lg:flex w-1/3 bg-slate-900/50 p-12 flex-col justify-between border-r border-white/5">
              <div>
                <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-black mb-8 shadow-lg shadow-emerald-500/20">C</div>
                <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4">CyberGuard Elite</h4>
                <p className="text-slate-500 text-xs leading-relaxed font-bold italic">Deep analysis enabled for all incoming traffic.</p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-emerald-500">
                   <Mail size={16} />
                   <span className="text-[9px] font-black uppercase tracking-widest">Secure Entry Point</span>
                </div>
              </div>
            </div>

            <div className="flex-1 p-8 sm:p-12">
              <div className="mb-10">
                <div className="inline-flex px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                  {serviceTitle ? 'Technical Assessment' : 'New Incident'}
                </div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                  {serviceTitle || 'Contactar Especialista'}
                </h2>
                <p className="text-slate-500 text-sm font-medium">Validación de identidad requerida para procesar solicitud.</p>
              </div>

              <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-5">
                {/* Anti-Bot Honeypots */}
                <div className="sr-only" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                  <input
                    id="confirm_email"
                    name="confirm_email"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.confirm_email}
                    onChange={(e) => setFormData({ ...formData, confirm_email: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 ml-1 flex items-center gap-2">
                      <User size={10} /> Nombre Completo
                    </label>
                    <input 
                      required 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all placeholder:text-slate-800 text-sm font-bold" 
                      placeholder="Ej: Alejandro Silva" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 ml-1 flex items-center gap-2">
                      <Building2 size={10} /> Empresa
                    </label>
                    <input 
                      required 
                      type="text" 
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all placeholder:text-slate-800 text-sm font-bold" 
                      placeholder="Ej: Tech Corp SA" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 ml-1 flex items-center gap-2">
                    <Mail size={10} /> Email Corporativo
                  </label>
                  <input 
                    required 
                    type="email" 
                    value={formData.email}
                    onChange={handleEmailChange}
                    className={`w-full bg-slate-950 border rounded-2xl px-5 py-4 text-white focus:ring-2 outline-none transition-all placeholder:text-slate-800 text-sm font-bold ${emailError ? 'border-red-500 focus:ring-red-500/30' : 'border-white/5 focus:ring-emerald-500/30'}`} 
                    placeholder="correo@empresa.com" 
                  />
                  {emailError && (
                    <div className="flex items-center gap-1.5 mt-1 text-red-500 animate-in fade-in slide-in-from-top-1 duration-300">
                      <AlertCircle size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{emailError}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 ml-1 flex items-center gap-2">
                    <MessageSquare size={10} /> Contexto de Seguridad
                  </label>
                  <textarea 
                    required 
                    rows={3} 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all placeholder:text-slate-800 resize-none text-sm font-bold" 
                    placeholder="Detalla tu requerimiento..."
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full mt-4 bg-white text-black py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-70 group"
                >
                  {status === 'sending' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                      Encriptando...
                    </>
                  ) : (
                    <>
                      <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      Enviar Solicitud Segura
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactModal;
