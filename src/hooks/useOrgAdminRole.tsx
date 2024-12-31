import {useMemo} from 'react';
import {Role} from "../interfaces/RoleEnum.tsx";

const useOrgAdminRole = () => {
    return useMemo(() => {
        const role = sessionStorage.getItem('role');
        return role === Role.ORG_ADMIN || role === Role.OWNER;
    }, [])
};

export default useOrgAdminRole;