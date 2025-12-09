// Styles
import './styles/index.css';

// ============================================
// GENERAL COMPONENTS
// ============================================
export * from './components/General';

// ============================================
// LAYOUT COMPONENTS
// ============================================
export * from './components/Layout';

// ============================================
// NAVIGATION COMPONENTS
// ============================================
export * from './components/Navigation';

// ============================================
// DATA ENTRY COMPONENTS
// ============================================
export * from './components/DataEntry';

// ============================================
// DATA DISPLAY COMPONENTS
// ============================================
export * from './components/DataDisplay';

// ============================================
// TABLE COMPONENTS
// ============================================
export * from './components/Table';

// ============================================
// FEEDBACK COMPONENTS
// ============================================
export * from './components/Feedback';

// ============================================
// HOOKS
// ============================================
export { useTableSearch } from './hooks/useTableSearch';
export { useLocalStorage } from './hooks/useLocalStorage';

// ============================================
// OTHER COMPONENTS
// ============================================
export * from './components/Other';

// ============================================
// UTILS
// ============================================
export { formatDate, formatThaiDate, getDatePresets, getDateRangePresets } from './utils/dateUtils';
export { cn } from './utils/cn';

// ============================================
// SERVICES
// ============================================
export { axiosInstant, AxiosInstant } from './services';
export type { AxiosInstantConfig, ApiResponse } from './services';

// ============================================
// TANSTACK QUERY
// ============================================
export { QueryProvider, queryClient } from './lib/tanstack-query';
export { useApiQuery, useApiMutation, useApiPut, useApiDelete } from './lib/tanstack-query-hooks';
export { useQuery, useMutation, useQueryClient, useInfiniteQuery } from './lib/tanstack-query';

// ============================================
// ROUTING
// ============================================
export { TanstackRouterProvider, createAppRoute, router } from './lib/routing/tanstack-router';
export { ReactRouterProvider } from './lib/routing/react-router';
export type { RouteConfig, ReactRouterProviderProps } from './lib/routing/react-router';
export { Link, NavLink, useNavigate, useParams, useLocation } from './lib/routing/react-router';

// ============================================
// STATE MANAGEMENT
// ============================================
export { createZustandStore, create, persist, createJSONStorage } from './lib/store/zustand-store';
export type { ZustandStoreConfig } from './lib/store/zustand-store';
export { createReduxSlice, createReduxStore, ReduxProvider, useAppDispatch, useAppSelector } from './lib/store/redux-store';
export type { ReduxSliceConfig } from './lib/store/redux-store';

// ============================================
// FORMS
// ============================================
export { useForm } from './hooks/useForm';
export type { FormLibrary, UseFormConfig } from './hooks/useForm';
export { Controller, FormProvider, useFormContext, useController, useWatch, useFieldArray } from './hooks/useForm';