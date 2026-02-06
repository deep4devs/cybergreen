
import React, { useState } from 'react';
import { X, Send, ShieldCheck, Loader2 } from 'lucide-react';

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
      setTimeout(() => { onClose(); setStatus('idle'); setFormData({name: '', company: '', email: '', message: ''}); }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-3xl animate-in fade-in">
      <div className="bg-[#020617] border border-white/10 rounded-[3rem] w-full max-w-xl p-12 relative">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-white"><X size={20} /></button>
        {status === 'success' ? (
          <div className="text-center py-10">
            <ShieldCheck size={64} className="text-emerald-500 mx-auto mb-6" />
            <h3 className="text-3xl font-black text-white uppercase">Solicitud Enviada</h3>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-8">{serviceTitle || 'Contacto'}</h2>
            <input required type="text" placeholder="Nombre" className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 text-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <input required type="email" placeholder="Email Corporativo" className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 text-white" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <textarea required rows={3} placeholder="Mensaje" className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 text-white" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
            <button type="submit" disabled={status === 'sending'} className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest">{status === 'sending' ? <Loader2 className="animate-spin mx-auto" /> : 'Enviar Solicitud'}</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactModal;
