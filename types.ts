export interface EtsyListing {
  title: string;
  description: string;
  tags: string[];
  category: string;
  priceSuggestion: string;
  attributes: Record<string, string>;
  seoKeywords: string[];
}

export interface UploadedFile {
  file: File;
  previewUrl?: string;
}

export enum ProcessingStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}