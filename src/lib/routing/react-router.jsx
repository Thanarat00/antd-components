import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

/**
 * React Router DOM Provider
 * 
 * Usage:
 * ```jsx
 * import { ReactRouterProvider } from '@/lib/routing/react-router';
 * 
 * function App() {
 *   return (
 *     <ReactRouterProvider
 *       routes={[
 *         { path: '/', element: <Home /> },
 *         { path: '/about', element: <About /> },
 *       ]}
 *     />
 *   );
 * }
 * ```
 */
export function ReactRouterProvider({ routes = [], defaultRoute = '/', children }) {
  const renderRoutes = (routeList) => {
    return routeList.map((route) => (
      <Route key={route.path} path={route.path} element={route.element}>
        {route.children && renderRoutes(route.children)}
      </Route>
    ));
  };

  return (
    <BrowserRouter>
      <Routes>
        {routes.length > 0 && renderRoutes(routes)}
        {children}
        <Route path="*" element={<Navigate to={defaultRoute} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Export common components
export { Link, NavLink, useNavigate, useParams, useLocation } from 'react-router-dom';

