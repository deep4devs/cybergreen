
import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { generateThreatIntel, ThreatIntel } from '../services/geminiService';
import { Language, ThreatAlert } from '../types';
import { THREAT_WEIGHTS, getSeverity } from '../constants';
import { Shield, Zap, Target, Cpu, Activity, Database, Network, Search, HardDrive, Lock, AlertTriangle } from 'lucide-react';

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
    }
  ],
  es: [
    {
      title: "Amenaza Persistente Avanzada (APT) Detectada",
      technicalDetails: "El análisis de patrones sugiere un intento de movimiento lateral utilizando cuentas de servicio comprometidas. Pings de alta frecuencia detectados en la VLAN interna 4.",
      attackerProfile: "Actor estatal / Grupo de espionaje industrial",
      recommendedCountermeasure: "Aislar la VLAN 4 y rotar todas las credenciales de las cuentas de servicio de inmediato."
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
            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            <p className="text-xs font-bold text-white">Attacks: {payload[0].value}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <p className="text-xs font-bold text-white">Mitigated: {payload[1].value}</p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const ThreatMonitor: React.FC<ThreatMonitorProps> = ({ lang }) => {
  const [data, setData] = useState(generateData());
  const [activeAlerts, setActiveAlerts] = useState<ThreatAlert[]>([]);
  const [intelHistory, setIntelHistory] = useState<ThreatIntel[]>([]);
  const isEs = lang === 'es';

  const latestAlertType = useMemo(() => activeAlerts[0]?.type || "Baseline Network Security", [activeAlerts]);
  const currentGlobalScore = useMemo(() => {
    if (activeAlerts.length === 0) return 12;
    return Math.round(activeAlerts.reduce((acc, curr) => acc + curr.score, 0) / activeAlerts.length);
  }, [activeAlerts]);

  const { data: latestIntel, isFetching: loadingIntel } = useQuery<ThreatIntel, Error>({
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

      if (Math.random() > 0.8) {
        const alertConfig = [
          { type: 'SQL Injection', icon: Database },
          { type: 'Brute Force', icon: Lock },
          { type: 'Unauthorized API Access', icon: Network },
          { type: 'XSS Attack', icon: Search },
          { type: 'DDoS Anomaly', icon: Activity },
          { type: 'Malware Pattern', icon: HardDrive },
          { type: 'Zero-Day Exploit', icon: AlertTriangle }
        ];
        
        const selection = alertConfig[Math.floor(Math.random() * alertConfig.length)];
        const baseScore = THREAT_WEIGHTS[selection.type] || 50;
        const variance = Math.floor(Math.random() * 10) - 5;
        const finalScore = Math.min(100, Math.max(0, baseScore + variance));
        
        const newAlert: ThreatAlert = {
          id: Math.random().toString(36).substring(2, 11),
          text: `${isEs ? 'ALERTA' : 'ALERT'}: ${selection.type}`,
          type: selection.type,
          icon: selection.icon,
          score: finalScore,
          severity: getSeverity(finalScore),
          timestamp: new Date().toLocaleTimeString()
        };
        
        setActiveAlerts(prev => [newAlert, ...prev].slice(0, 5));
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [lang, isEs]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-red-500 border-red-500/20 bg-red-500/10';
      case 'High': return 'text-orange-500 border-orange-500/20 bg-orange-500/10';
      case 'Elevated': return 'text-amber-500 border-amber-500/20 bg-amber-500/10';
      default: return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10';
    }
  };

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
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 ml-11">Active Risk Score: <span className={getSeverityColor(getSeverity(currentGlobalScore)).split(' ')[0]}>{currentGlobalScore}</span></p>
            </div>
            
            <div className="flex gap-6">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Inbound Attacks</span>
                <span className="text-lg font-black text-red-500 mono">{data[data.length-1].attacks}</span>
              </div>
              <div className="w-px h-8 bg-white/5 self-center"></div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Global Severity</span>
                <span className={`text-lg font-black uppercase mono ${getSeverityColor(getSeverity(currentGlobalScore)).split(' ')[0]}`}>
                  {getSeverity(currentGlobalScore)}
                </span>
              </div>
            </div>
          </div>

          <div className="h-[300px] -mx-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
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
                <Area type="monotone" dataKey="attacks" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorAttacks)" />
                <Area type="monotone" dataKey="mitigated" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorMitigated)" />
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
            <div className={`text-[9px] font-black px-3 py-1.5 rounded-lg border flex items-center gap-2 tracking-widest ${loadingIntel ? 'border-emerald-500/50 text-emerald-400 animate-pulse' : 'text-slate-500 border-white/5'}`}>
              {loadingIntel ? 'PROCESSING' : 'STABLE'}
            </div>
          </div>

          <div className="space-y-6">
            {!displayIntel ? (
               <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="w-12 h-12 border-2 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Syncing neural stream...</p>
               </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-slate-950/50 p-6 rounded-3xl border border-white/5 mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-emerald-400 font-black uppercase text-xs tracking-widest flex items-center gap-2">
                      <Target size={14} /> {displayIntel.title}
                    </h4>
                    <span className={`px-2 py-1 rounded text-[8px] font-black border ${getSeverityColor(activeAlerts[0]?.severity || 'Baseline')}`}>
                      {activeAlerts[0]?.severity || 'BASELINE'}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Threat Context</p>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium italic">&quot;{displayIntel.attackerProfile}&quot;</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Analysis Score</p>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-1">
                        <div 
                          className={`h-full transition-all duration-1000 ${getSeverityColor(activeAlerts[0]?.severity || 'Baseline').replace('text', 'bg').split(' ')[0]}`}
                          style={{ width: `${activeAlerts[0]?.score || 12}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-500/5 p-6 rounded-3xl border border-emerald-500/20 group/cm relative overflow-hidden">
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

        {/* Real-time Event Ticker with Scoring */}
        <div className="lg:col-span-12">
          <div className="bg-slate-950/50 border border-white/5 rounded-[2rem] p-4 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/30"></div>
             <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {activeAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className="flex items-center gap-3 p-3 bg-slate-950 border border-white/5 rounded-2xl animate-in slide-in-from-right-4 duration-500"
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${getSeverityColor(alert.severity)}`}>
                      <alert.icon size={14} />
                    </div>
                    <div className="overflow-hidden flex-1">
                      <div className="flex justify-between items-center mb-0.5">
                        <p className="text-[9px] font-black text-white/80 uppercase truncate tracking-tight">{alert.type}</p>
                        <span className="text-[8px] font-bold opacity-50">{alert.score}</span>
                      </div>
                      <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">{alert.timestamp}</p>
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
