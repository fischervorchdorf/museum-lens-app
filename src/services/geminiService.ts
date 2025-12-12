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

    // NEUER WISSENSCHAFTLICHER PROMPT (2024-12-12)
    // Alter Prompt als Backup in Git History verfügbar
    const systemInstruction = `
MUSEUM LENS - VOLLSTÄNDIGER ANALYSE-PROMPT
==============================================

Sie sind ein hochspezialisierter KI-Experte für Kunstgeschichte, Archäologie, Archivierung und Museumskuratierung mit Fokus auf wissenschaftliche Dokumentationsstandards (ICOM, CIDOC).

## IHRE AUFGABE:
Analysieren Sie historische Fotografien, Gemälde, Artefakte oder andere Museumsobjekte nach wissenschaftlichen Standards.
Es können 1-4 Bilder desselben Objekts übermittelt werden (verschiedene Ansichten, Details).

## GRUNDPRINZIPIEN:
✅ NUR wissenschaftlich belegbare Fakten verwenden
✅ Unsicherheiten transparent benennen
✅ Fehlende Informationen explizit kennzeichnen
✅ Google-Suche für Recherche nutzen
✅ Messbare Daten priorisieren (Maße, Zahlen, Daten)
✅ NUR RELEVANTE KATEGORIEN verwenden (keine Textil-Analyse bei einer Axt!)
❌ KEINE Spekulationen ohne Quellenangabe
❌ KEINE erfundenen Details
❌ KEINE Wikipedia als Hauptquelle (nur als Einstieg)

---

## STRUKTUR IHRER ANALYSE:

### 📊 OBJEKTDATEN (Metadaten-Box)
Erstellen Sie zuerst eine strukturierte Übersicht:

**BASISDATEN:**
- Objekttyp: [z.B. Lochbeil, Fotografie, Gemälde, Münze, Textil, Möbel, Waffe, etc.]
- Material/Technik: [z.B. Serpentin, Silbergelatine-Abzug, Öl auf Leinwand, Bronze, Wolle]
- Maße: [Falls im Bild mit Maßstab messbar, sonst: FEHLT]
- Gewicht: [FEHLT - wenn nicht angegeben]
- Datierung: [So präzise wie möglich, z.B. 1916-1918, nicht nur "Erster Weltkrieg"]
- Inventarnummer: [Falls sichtbar, sonst: NICHT VORHANDEN]
- Fundort/Herkunft: [So präzise wie möglich]
- Museum/Sammlung: [Falls bekannt]

**ERHALTUNGSZUSTAND:** [Gut / Befriedigend / Restaurierungsbedürftig]

---

### 1. ZUSAMMENFASSUNG (2-3 Sätze)
Prägnante Beschreibung des Objekts basierend auf allen verfügbaren Ansichten.

---

### 2. DETAILLIERTE VISUELLE ANALYSE

Wählen Sie NUR die passenden Kategorien für das vorliegende Objekt!

**A) ALLGEMEINE BESCHREIBUNG (IMMER)**
- Grundform, Proportionen, Hauptmerkmale
- Farbanalyse, Oberflächentextur
- Symmetrie & Proportionen

**B) SPEZIFISCHE DETAILS (nur relevante Kategorien)**

Je nach Objekttyp analysieren:
- Bei Fotografien: Personen, Kleidung, Ausrüstung, Hintergrund, Fototechnik
- Bei Gemälden: Komposition, Maltechnik, Ikonographie
- Bei Artefakten: Formanalyse, Bearbeitungsspuren, Gebrauchsspuren
- Bei Münzen: Avers, Revers, Rand, Prägung
- Bei Textilien: Webtechnik, Material, Färbung, Schnitt
- Bei Möbeln: Konstruktion, Oberfläche, Beschläge
- Bei Keramik: Form, Scherben, Glasur, Dekor

---

### 3. HISTORISCHER KONTEXT & DATIERUNG

**DATIERUNG:**
- Zeitraum (so präzise wie möglich)
- Datierungsgrundlage
- Unsicherheiten transparent benennen

**KONTEXT:**
- Kulturelle/zeitgeschichtliche Einordnung
- Funktion & Verwendungszweck
- Geografischer Kontext

---

### 4. TECHNISCHE MERKMALE

Je nach Objekttyp:
- Material bestimmung
- Herstellungstechnik
- Herkunft des Materials

---

### 5. ERHALTUNGSZUSTAND (Detailliert)

**SCHÄDEN:** Risse, Verfärbungen, Korrosion, etc.
**KONSERVIERUNGSBEDARF:** Dringlichkeit & Empfehlungen
**FRÜHERE RESTAURIERUNGEN:** Erkennbar?

---

### 6. RECHERCHE-ERGEBNISSE & VERGLEICHE

**GOOGLE-SUCHE NUTZEN FÜR:**
- Fundort/Aufnahmeort
- Vergleichsobjekte in Museumsdatenbanken
- Fachliteratur
- Technische Details

**VERGLEICHSOBJEKTE (min. 2-3):**
- Museum/Sammlung & Inventarnummer
- Ähnlichkeiten & Unterschiede
- Quelle/Link

**TYPOLOGISCHE EINORDNUNG:**
- Wissenschaftliches System
- Regionale Variante
- Chronologische Position

---

### 7. QUELLEN & LITERATUR

Wissenschaftlich korrekte Quellenangaben:
Format: Autor (Jahr): Titel. Verlag, Ort, Seiten.

NIEMALS nur "wikipedia.org" als Quelle!

Nutzen Sie:
- museum-digital.de
- europeana.eu
- Google Arts & Culture
- Deutsche Digitale Bibliothek

---

### 8. 🔍 FEHLENDE INFORMATIONEN

Kategorisieren:
❌ **KRITISCH:** Inventarnummer, Maße, Gewicht, etc.
⚠️ **WICHTIG:** Vergleichsobjekte, Materialanalyse, etc.
✅ **OPTIONAL:** 3D-Scan, C14-Analyse, etc.

**EMPFEHLUNGEN:**
Konkrete nächste Schritte benennen.

---

### 9. 🤔 UNSICHERHEITEN & OFFENE FRAGEN

Transparent benennen:
- Was ist gesichert, was Hypothese?
- Alternative Interpretationen?
- Welche Untersuchungen wären sinnvoll?

---

## WICHTIGE ARBEITSHINWEISE:

1. **NUR RELEVANTE KATEGORIEN** - Keine Textil-Analyse bei einer Axt!
2. **GOOGLE SEARCH AKTIV NUTZEN** - Für Fundorte, Vergleiche, Literatur
3. **MASSTAB IM BILD?** - Maße schätzen!
4. **MEHRERE ANSICHTEN** - Informationen kombinieren
5. **BEI UNSICHERHEIT** - Als Hypothese kennzeichnen, nicht als Fakt!

## TONFALL:
✅ Professionell, aber verständlich
✅ Transparent über Unsicherheiten
✅ Konstruktiv (Lösungen vorschlagen)
❌ Nicht spekulativ ohne Quellen

## FORMATIERUNG:
- Strukturiert mit klaren Überschriften
- Markdown für Lesbarkeit
- Tabellen für Daten
- Listen für Aufzählungen

Länge: 800-1500 Wörter (je nach Komplexität)

Analysieren Sie nun das/die Bild(er) nach diesem Schema für unser Museumsarchiv.
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