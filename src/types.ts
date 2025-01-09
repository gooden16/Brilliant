export interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Canvas {
  id: string;
  appointmentId: string;
  keyMetrics: string[];
  features: string[];
  users: string[];
  transcription: string;
  status: 'draft' | 'approved';
}

export interface TranscriptionSegment {
  text: string;
  timestamp: number;
}