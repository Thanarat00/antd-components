import { createRouter, RouterProvider, createRootRoute, createRoute } from '@tanstack/react-router';
import { ReactNode } from 'react';

// Example root route
const rootRoute = createRootRoute({
  component: () => null,
});

// Example index route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => null,
});

// Create router
const routeTree = rootRoute.addChildren([indexRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

/**
 * Tanstack Router Provider
 * 
 * Usage:
 * ```tsx
 * import { TanstackRouterProvider } from '@/lib/routing/tanstack-router';
 * 
 * function App() {
 *   return <TanstackRouterProvider />;
 * }
 * ```
 */
export function TanstackRouterProvider() {
  return <RouterProvider router={router} />;
}

/**
 * Helper to create routes
 */
export function createAppRoute(config: {
  path: string;
  component: () => ReactNode;
  getParentRoute?: () => any;
}) {
  return createRoute({
    getParentRoute: config.getParentRoute || (() => rootRoute),
    path: config.path,
    component: config.component,
  });
}

