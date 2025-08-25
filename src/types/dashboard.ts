export interface ProcessingJob {
  id: string;
  fileName: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  startTime: Date;
  endTime?: Date;
  fileSize: number;
  error?: string;
}

export interface ExtractedEvent {
  eventType: string;
  startTime: string;
  endTime: string;
  duration: number;
  location?: string;
  description?: string;
  anomalies?: string[]; // New field for anomaly detection
}

export interface VesselInfo {
  name: string;
  imo?: string;
  flag?: string;
  dwt?: number;
}

export interface PortInfo {
  name: string;
  country?: string;
  code?: string;
}

export interface ExtractedData {
  events: ExtractedEvent[];
  vesselInfo?: VesselInfo;
  portInfo?: PortInfo;
  totalLaytime?: string;
  documentDate?: string;
  downloadUrl?: string;
}

export interface ProcessedFile {
  id: string;
  name: string;
  originalSize: number;
  processedAt: Date;
  eventsExtracted: number;
  status: 'completed' | 'failed';
  extractedData: ExtractedData;
  downloadUrl?: string;
}
