import {useMemo} from 'react';

const useOrgAdminRole = () => {
    return useMemo(() => {
        const role = sessionStorage.getItem('role');
        return role === 'ORG_ADMIN' || role === 'OWNER';
    }, [])
};

export default useOrgAdminRole;