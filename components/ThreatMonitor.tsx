// last version cyberg 1.0
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity } from 'lucide-react';
import { Language } from '../types';

const generateData = () => Array.from({ length: 20 }, (_, i) => ({ time: i, attacks: Math.floor(Math.random() * 50) + 10 }));

const ThreatMonitor: React.FC<{ lang: Language }> = ({ lang }) => {
  const [data, setData] = useState(generateData());
  const isEs = lang === 'es';

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => [...prev.slice(1), { time: prev[prev.length-1].time + 1, attacks: Math.floor(Math.random() * 60) + 20 }]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden">
        <div className="scanner-line"></div>
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter"><Activity className="text-red-500" /> {isEs ? 'Telemetría de Amenazas' : 'Threat Telemetry'}</h3>
          <div className="text-xs font-black text-emerald-500 uppercase mono">Systems Active</div>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <Area type="monotone" dataKey="attacks" stroke="#ef4444" strokeWidth={3} fill="#ef4444" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ThreatMonitor;