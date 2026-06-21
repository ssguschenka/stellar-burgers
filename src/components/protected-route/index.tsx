import { Outlet } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({ onlyUnAuth }: ProtectedRouteProps) => {
  const { user, isAuthChecked } = useSelector((state) => state.user);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to={'/login'} state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };

    return <Navigate replace to={from} />;
  }

  return <Outlet />;
};
