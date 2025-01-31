import type React from 'react';
import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import NotFound from '@views/notFound/NotFound';
import { APP_ROUTES } from '@config/appRoutes';

// Lazy-loaded views
const DashboardLayout = lazy(() => import('@components/dashboardLayout/DashboardLayout'));

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path={APP_ROUTES.PUBLIC.HOME} element={<DashboardLayout />}>
      <Route index element={<DashboardLayout />} />
      <Route path="c/:chatId" element={<DashboardLayout />} />
    </Route>

    {/* Fallback */}
    <Route path={APP_ROUTES.ERROR.NOT_FOUND} element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
