
import { GoogleGenAI, Type } from "@google/genai";

// Utilisation d'une vérification sécurisée pour l'environnement browser
const safeApiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';

export const generateDentalMessages = async (reason: string = "general") => {
  try {
    // Initialisation dynamique pour s'assurer d'utiliser la clé la plus récente
    const ai = new GoogleGenAI({ apiKey: safeApiKey || '' });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 3 professional and short WhatsApp messages in Darija (Moroccan Arabic) and English for a patient contacting a dentist. The reason is: ${reason}. Format as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING, description: "Short label like 'Urgent' or 'Appointment'" },
              text: { type: Type.STRING, description: "The full message content" }
            },
            required: ["label", "text"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Error:", error);
    return [
      { label: "Rendez-vous", text: "Salam Dr, bghit nakhod rdv l'u3ti9a diali ddarani bezaf." },
      { label: "Emergency", text: "Hello Doctor, I have an urgent toothache, can I see you today?" }
    ];
  }
};
