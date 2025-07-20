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
  // Пример: accessToken хранится в localStorage
  const accessToken = localStorage.getItem('accessToken');
  const isAuth = Boolean(accessToken);
  const location = useLocation();

  if (onlyUnAuth && isAuth) {
    // Если пользователь авторизован, не пускать на страницы login, register и т.д.
    return <Navigate to={location.state?.from || '/'} replace />;
  }

  if (!onlyUnAuth && !isAuth) {
    // Если пользователь не авторизован, не пускать на защищённые страницы
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
