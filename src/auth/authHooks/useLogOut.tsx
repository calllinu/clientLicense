import {useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {useLogoutUserMutation} from "../../services/userApi.tsx";

const useLogout = () => {
    const navigate = useNavigate();
    const [logout] = useLogoutUserMutation();

    return useCallback(async () => {
        try {
            await logout({
                accessToken: sessionStorage.getItem('accessToken') || undefined,
                refreshToken: sessionStorage.getItem('refreshToken') || undefined,
            }).unwrap().then(() => {
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('refreshToken');
                sessionStorage.removeItem('role');
                navigate('/login');
            });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }, [logout, navigate]);
};

export default useLogout;
