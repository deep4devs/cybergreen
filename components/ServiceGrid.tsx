
import React, { useState, useMemo } from 'react';
import { SecurityService, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { 
  ShieldCheck, ShieldAlert, ClipboardCheck, Cloud, Scale, Bot, Terminal, Globe, Mail, Fingerprint, Network, Server, Smartphone, Search, X, Filter
} from 'lucide-react';

interface ServiceGridProps {
  onSelect: (service: SecurityService) => void;
  onRequestQuote: (service: SecurityService) => void;
  services: SecurityService[];
  lang: Language;
}

const CATEGORY_STYLES: Record<string, string> = {
  proactive: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  reactive: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  compliance: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  cloud: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  nist: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  ai: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20',
  linux: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  dns: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  email: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  identity: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20',
  networking: 'bg-blue-600/10 text-blue-400 border-blue-600/20',
  servers: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
  endpoints: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
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
  identity: Fingerprint,
  networking: Network,
  servers: Server,
  endpoints: Smartphone
};

const ServiceGrid: React.FC<ServiceGridProps> = ({ onSelect, onRequestQuote, services, lang }) => {
  const t = TRANSLATIONS[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');

  // Get unique categories present in the current services list
  const categories = useMemo(() => {
    const cats = new Set(services.map(s => s.category));
    return ['all', ...Array.from(cats)];
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesCategory = activeCategory === 'all' || service.category === activeCategory;
      const query = searchTerm.toLowerCase();
      const matchesSearch = 
        service.title.toLowerCase().includes(query) || 
        service.description.toLowerCase().includes(query) ||
        service.features.some(f => f.toLowerCase().includes(query));
      
      return matchesCategory && matchesSearch;
    });
  }, [services, activeCategory, searchTerm]);

  return (
    <div className="space-y-10">
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-slate-900/40 border border-white/5 p-6 rounded-[2.5rem] glass">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder={lang === 'es' ? 'Buscar por servicio o característica...' : 'Search by service or feature...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-3 pl-12 pr-10 text-white text-sm font-medium focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all placeholder:text-slate-700"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const CatIcon = cat === 'all' ? Filter : (CATEGORY_ICONS[cat] || ShieldCheck);
            
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all border ${
                  isActive 
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' 
                    : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                <CatIcon size={12} />
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Display */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          {filteredServices.map((service) => {
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
                  
                  {/* Inline features for search visibility */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {service.features.slice(0, 3).map((f, i) => (
                      <span key={i} className="text-[8px] font-black uppercase tracking-[0.1em] text-slate-600 bg-white/[0.02] px-2 py-1 rounded border border-white/5">
                        {f}
                      </span>
                    ))}
                    {service.features.length > 3 && (
                      <span className="text-[8px] font-black uppercase tracking-[0.1em] text-slate-700">+ {service.features.length - 3}</span>
                    )}
                  </div>
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
      ) : (
        <div className="py-24 text-center bg-slate-900/20 border border-white/5 border-dashed rounded-[3rem] animate-in fade-in duration-500">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-700 mx-auto mb-6">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">
            {lang === 'es' ? 'Sin Coincidencias' : 'No Matches Found'}
          </h3>
          <p className="text-slate-500 text-sm font-medium mb-8 max-w-xs mx-auto">
            {lang === 'es' 
              ? 'No encontramos servicios que coincidan con tus criterios de búsqueda.' 
              : "We couldn't find any services matching your search criteria."}
          </p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setActiveCategory('all');
            }}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 border border-emerald-500/20 px-6 py-3 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"
          >
            {lang === 'es' ? 'Restablecer Filtros' : 'Reset Filters'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ServiceGrid;
