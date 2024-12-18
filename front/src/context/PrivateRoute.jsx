import { Navigate } from 'react-router-dom';
import { hasAccessToken } from '@/utils';

const PrivateRoute = ({ children }) => {
  const has = hasAccessToken();
  if (!has) return <Navigate to="/auth" />;

  return children;
};

export default PrivateRoute;
