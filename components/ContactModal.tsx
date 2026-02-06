
import React, { useState } from 'react';
import { X, ShieldCheck, Loader2 } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle?: string;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, serviceTitle }) => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', company: '', email: '', message: '' });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => { onClose(); setStatus('idle'); setFormData({name: '', company: '', email: '', message: ''}); }, 2500);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-3xl animate-in fade-in duration-300">
      <div className="bg-[#020617] border border-white/10 rounded-[3rem] w-full max-w-xl p-12 relative shadow-3xl">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-white transition-all"><X size={24} /></button>
        {status === 'success' ? (
          <div className="text-center py-10 animate-in zoom-in-95">
            <ShieldCheck size={64} className="text-emerald-500 mx-auto mb-6" />
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Solicitud Enviada</h3>
            <p className="text-slate-500 mt-4 font-medium">Nuestro equipo SOC se pondrá en contacto pronto.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-8">{serviceTitle || 'Contacto'}</h2>
            <div className="space-y-4">
              <input required type="text" placeholder="Nombre" className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 text-white outline-none focus:ring-1 focus:ring-emerald-500/50" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required type="email" placeholder="Email Corporativo" className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 text-white outline-none focus:ring-1 focus:ring-emerald-500/50" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <textarea required rows={3} placeholder="Mensaje" className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 text-white outline-none focus:ring-1 focus:ring-emerald-500/50 resize-none" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
            </div>
            <button type="submit" disabled={status === 'sending'} className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">{status === 'sending' ? <Loader2 className="animate-spin mx-auto" /> : 'Enviar Solicitud'}</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactModal;
