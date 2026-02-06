
import React, { useState } from 'react';
import Navbar from './components/Navbar.tsx';
import ServiceGrid from './components/ServiceGrid.tsx';
import ThreatMonitor from './components/ThreatMonitor.tsx';
import AISecurityAdvisor from './components/AISecurityAdvisor.tsx';
import ContactModal from './components/ContactModal.tsx';
import { Page, SecurityService, Language } from './types.ts';
import { getServices, TRANSLATIONS } from './constants.tsx';
import { useQuery } from '@tanstack/react-query';
import { getIsraelCyberNotices, ResourceNotice } from './services/geminiService.ts';
import { 
  ShieldCheck, Target, Eye, Award, Terminal, Network, Layers, Repeat, 
  Globe, ShieldAlert, X, Activity, Cpu, Radio, BookOpen, ExternalLink, Calendar, Zap, MessageSquare, Database
} from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [lang, setLang] = useState<Language>('es');
  const [selectedService, setSelectedService] = useState<SecurityService | null>(null);
  
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactServiceTitle, setContactServiceTitle] = useState<string | undefined>();

  const t = TRANSLATIONS[lang];
  const allServices = getServices(lang);

  const toggleLang = () => setLang((prev) => (prev === 'es' ? 'en' : 'es'));

  const openContact = (serviceName?: string) => {
    setContactServiceTitle(serviceName);
    setIsContactOpen(true);
  };

  const closeContact = () => {
    setIsContactOpen(false);
    setContactServiceTitle(undefined);
  };

  const { data: notices, isLoading: loadingNotices, error: noticesError } = useQuery<ResourceNotice[]>({
    queryKey: ['israelNotices', lang],
    queryFn: () => getIsraelCyberNotices(lang),
    enabled: currentPage === Page.Resource,
  });

  const FeatureCard: React.FC<{ item: any; colorClass: string }> = ({ item, colorClass }) => (
    <div className={`bg-white/5 border border-white/10 p-8 rounded-3xl group hover:border-${colorClass} transition-all flex flex-col relative overflow-hidden`}>
      <div className={`absolute top-0 right-0 w-24 h-24 bg-${colorClass}/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
      <div className={`w-12 h-12 bg-${colorClass}/10 rounded-2xl flex items-center justify-center text-${colorClass} mb-6 group-hover:scale-110 transition-transform relative z-10`}>
        <item.icon size={24} />
      </div>
      <h3 className="text-lg font-bold text-white mb-3 relative z-10">{item.title}</h3>
      <p className="text-slate-400 text-xs leading-relaxed mb-8 flex-grow relative z-10 font-medium">{item.desc}</p>
      <button 
        onClick={() => openContact(item.title)}
        className={`w-full py-3 rounded-xl border border-${colorClass}/20 text-${colorClass} text-[9px] font-black uppercase tracking-widest hover:bg-${colorClass} hover:text-white transition-all relative z-10`}
      >
        {lang === 'es' ? 'Solicitar Cotización' : 'Request Quote'}
      </button>
    </div>
  );

  const renderContent = () => {
    const isEs = lang === 'es';
    switch (currentPage) {
      case Page.Home:
        return (
          <div className="space-y-32 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <header className="text-center py-10 px-4 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 text-[10px] font-extrabold tracking-[0.2em] uppercase mb-10 relative z-10">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                {lang === 'es' ? 'Protección Activa' : 'Active Protection'}
              </div>
              <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-8 tracking-tighter leading-[1.1] relative z-10">
                {t.heroTitle} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-sm">{t.heroFuture}</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed opacity-80 mb-6 relative z-10">
                {t.heroDesc}
              </p>
              <p className="text-emerald-500/60 font-mono text-xs uppercase tracking-[0.3em] font-bold mb-14 italic relative z-10">
                &quot;{t.slogan}&quot;
              </p>
              <div className="flex flex-wrap justify-center gap-5 relative z-10">
                <button 
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

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-emerald-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <div className="relative bg-slate-900/40 border border-white/5 p-12 rounded-[3rem] overflow-hidden">
                   <div className="flex items-center gap-6 mb-8">
                     <div className="text-6xl font-black text-emerald-500 tracking-tighter">{t.experienceYears}</div>
                     <div className="h-12 w-px bg-white/10"></div>
                     <div className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-loose max-w-[150px]">
                       {t.experienceText}
                     </div>
                   </div>
                   <h2 className="text-3xl font-extrabold text-white mb-6 tracking-tight">{t.aboutTitle}</h2>
                   <p className="text-slate-400 text-lg leading-relaxed font-medium">
                     {t.aboutDesc}
                   </p>
                   <div className="mt-10 flex gap-4">
                      <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2 text-[10px] font-black uppercase text-emerald-400 tracking-widest">
                        <Award size={14} /> Certified Excellence
                      </div>
                      <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2 text-[10px] font-black uppercase text-cyan-400 tracking-widest">
                        <ShieldCheck size={14} /> Global Protection
                      </div>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] hover:bg-white/[0.04] transition-all group">
                   <div className="flex items-start gap-6">
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0 group-hover:scale-110 transition-transform">
                        <Target size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-3">{t.missionTitle}</h3>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">{t.missionDesc}</p>
                      </div>
                   </div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] hover:bg-white/[0.04] transition-all group">
                   <div className="flex items-start gap-6">
                      <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500 shrink-0 group-hover:scale-110 transition-transform">
                        <Eye size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-3">{t.visionTitle}</h3>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">{t.visionDesc}</p>
                      </div>
                   </div>
                </div>
              </div>
            </section>
          </div>
        );

      case Page.Monitor:
        return (
          <div className="animate-in fade-in duration-1000 -mt-10 px-4 max-w-[1600px] mx-auto pb-20">
             <div className="relative mb-16 group">
                <div className="text-center relative z-10">
                  <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-slate-900 border border-white/5 text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-6 shadow-2xl">
                    <Radio size={12} className="animate-pulse" />
                    SOC MISSION CONTROL - LVL 4
                  </div>
                  <h2 className="text-7xl font-black text-white mb-6 tracking-tighter uppercase">Cyber<span className="text-emerald-500">Monitor</span></h2>
                </div>
            </div>
            <div className="glass p-8 sm:p-16 rounded-[4rem] shadow-3xl border border-white/10">
              <ThreatMonitor lang={lang} />
            </div>
          </div>
        );

      case Page.Resource:
        return (
          <div className="space-y-16 animate-in fade-in duration-700 px-4 max-w-6xl mx-auto pb-20">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/10 text-blue-500 text-[10px] font-extrabold tracking-[0.2em] uppercase mb-8">
                <Globe size={12} /> Global Intelligence Hub
              </div>
              <h2 className="text-5xl font-black text-white mb-6 tracking-tight uppercase">
                {t.resourceTitle}
              </h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-3xl mx-auto">
                {t.resourceDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {loadingNotices ? (
                <div className="flex flex-col items-center justify-center py-32 gap-6">
                  <div className="w-16 h-16 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">Syncing with Tel Aviv Tech Feed...</p>
                </div>
              ) : noticesError ? (
                <div className="p-12 text-center bg-red-500/5 border border-red-500/20 rounded-[3rem]">
                  <ShieldAlert className="mx-auto text-red-500 mb-6" size={48} />
                  <p className="text-red-400 font-bold uppercase tracking-widest text-xs">Intelligence stream interrupted. Please retry.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {notices?.map((notice, i) => (
                    <div key={i} className="group bg-[#0f172a] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden transition-all hover:border-blue-500/30 hover:shadow-2xl">
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                         <BookOpen size={64} className="text-blue-500" />
                      </div>
                      <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="space-y-2">
                           <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">{notice.firm}</div>
                           <div className="flex items-center gap-3 text-slate-500 text-[9px] font-bold uppercase tracking-widest">
                              <Calendar size={10} /> {notice.date}
                           </div>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black border uppercase tracking-widest ${
                          notice.impact === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                          notice.impact === 'High' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                          'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {notice.impact} IMPACT
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-white mb-4 group-hover:text-blue-400 transition-colors">{notice.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed font-medium mb-10">
                        {notice.summary}
                      </p>
                      {notice.link && (
                        <a 
                          href={notice.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] group/link"
                        >
                          Read Full Briefing <ExternalLink size={12} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case Page.CloudSecurity:
        return (
          <div className="space-y-16 animate-in fade-in duration-700 px-4">
            <div className="text-center max-w-3xl mx-auto">
              <div className="text-blue-500 font-bold text-[10px] tracking-[0.4em] uppercase mb-4">Multi-Cloud Defense</div>
              <h2 className="text-5xl font-extrabold text-white mb-6 tracking-tight">{t.cloudTitle}</h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">{t.cloudDesc}</p>
            </div>
            <div className="bg-[#0f172a] border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="w-full md:w-1/2 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                    <Layers size={12} /> Next-Gen Cloud Protection
                  </div>
                  <h3 className="text-3xl font-extrabold text-white">CNAPP Elite Suite</h3>
                  <p className="text-slate-400 leading-relaxed font-medium">
                    {isEs 
                      ? 'Nuestra plataforma unificada CNAPP proporciona visibilidad continua y protección de cargas de trabajo en AWS, Azure y GCP.'
                      : 'Our unified CNAPP platform provides continuous visibility and workload protection across AWS, Azure, and GCP.'}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                     {[
                       { label: 'CSPM', desc: isEs ? 'Gestión de Postura' : 'Posture Management' },
                       { label: 'CWPP', desc: isEs ? 'Protección Cargas' : 'Workload Protection' },
                       { label: 'CIEM', desc: isEs ? 'Gestión Identidad' : 'Identity Mgmt' },
                       { label: 'KSPM', desc: isEs ? 'Seguridad K8s' : 'K8s Security' },
                     ].map((feat, idx) => (
                       <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div className="text-blue-400 font-black text-xs mb-1">{feat.label}</div>
                          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{feat.desc}</div>
                       </div>
                     ))}
                  </div>
                </div>
                <div className="w-full md:w-1/2 bg-slate-950 p-8 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl"></div>
                  <div className="space-y-6 relative z-10">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Security Posture Dashboard</span>
                      <span className="text-emerald-500 font-bold text-[10px] uppercase flex items-center gap-1.5">
                        <Activity size={10} /> Healthy
                      </span>
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between items-end">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Risk Index</span>
                          <span className="text-2xl font-black text-white">0.04 <span className="text-[10px] text-emerald-500 font-black uppercase">↓ 12%</span></span>
                       </div>
                       <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 w-[15%]"></div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-16">
               <ServiceGrid 
                  onSelect={setSelectedService} 
                  onRequestQuote={(service) => openContact(service.title)} 
                  services={allServices.filter(s => s.category === 'cloud')} 
                  lang={lang} 
               />
            </div>
          </div>
        );

      case Page.EmailSecurity:
        return (
          <div className="space-y-16 animate-in fade-in duration-700 px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-5xl font-extrabold text-white mb-6 tracking-tight">{t.emailTitle}</h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">{t.emailDesc}</p>
            </div>
            <div className="pt-16">
               <ServiceGrid 
                  onSelect={setSelectedService} 
                  onRequestQuote={(service) => openContact(service.title)} 
                  services={allServices.filter(s => s.category === 'email')} 
                  lang={lang} 
               />
            </div>
          </div>
        );

      case Page.Advisor:
        return <AISecurityAdvisor lang={lang} />;
      
      case Page.Services:
        return (
          <div className="space-y-16 animate-in fade-in duration-700 px-4">
            <ServiceGrid onSelect={setSelectedService} onRequestQuote={(s) => openContact(s.title)} services={allServices} lang={lang} />
          </div>
        );

      case Page.NIST:
        return (
          <div className="space-y-16 animate-in fade-in duration-700 px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-5xl font-extrabold text-white mb-6 tracking-tight">{t.nistTitle}</h2>
              <p className="text-slate-400 text-lg leading-relaxed font-medium">{t.nistDesc}</p>
            </div>
            <ServiceGrid onSelect={setSelectedService} onRequestQuote={(s) => openContact(s.title)} services={allServices.filter(s => s.category === 'nist')} lang={lang} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-emerald-500 selection:text-white">
      <Navbar currentPage={currentPage} onPageChange={setCurrentPage} lang={lang} onLangToggle={toggleLang} />
      <main className={`max-w-7xl mx-auto px-6 ${currentPage === Page.Monitor ? 'pt-56' : 'pt-44'}`}>
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
              <p className="text-slate-500 text-lg leading-relaxed max-w-md font-medium">{t.footerDesc}</p>
            </div>
          </div>
        </div>
      </footer>

      {selectedService && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-[#0f172a] border border-white/10 rounded-[3rem] w-full max-w-3xl p-12 relative overflow-y-auto no-scrollbar max-h-[90vh]">
            <button onClick={() => setSelectedService(null)} className="absolute top-8 right-8 p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-all"><X size={20} /></button>
            <div className="text-7xl mb-12 text-emerald-400"><selectedService.icon size={64} strokeWidth={1.5} /></div>
            <h3 className="text-4xl font-extrabold text-white mb-8 tracking-tight">{selectedService.title}</h3>
            <p className="text-slate-400 text-lg mb-12 leading-relaxed font-medium">{selectedService.longDescription}</p>
            <button onClick={() => {openContact(selectedService.title); setSelectedService(null);}} className="w-full bg-emerald-500 text-white py-6 rounded-2xl font-extrabold uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-400 transition-all text-sm">{t.initDeployment}</button>
          </div>
        </div>
      )}

      <ContactModal isOpen={isContactOpen} onClose={closeContact} serviceTitle={contactServiceTitle} />
    </div>
  );
};

export default App;
