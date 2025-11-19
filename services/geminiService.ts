import { GoogleGenAI, Type, Schema } from "@google/genai";
import { EtsyListing } from "../types";

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const generateEtsyListing = async (
  pdfFile: File,
  coverFile: File
): Promise<EtsyListing> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const pdfBase64 = await convertFileToBase64(pdfFile);
  const coverBase64 = await convertFileToBase64(coverFile);

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: "A high-converting, SEO-optimized Etsy product title (max 140 chars). Use delimiters like | or -.",
      },
      description: {
        type: Type.STRING,
        description: "A persuasive product description formatted with bullet points, benefits, and specifications.",
      },
      tags: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Exactly 13 SEO tags, each less than 20 characters.",
      },
      category: {
        type: Type.STRING,
        description: "The most relevant Etsy category path (e.g., Books > Coloring Books).",
      },
      priceSuggestion: {
        type: Type.STRING,
        description: "A suggested price range in USD based on market standards for this type of digital/physical book.",
      },
      seoKeywords: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of 5-10 primary long-tail keywords used in the listing.",
      },
      attributes: {
        type: Type.OBJECT,
        description: "Key-value pairs for product attributes (e.g., 'Pages': '50', 'Format': 'PDF').",
        properties: {
            pages: { type: Type.STRING },
            format: { type: Type.STRING },
            dimensions: { type: Type.STRING },
            targetAudience: { type: Type.STRING },
        }
      },
    },
    required: ["title", "description", "tags", "category", "priceSuggestion"],
  };

  const prompt = `
    You are an expert Etsy Seller and SEO Specialist for digital and physical books (KDP/Printables).
    
    Task: Analyze the provided Book Cover Image and Book Interior (PDF).
    Create a complete, high-converting Etsy listing.
    
    Guidelines:
    1. **Title:** Must be keyword-stuffed but readable. Place most important keywords first.
    2. **Description:** Use a 'Hook', 'Features', 'Benefits', and 'What's Included' structure. Use emoticons to make it readable.
    3. **Tags:** Provide exactly 13 highly relevant tags. Multi-word tags are better. Max 20 characters per tag.
    4. **Language:** Generate the content primarily in English (as it is the standard for Etsy SEO), unless the book content is strictly in another language.
    
    Analyze the visual style of the cover and the content of the PDF to determine the niche, audience, and themes.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: coverFile.type,
              data: coverBase64,
            },
          },
          {
            inlineData: {
              mimeType: "application/pdf", // Gemini handles PDF mime type
              data: pdfBase64,
            },
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(response.text) as EtsyListing;
  } catch (error) {
    console.error("Error generating listing:", error);
    throw error;
  }
};