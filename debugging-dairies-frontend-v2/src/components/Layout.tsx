import NavBar from '@/components/layoutComponents/NavBar';

import { ToastProvider } from '@/providers/ToastProvider';
import { isAuthenticated } from '@/utils/localStorageUtils';
import { Navigate, Outlet } from 'react-router-dom';

const AppShell = ({ auth }: { auth: boolean }) => (
  <ToastProvider>
    <div className="flex flex-col min-h-screen bg-background">
      <div className="sticky top-0 z-50">{auth && <NavBar />}</div>
      <div className="flex flex-1">
        <main className="flex-1 pt-0 ">
          <Outlet />
        </main>
      </div>
    </div>
  </ToastProvider>
);

export const ProtectedLayout = () => {
  if (!isAuthenticated()) return <Navigate to="/" replace />;

  return <AppShell auth={true} />;
};

export const PublicLayout = () => {
  if (isAuthenticated()) return <Navigate to="/home" replace />;

  return <AppShell auth={false} />;
};
