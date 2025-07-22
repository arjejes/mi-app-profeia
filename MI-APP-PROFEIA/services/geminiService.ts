import { GoogleGenAI, GenerateContentResponse, Chat, Part } from "@google/genai";
import { FileData } from "../types";

let ai: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

export const initAi = (apiKey: string) => {
    if (!apiKey) {
        throw new Error("API key is missing.");
    }
    ai = new GoogleGenAI({ apiKey });
};

export const startChat = (systemInstruction: string) => {
    if (!ai) {
        throw new Error("AI not initialized. Call initAi first.");
    }
    chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
        }
    });
};

const fileToGenerativePart = (file: FileData): Part => {
    return {
        inlineData: {
            data: file.base64,
            mimeType: file.type,
        },
    };
};

export const generateContent = async (
  prompt: string,
  files: FileData[] = []
): Promise<string> => {
  if (!chatSession) {
      throw new Error("Chat session not started. Call startChat first.");
  }

  try {
    const messageParts: Part[] = [];

    if (files.length > 0) {
        files.forEach(file => {
            messageParts.push(fileToGenerativePart(file));
        });
    }

    messageParts.push({ text: prompt });
    
    // The `sendMessage` method expects an object with a `message` property,
    // which can be a string or an array of Parts.
    const response: GenerateContentResponse = await chatSession.sendMessage({ message: messageParts });
    return response.text;

  } catch (error) {
    console.error("Error generating content:", error);
    return "Lo siento, ha ocurrido un error al contactar a la IA. Por favor, verifica los archivos subidos e inténtalo de nuevo más tarde.";
  }
};