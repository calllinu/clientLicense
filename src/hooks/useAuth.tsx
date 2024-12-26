import {useMemo} from 'react';

const useAuth = () => {
    return useMemo(() => {
       const accessToken = sessionStorage.getItem('accessToken');
       const refreshToken = sessionStorage.getItem('refreshToken');

       return !!accessToken && !!refreshToken;
   }, [])

};

export default useAuth;
