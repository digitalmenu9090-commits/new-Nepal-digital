export interface Appointment {
  id: string;
  name: string;
  phone: string;
  email?: string;
  service: string;
  date: string;
  time: string;
  appointmentType: string;
  message: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  isNewRequest?: boolean;
  notes?: string;
}

export interface AdminStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  newRequests: number;
}

export interface CustomerSummary {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalAppointments: number;
  latestService: string;
  latestDate: string;
  latestStatus: string;
  history: Appointment[];
}

export interface StudioService {
  id: string;
  name: string;
  category: string;
  priceEstimate: string;
  duration: string;
  status: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  event: string;
  level: 'INFO' | 'WARN' | 'SECURITY';
  details: string;
}
