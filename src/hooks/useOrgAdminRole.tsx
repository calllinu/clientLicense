import {useMemo} from 'react';

const useOrgAdminRole = () => {
    return useMemo(() => {
        const role = localStorage.getItem('role');
        return role === 'ORG_ADMIN';
    }, [])
};

export default useOrgAdminRole;