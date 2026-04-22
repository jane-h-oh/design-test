// Member types
export interface Member {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  role: 'pastor' | 'elder' | 'deacon' | 'member' | 'visitor';
  group?: string;
  tags: string[];
  memo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberFormData {
  name: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  role: Member['role'];
  group?: string;
  tags: string[];
  memo?: string;
}

// Worship types
export interface Worship {
  id: string;
  title: string;
  type: 'sunday' | 'wednesday' | 'special' | 'cell';
  date: string;
  time: string;
  location?: string;
  preacher?: string;
  sermonTitle?: string;
  sermonNotes?: string;
  team: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WorshipFormData {
  title: string;
  type: Worship['type'];
  date: string;
  time: string;
  location?: string;
  preacher?: string;
  sermonTitle?: string;
  sermonNotes?: string;
  team: string[];
}

// Finance types
export interface Finance {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinanceFormData {
  type: Finance['type'];
  amount: number;
  category: string;
  description: string;
  date: string;
}

// Document types
export interface Document {
  id: string;
  title: string;
  type: string;
  url: string;
  size: number;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentFormData {
  title: string;
  type: string;
  file: File;
}

// Schedule types
export interface Schedule {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  allDay: boolean;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleFormData {
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  allDay: boolean;
  color?: string;
}

// Dashboard types
export interface DashboardStats {
  totalMembers: number;
  newMembersThisMonth: number;
  totalOfferings: number;
  upcomingWorships: number;
}

export interface RecentActivity {
  id: string;
  type: 'member' | 'worship' | 'finance' | 'document' | 'schedule';
  action: string;
  description: string;
  timestamp: string;
}