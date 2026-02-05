
import React from 'react';
import { SecurityService, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface ServiceGridProps {
  onSelect: (service: SecurityService) => void;
  onRequestQuote: (service: SecurityService) => void;
  services: SecurityService[];
  lang: Language;
}

const CATEGORY_STYLES = {
  proactive: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  reactive: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  compliance: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  cloud: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  nist: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  ai: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20'
};

const ServiceGrid: React.FC<ServiceGridProps> = ({ onSelect, onRequestQuote, services, lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <div 
          key={service.id}
          className="group relative bg-[#0f172a] border border-white/5 rounded-[2rem] p-8 transition-all duration-500 hover:border-emerald-500/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col h-full"
        >
          <div className="flex justify-between items-start mb-8">
            <div className={`px-4 py-1 rounded-full border text-[9px] font-extrabold uppercase tracking-widest ${CATEGORY_STYLES[service.category]}`}>
              {service.category}
            </div>
            <div className="text-3xl filter grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-125">
              {service.icon}
            </div>
          </div>

          <div className="flex-grow">
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
              {service.title}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
              {service.description}
            </p>
          </div>

          <div className="mt-auto space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">{service.id}</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(service);
                }}
                className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
              >
                {t.btnLearnMore} →
              </button>
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onRequestQuote(service);
              }}
              className="w-full bg-emerald-500 text-white font-bold text-[11px] uppercase tracking-[0.2em] py-4 rounded-xl shadow-lg shadow-emerald-500/10 hover:bg-emerald-400 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              {t.btnRequestQuote}
            </button>
          </div>

          {/* Decorative subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] pointer-events-none"></div>
        </div>
      ))}
    </div>
  );
};

export default ServiceGrid;
