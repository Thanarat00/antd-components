import { createRouter, RouterProvider, createRootRoute, createRoute } from '@tanstack/react-router';

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

/**
 * Tanstack Router Provider
 * 
 * Usage:
 * ```jsx
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
export function createAppRoute(config) {
  return createRoute({
    getParentRoute: config.getParentRoute || (() => rootRoute),
    path: config.path,
    component: config.component,
  });
}

