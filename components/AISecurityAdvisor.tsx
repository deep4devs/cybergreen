
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getSecurityAdvice, QuotaError } from '../services/geminiService';
import { SecurityAdvice, Language } from '../types';

interface AISecurityAdvisorProps {
  lang: Language;
}

const AISecurityAdvisor: React.FC<AISecurityAdvisorProps> = ({ lang }) => {
  const [input, setInput] = useState('');
  const isEs = lang === 'es';

  const mutation = useMutation({
    mutationFn: (infrastructure: string) => getSecurityAdvice(infrastructure, lang),
  });

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || mutation.isPending) return;
    mutation.mutate(input);
  };

  const advice = mutation.data;
  const loading = mutation.isPending;
  const error = mutation.error ? (
    mutation.error instanceof QuotaError 
      ? mutation.error.message 
      : (isEs ? 'Error en el motor de análisis. Por favor intenta de nuevo.' : 'Analysis engine error. Please try again.')
  ) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12 animate-in fade-in duration-700">
      <div className="bg-[#0f172a] border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6">
           <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 text-2xl">🤖</div>
        </div>
        
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">{isEs ? 'Asesor de Seguridad IA' : 'AI Security Advisor'}</h2>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">{isEs ? 'Describe tu infraestructura tecnológica para un diagnóstico de riesgos avanzado.' : 'Describe your technology infrastructure for an advanced risk diagnosis.'}</p>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-6">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isEs ? 'Ej: Servidor web expuesto, 50 bases de datos SQL, sin firewall de aplicación...' : 'Ex: Exposed web server, 50 SQL databases, no web application firewall...'}
            className="w-full h-48 bg-slate-950/50 border border-white/10 rounded-2xl p-6 text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none font-medium placeholder:text-slate-700"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-full py-5 rounded-2xl font-extrabold text-sm uppercase tracking-widest bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
          >
            {loading ? (isEs ? 'ANALIZANDO VECTORES...' : 'ANALYZING VECTORS...') : (isEs ? '🚀 Generar Evaluación' : '🚀 Generate Assessment')}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest text-center animate-in shake">
            {error}
          </div>
        )}
      </div>

      {advice && (
        <div className="bg-[#0f172a] border border-white/5 rounded-[3rem] p-12 animate-in slide-in-from-bottom-6 duration-700 shadow-3xl">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-extrabold text-white tracking-tight uppercase">{isEs ? 'Diagnóstico' : 'Diagnosis'}</h3>
            <div className={`px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.2em] border ${advice.riskLevel.toLowerCase().includes('high') || advice.riskLevel.toLowerCase().includes('alto') ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
               {advice.riskLevel}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">{isEs ? 'Resumen Ejecutivo' : 'Executive Summary'}</div>
                <p className="text-slate-300 text-base leading-relaxed font-medium">{advice.summary}</p>
              </div>
              
              <div className="space-y-4">
                <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">{isEs ? 'Servicios Recomendados' : 'Recommended Services'}</div>
                <div className="flex flex-wrap gap-2">
                  {advice.recommendedServices.map((s, i) => (
                    <span key={i} className="bg-white/5 px-4 py-2 rounded-xl text-[10px] font-bold text-emerald-400 border border-white/5">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-950/50 p-8 rounded-[2rem] border border-white/5">
              <h4 className="text-red-400 font-extrabold text-[11px] uppercase mb-8 tracking-[0.2em] flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                 {isEs ? 'Plan de Mitigación Inmediato' : 'Immediate Mitigation Plan'}
              </h4>
              <ul className="space-y-5">
                {advice.immediateSteps.map((s, i) => (
                  <li key={i} className="text-slate-400 text-sm flex gap-4 font-medium items-start">
                    <span className="text-emerald-500 font-bold text-xs mt-0.5">{i+1}.</span> 
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISecurityAdvisor;