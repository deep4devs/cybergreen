
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

export class QuotaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QuotaError";
  }
}

const parseResponse = <T>(text: string | undefined): T => {
  if (!text) throw new Error("Empty response");
  try {
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson) as T;
  } catch (e) {
    console.error("Failed to parse JSON response:", text);
    throw new Error("Invalid response format");
  }
};

const handleApiError = (error: any, lang: Language) => {
  const isEs = lang === 'es';
  const errorMessage = error?.message || "";
  if (errorMessage.includes("429") || errorMessage.toLowerCase().includes("quota")) {
    throw new QuotaError(isEs 
      ? "Límite de API excedido. Por favor, intenta de nuevo más tarde." 
      : "API Quota exceeded. Please try again later.");
  }
  throw error;
};

export const getSecurityAdvice = async (userInput: string, lang: Language): Promise<SecurityAdvice> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const isEs = lang === 'es';
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: isEs 
        ? `Analiza la siguiente descripción de infraestructura y proporciona consejos en ESPAÑOL: ${userInput}`
        : `Analyze the following infrastructure description and provide advice in ENGLISH: ${userInput}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING },
            summary: { type: Type.STRING },
            recommendedServices: { type: Type.ARRAY, items: { type: Type.STRING } },
            immediateSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["riskLevel", "summary", "recommendedServices", "immediateSteps"],
        },
      },
    });
    return parseResponse<SecurityAdvice>(response.text);
  } catch (e) {
    return handleApiError(e, lang);
  }
};

export const generateThreatIntel = async (threatType: string, lang: Language): Promise<ThreatIntel> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const isEs = lang === 'es';

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a tactical intelligence report for: ${threatType}. Respond in ${isEs ? 'SPANISH' : 'ENGLISH'}.`,
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
  } catch (e) {
    return handleApiError(e, lang);
  }
};

export const getIsraelCyberNotices = async (lang: Language): Promise<ResourceNotice[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const isEs = lang === 'es';

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search and summarize the top 4 recent cybersecurity innovations from Israeli firms. Respond in ${isEs ? 'SPANISH' : 'ENGLISH'}.`,
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

    return parseResponse<ResourceNotice[]>(response.text);
  } catch (e) {
    return handleApiError(e, lang);
  }
};
