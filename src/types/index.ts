export type OccupancyLevel = 'low' | 'medium' | 'high';

export type UserRole = 'paciente' | 'gestor' | 'supervisor' | 'admin';

export interface Hospital {
  id: string;
  name: string;
  address: string;
  distance: number;
  occupancy: OccupancyLevel;
  specialties: string[];
  phone: string;
  lat: number;
  lng: number;
  waitTime: number;
}

export type RootStackParamList = {
  Home: undefined;
  Map: undefined;
  HospitalDetail: { hospital: Hospital };
  Anamnese: undefined;
  AdminLogin: undefined;
  AdminPanel: { hospitalId: string };
  Perfil: undefined;
  Comentarios: { hospitalId: string };
  GestorPanel: undefined;
  SuperAdminDashboard: undefined;
};

export interface ExamSuggestion {
  exam: string;
  reason: string;
  urgency: 'low' | 'medium' | 'high';
}

export interface Comentario {
  id: string;
  hospitalId: string;
  autor: string;
  texto: string;
  data: string;
}