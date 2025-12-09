import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

export interface ReduxSliceConfig<T> {
  name: string;
  initialState: T;
  reducers?: Record<string, (state: T, action: PayloadAction<any>) => void>;
  persist?: boolean;
}

/**
 * Create a Redux slice with optional persistence
 * 
 * Usage:
 * ```tsx
 * interface UserState {
 *   user: User | null;
 * }
 * 
 * const userSlice = createReduxSlice<UserState>({
 *   name: 'user',
 *   initialState: {
 *     user: null,
 *   },
 *   reducers: {
 *     setUser: (state, action) => {
 *       state.user = action.payload;
 *     },
 *     clearUser: (state) => {
 *       state.user = null;
 *     },
 *   },
 *   persist: true,
 * });
 * ```
 */
export function createReduxSlice<T>(config: ReduxSliceConfig<T>) {
  const { name, initialState, reducers = {}, persist: enablePersist = false } = config;

  const slice = createSlice({
    name,
    initialState,
    reducers: {
      reset: (state) => ({ ...initialState } as T),
      ...reducers,
    },
  });

  if (enablePersist) {
    const persistConfig = {
      key: name,
      storage,
    };

    return {
      ...slice,
      reducer: persistReducer(persistConfig, slice.reducer),
    };
  }

  return slice;
}

/**
 * Create Redux store
 * 
 * Usage:
 * ```tsx
 * const store = createReduxStore({
 *   reducer: {
 *     user: userSlice.reducer,
 *   },
 * });
 * ```
 */
export function createReduxStore(config: { reducer: Record<string, any> }) {
  return configureStore({
    reducer: config.reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }),
  });
}

/**
 * Redux Provider Component
 */
export function ReduxProvider({ store, children }: { store: ReturnType<typeof createReduxStore>; children: React.ReactNode }) {
  const { Provider } = require('react-redux');
  return <Provider store={store}>{children}</Provider>;
}

// Typed hooks
export const useAppDispatch = () => useDispatch<ReturnType<typeof createReduxStore>['dispatch']>();
export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof createReduxStore>['getState']> = useSelector;

// Export Redux utilities
export { configureStore, createSlice } from '@reduxjs/toolkit';
export { Provider } from 'react-redux';

