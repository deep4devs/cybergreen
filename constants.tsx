
import { SecurityService, Language } from './types';

export const getServices = (lang: Language): SecurityService[] => {
  const isEs = lang === 'es';
  return [
    {
      id: 'pt-01',
      title: isEs ? 'Pruebas de Penetración' : 'Penetration Testing',
      description: isEs ? 'Ciberataques simulados avanzados para identificar vulnerabilidades.' : 'Advanced simulated cyberattacks to identify vulnerabilities.',
      icon: '🎯',
      category: 'proactive',
      longDescription: isEs ? 'Nuestros hackers éticos realizan exploraciones profundas de su infraestructura, imitando vectores de ataque del mundo real.' : 'Our ethical hackers perform deep-dive explorations of your infrastructure, mimicking real-world attack vectors.',
      features: isEs ? ['Apps Web', 'Redes', 'Móvil', 'Ingeniería Social'] : ['Web Apps', 'Networks', 'Mobile', 'Social Engineering']
    },
    {
      id: 'nist-01',
      title: isEs ? 'Implementación NIST CSF' : 'NIST CSF Implementation',
      description: isEs ? 'Alineación completa con el Marco de Ciberseguridad NIST 2.0.' : 'Full alignment with the NIST 2.0 Cybersecurity Framework.',
      icon: '🏛️',
      category: 'nist',
      longDescription: isEs ? 'Establecemos un programa de ciberseguridad basado en riesgos utilizando los cinco pilares de NIST.' : 'We establish a risk-based cybersecurity program using the five NIST pillars.',
      features: ['Identify', 'Protect', 'Detect', 'Respond', 'Recover']
    },
    {
      id: 'nist-02',
      title: isEs ? 'Auditoría de Cumplimiento' : 'Compliance Audit',
      description: isEs ? 'Evaluaciones de brechas y preparación para auditorías gubernamentales.' : 'Gap assessments and readiness for government audits.',
      icon: '📋',
      category: 'nist',
      longDescription: isEs ? 'Evaluamos sus controles actuales frente a los requisitos de NIST 800-53 o 800-171.' : 'We evaluate your current controls against NIST 800-53 or 800-171 requirements.',
      features: isEs ? ['Mapa de Controles', 'Análisis de Brechas', 'Plan de Acción'] : ['Control Mapping', 'Gap Analysis', 'POAM Development']
    },
    {
      id: 'cloud-01',
      title: isEs ? 'Seguridad AWS & Azure' : 'AWS & Azure Security',
      description: isEs ? 'Configuración de seguridad nativa y endurecimiento de IAM.' : 'Native security configuration and IAM hardening.',
      icon: '☁️',
      category: 'cloud',
      longDescription: isEs ? 'Protegemos sus cargas de trabajo en la nube mediante configuraciones seguras y monitoreo continuo.' : 'We protect your cloud workloads through secure configurations and continuous monitoring.',
      features: ['IAM Policy Review', 'VPC Hardening', 'S3 Encryption', 'GuardDuty Ops']
    },
    {
      id: 'cloud-02',
      title: isEs ? 'Seguridad de Kubernetes' : 'Kubernetes Security',
      description: isEs ? 'Blindaje de contenedores y microservicios en la nube.' : 'Shielding containers and microservices in the cloud.',
      icon: '📦',
      category: 'cloud',
      longDescription: isEs ? 'Implementamos seguridad en todo el ciclo de vida del contenedor, desde la imagen hasta la ejecución.' : 'We implement security throughout the container lifecycle, from image to runtime.',
      features: ['RBAC Config', 'Network Policies', 'Image Scanning', 'Runtime Protection']
    },
    {
      id: 'ai-01',
      title: isEs ? 'Defensa de LLM' : 'LLM Defense',
      description: isEs ? 'Protección contra inyección de prompts y fuga de datos.' : 'Protection against prompt injection and data leakage.',
      icon: '🤖',
      category: 'ai',
      longDescription: isEs ? 'Aseguramos que sus modelos de lenguaje no sean manipulados ni filtren información confidencial.' : 'We ensure your language models are not manipulated and do not leak confidential information.',
      features: ['Prompt Filtering', 'Data Sanitization', 'Adversarial Testing', 'PII Detection']
    },
    {
      id: 'ai-02',
      title: isEs ? 'Gobernanza de IA' : 'AI Governance',
      description: isEs ? 'Políticas y ética para el despliegue seguro de IA.' : 'Policies and ethics for secure AI deployment.',
      icon: '⚖️',
      category: 'ai',
      longDescription: isEs ? 'Marco de trabajo para el uso responsable y seguro de la inteligencia artificial corporativa.' : 'Framework for the responsible and secure use of corporate artificial intelligence.',
      features: isEs ? ['Ética de IA', 'Privacidad de Datos', 'Cumplimiento Legal'] : ['AI Ethics', 'Data Privacy', 'Legal Compliance']
    },
    {
       id: 'ir-01',
       title: isEs ? 'Respuesta a Incidentes' : 'Incident Response',
       description: isEs ? 'Respuesta rápida 24/7 para contener amenazas activas.' : 'Rapid 24/7 response to contain active threats.',
       icon: '🚨',
       category: 'reactive',
       longDescription: isEs ? 'Nuestro equipo de élite se despliega para neutralizar amenazas y restaurar la integridad del sistema.' : 'Our elite team deploys to neutralize threats and restore system integrity.',
       features: isEs ? ['Forense Digital', 'Remediación', 'Cacería de Amenazas'] : ['Digital Forensics', 'Remediación', 'Threat Hunting']
    }
  ];
};

export const TRANSLATIONS = {
  es: {
    heroTitle: 'CYBERSEGURIDAD',
    heroFuture: 'AVANZADA',
    heroDesc: 'Servicios de Cyberseguridad Avanzada con integraciones de AI preventiva para una protección total de infraestructuras críticas.',
    btnAI: 'Obtener Escaneo IA',
    btnServices: 'Explorar Servicios',
    btnLearnMore: 'Saber Más',
    btnRequestQuote: 'Solicitar Cotización',
    quoteSuccess: '¡Solicitud enviada! Nuestro equipo se pondrá en contacto pronto.',
    socTitle: 'Centro de Operaciones (SOC)',
    socLive: 'MONITOREO EN TIEMPO REAL',
    statThreat: 'Mitigación de Amenazas',
    statResponse: 'Tiempo de Respuesta',
    statGuard: 'Guardia Activa',
    navHome: 'Inicio',
    navServices: 'Servicios',
    navAdvisor: 'Asesor IA',
    navMonitor: 'Monitor Vivo',
    navNIST: 'Marco NIST',
    navCloud: 'Seguridad Nube',
    navAI: 'Seguridad IA',
    login: 'Acceso Clientes',
    footerDesc: 'Protección especializada para activos digitales e infraestructura crítica.',
    legal: 'Legal',
    contact: 'Contacto',
    rights: 'TODOS LOS DERECHOS CIFRADOS',
    nistTitle: 'Ciberseguridad NIST 2.0',
    nistDesc: 'Marco de trabajo estándar de la industria para gestionar y reducir el riesgo de ciberseguridad.',
    cloudTitle: 'Ecosistema de Seguridad Nube',
    cloudDesc: 'Protección profunda para infraestructuras distribuidas y arquitecturas serverless.',
    aiTitle: 'Blindaje para Inteligencia Artificial',
    aiDesc: 'Estrategias de defensa para la nueva frontera de las amenazas automatizadas.',
    initDeployment: 'Iniciar Despliegue',
    requestInfo: 'Solicitar Información'
  },
  en: {
    heroTitle: 'ADVANCED',
    heroFuture: 'CYBERSECURITY',
    heroDesc: 'Advanced Cybersecurity Services with preventive AI integrations for total protection of critical infrastructures.',
    btnAI: 'Get AI Scan',
    btnServices: 'Explore Services',
    btnLearnMore: 'Learn More',
    btnRequestQuote: 'Request Quote',
    quoteSuccess: 'Request sent! Our team will contact you shortly.',
    socTitle: 'Operations Center (SOC)',
    socLive: 'REAL-TIME SYSTEMS MONITORING',
    statThreat: 'Threat Mitigation',
    statResponse: 'Response Time',
    statGuard: 'Active Guard',
    navHome: 'Home',
    navServices: 'Services',
    navAdvisor: 'AI Advisor',
    navMonitor: 'Live Monitor',
    navNIST: 'NIST Framework',
    navCloud: 'Cloud Security',
    navAI: 'AI Security',
    login: 'Client Login',
    footerDesc: 'Specialized protection for digital assets and critical infrastructure.',
    legal: 'Legal',
    contact: 'Contact',
    rights: 'ALL RIGHTS ENCRYPTED',
    nistTitle: 'NIST 2.0 Cybersecurity',
    nistDesc: 'Industry standard framework for managing and reducing cybersecurity risk.',
    cloudTitle: 'Cloud Security Ecosystem',
    cloudDesc: 'Deep protection for distributed infrastructures and serverless architectures.',
    aiTitle: 'Artificial Intelligence Shielding',
    aiDesc: 'Defense strategies for the new frontier of automated threats.',
    initDeployment: 'Initiate Deployment',
    requestInfo: 'Request Information'
  }
};
