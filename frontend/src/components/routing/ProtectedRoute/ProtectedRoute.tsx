import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../hooks';

const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;

};

export default ProtectedRoute;