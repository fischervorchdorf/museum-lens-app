import { GoogleGenAI, GenerateContentResponse, Tool } from "@google/genai";
import { AnalysisResult } from "../types";

// Initialisierung strikt nach Vorgabe mit process.env.API_KEY
// Dieser Wert wird durch vite.config.ts injiziert.
const ai = new GoogleGenAI({ apiKey: "AIzaSyBudkecvmZX9cRyXRaPw16Fct2MbGDBQog" });

const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      if (!base64Data) {
        reject(new Error("Failed to read file"));
        return;
      }
      const base64Content = base64Data.split(',')[1];
      resolve({
        inlineData: {
          data: base64Content,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeImage = async (imageFile: File, promptOverride?: string): Promise<AnalysisResult> => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);

    // Google Search Tool für Fakten-Check
    const tools: Tool[] = [{ googleSearch: {} }];

    const systemInstruction = `
      Sie sind ein KI-Experte für Kunstgeschichte, Archivierung und Museumskuratierung. 
      Ihre Aufgabe ist es, historische Fotografien, Gemälde oder Artefakte zu analysieren.
      
      Strukturieren Sie Ihre Analyse wie folgt in deutscher Sprache:
      
      1. **Zusammenfassung**: Eine prägnante Beschreibung des Bildes.
      2. **Detaillierte Visuelle Analyse**: Beschreiben Sie Kleidung, Objekte, Architektur, Landschaft und Personen im Detail.
      3. **Historischer Kontext & Datierung**: Versuchen Sie, das Entstehungsdatum und den Ort so genau wie möglich einzugrenzen. Begründen Sie dies anhand visueller Hinweise (z.B. Modestil, Technik).
      4. **Technische Merkmale**: Art der Fotografie (z.B. Daguerreotypie, Albuminabzug) oder Maltechnik, falls erkennbar.
      5. **Erhaltungszustand**: Notieren Sie sichtbare Schäden, Vergilbungen oder Restaurierungsbedarf.
      6. **Recherche-Ergebnisse**: Nutzen Sie Ihr Wissen und die Google-Suche, um potenzielle Orte, Ereignisse oder Personen zu identifizieren.

      Verwenden Sie einen professionellen, akademischen, aber verständlichen Tonfall.
    `;

    const prompt = promptOverride || "Analysieren Sie dieses Bild ausführlich für unser Museumsarchiv.";

    // WICHTIG: Nutzung von gemini-2.5-flash für schnellere und stabilere Analyse auf mobilen Geräten
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        role: 'user',
        parts: [imagePart, { text: prompt }]
      },
      config: {
        systemInstruction: systemInstruction,
        tools: tools,
        temperature: 0.4,
      }
    });

    const text = response.text || "Keine Analyse generiert.";

    // Extraktion der Quellen (Grounding)
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => {
      if (chunk.web) {
        return { web: chunk.web };
      }
      return undefined;
    }).filter((chunk): chunk is { web: { uri: string; title: string } } => chunk !== undefined);

    return {
      text,
      groundingChunks
    };

  } catch (error: any) {
    console.error("Gemini analysis failed:", error);

    if (error.message?.includes('403') || error.status === 403) {
      throw new Error("API-Zugriff verweigert (403). Bitte prüfen Sie die API-Key Einschränkungen (Referrer).");
    }

    if (error.message?.includes('Failed to fetch')) {
      throw new Error("Netzwerkfehler. Bitte prüfen Sie Ihre Internetverbindung.");
    }

    throw error;
  }
};