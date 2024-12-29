import { Navigate } from 'react-router-dom';
import { PropsWithChildren } from 'react';
import useAuth from "../hooks/useAuth.tsx";

const AuthProtectedRoute = ({ children }: PropsWithChildren) => {
    const  isAuthenticated = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
};

export default AuthProtectedRoute;
