import { ReactNode } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { getCurrentUser } from '../../redux/services/authSlice';
import { Navigate, useLocation } from 'react-router-dom';
import { useGetSelfProfileQuery } from '../../redux/features/authApi';
import Loader from '../Loader';

const ProtectRoute = ({ children }: { children: ReactNode }) => {
  const user = useAppSelector(getCurrentUser);
  const { data, isLoading } = useGetSelfProfileQuery(undefined);
  const location = useLocation();

    if (isLoading) return <Loader />;

  if (!user && !data?.data) {
    return <Navigate to="/login" replace />;
  }

  const userRole = data?.data?.role;

  const restrictedRoutes: Record<string, string[]> = {
    'create-product': ['Mixture'], 
    'create-order': ['Mixture', 'Stock-Manager'], 
    'add-chemical': ['Mixture'], 
    'products': ['Mixture', 'Stock-Manager'], 
    'manage-chemicals': ['Mixture'], 
    'register': ['Manager', 'Mixture', 'Stock-Manager'], 
    'Register': ['Manager', 'Mixture', 'Stock-Manager'], 
  };

  const path = location.pathname.replace('/', '');

  if (restrictedRoutes[path]?.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectRoute;
