import { AnalysisResult, ArtifactImage } from "../types";

// Cloudflare Worker Proxy URL - kein API-Key mehr nötig!
const WORKER_URL = "https://gemini-proxy.fischervorchdorf.workers.dev/";

const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
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

export const analyzeImage = async (images: ArtifactImage[], promptOverride?: string): Promise<AnalysisResult> => {
  try {
    const imageParts = await Promise.all(images.map(img => fileToGenerativePart(img.file)));

    let descriptionsText = "";
    if (images.some(img => img.description.trim() !== "")) {
      descriptionsText = "\n\nZusätzliche Informationen vom Nutzer zu den Bildern:\n";
      images.forEach((img, index) => {
        if (img.description.trim()) {
          descriptionsText += `Bild ${index + 1}: ${img.description}\n`;
        }
      });
    }

    const systemInstruction = `
      Sie sind ein KI-Experte für Kunstgeschichte, Archivierung und Museumskuratierung. 
      Ihre Aufgabe ist es, historische Fotografien, Gemälde oder Artefakte zu analysieren.
      Es können ein oder mehrere Bilder desselben Objekts (z.B. verschiedene Ansichten, Details) übermittelt werden.
      
      Strukturieren Sie Ihre Analyse wie folgt in deutscher Sprache:
      
      1. **Zusammenfassung**: Eine prägnante Beschreibung des Objekts basierend auf allen verfügbaren Ansichten.
      2. **Detaillierte Visuelle Analyse**: Beschreiben Sie Kleidung, Objekte, Architektur, Landschaft und Personen im Detail. Nutzen Sie Detailansichten für genauere Beobachtungen.
      3. **Historischer Kontext & Datierung**: Versuchen Sie, das Entstehungsdatum und den Ort so genau wie möglich einzugrenzen. Begründen Sie dies anhand visueller Hinweise (z.B. Modestil, Technik).
      4. **Technische Merkmale**: Art der Fotografie (z.B. Daguerreotypie, Albuminabzug) oder Maltechnik, falls erkennbar.
      5. **Erhaltungszustand**: Notieren Sie sichtbare Schäden, Vergilbungen oder Restaurierungsbedarf.
      6. **Recherche-Ergebnisse**: Nutzen Sie Ihr Wissen und die Google-Suche, um potenzielle Orte, Ereignisse oder Personen zu identifizieren.

      Verwenden Sie einen professionellen, akademischen, aber verständlichen Tonfall.
    `;

    const prompt = (promptOverride || "Analysieren Sie diese Bilder ausführlich für unser Museumsarchiv.") + descriptionsText;

    // Combine all parts: images first, then text prompt
    const parts = [...imageParts, { text: prompt }];

    // Cloudflare Worker Proxy Request
    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: parts
        }],
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        tools: [{ googleSearch: {} }],
        generationConfig: {
          temperature: 0.4,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Worker request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Keine Analyse generiert.";

    const groundingChunks = data.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => {
      if (chunk.web) {
        return { web: chunk.web };
      }
      return undefined;
    }).filter((chunk: any): chunk is { web: { uri: string; title: string } } => chunk !== undefined);

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

    // Add more specific error handling for common Gemini API errors
    if (error.message?.includes('400') || error.status === 400) {
      throw new Error("Ungültige Anfrage (400). Bitte stellen Sie sicher, dass die Eingabe korrekt ist.");
    }
    if (error.message?.includes('429') || error.status === 429) {
      throw new Error("Ratenlimit überschritten (429). Bitte versuchen Sie es später erneut.");
    }
    if (error.message?.includes('500') || error.status === 500) {
      throw new Error("Interner Serverfehler (500). Der Gemini-Dienst hat ein Problem.");
    }
    if (error.message?.includes('503') || error.status === 503) {
      throw new Error("Dienst nicht verfügbar (503). Der Gemini-Dienst ist derzeit nicht erreichbar.");
    }

    throw error;
  }
};