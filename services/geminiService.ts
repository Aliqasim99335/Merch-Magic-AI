
import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = 'gemini-2.5-flash-image';

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    if (!process.env.API_KEY) {
      throw new Error("API Key is missing. Please ensure process.env.API_KEY is configured.");
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateMockup(logoBase64: string, prompt: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: MODEL_NAME,
        contents: {
          parts: [
            {
              inlineData: {
                data: logoBase64.split(',')[1],
                mimeType: 'image/png'
              }
            },
            {
              text: `Generate a product mockup using the provided logo. Prompt: ${prompt}. Ensure the logo is integrated naturally onto the product surfaces with correct perspective and lighting.`
            }
          ]
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (imagePart?.inlineData) {
        return `data:image/png;base64,${imagePart.inlineData.data}`;
      }
      throw new Error("No image was generated in the response.");
    } catch (error) {
      console.error("Mockup generation error:", error);
      throw error;
    }
  }

  async editMockup(imageBase64: string, editPrompt: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: MODEL_NAME,
        contents: {
          parts: [
            {
              inlineData: {
                data: imageBase64.split(',')[1],
                mimeType: 'image/png'
              }
            },
            {
              text: `Edit the provided product mockup according to this instruction: ${editPrompt}. Maintain the core product and logo but apply the requested changes accurately.`
            }
          ]
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (imagePart?.inlineData) {
        return `data:image/png;base64,${imagePart.inlineData.data}`;
      }
      throw new Error("No image was generated in the edit response.");
    } catch (error) {
      console.error("Image editing error:", error);
      throw error;
    }
  }
}
