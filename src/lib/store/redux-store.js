import { configureStore, createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

/**
 * Create a Redux slice with optional persistence
 * 
 * Usage:
 * ```jsx
 * const userSlice = createReduxSlice({
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
export function createReduxSlice(config) {
  const { name, initialState, reducers = {}, persist: enablePersist = false } = config;

  const slice = createSlice({
    name,
    initialState,
    reducers: {
      reset: (state) => ({ ...initialState }),
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
 * ```jsx
 * const store = createReduxStore({
 *   reducer: {
 *     user: userSlice.reducer,
 *   },
 * });
 * ```
 */
export function createReduxStore(config) {
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
export function ReduxProvider({ store, children }) {
  const { Provider } = require('react-redux');
  return <Provider store={store}>{children}</Provider>;
}

// Typed hooks
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Export Redux utilities
export { configureStore, createSlice } from '@reduxjs/toolkit';
export { Provider } from 'react-redux';

