
export interface ProductType {
  id: string;
  name: string;
  icon: string;
  basePrompt: string;
  imageUrl: string;
}

export interface MockupResult {
  id: string;
  url: string;
  productId: string;
  prompt: string;
  timestamp: number;
}

export enum AppStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  GENERATING = 'GENERATING',
  EDITING = 'EDITING',
  ERROR = 'ERROR'
}
