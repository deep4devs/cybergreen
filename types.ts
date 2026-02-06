// last version cyberg 1.0
import type { ElementType } from 'react';

export interface SecurityService {
  id: string;
  title: string;
  description: string;
  icon: ElementType;
  category: 'proactive' | 'reactive' | 'compliance' | 'cloud' | 'nist' | 'ai' | 'linux' | 'dns' | 'email' | 'identity' | 'networking' | 'servers' | 'endpoints';
  longDescription: string;
  features: string[];
}

export interface SecurityAdvice {
  riskLevel: string;
  summary: string;
  recommendedServices: string[];
  immediateSteps: string[];
}

export interface ThreatAlert {
  id: string;
  text: string;
  type: string;
  icon: any;
  score: number;
  severity: 'Baseline' | 'Elevated' | 'High' | 'Critical';
  timestamp: string;
}

export enum Page {
  Home = 'home',
  Services = 'services',
  Advisor = 'advisor',
  Monitor = 'monitor',
  NIST = 'nist',
  CloudSecurity = 'cloud-security',
  AISecurity = 'ai-security',
  LinuxSecurity = 'linux-security',
  DNSSecurity = 'dns-security',
  EmailSecurity = 'email-security',
  IdentitySecurity = 'identity-security',
  Networking = 'networking',
  Servers = 'servers',
  Endpoints = 'endpoints',
  Resource = 'resource'
}

export type Language = 'es' | 'en';