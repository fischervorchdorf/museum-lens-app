import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Lädt Umgebungsvariablen aus der .env Datei
  const env = loadEnv(mode, process.cwd(), '');

  // Priorisiert .env Datei, fällt aber auf System-Umgebungsvariablen zurück
  const apiKey = env.API_KEY || process.env.API_KEY || '';

  return {
    base: './',
    plugins: [react()],
    define: {
      // Macht den API-Key als process.env.API_KEY im Code verfügbar
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
    server: {
      host: true, // Erlaubt Zugriff im lokalen Netzwerk (für Handy-Test)
    }
  };
});