
import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { generateThreatIntel, ThreatIntel } from '../services/geminiService';
import { Language, ThreatAlert } from '../types';
import { THREAT_WEIGHTS, getSeverity } from '../constants';
import { Shield, Target, Cpu, Activity, Database, Network, Search, HardDrive, Lock, AlertTriangle, ChevronDown, ChevronUp, BrainCircuit, Loader2, FileText, Info, Terminal } from 'lucide-react';

interface ThreatMonitorProps {
  lang: Language;
}

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
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [alertIntel, setAlertIntel] = useState<Record<string, ThreatIntel>>({});
  
  const isEs = lang === 'es';

  const currentGlobalScore = useMemo(() => {
    if (activeAlerts.length === 0) return 12;
    return Math.round(activeAlerts.reduce((acc, curr) => acc + curr.score, 0) / activeAlerts.length);
  }, [activeAlerts]);

  // Global AI Summary for the most recent high-level threat
  const { data: globalIntel } = useQuery<ThreatIntel, Error>({
    queryKey: ['globalThreatIntel', activeAlerts[0]?.type || "Baseline", lang],
    queryFn: () => generateThreatIntel(activeAlerts[0]?.type || "Baseline", lang),
    enabled: activeAlerts.length > 0,
    staleTime: 60000,
  });

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
        
        setActiveAlerts(prev => [newAlert, ...prev].slice(0, 8));
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Immediate': return 'text-rose-500 border-rose-500/30 bg-rose-500/5';
      case 'High': return 'text-orange-400 border-orange-400/30 bg-orange-400/5';
      case 'Medium': return 'text-blue-400 border-blue-400/30 bg-blue-400/5';
      default: return 'text-slate-400 border-slate-400/30 bg-slate-400/5';
    }
  };

  const handleAnalyzeAlert = async (alert: ThreatAlert) => {
    if (alertIntel[alert.id]) {
      setExpandedAlertId(expandedAlertId === alert.id ? null : alert.id);
      return;
    }

    setAnalyzingId(alert.id);
    try {
      const intel = await generateThreatIntel(alert.type, lang);
      setAlertIntel(prev => ({ ...prev, [alert.id]: intel }));
      setExpandedAlertId(alert.id);
    } catch (e) {
      console.error("Failed to fetch detailed intel", e);
    } finally {
      setAnalyzingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Telemetry Graph */}
        <div className="lg:col-span-7 bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group">
          <div className="scanner-line"></div>
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

        {/* AI Global Diagnosis Panel */}
        <div className="lg:col-span-5 bg-[#0f172a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <BrainCircuit size={120} className="text-emerald-500" />
          </div>
          
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Cpu size={18} />
              </div>
              {isEs ? 'Diagnóstico Global IA' : 'Global AI Diagnosis'}
            </h3>
            <div className={`text-[9px] font-black px-3 py-1.5 rounded-lg border flex items-center gap-2 tracking-widest text-slate-500 border-white/5`}>
              STABLE
            </div>
          </div>

          <div className="space-y-6">
            {!globalIntel ? (
               <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Loader2 size={32} className="text-emerald-500 animate-spin" />
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Analyzing incoming stream...</p>
               </div>
            ) : (
              <div className="animate-in fade-in duration-700">
                <div className="bg-slate-950/50 p-6 rounded-3xl border border-white/5 mb-6 relative overflow-hidden">
                  <h4 className="text-emerald-400 font-black uppercase text-xs tracking-widest flex items-center gap-2 mb-4 relative z-10">
                    <BrainCircuit size={14} /> {globalIntel.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium italic mb-4 relative z-10">
                    {globalIntel.attackerProfile}
                  </p>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative z-10">
                    <div className="bg-emerald-500 h-full w-[85%]"></div>
                  </div>
                </div>

                <div className="bg-emerald-500/5 p-6 rounded-3xl border border-emerald-500/20">
                  <h5 className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Shield size={12} /> Adaptive Defense
                  </h5>
                  <p className="text-xs text-white font-bold leading-relaxed">
                    {globalIntel.recommendedCountermeasure}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tactical Ticker with Deep Analysis */}
        <div className="lg:col-span-12 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Live Threat Stream</h4>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Systems Nominal</span>
               </div>
               <div className="h-4 w-px bg-white/5"></div>
               <span className="text-[9px] font-mono text-slate-500">{activeAlerts.length} NODES MONITORING</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
             {activeAlerts.map((alert) => {
               const isExpanded = expandedAlertId === alert.id;
               const isAnalyzing = analyzingId === alert.id;
               const intel = alertIntel[alert.id];

               return (
                 <div key={alert.id} className="group flex flex-col transition-all">
                    <div 
                      className={`flex items-center justify-between p-4 bg-slate-900/50 border rounded-2xl transition-all ${isExpanded ? 'border-emerald-500/30 rounded-b-none' : 'border-white/5 hover:border-white/10'}`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getSeverityColor(alert.severity)}`}>
                          <alert.icon size={18} />
                        </div>
                        <div className="flex flex-col">
                           <p className="text-xs font-black text-white uppercase tracking-tight">{alert.type}</p>
                           <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{alert.timestamp} • ID: {alert.id.toUpperCase()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="hidden sm:flex flex-col items-end">
                           <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Inbound Score</span>
                           <span className={`text-xs font-black mono ${getSeverityColor(alert.severity).split(' ')[0]}`}>{alert.score}</span>
                        </div>
                        
                        <button 
                          onClick={() => handleAnalyzeAlert(alert)}
                          disabled={isAnalyzing}
                          className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                            isAnalyzing ? 'bg-white/5 text-emerald-500 cursor-wait' : 
                            isExpanded ? 'bg-emerald-500 text-white' : 
                            'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {isAnalyzing ? <Loader2 size={12} className="animate-spin" /> : <BrainCircuit size={12} />}
                          {isAnalyzing ? (isEs ? 'ESCANEANDO...' : 'SCANNING...') : (isEs ? 'GENERAR INTEL' : 'GENERATE INTEL')}
                          {isExpanded ? <ChevronUp size={12} className="ml-1" /> : <ChevronDown size={12} className="ml-1" />}
                        </button>
                      </div>
                    </div>

                    {/* AI Intelligence Briefing Section */}
                    {isExpanded && intel && (
                      <div className="bg-slate-950 border-x border-b border-emerald-500/30 rounded-b-2xl p-8 animate-in slide-in-from-top-4 duration-300">
                         <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                            
                            {/* Technical Briefing Column */}
                            <div className="md:col-span-8 space-y-6">
                               <div className="flex items-center gap-4 mb-4">
                                  <div className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                                    AI Report: Verified
                                  </div>
                                  <div className={`px-3 py-1 rounded border text-[9px] font-black uppercase tracking-widest ${getPriorityColor(intel.mitigationPriority)}`}>
                                    Priority: {intel.mitigationPriority}
                                  </div>
                               </div>

                               <div className="space-y-4">
                                  <div className="flex items-center gap-2">
                                     <FileText size={14} className="text-slate-500" />
                                     <h5 className="text-sm font-black text-white uppercase tracking-tight">{intel.title}</h5>
                                  </div>
                                  
                                  <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                                     <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Terminal size={12} /> Detailed Signatures
                                     </p>
                                     <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                                        {intel.technicalDetails}
                                     </p>
                                  </div>

                                  <div className="flex items-center gap-8">
                                     <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Attacker Profile</span>
                                        <span className="text-[10px] text-slate-400 font-bold italic">{intel.attackerProfile}</span>
                                     </div>
                                     <div className="flex flex-col items-center">
                                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">AI Certainty</span>
                                        <div className="flex items-center gap-1.5">
                                           <div className="w-12 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                              <div className="h-full bg-emerald-500" style={{ width: `${intel.confidenceScore}%` }}></div>
                                           </div>
                                           <span className="text-[9px] font-black text-emerald-500 mono">{intel.confidenceScore}%</span>
                                        </div>
                                     </div>
                                  </div>
                               </div>
                            </div>

                            {/* Mitigation Action Panel */}
                            <div className="md:col-span-4">
                               <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6 h-full flex flex-col justify-between group/mitigate">
                                  <div>
                                     <div className="flex items-center gap-2 text-emerald-500 mb-6">
                                        <Shield size={18} className="animate-pulse" />
                                        <h5 className="text-[10px] font-black uppercase tracking-[0.2em]">Mitigation Steps</h5>
                                     </div>
                                     <p className="text-xs text-white font-extrabold leading-loose">
                                        {intel.recommendedCountermeasure}
                                     </p>
                                  </div>
                                  
                                  <div className="mt-8 space-y-3">
                                     <button 
                                        onClick={() => console.log(`Executing isolation for ${alert.id}`)}
                                        className="w-full py-3 bg-white/10 hover:bg-emerald-500 text-white border border-white/5 hover:border-emerald-400 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                                     >
                                        Execute Isolation
                                     </button>
                                     <div className="flex items-center gap-2 text-[8px] font-black text-slate-500 uppercase tracking-widest px-1">
                                        <Info size={10} /> Policy auto-applied by SOC
                                     </div>
                                  </div>
                               </div>
                            </div>

                         </div>
                      </div>
                    )}
                 </div>
               );
             })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ThreatMonitor;
