import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export interface QueryProviderProps {
  children: ReactNode;
  enableDevtools?: boolean;
}

/**
 * Tanstack Query Provider for Next.js App Router
 * 
 * Usage in app/layout.tsx:
 * ```tsx
 * import { QueryProvider } from '@/lib/tanstack-query';
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <QueryProvider>{children}</QueryProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function QueryProvider({ children, enableDevtools = false }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {enableDevtools && process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

// Export hooks
export { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

