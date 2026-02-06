
import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { generateThreatIntel, ThreatIntel } from '../services/geminiService';
import { Language } from '../types';
import { Shield, Zap, Target, Cpu, Activity, Info, Users, AlertCircle, Database, Network, Search, HardDrive } from 'lucide-react';

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
  return Array.from({ length: 30 }, (_, i) => ({
    time: i,
    attacks: Math.floor(Math.random() * 50) + 10,
    mitigated: Math.floor(Math.random() * 45) + 15,
  }));
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/90 border border-white/10 p-4 rounded-2xl backdrop-blur-xl shadow-2xl">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Metrics Snapshot</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></div>
            <p className="text-xs font-bold text-white uppercase tracking-tight">Attacks: <span className="text-red-400">{payload[0].value}</span></p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
            <p className="text-xs font-bold text-white uppercase tracking-tight">Mitigated: <span className="text-emerald-400">{payload[1].value}</span></p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const ThreatMonitor: React.FC<ThreatMonitorProps> = ({ lang }) => {
  const [data, setData] = useState(generateData());
  const [activeAlerts, setActiveAlerts] = useState<{ id: string; text: string; type: string; icon: any }[]>([]);
  const [intelHistory, setIntelHistory] = useState<ThreatIntel[]>([]);
  const isEs = lang === 'es';

  const latestAlertType = useMemo(() => activeAlerts[0]?.type || "Baseline Network Security", [activeAlerts]);

  const { data: latestIntel, isFetching: loadingIntel, isError } = useQuery<ThreatIntel, Error>({
    queryKey: ['threatIntel', latestAlertType, lang],
    queryFn: () => generateThreatIntel(latestAlertType, lang),
    retry: 1,
    staleTime: 30000,
  });

  useEffect(() => {
    if (latestIntel && !intelHistory.some(item => item.title === latestIntel.title)) {
      setIntelHistory(prev => [latestIntel, ...prev].slice(0, 3));
    }
  }, [latestIntel]);

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
        const alertConfig = [
          { type: 'SQL Injection', icon: Database },
          { type: 'Brute Force', icon: Lock },
          { type: 'Unauthorized API Access', icon: Network },
          { type: 'XSS Attack', icon: Search },
          { type: 'DDoS Anomaly', icon: Activity },
          { type: 'Malware Pattern', icon: HardDrive }
        ];
        
        const selection = alertConfig[Math.floor(Math.random() * alertConfig.length)];
        const newAlert = {
          id: Math.random().toString(36).substring(2, 11),
          text: `${new Date().toLocaleTimeString()} - ${isEs ? 'ALERTA' : 'ALERT'}: ${selection.type}`,
          type: selection.type,
          icon: selection.icon
        };
        
        setActiveAlerts(prev => [newAlert, ...prev].slice(0, 5));
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [lang, isEs]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Telemetry Graph */}
        <div className="lg:col-span-7 bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/20 via-emerald-500/20 to-blue-500/20"></div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                  <Activity size={18} className="animate-pulse" />
                </div>
                {isEs ? 'Telemetría de Amenazas' : 'Threat Telemetry'}
              </h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 ml-11">Real-time attack surface monitoring</p>
            </div>
            
            <div className="flex gap-6">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Inbound Attacks</span>
                <span className="text-lg font-black text-red-500 mono">{data[data.length-1].attacks}</span>
              </div>
              <div className="w-px h-8 bg-white/5 self-center"></div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Neutralized</span>
                <span className="text-lg font-black text-emerald-500 mono">{data[data.length-1].mitigated}</span>
              </div>
            </div>
          </div>

          <div className="h-[300px] -mx-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <linearGradient id="colorAttacks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMitigated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#ffffff03" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="attacks" 
                  stroke="#ef4444" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorAttacks)" 
                  animationDuration={1500}
                  filter="url(#glow)"
                />
                <Area 
                  type="monotone" 
                  dataKey="mitigated" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorMitigated)" 
                  animationDuration={2000}
                  filter="url(#glow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Neural Analysis Panel */}
        <div className="lg:col-span-5 bg-[#0f172a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
          <div className="scanner-line"></div>
          
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Cpu size={18} />
              </div>
              {isEs ? 'Análisis Neural' : 'Neural Analysis'}
            </h3>
            <div className={`text-[9px] font-black px-3 py-1.5 rounded-lg border flex items-center gap-2 tracking-widest transition-all ${loadingIntel ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 animate-pulse' : 'border-white/5 bg-white/5 text-slate-500'}`}>
              <Zap size={10} fill={loadingIntel ? "currentColor" : "none"} />
              {loadingIntel ? 'PROCESSING' : 'SYNCED'}
            </div>
          </div>

          <div className="space-y-6">
            {!displayIntel ? (
               <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="w-12 h-12 border-2 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Decrypting neural stream...</p>
               </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-slate-950/50 p-6 rounded-3xl border border-white/5 mb-6 hover:border-emerald-500/20 transition-all cursor-default">
                  <h4 className="text-emerald-400 font-black uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                    <Target size={14} />
                    {displayIntel.title}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Technical Origin</p>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium italic">&quot;{displayIntel.attackerProfile}&quot;</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Anomaly Depth</p>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{displayIntel.technicalDetails}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-500/5 p-6 rounded-3xl border border-emerald-500/20 group/cm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/cm:scale-150 transition-transform duration-700">
                    <Shield size={40} className="text-emerald-500" />
                  </div>
                  <h5 className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Shield size={12} /> Defensive Directive
                  </h5>
                  <p className="text-xs text-white font-bold leading-relaxed relative z-10">
                    {displayIntel.recommendedCountermeasure}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Neural Intel History */}
        <div className="lg:col-span-12 space-y-6">
          <div className="flex items-center gap-6">
             <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] shrink-0">Security Forensics</h4>
             <div className="h-px w-full bg-white/5"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {intelHistory.length > 0 ? intelHistory.map((intel, idx) => (
              <div 
                key={idx} 
                style={{ animationDelay: `${idx * 200}ms` }}
                className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 hover:bg-slate-900/60 hover:border-white/10 transition-all animate-in fade-in slide-in-from-bottom-2 duration-500 group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-all">
                    <Database size={18} />
                  </div>
                  <span className="text-[8px] font-black text-slate-700 uppercase tracking-tighter group-hover:text-slate-500 transition-colors">Forensic Log #{Math.floor(Math.random()*9000)+1000}</span>
                </div>
                
                <h5 className="text-xs font-black text-white uppercase tracking-tight mb-3 line-clamp-1">{intel.title}</h5>
                <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-3 font-medium mb-6">{intel.technicalDetails}</p>
                
                <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Isolated</span>
                </div>
              </div>
            )) : (
              <div className="col-span-3 py-16 text-center border border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
                <p className="text-[10px] font-bold text-slate-700 uppercase tracking-[0.6em] animate-pulse">Establishing secure data tunnel...</p>
              </div>
            )}
          </div>
        </div>

        {/* Real-time Event Ticker */}
        <div className="lg:col-span-12">
          <div className="bg-slate-950/50 border border-white/5 rounded-[2rem] p-4 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-red-500/30"></div>
             <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {activeAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className="flex items-center gap-3 p-3 bg-slate-950 border border-white/5 rounded-2xl animate-in slide-in-from-right-4 duration-500"
                  >
                    <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                      <alert.icon size={14} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[9px] font-black text-red-400/80 uppercase truncate tracking-tight">{alert.text.split(' - ')[1]}</p>
                      <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">{alert.text.split(' - ')[0]}</p>
                    </div>
                  </div>
                ))}
                {activeAlerts.length === 0 && (
                   <div className="col-span-5 py-2 text-center">
                      <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">Zero active intrusions detected</p>
                   </div>
                )}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ThreatMonitor;
