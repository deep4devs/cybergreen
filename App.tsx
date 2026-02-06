
import React, { useState } from 'react';
import Navbar from './components/Navbar.tsx';
import ServiceGrid from './components/ServiceGrid.tsx';
import ThreatMonitor from './components/ThreatMonitor.tsx';
import AISecurityAdvisor from './components/AISecurityAdvisor.tsx';
import ContactModal from './components/ContactModal.tsx';
import { Page, SecurityService, Language } from './types.ts';
import { getServices, TRANSLATIONS } from './constants.tsx';
import { 
  ShieldCheck, Target, Eye, Award, Terminal, Network, Layers, Repeat, 
  Globe, ShieldAlert, Mail, Lock, Fingerprint, UserCheck, Key, Search, Package, X, Server, Smartphone, Activity, Cpu, Users, BarChart3, Radio, UserPlus, Info
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

  const FeatureCard = ({ item, colorClass }: { item: any, colorClass: string }) => (
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

      case Page.EmailSecurity:
        return (
          <div className="space-y-16 animate-in fade-in duration-700 px-4">
            <div className="text-center max-w-3xl mx-auto">
              <div className="text-cyan-500 font-bold text-[10px] tracking-[0.4em] uppercase mb-4">Critical Vector Defense</div>
              <h2 className="text-5xl font-extrabold text-white mb-6 tracking-tight">{t.emailTitle}</h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">{t.emailDesc}</p>
            </div>

            {/* Simulated Email Intel Section */}
            <div className="bg-[#0f172a] border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="w-full md:w-1/2 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest">
                    <UserPlus size={12} /> Contact Intelligence
                  </div>
                  <h3 className="text-3xl font-extrabold text-white">{isEs ? 'Reputación de Contactos' : 'Contact Reputation Engine'}</h3>
                  <p className="text-slate-400 leading-relaxed font-medium">
                    {isEs 
                      ? 'Nuestra IA analiza automáticamente a los remitentes externos basándose en la edad del dominio, configuraciones DMARC y patrones de comportamiento histórico. Evita ataques de Business Email Compromise (BEC) antes de que lleguen a tu bandeja.'
                      : 'Our AI automatically analyzes external senders based on domain age, DMARC settings, and historical behavior patterns. Prevent Business Email Compromise (BEC) attacks before they reach your inbox.'}
                  </p>
                  <div className="p-6 bg-slate-950/50 rounded-2xl border border-white/5 border-dashed">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Info size={12} /> {isEs ? 'Sugerencia de Solución Externa' : 'External Solution Insight'}
                    </p>
                    <p className="text-xs text-slate-400 italic font-medium leading-loose">
                      {isEs 
                        ? 'Integramos APIs de inteligencia como Abnormal Security o Mimecast para obtener un perfil de riesgo completo de cada contacto de correo externo.' 
                        : 'We integrate intelligence APIs like Abnormal Security or Mimecast to obtain a complete risk profile for every external email contact.'}
                    </p>
                  </div>
                </div>
                <div className="w-full md:w-1/2 bg-slate-950 p-8 rounded-[2.5rem] border border-white/10 relative">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Analysis Preview</span>
                      <span className="text-emerald-500 font-bold text-[10px] uppercase">Live Scan</span>
                    </div>
                    {[
                      { email: 'internal-finance@yourcorp.com', status: 'Verified', color: 'text-emerald-400', reason: 'Internal Employee' },
                      { email: 'invoice-urgent@external-partner.net', status: 'Warning', color: 'text-amber-400', reason: 'New Domain detected (2 days old)' },
                      { email: 'admin@payment-gateway.biz', status: 'Critical', color: 'text-red-400', reason: 'DMARC Fail / SPF Mismatch' },
                    ].map((m, i) => (
                      <div key={i} className="bg-white/5 p-4 rounded-xl flex justify-between items-center group/mail hover:bg-white/10 transition-all">
                        <div>
                          <p className="text-[11px] font-bold text-white mb-1">{m.email}</p>
                          <p className="text-[9px] text-slate-500 font-medium">{m.reason}</p>
                        </div>
                        <span className={`text-[9px] font-black uppercase px-2 py-1 rounded border border-white/10 ${m.color}`}>{m.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                 { title: 'Anti-Phishing', desc: isEs ? 'Detección de suplantación mediante IA neural.' : 'Impersonation detection via neural AI.', icon: Target },
                 { title: 'DMARC Suite', desc: isEs ? 'Configuración SPF, DKIM y DMARC a nivel global.' : 'Global SPF, DKIM, and DMARC configuration.', icon: ShieldCheck },
                 { title: 'Sandbox Analysis', desc: isEs ? 'Ejecución segura de adjuntos sospechosos.' : 'Safe execution of suspicious attachments.', icon: Package },
                 { title: 'Data Loss Prev.', desc: isEs ? 'Prevención de fuga de información sensible (DLP).' : 'Prevention of sensitive data leakage (DLP).', icon: Search },
               ].map((item, i) => (
                 <FeatureCard key={i} item={item} colorClass="cyan-500" />
               ))}
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
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {['Identify', 'Protect', 'Detect', 'Respond', 'Recover'].map((phase, i) => (
                <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-3xl text-center group transition-all hover:-translate-y-2">
                  <h3 className="font-extrabold uppercase text-[10px] tracking-widest text-emerald-400">{phase}</h3>
                </div>
              ))}
            </div>
            <ServiceGrid onSelect={setSelectedService} onRequestQuote={(s) => openContact(s.title)} services={allServices.filter(s => s.category === 'nist')} lang={lang} />
          </div>
        );

      default:
        // Handle other pages similarly
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
                <li className="flex items-center gap-3">contact@cyberguard.mx</li>
              </ul>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
              {selectedService.features.map((f, i) => (
                <div key={i} className="flex items-center gap-4 text-emerald-400 bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/10"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span className="text-[11px] font-extrabold uppercase tracking-widest">{f}</span></div>
              ))}
            </div>
            <button onClick={() => {openContact(selectedService.title); setSelectedService(null);}} className="w-full bg-emerald-500 text-white py-6 rounded-2xl font-extrabold uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-400 transition-all text-sm">{t.initDeployment}</button>
          </div>
        </div>
      )}

      <ContactModal isOpen={isContactOpen} onClose={closeContact} serviceTitle={contactServiceTitle} />
    </div>
  );
};

export default App;
