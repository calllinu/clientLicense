import {Navigate} from 'react-router-dom';
import {PropsWithChildren} from 'react';
import useOrgAdminRole from "../hooks/useOrgAdminRole.tsx";

const AdminProtectedRoute = ({children}: PropsWithChildren) => {
    const isOrgAdmin = useOrgAdminRole();

    if (!isOrgAdmin) {
        return <Navigate to="/login"/>;
    }

    return <>{children}</>;
};

export default AdminProtectedRoute;
