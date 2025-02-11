import {useMemo} from 'react';
import {Role} from "../interfaces/enums/RoleEnum.tsx";

const useOrgAdminRole = () => {
    return useMemo(() => {
        const role = sessionStorage.getItem('role');
        return role === Role.ORG_ADMIN;
    }, [])
};

export default useOrgAdminRole;