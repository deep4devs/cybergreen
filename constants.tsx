
import { SecurityService, Language } from './types';
import { 
  Target, Scale, ClipboardCheck, Cloud, Bot, Terminal, Globe, Mail, Fingerprint, Lock, ShieldAlert, Network, Server, Smartphone, Search, Database, Activity, Layers, ShieldCheck
} from 'lucide-react';

export const THREAT_WEIGHTS: Record<string, number> = {
  'SQL Injection': 92,
  'Brute Force': 65,
  'Unauthorized API Access': 88,
  'XSS Attack': 45,
  'DDoS Anomaly': 95,
  'Malware Pattern': 82,
  'Email Phishing': 70,
  'Zero-Day Exploit': 98,
  'Baseline Network Security': 12
};

export const getSeverity = (score: number): 'Baseline' | 'Elevated' | 'High' | 'Critical' => {
  if (score >= 90) return 'Critical';
  if (score >= 70) return 'High';
  if (score >= 40) return 'Elevated';
  return 'Baseline';
};

export const getServices = (lang: Language): SecurityService[] => {
  const isEs = lang === 'es';
  return [
    {
      id: 'pt-01',
      title: isEs ? 'Pruebas de Penetración' : 'Penetration Testing',
      description: isEs ? 'Ciberataques simulados avanzados para identificar vulnerabilidades.' : 'Advanced simulated cyberattacks to identify vulnerabilities.',
      icon: Target,
      category: 'proactive',
      longDescription: isEs ? 'Nuestros hackers éticos realizan exploraciones profundas de su infraestructura, imitando vectores de ataque del mundo real.' : 'Our ethical hackers perform deep-dive explorations of your infrastructure, mimicking real-world attack vectors.',
      features: isEs ? ['Apps Web', 'Redes', 'Móvil', 'Ingeniería Social'] : ['Web Apps', 'Networks', 'Mobile', 'Social Engineering']
    },
    {
      id: 'cloud-cnapp',
      title: isEs ? 'CNAPP - Protección Nativa Nube' : 'CNAPP - Cloud Native Protection',
      description: isEs ? 'Plataforma unificada para seguridad desde el desarrollo hasta la ejecución.' : 'Unified platform for security from development to runtime.',
      icon: Layers,
      category: 'cloud',
      longDescription: isEs ? 'Nuestra solución CNAPP integra CSPM, CWPP y CIEM para proporcionar visibilidad total y control sobre sus entornos multi-nube.' : 'Our CNAPP solution integrates CSPM, CWPP, and CIEM to provide full visibility and control over your multi-cloud environments.',
      features: isEs ? ['CSPM (Postura)', 'CWPP (Cargas)', 'CIEM (Identidad)', 'KSPM (Kubernetes)'] : ['CSPM (Posture)', 'CWPP (Workloads)', 'CIEM (Identity)', 'KSPM (Kubernetes)']
    },
    {
      id: 'nist-01',
      title: isEs ? 'Implementación NIST CSF' : 'NIST CSF Implementation',
      description: isEs ? 'Alineación completa con el Marco de Ciberseguridad NIST 2.0.' : 'Full alignment with the NIST 2.0 Cybersecurity Framework.',
      icon: Scale,
      category: 'nist',
      longDescription: isEs ? 'Establecemos un programa de ciberseguridad basado en riesgos utilizando los cinco pilares de NIST.' : 'We establish a risk-based cybersecurity program using the five NIST pillars.',
      features: ['Identify', 'Protect', 'Detect', 'Respond', 'Recover']
    },
    {
      id: 'srv-01',
      title: isEs ? 'Hardening de Servidores' : 'Server Hardening',
      description: isEs ? 'Endurecimiento extremo para entornos de producción y bases de datos.' : 'Extreme hardening for production environments and databases.',
      icon: Server,
      category: 'servers',
      longDescription: isEs ? 'Blindaje de sistemas operativos para eliminar vectores de ataque innecesarios y asegurar la integridad del kernel y servicios core.' : 'OS hardening to eliminate unnecessary attack vectors and ensure the integrity of the kernel and core services.',
      features: isEs ? ['Kernel Hardening', 'Auditd Config', 'FIM Monitoring', 'HIDS'] : ['Kernel Hardening', 'Auditd Config', 'FIM Monitoring', 'HIDS']
    },
    {
      id: 'linux-01',
      title: isEs ? 'Linux Hardening (SUSE)' : 'Linux Hardening (SUSE)',
      description: isEs ? 'Blindaje experto para SUSE Linux Enterprise y virtualización segura.' : 'Expert shielding for SUSE Linux Enterprise and secure virtualization.',
      icon: Terminal,
      category: 'linux',
      longDescription: isEs ? 'Especialistas en endurecimiento de SUSE Linux Enterprise (SLES) y migración de infraestructuras críticas desde entornos como VMware.' : 'Specialists in SUSE Linux Enterprise (SLES) hardening and critical infrastructure migration from environments like VMware.',
      features: isEs ? ['Hardening SUSE SLES', 'DNS recursivo DNSSEC', 'Migración VMware', 'Virtualización KVM'] : ['SUSE SLES Hardening', 'DNSSEC Recursive DNS', 'VMware Migration', 'KVM Virtualization']
    }
  ];
};

export const TRANSLATIONS = {
  es: {
    heroTitle: 'CYBERSEGURIDAD',
    heroFuture: 'AVANZADA',
    heroDesc: 'Servicios de Cyberseguridad Avanzada con integraciones de IA preventiva para una protección total de infraestructuras críticas.',
    slogan: 'Digital AI Security for Business Resilience and Profitability',
    aboutTitle: 'Líderes con Experiencia',
    aboutDesc: 'Somos una empresa con más de 20 años de experiencia en ciberseguridad, comprometida con la excelencia técnica y la protección de activos globales.',
    experienceYears: '20+ Años',
    experienceText: 'Trayectoria Protegiendo el Futuro',
    btnAI: 'Obtener Escaneo IA',
    btnServices: 'Explorar Servicios',
    navHome: 'Inicio',
    navServices: 'Servicios',
    navAdvisor: 'Asesor IA',
    navMonitor: 'Monitor Vivo',
    navResource: 'Recursos',
    login: 'Acceso Clientes',
    footerDesc: 'Protección especializada para activos digitales e infraestructura crítica.',
    nistTitle: 'Ciberseguridad NIST 2.0',
    nistDesc: 'Marco de trabajo estándar de la industria para gestionar y reducir el riesgo de ciberseguridad.',
    resourceTitle: 'Hub de Inteligencia Israelí',
    resourceDesc: 'Alertas y noticias de última hora del ecosistema de ciberseguridad líder en el mundo.'
  },
  en: {
    heroTitle: 'ADVANCED',
    heroFuture: 'CYBERSECURITY',
    heroDesc: 'Advanced Cybersecurity Services with preventive AI integrations for total protection of critical infrastructures.',
    slogan: 'Digital AI Security for Business Resilience and Profitability',
    aboutTitle: 'Experienced Leaders',
    aboutDesc: 'We are a company with over 20 years of experience in cybersecurity, committed to technical excellence and the protection of global assets.',
    experienceYears: '20+ Years',
    experienceText: 'Protective Legacy for the Future',
    btnAI: 'Get AI Scan',
    btnServices: 'Explore Services',
    navHome: 'Home',
    navServices: 'Services',
    navAdvisor: 'AI Advisor',
    navMonitor: 'Live Monitor',
    navResource: 'Resources',
    login: 'Client Login',
    footerDesc: 'Specialized protection for digital assets and critical infrastructure.',
    nistTitle: 'NIST 2.0 Cybersecurity',
    nistDesc: 'Industry standard framework for managing and reducing cybersecurity risk.',
    resourceTitle: 'Israeli Intelligence Hub',
    resourceDesc: 'Latest breakthroughs and security alerts from the world\'s premier cybersecurity ecosystem.'
  }
};
