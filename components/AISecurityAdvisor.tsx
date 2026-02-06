
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getSecurityAdvice } from '../services/geminiService';
import { Language } from '../types';

const AISecurityAdvisor: React.FC<{ lang: Language }> = ({ lang }) => {
  const [input, setInput] = useState('');
  const isEs = lang === 'es';

  const mutation = useMutation({
    mutationFn: (infrastructure: string) => getSecurityAdvice(infrastructure, lang),
  });

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) mutation.mutate(input);
  };

  const advice = mutation.data;

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12">
      <div className="bg-[#0f172a] border border-white/5 rounded-[3rem] p-10 shadow-2xl">
        <h2 className="text-3xl font-extrabold text-white mb-3">{isEs ? 'Asesor de Seguridad IA' : 'AI Security Advisor'}</h2>
        <p className="text-slate-400 text-sm mb-10">{isEs ? 'Describe tu infraestructura para un diagnóstico avanzado.' : 'Describe your infrastructure for an advanced diagnosis.'}</p>
        <form onSubmit={handleAnalyze} className="space-y-6">
          <textarea value={input} onChange={e => setInput(e.target.value)} className="w-full h-48 bg-slate-950/50 border border-white/10 rounded-2xl p-6 text-white outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" placeholder="..." />
          <button type="submit" disabled={mutation.isPending} className="w-full py-5 rounded-2xl bg-emerald-500 text-white font-extrabold uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">{mutation.isPending ? 'Analyzing...' : 'Generate Assessment'}</button>
        </form>
      </div>
      {advice && (
        <div className="bg-[#0f172a] border border-white/5 rounded-[3rem] p-12 animate-in slide-in-from-bottom-6 duration-700">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-extrabold text-white uppercase">{isEs ? 'Diagnóstico' : 'Diagnosis'}</h3>
            <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-1.5 rounded-full font-black text-[10px]">{advice.riskLevel}</span>
          </div>
          <p className="text-slate-300 text-lg leading-relaxed mb-10 font-medium">{advice.summary}</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/[0.02] p-6 rounded-2xl">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Recommended Services</h4>
              <div className="flex flex-wrap gap-2">{advice.recommendedServices.map((s, i) => <span key={i} className="bg-white/5 px-3 py-1.5 rounded-lg text-xs text-emerald-400 border border-white/5">{s}</span>)}</div>
            </div>
            <div className="bg-red-500/[0.02] p-6 rounded-2xl border border-red-500/10">
              <h4 className="text-xs font-black text-red-500 uppercase tracking-widest mb-4">Immediate Steps</h4>
              <ul className="space-y-2">{advice.immediateSteps.map((s, i) => <li key={i} className="text-slate-400 text-sm font-medium">• {s}</li>)}</ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISecurityAdvisor;
