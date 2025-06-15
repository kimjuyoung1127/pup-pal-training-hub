
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface DashboardState {
  missionCompleted: boolean;
  lastMissionDate: string | null;
  toggleMissionCompleted: () => void;
  resetMissionIfNeeded: () => void;
}

const today = new Date().toISOString().split('T')[0];

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      missionCompleted: false,
      lastMissionDate: null,
      toggleMissionCompleted: () => set((state) => ({ missionCompleted: !state.missionCompleted, lastMissionDate: today })),
      resetMissionIfNeeded: () => {
        const { lastMissionDate } = get();
        if (lastMissionDate !== today) {
          set({ missionCompleted: false, lastMissionDate: today });
        }
      },
    }),
    {
      name: 'dashboard-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
