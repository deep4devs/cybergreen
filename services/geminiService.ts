
import { GoogleGenAI, Type } from "@google/genai";
import { SecurityAdvice, Language } from "../types";

export interface ThreatIntel {
  title: string;
  technicalDetails: string;
  attackerProfile: string;
  recommendedCountermeasure: string;
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
    // Basic cleanup in case of markdown blocks
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  const isEs = lang === 'es';
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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
        systemInstruction: isEs 
          ? "Eres un CISO experto. Responde siempre en ESPAÑOL y formato JSON."
          : "You are an expert CISO. Always respond in ENGLISH and JSON format.",
      },
    });

    return parseResponse<SecurityAdvice>(response.text);
  } catch (e) {
    return handleApiError(e, lang);
  }
};

export const generateThreatIntel = async (threatType: string, lang: Language): Promise<ThreatIntel> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  const isEs = lang === 'es';

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: isEs
        ? `Genera un informe detallado para la amenaza: ${threatType}.`
        : `Generate a detailed report for the threat: ${threatType}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            technicalDetails: { type: Type.STRING },
            attackerProfile: { type: Type.STRING },
            recommendedCountermeasure: { type: Type.STRING },
          },
          required: ["title", "technicalDetails", "attackerProfile", "recommendedCountermeasure"],
        },
        systemInstruction: isEs
          ? "Analista Senior de Inteligencia. Responde en ESPAÑOL y formato JSON."
          : "Senior Intelligence Analyst. Respond in ENGLISH and JSON format.",
      },
    });

    return parseResponse<ThreatIntel>(response.text);
  } catch (e) {
    return handleApiError(e, lang);
  }
};