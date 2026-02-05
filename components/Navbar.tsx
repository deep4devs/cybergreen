
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: t.navHome, id: Page.Home },
    { name: t.navServices, id: Page.Services },
    { name: t.navNIST, id: Page.NIST },
    { name: t.navCloud, id: Page.CloudSecurity },
    { name: t.navAI, id: Page.AISecurity },
    { name: t.navAdvisor, id: Page.Advisor },
    { name: t.navMonitor, id: Page.Monitor },
  ];

  const handleNavClick = (id: Page) => {
    onPageChange(id);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'py-4' : 'py-6'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-500 ${isScrolled ? 'glass shadow-2xl shadow-black/50 border-white/10' : 'bg-transparent border-transparent'}`}>
          
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => handleNavClick(Page.Home)}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg rotate-3 group-hover:rotate-12 transition-transform duration-500 flex items-center justify-center text-white font-bold text-xl">C</div>
              <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
            </div>
            <span className="text-lg font-extrabold tracking-tighter text-white uppercase hidden sm:block">
              CYBER<span className="text-emerald-500">GUARD</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 relative ${
                  currentPage === item.id 
                    ? 'text-emerald-400 bg-emerald-500/5' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.name}
                {currentPage === item.id && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-emerald-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onLangToggle}
              className="px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] font-bold text-slate-400 hover:border-emerald-500 hover:text-emerald-400 transition-all uppercase"
            >
              {lang === 'es' ? 'EN' : 'ES'}
            </button>
            
            <button className="hidden md:block bg-white text-black px-5 py-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wider hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-white/5">
              {t.login}
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div className={`lg:hidden fixed inset-0 z-[-1] transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl"></div>
        <div className="relative pt-32 px-8 flex flex-col gap-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left py-4 px-6 rounded-2xl text-lg font-bold uppercase tracking-widest transition-all ${
                currentPage === item.id ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.name}
            </button>
          ))}
          <div className="mt-8 pt-8 border-t border-white/5">
             <button className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest">
               {t.login}
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;