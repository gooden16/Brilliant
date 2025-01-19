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

export interface MetricItem {
  id: string;
  name: string;
  graphType: string;
  value: number;
}

export interface FeatureItem {
  id: string;
  name: string;
  type: string;
}

export interface UserItem {
  id: string;
  name: string;
  role: string;
}

export interface Individual {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  ssn?: string;
  dob?: string;
  kycStatus: 'pending' | 'approved' | 'rejected';
  kycDetails?: {
    verificationId: string;
    status: string;
    completedAt: string;
  };
}

export interface ClientOnboarding {
  accountType: 'individual' | 'joint' | 'trust';
  individuals: Individual[];
  trustDocuments?: string[];
  termsAccepted: boolean;
}

export interface Card {
  id: string;
  type: 'physical' | 'virtual';
  status: 'active' | 'paused' | 'cancelled';
  lastFour: string;
  expirationDate: string;
  cardNumber: string;
  cvv: string;
}

export interface PaymentMethod {
  type: 'ach' | 'zelle' | 'check';
  routingNumber?: string;
  accountNumber?: string;
  accountType?: 'checking' | 'savings';
  phoneNumber?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface Payee {
  id: string;
  name: string;
  type: 'business' | 'individual';
  paymentMethods: PaymentMethod[];
  lastPayment: {
    amount: number;
    date: string;
  };
}
// Rest of the types remain the same...