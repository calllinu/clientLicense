import { Navigate } from 'react-router-dom';
import { PropsWithChildren } from 'react';
import useOrgAdminRole from "../hooks/useOrgAdminRole.tsx";

const AdminProtectedRoutes = ({ children }: PropsWithChildren) => {
    const isOrgAdmin = useOrgAdminRole();

    if (!isOrgAdmin) {
        return <Navigate to="/profile" />;
    }

    return <>{children}</>;
};

export default AdminProtectedRoutes;
