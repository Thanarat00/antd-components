import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Create a Zustand store with optional persistence
 * 
 * Usage:
 * ```jsx
 * const useUserStore = createZustandStore({
 *   name: 'user-store',
 *   initialState: {
 *     user: null,
 *     setUser: (user) => set({ user }),
 *     clearUser: () => set({ user: null }),
 *   },
 *   persist: true,
 * });
 * ```
 */
export function createZustandStore(config) {
  const { name, initialState, persist: enablePersist = false } = config;

  if (enablePersist) {
    return create(
      persist(
        (set, get) => ({
          ...initialState,
          // Helper to update state
          setState: (updates) => set((state) => ({ ...state, ...updates })),
        }),
        {
          name,
          storage: createJSONStorage(() => localStorage),
        }
      )
    );
  }

  return create((set, get) => ({
    ...initialState,
    // Helper to update state
    setState: (updates) => set((state) => ({ ...state, ...updates })),
  }));
}

// Export zustand utilities
export { create } from 'zustand';
export { persist, createJSONStorage } from 'zustand/middleware';

