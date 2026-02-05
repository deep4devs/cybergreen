
import React from 'react';
import { SecurityService, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { 
  ShieldCheck, ShieldAlert, ClipboardCheck, Cloud, Scale, Bot, Terminal, Globe, Mail, Fingerprint 
} from 'lucide-react';

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
  ai: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20',
  linux: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  dns: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  email: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  identity: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20'
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  proactive: ShieldCheck,
  reactive: ShieldAlert,
  compliance: ClipboardCheck,
  cloud: Cloud,
  nist: Scale,
  ai: Bot,
  linux: Terminal,
  dns: Globe,
  email: Mail,
  identity: Fingerprint
};

const ServiceGrid: React.FC<ServiceGridProps> = ({ onSelect, onRequestQuote, services, lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => {
        const CategoryIcon = CATEGORY_ICONS[service.category] || ShieldCheck;
        
        return (
          <div 
            key={service.id}
            className="group relative bg-[#0f172a] border border-white/5 rounded-[2.5rem] p-8 transition-all duration-500 hover:border-emerald-500/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-8">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-extrabold uppercase tracking-widest ${CATEGORY_STYLES[service.category] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                <CategoryIcon size={12} strokeWidth={2.5} />
                {service.category}
              </div>
              <div className="text-3xl filter grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-125 text-emerald-400">
                <service.icon size={36} strokeWidth={1.5} />
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
                  className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 hover:text-white transition-colors flex items-center gap-1 group/btn"
                >
                  {t.btnLearnMore} 
                  <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
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

            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem] pointer-events-none"></div>
          </div>
        );
      })}
    </div>
  );
};

export default ServiceGrid;
