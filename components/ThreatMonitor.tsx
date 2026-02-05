
import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { generateThreatIntel, ThreatIntel } from '../services/geminiService';
import { Language } from '../types';
import { Shield, Zap, Target, Cpu, Activity, Info, Users } from 'lucide-react';

interface ThreatMonitorProps {
  lang: Language;
}

const SIMULATED_INTEL: Record<string, ThreatIntel[]> = {
  en: [
    {
      title: "Advanced Persistent Threat (APT) Detected",
      technicalDetails: "Pattern matching suggests a lateral movement attempt using compromised service accounts. High-frequency pings detected on internal VLAN 4.",
      attackerProfile: "Nation-state actor / Industrial Espionage Group",
      recommendedCountermeasure: "Isolate VLAN 4 and rotate all service account credentials immediately."
    },
    {
      title: "Distributed Denial of Service (DDoS) Mitigation",
      technicalDetails: "Inbound traffic spike identified as a SYN flood originating from a botnet of IoT devices. Traffic reaching 40Gbps.",
      attackerProfile: "Hired Botnet Operator",
      recommendedCountermeasure: "Activate edge-filtering rules and scrub traffic through global CDN nodes."
    }
  ],
  es: [
    {
      title: "Amenaza Persistente Avanzada (APT) Detectada",
      technicalDetails: "El análisis de patrones sugiere un intento de movimiento lateral utilizando cuentas de servicio comprometidas. Pings de alta frecuencia detectados en la VLAN interna 4.",
      attackerProfile: "Actor estatal / Grupo de espionaje industrial",
      recommendedCountermeasure: "Aislar la VLAN 4 y rotar todas las credenciales de las cuentas de servicio de inmediato."
    },
    {
      title: "Mitigación de Denegación de Servicio Distribuida (DDoS)",
      technicalDetails: "Pico de tráfico entrante identificado como un ataque SYN flood originado por una botnet de dispositivos IoT. El tráfico alcanzó los 40 Gbps.",
      attackerProfile: "Operador de Botnet a sueldo",
      recommendedCountermeasure: "Activar reglas de filtrado perimetral y limpiar el tráfico a través de nodos CDN globales."
    }
  ]
};

const generateData = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    time: i,
    attacks: Math.floor(Math.random() * 50) + 10,
    mitigated: Math.floor(Math.random() * 40) + 15,
  }));
};

const ThreatMonitor: React.FC<ThreatMonitorProps> = ({ lang }) => {
  const [data, setData] = useState(generateData());
  const [activeAlerts, setActiveAlerts] = useState<{ id: string; text: string; type: string }[]>([]);
  const [intelHistory, setIntelHistory] = useState<ThreatIntel[]>([]);
  const isEs = lang === 'es';

  // Latest alert type to trigger query
  const latestAlertType = useMemo(() => activeAlerts[0]?.type || "Baseline Network Security", [activeAlerts]);

  // Fix: Corrected queryFunction to queryFn and added explicit generic types to useQuery
  const { data: latestIntel, isFetching: loadingIntel, isError } = useQuery<ThreatIntel, Error>({
    queryKey: ['threatIntel', latestAlertType, lang],
    queryFn: () => generateThreatIntel(latestAlertType, lang),
    retry: 1,
    staleTime: 30000,
  });

  // Track history of AI intel
  useEffect(() => {
    // Fix: latestIntel is now correctly typed as ThreatIntel | undefined
    if (latestIntel && !intelHistory.some(item => item.title === latestIntel.title)) {
      setIntelHistory(prev => [latestIntel, ...prev].slice(0, 3));
    }
  }, [latestIntel]);

  // Fallback if AI fails or is loading the first time
  const displayIntel = useMemo(() => {
    if (latestIntel) return latestIntel;
    const fallbackPool = SIMULATED_INTEL[lang] || SIMULATED_INTEL['en'];
    return fallbackPool[0];
  }, [latestIntel, lang]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const lastTime = prev[prev.length - 1].time;
        return [...prev.slice(1), {
          time: lastTime + 1,
          attacks: Math.floor(Math.random() * 60) + 20,
          mitigated: Math.floor(Math.random() * 55) + 25
        }];
      });

      if (Math.random() > 0.85) {
        const alertTypes = isEs 
          ? ['Inyección SQL', 'Fuerza Bruta', 'Acceso API no autorizado', 'XSS', 'Anomalía DDoS']
          : ['SQL Injection', 'Brute Force', 'Unauthorized API Access', 'XSS', 'DDoS Anomaly'];
        
        const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        const newAlert = {
          id: Math.random().toString(36).substring(2, 11),
          text: `${new Date().toLocaleTimeString()} - ${isEs ? 'CRÍTICO' : 'CRITICAL'}: ${type}`,
          type
        };
        
        setActiveAlerts(prev => [newAlert, ...prev].slice(0, 5));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [lang, isEs]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Graph */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-white/5 rounded-3xl p-6 shadow-inner relative overflow-hidden backdrop-blur-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2 uppercase tracking-tight">
              <Activity className="w-5 h-5 text-red-500 animate-pulse" />
              {isEs ? 'Análisis Global' : 'Global Analytics'}
            </h3>
            <div className="flex gap-4 text-[9px] font-bold uppercase tracking-widest text-slate-500">
              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div> {isEs ? 'Ataques' : 'Attacks'}</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> {isEs ? 'Mitigados' : 'Mitigated'}</div>
            </div>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorAttacks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMitigated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc', borderRadius: '16px', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="attacks" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorAttacks)" />
                <Area type="monotone" dataKey="mitigated" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorMitigated)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Feed Summary */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md border-l-emerald-500/20">
          <div className="absolute top-0 right-0 p-4">
             <div className={`text-[9px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-[0.2em] flex items-center gap-2 ${loadingIntel ? 'animate-pulse' : ''}`}>
                <Cpu size={10} />
                {isError ? 'LOCAL CACHE' : 'AI NEURAL LINK'}
             </div>
          </div>
          
          <h3 className="text-lg font-extrabold text-white mb-6 tracking-tight flex items-center gap-2">
            <Zap className="text-emerald-500 w-5 h-5" /> 
            {isEs ? 'Análisis de Red IA' : 'AI Network Analysis'}
          </h3>

          <div className="min-h-[180px] flex flex-col justify-center">
            {loadingIntel && !displayIntel ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-10">
                <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest animate-pulse">
                   {isEs ? 'Escaneando Capa de Aplicación...' : 'Scanning Application Layer...'}
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  {displayIntel.title}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <div className="text-[9px] font-bold text-slate-600 uppercase mb-1 tracking-widest flex items-center gap-1">
                        <Target size={10} /> {isEs ? 'Perfil del Atacante' : 'Attacker Profile'}
                      </div>
                      <div className="text-xs text-slate-300 font-medium italic">&quot;{displayIntel.attackerProfile}&quot;</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-slate-600 uppercase mb-1 tracking-widest flex items-center gap-1">
                        <Info size={10} /> {isEs ? 'Detalle Técnico' : 'Technical Detail'}
                      </div>
                      <div className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{displayIntel.technicalDetails}</div>
                    </div>
                  </div>
                  <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10 flex flex-col justify-center group hover:bg-emerald-500/10 transition-all cursor-crosshair">
                    <div className="text-[9px] font-bold text-emerald-500 uppercase mb-2 tracking-widest flex items-center gap-1">
                       <Shield size={10} /> {isEs ? 'CONTRAMEDIDA' : 'COUNTERMEASURE'}
                    </div>
                    <div className="text-xs text-white font-bold leading-relaxed">
                       {displayIntel.recommendedCountermeasure}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Intelligence History Feed */}
        <div className="lg:col-span-4 space-y-4 mt-4">
           <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                <Activity size={12} className="text-emerald-500" />
                {isEs ? 'Historial de Inteligencia Neural' : 'Neural Intelligence History'}
              </h4>
              <div className="h-px flex-grow bg-white/5 mx-6"></div>
              <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                {intelHistory.length} {isEs ? 'REPORTES ACTIVOS' : 'ACTIVE REPORTS'}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {intelHistory.length > 0 ? intelHistory.map((intel, idx) => (
                <div key={idx} className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 hover:border-emerald-500/20 transition-all group relative overflow-hidden flex flex-col h-full">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/20 group-hover:bg-emerald-500 transition-all"></div>
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-[11px] font-black text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors leading-tight max-w-[80%]">
                      {intel.title}
                    </div>
                    <span className="text-[8px] font-black text-slate-700 uppercase tracking-tighter shrink-0 ml-2">AI-ARCHIVE</span>
                  </div>

                  {/* Attacker Profile Field */}
                  <div className="mb-4">
                    <div className="text-[8px] font-black text-slate-600 uppercase mb-1 flex items-center gap-1 tracking-widest">
                      <Users size={8} /> {isEs ? 'PERFIL ATACANTE' : 'ATTACKER PROFILE'}
                    </div>
                    <div className="text-[10px] text-emerald-500/80 font-bold italic line-clamp-1">
                      {intel.attackerProfile}
                    </div>
                  </div>

                  {/* Technical Details Field */}
                  <div className="flex-grow">
                    <div className="text-[8px] font-black text-slate-600 uppercase mb-1 flex items-center gap-1 tracking-widest">
                      <Info size={8} /> {isEs ? 'DETALLES TÉCNICOS' : 'TECHNICAL DETAILS'}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-3 font-medium">
                      {intel.technicalDetails}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/5 flex items-center gap-2">
                    <div className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                      {isEs ? 'Mitigado' : 'Mitigated'}
                    </div>
                    <div className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[8px] font-bold uppercase tracking-widest">
                      {isEs ? 'Verificado' : 'Verified'}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-3 py-16 text-center border border-dashed border-white/5 rounded-3xl bg-slate-900/10">
                  <div className="text-[10px] font-bold text-slate-700 uppercase tracking-[0.5em] animate-pulse">
                    {isEs ? 'Sincronizando Base de Conocimientos...' : 'Synchronizing Knowledge Base...'}
                  </div>
                </div>
              )}
           </div>
        </div>

        {/* Live Alert Ticker */}
        <div className="lg:col-span-4 bg-slate-950/30 border border-white/5 rounded-2xl p-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {activeAlerts.map((alert) => (
              <div key={alert.id} className="text-[9px] font-bold p-3 bg-slate-950 border border-white/5 border-l-2 border-l-red-500 rounded-xl text-red-400/60 animate-in slide-in-from-right-2 duration-300 uppercase tracking-tight">
                {alert.text}
              </div>
            ))}
            {activeAlerts.length === 0 && (
              <div className="col-span-5 text-center text-[9px] text-slate-600 font-bold uppercase tracking-[0.3em] py-2">
                {isEs ? 'Sistemas Nominales' : 'Systems Nominal'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatMonitor;
