import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface ZustandStoreConfig<T> {
  name: string;
  initialState: T;
  persist?: boolean;
}

/**
 * Create a Zustand store with optional persistence
 * 
 * Usage:
 * ```tsx
 * interface UserState {
 *   user: User | null;
 *   setUser: (user: User) => void;
 *   clearUser: () => void;
 * }
 * 
 * const useUserStore = createZustandStore<UserState>({
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
export function createZustandStore<T extends object>(config: ZustandStoreConfig<T>) {
  const { name, initialState, persist: enablePersist = false } = config;

  if (enablePersist) {
    return create<T>()(
      persist(
        (set, get) => ({
          ...initialState,
          // Helper to update state
          setState: (updates: Partial<T>) => set((state) => ({ ...state, ...updates })),
        } as T & { setState: (updates: Partial<T>) => void }),
        {
          name,
          storage: createJSONStorage(() => localStorage),
        }
      )
    );
  }

  return create<T>()((set, get) => ({
    ...initialState,
    // Helper to update state
    setState: (updates: Partial<T>) => set((state) => ({ ...state, ...updates })),
  } as T & { setState: (updates: Partial<T>) => void }));
}

// Export zustand utilities
export { create } from 'zustand';
export { persist, createJSONStorage } from 'zustand/middleware';

