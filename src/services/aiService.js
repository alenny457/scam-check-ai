import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const analyzeMessage = async (userMessage) => {
  const prompt = `
    Analyze the following text message for potential scam indicators.
    
    You must return your analysis strictly as a valid JSON object matching this structure:
    {
      "risk_level": "High Risk" | "Medium Risk" | "Low Risk",
      "confidence": number (0 to 100),
      "red_flags": ["string", "string", ...],
      "explanation": "string explaining the scam indicators pattern",
      "safety_advice": ["string", "string", ...]
    }

    Message to analyze:
    "${userMessage}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Analysis failed:", error);
    throw new Error("Failed to process message security scan.");
  }
};