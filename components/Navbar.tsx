
import React, { useState, useEffect, useRef } from 'react';
import { Page, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { ChevronDown, Shield, Globe, Lock, Cpu, Activity, LayoutGrid, Network, Server, Smartphone, BookOpen } from 'lucide-react';

interface NavbarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  lang: Language;
  onLangToggle: () => void;
}

interface NavItem {
  label: string;
  id?: Page;
  children?: { label: string; id: Page; icon: React.ElementType }[];
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onPageChange, lang, onLangToggle }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navStructure: NavItem[] = [
    { label: t.navHome, id: Page.Home },
    { 
      label: lang === 'es' ? 'Soluciones' : 'Solutions', 
      children: [
        { label: t.navServices, id: Page.Services, icon: LayoutGrid },
        { label: t.navLinux, id: Page.LinuxSecurity, icon: Shield },
        { label: t.navIdentity, id: Page.IdentitySecurity, icon: Lock },
      ]
    },
    { 
      label: lang === 'es' ? 'Infraestructura' : 'Infrastructure', 
      children: [
        { label: t.navCloud, id: Page.CloudSecurity, icon: Globe },
        { label: t.navDNS, id: Page.DNSSecurity, icon: Shield },
        { label: t.navEmail, id: Page.EmailSecurity, icon: Lock },
        { label: t.navNetworking || (lang === 'es' ? 'Redes' : 'Networking'), id: Page.Networking, icon: Network },
        { label: t.navServers || (lang === 'es' ? 'Servidores' : 'Servers'), id: Page.Servers, icon: Server },
        { label: t.navEndpoints || (lang === 'es' ? 'Endpoints' : 'Endpoints'), id: Page.Endpoints, icon: Smartphone },
      ]
    },
    { 
      label: lang === 'es' ? 'Cumplimiento & IA' : 'Compliance & AI', 
      children: [
        { label: t.navNIST, id: Page.NIST, icon: Shield },
        { label: t.navAI, id: Page.AISecurity, icon: Cpu },
        { label: t.navAdvisor, id: Page.Advisor, icon: Cpu },
      ]
    },
    { label: t.navResource, id: Page.Resource },
    { label: t.navMonitor, id: Page.Monitor },
  ];

  const handleNavClick = (id: Page) => {
    onPageChange(id);
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleMobileExpanded = (label: string) => {
    setMobileExpanded(mobileExpanded === label ? null : label);
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
          <div className="hidden lg:flex items-center gap-2">
            {navStructure.map((item) => (
              <div 
                key={item.label}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() => item.id && handleNavClick(item.id)}
                  className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                    (item.id === currentPage || item.children?.some(c => c.id === currentPage))
                      ? 'text-emerald-400 bg-emerald-500/5' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                  {item.children && <ChevronDown size={12} className={`transition-transform duration-300 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />}
                </button>

                {/* Dropdown Menu */}
                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="bg-[#0f172a] border border-white/10 rounded-2xl shadow-3xl min-w-[240px] overflow-hidden p-2">
                      {item.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => handleNavClick(child.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                            currentPage === child.id 
                              ? 'bg-emerald-500/10 text-emerald-400' 
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <child.icon size={16} className={currentPage === child.id ? 'text-emerald-400' : 'text-slate-600'} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{child.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
        <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-3xl"></div>
        <div className="relative pt-32 px-6 flex flex-col gap-2 max-h-screen overflow-y-auto pb-20">
          {navStructure.map((item) => (
            <div key={item.label} className="w-full">
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleMobileExpanded(item.label)}
                    className="w-full flex items-center justify-between py-4 px-6 rounded-2xl text-lg font-bold uppercase tracking-widest text-slate-400 hover:bg-white/5"
                  >
                    {item.label}
                    <ChevronDown size={20} className={`transition-transform duration-300 ${mobileExpanded === item.label ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileExpanded === item.label && (
                    <div className="pl-6 space-y-1 mt-1 animate-in slide-in-from-top-2">
                      {item.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => handleNavClick(child.id)}
                          className={`w-full text-left py-3 px-6 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all ${
                            currentPage === child.id ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500 hover:text-white'
                          }`}
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => item.id && handleNavClick(item.id)}
                  className={`w-full text-left py-4 px-6 rounded-2xl text-lg font-bold uppercase tracking-widest transition-all ${
                    currentPage === item.id ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              )}
            </div>
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
