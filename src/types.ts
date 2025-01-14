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
  keyMetrics: MetricItem[];
  features: FeatureItem[];
  users: UserItem[];
  transcription: string;
  status: 'draft' | 'approved';
  createdAt: string;
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

export interface Card {
  id: string;
  type: 'physical' | 'virtual';
  status: 'active' | 'paused' | 'cancelled';
  lastFour: string;
  expirationDate: string;
  cvv?: string;
  cardNumber?: string;
  isAuthenticated?: boolean;
}

export interface TranscriptionSegment {
  text: string;
  timestamp: number;
}

export interface UserItem {
  id: string;
  name: string;
  icon: string;
}

export interface FeatureItem {
  id: string;
  name: string;
  icon: string;
}

export interface MetricItem {
  id: string;
  name: string;
  graphType: 'bar' | 'line' | 'pie';
  value?: number;
}

export interface ClientOnboarding {
  id: string;
  accountType: 'individual' | 'joint' | 'trust';
  status: 'pending' | 'in_progress' | 'completed';
  trustDocuments?: string[];
  individuals: Individual[];
  termsAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Individual {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  ssn: string;
  dob: string;
  kycStatus: 'pending' | 'in_progress' | 'approved' | 'rejected';
  kycDetails?: {
    verificationId: string;
    status: string;
    completedAt: string;
  };
}

// Add WebkitSpeechRecognition type for TypeScript
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}