
export interface SecurityService {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'proactive' | 'reactive' | 'compliance' | 'cloud' | 'nist' | 'ai';
  longDescription: string;
  features: string[];
}

export interface SecurityAdvice {
  riskLevel: string;
  summary: string;
  recommendedServices: string[];
  immediateSteps: string[];
}

export enum Page {
  Home = 'home',
  Services = 'services',
  Advisor = 'advisor',
  Monitor = 'monitor',
  NIST = 'nist',
  CloudSecurity = 'cloud-security',
  AISecurity = 'ai-security'
}

export type Language = 'es' | 'en';
