import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Member, Worship, Finance, Schedule } from '@/types';

interface AppState {
  // UI State
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  
  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  
  // Members
  members: Member[];
  setMembers: (members: Member[]) => void;
  addMember: (member: Member) => void;
  updateMember: (id: string, data: Partial<Member>) => void;
  removeMember: (id: string) => void;
  
  // Worship
  worships: Worship[];
  setWorships: (worships: Worship[]) => void;
  addWorship: (worship: Worship) => void;
  updateWorship: (id: string, data: Partial<Worship>) => void;
  removeWorship: (id: string) => void;
  
  // Finance
  finances: Finance[];
  setFinances: (finances: Finance[]) => void;
  addFinance: (finance: Finance) => void;
  updateFinance: (id: string, data: Partial<Finance>) => void;
  removeFinance: (id: string) => void;
  
  // Schedule
  schedules: Schedule[];
  setSchedules: (schedules: Schedule[]) => void;
  addSchedule: (schedule: Schedule) => void;
  updateSchedule: (id: string, data: Partial<Schedule>) => void;
  removeSchedule: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // UI State
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      // Theme
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      
      // Members
      members: [],
      setMembers: (members) => set({ members }),
      addMember: (member) => set((state) => ({ members: [...state.members, member] })),
      updateMember: (id, data) => set((state) => ({
        members: state.members.map((m) => (m.id === id ? { ...m, ...data } : m)),
      })),
      removeMember: (id) => set((state) => ({
        members: state.members.filter((m) => m.id !== id),
      })),
      
      // Worship
      worships: [],
      setWorships: (worships) => set({ worships }),
      addWorship: (worship) => set((state) => ({ worships: [...state.worships, worship] })),
      updateWorship: (id, data) => set((state) => ({
        worships: state.worships.map((w) => (w.id === id ? { ...w, ...data } : w)),
      })),
      removeWorship: (id) => set((state) => ({
        worships: state.worships.filter((w) => w.id !== id),
      })),
      
      // Finance
      finances: [],
      setFinances: (finances) => set({ finances }),
      addFinance: (finance) => set((state) => ({ finances: [...state.finances, finance] })),
      updateFinance: (id, data) => set((state) => ({
        finances: state.finances.map((f) => (f.id === id ? { ...f, ...data } : f)),
      })),
      removeFinance: (id) => set((state) => ({
        finances: state.finances.filter((f) => f.id !== id),
      })),
      
      // Schedule
      schedules: [],
      setSchedules: (schedules) => set({ schedules }),
      addSchedule: (schedule) => set((state) => ({ schedules: [...state.schedules, schedule] })),
      updateSchedule: (id, data) => set((state) => ({
        schedules: state.schedules.map((s) => (s.id === id ? { ...s, ...data } : s)),
      })),
      removeSchedule: (id) => set((state) => ({
        schedules: state.schedules.filter((s) => s.id !== id),
      })),
    }),
    {
      name: 'mokbomate-storage',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
        members: state.members,
        worships: state.worships,
        finances: state.finances,
        schedules: state.schedules,
      }),
    }
  )
);