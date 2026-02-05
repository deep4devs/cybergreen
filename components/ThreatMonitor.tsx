
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateThreatIntel, ThreatIntel, QuotaError } from '../services/geminiService';
import { Language } from '../types';

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
    },
    {
      title: "SQL Injection Attempt Blocked",
      technicalDetails: "WAF intercepted malicious payload attempting to bypass authentication on the payroll portal using 'OR 1=1' variants.",
      attackerProfile: "Script Kiddie / Automated Scanner",
      recommendedCountermeasure: "Patch database drivers and implement parameterized queries across all endpoints."
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
    },
    {
      title: "Intento de Inyección SQL Bloqueado",
      technicalDetails: "El WAF interceptó un payload malicioso que intentaba eludir la autenticación en el portal de nómina utilizando variantes de 'OR 1=1'.",
      attackerProfile: "Script Kiddie / Escáner automatizado",
      recommendedCountermeasure: "Parchear los controladores de la base de datos e implementar consultas parametrizadas en todos los puntos finales."
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
  const [latestIntel, setLatestIntel] = useState<ThreatIntel | null>(null);
  const [loadingIntel, setLoadingIntel] = useState(false);
  const [isUsingSimulatedData, setIsUsingSimulatedData] = useState(false);
  const lastFetchTime = useRef<number>(0);
  const isEs = lang === 'es';

  const fetchIntel = useCallback(async (threatType: string) => {
    // Basic throttling: only try to fetch once every 30 seconds
    const now = Date.now();
    if (now - lastFetchTime.current < 30000 && !isUsingSimulatedData) return;
    
    setLoadingIntel(true);
    try {
      const intel = await generateThreatIntel(threatType, lang);
      setLatestIntel(intel);
      setIsUsingSimulatedData(false);
      lastFetchTime.current = Date.now();
    } catch (err) {
      // If we hit quota or any API error, switch to a simulated report
      const fallbackPool = SIMULATED_INTEL[lang] || SIMULATED_INTEL['en'];
      const randomFallback = fallbackPool[Math.floor(Math.random() * fallbackPool.length)];
      setLatestIntel(randomFallback);
      setIsUsingSimulatedData(true);
      console.warn("API quota issues or error. Switching to Simulated Intel Feed.");
    } finally {
      setLoadingIntel(false);
    }
  }, [lang, isUsingSimulatedData]);

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

      // Frequency control for UI activity
      if (Math.random() > 0.85 && !loadingIntel) {
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
        
        // Conditional fetch logic to prevent spamming the API
        const timeSinceLast = Date.now() - lastFetchTime.current;
        if (timeSinceLast > 60000 || !latestIntel) {
          fetchIntel(type);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [lang, fetchIntel, isEs, loadingIntel, latestIntel]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 bg-slate-900/50 border border-white/5 rounded-3xl p-6 shadow-inner relative overflow-hidden backdrop-blur-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2 uppercase tracking-tight">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
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

        <div className="lg:col-span-2 bg-slate-900/50 border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 p-4">
             <div className={`text-[9px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-[0.2em] ${loadingIntel ? 'animate-pulse' : ''}`}>
                {isUsingSimulatedData ? 'LOCAL FEED' : 'AI FEED'}
             </div>
          </div>
          
          <h3 className="text-lg font-extrabold text-white mb-6 tracking-tight flex items-center gap-2">
            <span className="text-emerald-500">⚡</span> {isEs ? 'Reporte de Inteligencia' : 'Intelligence Report'}
          </h3>

          <div className="min-h-[180px]">
            {loadingIntel ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4 py-10">
                <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest animate-pulse">
                   {isEs ? 'Analizando Amenaza...' : 'Analyzing Threat...'}
                </div>
              </div>
            ) : latestIntel ? (
              <div className="animate-in fade-in duration-500">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {latestIntel.title}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <div className="text-[9px] font-bold text-slate-600 uppercase mb-1 tracking-widest">{isEs ? 'Perfil' : 'Profile'}</div>
                      <div className="text-xs text-slate-300 font-medium italic">&quot;{latestIntel.attackerProfile}&quot;</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-slate-600 uppercase mb-1 tracking-widest">{isEs ? 'Detalle' : 'Detail'}</div>
                      <div className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{latestIntel.technicalDetails}</div>
                    </div>
                  </div>
                  <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10 flex flex-col justify-center">
                    <div className="text-[9px] font-bold text-emerald-500 uppercase mb-2 tracking-widest">
                       {isEs ? 'CONTRAMEDIDA' : 'COUNTERMEASURE'}
                    </div>
                    <div className="text-xs text-white font-bold leading-relaxed">
                       {latestIntel.recommendedCountermeasure}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-600 text-[11px] font-medium py-10">
                {isEs ? 'Esperando anomalías de red...' : 'Waiting for network anomalies...'}
              </div>
            )}
          </div>
          
          {isUsingSimulatedData && (
             <div className="mt-4 flex items-center justify-center">
                <button 
                  onClick={() => fetchIntel(activeAlerts[0]?.type || "Manual Request")}
                  className="text-[8px] font-bold text-slate-500 hover:text-emerald-400 transition-colors uppercase tracking-[0.3em] bg-white/5 px-4 py-1.5 rounded-full border border-white/5"
                >
                  {isEs ? 'Actualizar desde la nube' : 'Refresh from Cloud'}
                </button>
             </div>
          )}
        </div>

        <div className="lg:col-span-4 bg-slate-900/30 border border-white/5 rounded-2xl p-4">
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
