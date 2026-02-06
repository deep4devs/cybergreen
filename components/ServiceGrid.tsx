
import React from 'react';
import { SecurityService, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface ServiceGridProps {
  onSelect: (service: SecurityService) => void;
  onRequestQuote: (service: SecurityService) => void;
  services: SecurityService[];
  lang: Language;
}

const ServiceGrid: React.FC<ServiceGridProps> = ({ onSelect, onRequestQuote, services, lang }) => {
  const t = TRANSLATIONS[lang];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      {services.map(service => (
        <div key={service.id} className="group bg-[#0f172a] border border-white/5 rounded-[2.5rem] p-8 hover:border-emerald-500/30 transition-all flex flex-col h-full relative overflow-hidden">
          <div className="text-emerald-400 mb-8"><service.icon size={36} strokeWidth={1.5} /></div>
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">{service.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">{service.description}</p>
          <button onClick={() => onRequestQuote(service)} className="w-full bg-emerald-500 text-white font-bold text-[11px] uppercase tracking-[0.2em] py-4 rounded-xl shadow-lg shadow-emerald-500/10 hover:bg-emerald-400 transition-all">Solicitar Cotización</button>
        </div>
      ))}
    </div>
  );
};

export default ServiceGrid;
