import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { axiosInstant, ApiResponse } from '../services';

/**
 * Custom hook for GET requests with Tanstack Query
 */
export function useApiQuery<T = any>(
  key: string | string[],
  url: string,
  options?: Omit<UseQueryOptions<ApiResponse<T>>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ApiResponse<T>>({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      const response = await axiosInstant.get<T>(url);
      return response.data;
    },
    ...options,
  });
}

/**
 * Custom hook for POST requests with Tanstack Query
 */
export function useApiMutation<TData = any, TVariables = any>(
  url: string,
  options?: UseMutationOptions<ApiResponse<TData>, Error, TVariables>
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<TData>, Error, TVariables>({
    mutationFn: async (variables) => {
      const response = await axiosInstant.post<TData>(url, variables);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate queries on success
      queryClient.invalidateQueries();
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

/**
 * Custom hook for PUT requests with Tanstack Query
 */
export function useApiPut<TData = any, TVariables = any>(
  url: string,
  options?: UseMutationOptions<ApiResponse<TData>, Error, TVariables>
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<TData>, Error, TVariables>({
    mutationFn: async (variables) => {
      const response = await axiosInstant.put<TData>(url, variables);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries();
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

/**
 * Custom hook for DELETE requests with Tanstack Query
 */
export function useApiDelete<TData = any>(
  url: string,
  options?: UseMutationOptions<ApiResponse<TData>, Error, void>
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<TData>, Error, void>({
    mutationFn: async () => {
      const response = await axiosInstant.delete<TData>(url);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries();
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

