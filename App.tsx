
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ServiceGrid from './components/ServiceGrid';
import ThreatMonitor from './components/ThreatMonitor';
import AISecurityAdvisor from './components/AISecurityAdvisor';
import ContactModal from './components/ContactModal'; // NEW IMPORT
import { Page, SecurityService, Language } from './types';
import { getServices, TRANSLATIONS } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [lang, setLang] = useState<Language>('es');
  const [selectedService, setSelectedService] = useState<SecurityService | null>(null);
  
  const [isContactOpen, setIsContactOpen] = useState(false); // NEW STATE
  const [contactServiceTitle, setContactServiceTitle] = useState<string | undefined>(); // NEW STATE

  const t = TRANSLATIONS[lang];
  const allServices = getServices(lang);

  const toggleLang = () => setLang((prev) => (prev === 'es' ? 'en' : 'es'));

  // NEW: Function to open the contact modal, optionally with a service title
  const openContact = (serviceName?: string) => {
    setContactServiceTitle(serviceName);
    setIsContactOpen(true);
  };

  // NEW: Close contact modal
  const closeContact = () => {
    setIsContactOpen(false);
    setContactServiceTitle(undefined);
  };

  const renderContent = () => {
    switch (currentPage) {
      case Page.Home:
        return (
          <div className="space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <header className="text-center py-20 px-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 text-[10px] font-extrabold tracking-[0.2em] uppercase mb-10">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                {lang === 'es' ? 'Protección Activa' : 'Active Protection'}
              </div>
              <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-8 tracking-tighter leading-[1.1]">
                {t.heroTitle} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-sm">{t.heroFuture}</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed opacity-80">
                {t.heroDesc}
              </p>
              <div className="mt-14 flex flex-wrap justify-center gap-5">
                <button 
                  // MODIFIED: Call openContact instead of an internal AI action
                  onClick={() => openContact(lang === 'es' ? 'Escaneo IA Preventivo' : 'Preventive AI Scan')}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-5 rounded-2xl font-extrabold text-sm uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 hover:-translate-y-1 active:translate-y-0"
                >
                  {t.btnAI}
                </button>
                <button 
                  onClick={() => setCurrentPage(Page.Services)}
                  className="bg-white/5 border border-white/10 text-white hover:bg-white/10 px-10 py-5 rounded-2xl font-extrabold text-sm uppercase tracking-widest transition-all"
                >
                  {t.btnServices}
                </button>
              </div>
            </header>

            <section className="glass p-8 sm:p-12 rounded-[3rem] shadow-3xl">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
                <h2 className="text-3xl font-extrabold text-white tracking-tight">{t.socTitle}</h2>
                <div className="flex items-center gap-3 text-emerald-500 text-[10px] font-bold tracking-widest bg-emerald-500/5 px-5 py-2.5 rounded-full border border-emerald-500/10 uppercase">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {t.socLive}
                </div>
              </div>
              <ThreatMonitor lang={lang} />
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
              {[
                { label: t.statThreat, value: '99.9%', color: 'text-emerald-500' },
                { label: t.statResponse, value: '5min', color: 'text-cyan-400' },
                { label: t.statGuard, value: '24/7', color: 'text-white' }
              ].map((stat, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 p-12 rounded-[2.5rem] text-center group transition-all hover:bg-white/[0.04] hover:border-emerald-500/20">
                  <div className={`text-5xl font-extrabold mb-4 ${stat.color}`}>{stat.value}</div>
                  <div className="text-slate-500 font-extrabold text-[10px] uppercase tracking-[0.2em]">{stat.label}</div>
                </div>
              ))}
            </section>
          </div>
        );

      case Page.Services:
        return (
          <div className="space-y-16 animate-in fade-in duration-700 px-4">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-5xl font-extrabold text-white mb-6 tracking-tight">{t.navServices}</h2>
              <p className="text-slate-400 font-medium">{t.heroDesc}</p>
            </div>
            {/* MODIFIED: onRequestQuote now calls openContact */}
            <ServiceGrid 
                onSelect={setSelectedService} 
                onRequestQuote={(service) => openContact(service.title)} 
                services={allServices} 
                lang={lang} 
            />
          </div>
        );

      case Page.NIST:
        return (
          <div className="space-y-16 animate-in fade-in duration-700 px-4">
            <div className="text-center max-w-3xl mx-auto">
              <div className="text-emerald-500 font-bold text-[10px] tracking-[0.4em] uppercase mb-4">Arquitectura de Cumplimiento</div>
              <h2 className="text-5xl font-extrabold text-white mb-6 tracking-tight">{t.nistTitle}</h2>
              <p className="text-slate-400 text-lg leading-relaxed font-medium">{t.nistDesc}</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { name: 'Identify', icon: '🔍', color: 'text-blue-400 border-blue-400/10' },
                { name: 'Protect', icon: '🛡️', color: 'text-emerald-400 border-emerald-400/10' },
                { name: 'Detect', icon: '📡', color: 'text-amber-400 border-amber-400/10' },
                { name: 'Respond', icon: '⚔️', color: 'text-rose-400 border-rose-400/10' },
                { name: 'Recover', icon: '🔄', color: 'text-cyan-400 border-cyan-400/10' }
              ].map((phase, i) => (
                <div key={i} className={`bg-white/5 border p-8 rounded-3xl text-center group transition-all hover:-translate-y-2 ${phase.color}`}>
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{phase.icon}</div>
                  <h3 className="font-extrabold uppercase text-[10px] tracking-widest">{phase.name}</h3>
                </div>
              ))}
            </div>
            <div className="pt-16 border-t border-white/5">
               {/* MODIFIED: onRequestQuote now calls openContact */}
               <ServiceGrid 
                  onSelect={setSelectedService} 
                  onRequestQuote={(service) => openContact(service.title)} 
                  services={allServices.filter(s => s.category === 'nist')} 
                  lang={lang} 
               />
            </div>
          </div>
        );

      case Page.CloudSecurity:
        return (
          <div className="space-y-16 animate-in fade-in duration-700 px-4">
            <div className="text-center max-w-3xl mx-auto">
              <div className="text-blue-500 font-bold text-[10px] tracking-[0.4em] uppercase mb-4">Cloud Defense</div>
              <h2 className="text-5xl font-extrabold text-white mb-6 tracking-tight">{t.cloudTitle}</h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">{t.cloudDesc}</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 p-12 rounded-[3rem] text-center">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                  {['AWS', 'AZURE', 'GCP', 'K8S'].map(provider => (
                    <div key={provider} className="px-8 py-4 bg-slate-950 rounded-2xl border border-white/5 flex items-center justify-center font-black text-slate-500 text-[10px] tracking-widest hover:border-blue-500 hover:text-blue-400 transition-all cursor-default uppercase">
                      {provider}
                    </div>
                  ))}
               </div>
               {/* MODIFIED: onRequestQuote now calls openContact */}
               <ServiceGrid 
                  onSelect={setSelectedService} 
                  onRequestQuote={(service) => openContact(service.title)} 
                  services={allServices.filter(s => s.category === 'cloud')} 
                  lang={lang} 
               />
            </div>
          </div>
        );

      case Page.AISecurity:
        return (
          <div className="space-y-16 animate-in fade-in duration-700 px-4">
            <div className="text-center max-w-3xl mx-auto">
              <div className="text-fuchsia-500 font-bold text-[10px] tracking-[0.4em] uppercase mb-4">Neural Defense</div>
              <h2 className="text-5xl font-extrabold text-white mb-6 tracking-tight">{t.aiTitle}</h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">{t.aiDesc}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/5 border border-white/10 p-12 rounded-[2.5rem] group hover:border-emerald-500/30 transition-all">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 text-3xl mb-8 group-hover:scale-110 transition-transform">🛡️</div>
                <h3 className="text-2xl font-extrabold text-white mb-4">Prompt Guard</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  {lang === 'es' 
                    ? 'Algoritmos de detección en tiempo real para filtrar inyecciones de prompts maliciosos y proteger la integridad del modelo.' 
                    : 'Real-time detection algorithms to filter malicious prompt injections and protect model integrity.'}
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 p-12 rounded-[2.5rem] group hover:border-fuchsia-500/30 transition-all">
                <div className="w-14 h-14 bg-fuchsia-500/10 rounded-2xl flex items-center justify-center text-fuchsia-400 text-3xl mb-8 group-hover:scale-110 transition-transform">🧠</div>
                <h3 className="text-2xl font-extrabold text-white mb-4">Neural Integrity</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                   {lang === 'es' 
                    ? 'Auditoría continua de conjuntos de datos de entrenamiento para prevenir el envenenamiento de datos.' 
                    : 'Continuous auditing of training datasets to prevent data poisoning.'}
                </p>
              </div>
            </div>
            <div className="pt-16">
               {/* MODIFIED: onRequestQuote now calls openContact */}
               <ServiceGrid 
                  onSelect={setSelectedService} 
                  onRequestQuote={(service) => openContact(service.title)} 
                  services={allServices.filter(s => s.category === 'ai')} 
                  lang={lang} 
               />
            </div>
          </div>
        );

      case Page.Advisor:
        return <AISecurityAdvisor lang={lang} />;
        
      case Page.Monitor:
        return (
          <div className="space-y-10 animate-in fade-in duration-700 px-4">
             <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-5xl font-extrabold text-white mb-6 tracking-tight">Cyber Monitor</h2>
              <p className="text-slate-400 font-medium leading-relaxed">
                {lang === 'es' 
                  ? 'Visualización geoespacial de amenazas y telemetría de red en vivo.' 
                  : 'Geospatial threat visualization and live network telemetry.'}
              </p>
            </div>
            <div className="glass p-8 sm:p-12 rounded-[3rem] shadow-4xl">
              <ThreatMonitor lang={lang} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-emerald-500 selection:text-white">
      <Navbar 
        currentPage={currentPage} 
        onPageChange={setCurrentPage} 
        lang={lang} 
        onLangToggle={toggleLang}
      />
      
      <main className="max-w-7xl mx-auto pt-44 px-6">
        {renderContent()}
      </main>

      <footer className="mt-48 border-t border-white/5 py-32 bg-[#020617] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center font-black text-2xl">C</div>
                <span className="text-2xl font-extrabold tracking-tighter text-white uppercase">CYBERGUARD</span>
              </div>
              <p className="text-slate-500 text-lg leading-relaxed max-w-md font-medium">
                {t.footerDesc}
              </p>
            </div>
            <div>
              <h4 className="text-white font-extrabold text-[11px] uppercase tracking-[0.2em] mb-10">{t.legal}</h4>
              <ul className="space-y-5 text-xs text-slate-500 font-bold uppercase tracking-widest">
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Service Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-extrabold text-[11px] uppercase tracking-[0.2em] mb-10">{t.contact}</h4>
              <ul className="space-y-5 text-sm text-slate-500 font-medium">
                <li className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                   contact@cyberguard.mx {/* Updated email for footer */}
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-32 pt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 text-[11px] font-bold tracking-widest text-slate-700 uppercase">
            <div>&copy; 2024 CYBERGUARD ELITE. {t.rights}.</div>
            <div className="flex gap-8">
               <span className="text-emerald-500/30">AES-512 SECURED</span>
               <span className="text-white/10">QUANTUM READY</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal de Detalle */}
      {selectedService && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-[#0f172a] border border-white/10 rounded-[3rem] w-full max-w-3xl p-12 relative shadow-4xl overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar">
            <button 
              onClick={() => setSelectedService(null)} 
              className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all border border-white/10"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M6 18L18 6M6 6l12 12" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </button>
            <div className="text-7xl mb-12 text-emerald-400">
              <selectedService.icon size={64} strokeWidth={1.5} />
            </div>
            <h3 className="text-4xl font-extrabold text-white mb-8 tracking-tight">{selectedService.title}</h3>
            <p className="text-slate-400 text-lg mb-12 leading-relaxed font-medium">{selectedService.longDescription}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
              {selectedService.features.map((f, i) => (
                <div key={i} className="flex items-center gap-4 text-emerald-400 bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/10">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-[11px] font-extrabold uppercase tracking-widest">{f}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => {
                openContact(selectedService.title); // MODIFIED: Call openContact
                setSelectedService(null);
              }}
              className="w-full bg-emerald-500 text-white py-6 rounded-2xl font-extrabold uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/30 hover:bg-emerald-400 hover:-translate-y-1 transition-all text-sm"
            >
               {t.initDeployment}
            </button>
          </div>
        </div>
      )}

      {/* NEW: Render ContactModal */}
      <ContactModal 
        isOpen={isContactOpen} 
        onClose={closeContact} 
        serviceTitle={contactServiceTitle} 
      />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default App;