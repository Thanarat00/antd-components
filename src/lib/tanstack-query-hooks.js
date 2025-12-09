import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstant } from '../services';

/**
 * Custom hook for GET requests with Tanstack Query
 */
export function useApiQuery(key, url, options) {
  return useQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      const response = await axiosInstant.get(url);
      return response.data;
    },
    ...options,
  });
}

/**
 * Custom hook for POST requests with Tanstack Query
 */
export function useApiMutation(url, options) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => {
      const response = await axiosInstant.post(url, variables);
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
export function useApiPut(url, options) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => {
      const response = await axiosInstant.put(url, variables);
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
export function useApiDelete(url, options) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstant.delete(url);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries();
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

