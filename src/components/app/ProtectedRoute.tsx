import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  onlyUnAuth?: boolean;
  children: JSX.Element;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const accessToken = localStorage.getItem('accessToken');
  const isAuth = Boolean(accessToken);
  const location = useLocation();

  if (onlyUnAuth && isAuth) {
    return <Navigate to={location.state?.from || '/'} replace />;
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
