
import React, { useState } from 'react';
import { Mail, Send, X, ShieldCheck, Building2, User, MessageSquare } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle?: string;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, serviceTitle }) => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    message: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    
    // Simulation of professional email routing
    console.log(`Sending quote request for ${serviceTitle || 'General Inquiry'} to contact@cyberguard.mx`, formData);
    
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setFormData({ name: '', company: '', email: '', message: '' });
        onClose();
      }, 3500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 bg-slate-950/95 backdrop-blur-3xl animate-in fade-in duration-300">
      <div className="bg-[#020617] border border-white/10 rounded-[3rem] w-full max-w-2xl relative shadow-[0_0_100px_rgba(16,185,129,0.05)] overflow-hidden">
        
        {/* Progress Bar for simulation */}
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
              Tu solicitud de cotización para <span className="text-emerald-400 font-bold">{serviceTitle}</span> ha sido enviada a <span className="text-white border-b border-emerald-500/30">contact@cyberguard.mx</span>.
            </p>
            <div className="mt-10 pt-10 border-t border-white/5">
               <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Referencia: #{Math.random().toString(36).substring(7).toUpperCase()}</div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row h-full">
            {/* Sidebar Info */}
            <div className="hidden lg:flex w-1/3 bg-slate-900/50 p-12 flex-col justify-between border-r border-white/5">
              <div>
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-black mb-8 shadow-lg shadow-emerald-500/20">C</div>
                <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4">CyberGuard Elite</h4>
                <p className="text-slate-500 text-xs leading-relaxed font-bold">Respuesta rápida garantizada en menos de 2 horas hábiles.</p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-emerald-500">
                   <Mail size={16} />
                   <span className="text-[9px] font-black uppercase tracking-widest">Routing to SOC</span>
                </div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-tight">
                  contact@cyberguard.mx
                </div>
              </div>
            </div>

            {/* Form Area */}
            <div className="flex-1 p-8 sm:p-12">
              <div className="mb-10">
                <div className="inline-flex px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                  {serviceTitle ? 'Solicitud de Cotización' : 'Nueva Consulta'}
                </div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                  {serviceTitle || 'Contactar con Ventas'}
                </h2>
                <p className="text-slate-500 text-sm font-medium">Completa los detalles para recibir una propuesta técnica.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
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
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all placeholder:text-slate-800 text-sm font-bold" 
                    placeholder="correo@empresa.com" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 ml-1 flex items-center gap-2">
                    <MessageSquare size={10} /> Detalles del Proyecto
                  </label>
                  <textarea 
                    required 
                    rows={4} 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all placeholder:text-slate-800 resize-none text-sm font-bold" 
                    placeholder="Describe brevemente tus requerimientos o infraestructura..."
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
                      Encriptando y Enviando...
                    </>
                  ) : (
                    <>
                      <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      Solicitar Presupuesto a contact@cyberguard.mx
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes progress {
          0% { width: 0; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ContactModal;
