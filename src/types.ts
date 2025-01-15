import { Session } from '@supabase/supabase-js';

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
  name: string;
  type: 'property' | 'investment';
  appointmentId: string;
  keyMetrics: MetricItem[];
  features: FeatureItem[];
  users: UserItem[];
  transcription: string;
  status: 'draft' | 'approved';
  createdAt: string;
}

// Rest of the types remain the same...