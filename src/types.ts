export interface AnalysisResult {
  text: string;
  groundingChunks?: GroundingChunk[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export enum AppState {
  IDLE = 'IDLE',
  PREVIEW = 'PREVIEW',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}

export interface ArtifactImage {
  id: string;
  file: File;
  preview: string;
  description: string;
}

export interface AnalysisConfig {
  focusArea: 'general' | 'dating' | 'condition' | 'transcription';
}