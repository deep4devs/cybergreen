
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ServiceGrid from './components/ServiceGrid';
import ThreatMonitor from './components/ThreatMonitor';
import AISecurityAdvisor from './components/AISecurityAdvisor';
import ContactModal from './components/ContactModal';
import { Page, SecurityService, Language } from './types';
import { getServices, TRANSLATIONS } from './constants';

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
                <div className="flex items-center gap-3 text-emerald-500 text-[10px