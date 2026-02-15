// last version cyberg 1.0
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
import { ShieldCheck, Target, Radio, ExternalLink, Calendar } from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [lang, setLang] = useState<Language>('es');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactServiceTitle, setContactServiceTitle] = useState<string | undefined>();

  const t = TRANSLATIONS[lang];
  const allServices = getServices(lang);

  const { data: notices, isLoading: loadingNotices } = useQuery<ResourceNotice[]>({
    queryKey: ['israelNotices', lang],
    queryFn: () => getIsraelCyberNotices(lang),
    enabled: currentPage === Page.Resource,
  });

  const renderContent = () => {
    switch (currentPage) {
      case Page.Home:
        return (
          <div className="space-y-32 animate-in fade-in duration-700">
            <header className="text-center py-10 px-4 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>
              <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-8 tracking-tighter leading-[1.1] relative z-10">
                {t.heroTitle} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{t.heroFuture}</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium mb-6 relative z-10">{t.heroDesc}</p>
              <p className="text-white text-xl font-bold mb-4 relative z-10">Liz Hernandez</p>
              <p className="text-emerald-500/60 font-mono text-xs uppercase tracking-[0.3em] mb-14 italic relative z-10">"{t.slogan}"</p>
              <div className="flex flex-wrap justify-center gap-5 relative z-10">
                <button onClick={() => setIsContactOpen(true)} className="bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-5 rounded-2xl font-extrabold text-sm uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20">{t.btnAI}</button>
                <button onClick={() => setCurrentPage(Page.Services)} className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-extrabold text-sm uppercase tracking-widest transition-all">{t.btnServices}</button>
              </div>
            </header>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="bg-slate-900/40 border border-white/5 p-12 rounded-[3rem]">
                <div className="flex items-center gap-6 mb-8">
                  <div className="text-6xl font-black text-emerald-500 tracking-tighter">{t.experienceYears}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-loose max-w-[150px]">{t.experienceText}</div>
                </div>
                <h2 className="text-3xl font-extrabold text-white mb-6 tracking-tight">{t.aboutTitle}</h2>
                <p className="text-slate-400 text-lg leading-relaxed font-medium">{t.aboutDesc}</p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] flex items-start gap-6">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0"><Target size={24} /></div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Misión</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">Garantizar la continuidad del negocio mediante tecnología avanzada.</p>
                </div>
              </div>
            </section>
          </div>
        );
      case Page.Monitor:
        return (
          <div className="animate-in fade-in duration-1000 px-4 max-w-[1600px] mx-auto pb-20">
             <div className="text-center mb-16">
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-slate-900 border border-white/5 text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-6"><Radio size={12} className="animate-pulse" /> SOC MISSION CONTROL</div>
                <h2 className="text-7xl font-black text-white mb-6 tracking-tighter uppercase">Cyber<span className="text-emerald-500">Monitor</span></h2>
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
              <h2 className="text-5xl font-black text-white mb-6 tracking-tight uppercase">{t.resourceTitle}</h2>
              <p className="text-slate-400 text-lg font-medium max-w-3xl mx-auto">{t.resourceDesc}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {loadingNotices ? (
                <div className="col-span-2 text-center py-32 text-slate-500 font-black uppercase tracking-[0.4em]">Syncing Feed...</div>
              ) : notices?.map((notice, i) => (
                <div key={i} className="bg-[#0f172a] border border-white/5 rounded-[3rem] p-10 relative group hover:border-blue-500/30 transition-all">
                  <div className="flex justify-between items-start mb-8">
                    <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">{notice.firm}</div>
                    <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg text-[9px] font-black border border-blue-500/20">{notice.impact} IMPACT</span>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4">{notice.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-10">{notice.summary}</p>
                  {notice.link && <a href={notice.link} target="_blank" className="text-[10px] font-black text-blue-400 uppercase flex items-center gap-2">Read Briefing <ExternalLink size={12} /></a>}
                </div>
              ))}
            </div>
          </div>
        );
      case Page.Advisor:
        return <AISecurityAdvisor lang={lang} />;
      case Page.Services:
        return <ServiceGrid onSelect={() => {}} onRequestQuote={(s) => {setContactServiceTitle(s.title); setIsContactOpen(true);}} services={allServices} lang={lang} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar currentPage={currentPage} onPageChange={setCurrentPage} lang={lang} onLangToggle={() => setLang(l => l === 'es' ? 'en' : 'es')} />
      <main className="max-w-7xl mx-auto px-6 pt-44">{renderContent()}</main>
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} serviceTitle={contactServiceTitle} />
    </div>
  );
};

export default App;