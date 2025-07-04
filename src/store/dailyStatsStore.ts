import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DailyStatsState {
  walkCount: number;
  poopCount: number;
  lastUpdated: string; // YYYY-MM-DD
  incrementWalk: () => void;
  incrementPoop: () => void;
  setWalk: (count: number) => void;
  setPoop: (count: number) => void;
  checkAndResetCounts: () => void;
}

const useDailyStatsStore = create(
  persist<DailyStatsState>(
    (set, get) => ({
      walkCount: 0,
      poopCount: 0,
      lastUpdated: new Date().toISOString().split('T')[0],

      incrementWalk: () => {
        get().checkAndResetCounts();
        set((state) => ({ walkCount: state.walkCount + 1 }));
      },

      incrementPoop: () => {
        get().checkAndResetCounts();
        set((state) => ({ poopCount: state.poopCount + 1 }));
      },
      
      setWalk: (count: number) => set({ walkCount: count }),
      setPoop: (count: number) => set({ poopCount: count }),

      checkAndResetCounts: () => {
        const today = new Date().toISOString().split('T')[0];
        if (get().lastUpdated !== today) {
          set({ walkCount: 0, poopCount: 0, lastUpdated: today });
        }
      },
    }),
    {
      name: 'daily-dog-stats',
    }
  )
);

export default useDailyStatsStore;