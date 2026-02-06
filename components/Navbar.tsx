
import React, { useState, useEffect } from 'react';
import { Page, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface NavbarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  lang: Language;
  onLangToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onPageChange, lang, onLangToggle }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menu = [
    { label: t.navHome, id: Page.Home },
    { label: t.navServices, id: Page.Services },
    { label: t.navAdvisor, id: Page.Advisor },
    { label: t.navMonitor, id: Page.Monitor },
    { label: t.navResource, id: Page.Resource },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'py-4' : 'py-6'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-500 ${isScrolled ? 'glass shadow-2xl shadow-black/50' : 'bg-transparent'}`}>
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onPageChange(Page.Home)}>
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">C</div>
            <span className="text-lg font-extrabold text-white uppercase tracking-tighter">CYBER<span className="text-emerald-500">GUARD</span></span>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            {menu.map(item => (
              <button key={item.id} onClick={() => onPageChange(item.id)} className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${currentPage === item.id ? 'text-emerald-400 bg-emerald-500/5' : 'text-slate-400 hover:text-white'}`}>{item.label}</button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onLangToggle} className="px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] font-bold text-slate-400 hover:text-emerald-400 transition-all uppercase">{lang === 'es' ? 'EN' : 'ES'}</button>
            <button className="bg-white text-black px-5 py-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wider hover:bg-emerald-500 hover:text-white transition-all shadow-lg">{t.login || 'Login'}</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
