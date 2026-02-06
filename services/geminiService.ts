
import { GoogleGenAI, Type } from "@google/genai";
import { SecurityAdvice, Language } from "../types";

export interface ThreatIntel {
  title: string;
  technicalDetails: string;
  attackerProfile: string;
  recommendedCountermeasure: string;
  confidenceScore: number;
  mitigationPriority: 'Low' | 'Medium' | 'High' | 'Immediate';
}

export interface ResourceNotice {
  firm: string;
  title: string;
  summary: string;
  impact: 'Low' | 'Medium' | 'High' | 'Critical';
  date: string;
  link?: string;
}

const parseResponse = <T>(text: string | undefined): T => {
  if (!text) throw new Error("Empty response from AI engine.");
  try {
    // Robust parsing for markdown-wrapped JSON
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson) as T;
  } catch (e) {
    console.error("Failed to parse Gemini response:", text);
    throw new Error("Invalid format received from security advisor engine.");
  }
};

export const getSecurityAdvice = async (userInput: string, lang: Language): Promise<SecurityAdvice> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const isEs = lang === 'es';
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: isEs 
      ? `Actúa como un experto en ciberseguridad. Analiza esta infraestructura y proporciona consejos técnicos precisos en ESPAÑOL: ${userInput}`
      : `Act as a senior cybersecurity consultant. Analyze this infrastructure and provide precise technical advice in ENGLISH: ${userInput}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskLevel: { type: Type.STRING, description: "Risk classification (Low, Medium, High, Critical)" },
          summary: { type: Type.STRING, description: "Summary of the findings" },
          recommendedServices: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific security services needed" },
          immediateSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Steps to take right now to secure the perimeter" },
        },
        required: ["riskLevel", "summary", "recommendedServices", "immediateSteps"],
      },
    },
  });
  return parseResponse<SecurityAdvice>(response.text);
};

export const generateThreatIntel = async (threatType: string, lang: Language): Promise<ThreatIntel> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const isEs = lang === 'es';

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a detailed tactical threat intelligence report for: ${threatType}. Language: ${isEs ? 'SPANISH' : 'ENGLISH'}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          technicalDetails: { type: Type.STRING },
          attackerProfile: { type: Type.STRING },
          recommendedCountermeasure: { type: Type.STRING },
          confidenceScore: { type: Type.NUMBER },
          mitigationPriority: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Immediate'] }
        },
        required: ["title", "technicalDetails", "attackerProfile", "recommendedCountermeasure", "confidenceScore", "mitigationPriority"],
      },
    },
  });
  return parseResponse<ThreatIntel>(response.text);
};

export const getIsraelCyberNotices = async (lang: Language): Promise<ResourceNotice[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const isEs = lang === 'es';

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `List 4 real-world, recent cybersecurity alerts or reports from prominent Israeli firms (like Check Point, Wiz, SentinelOne, CyberArk). Language: ${isEs ? 'SPANISH' : 'ENGLISH'}.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            firm: { type: Type.STRING },
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            impact: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
            date: { type: Type.STRING },
            link: { type: Type.STRING },
          },
          required: ["firm", "title", "summary", "impact", "date"],
        },
      },
    },
  });

  const notices = parseResponse<ResourceNotice[]>(response.text);
  const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (grounding && Array.isArray(grounding)) {
    notices.forEach((n, i) => {
      // Attempt to map search grounding results back to the objects
      if (grounding[i]?.web?.uri) n.link = grounding[i].web.uri;
    });
  }
  return notices;
};
