import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {useLogoutUserMutation} from "../../services/userApi.tsx";

const useLogout = () => {
    const navigate = useNavigate();
    const [logout] = useLogoutUserMutation();

    const handleLogout = useCallback(async () => {
        try {
            await logout({
                accessToken: sessionStorage.getItem('accessToken') || undefined,
                refreshToken: sessionStorage.getItem('refreshToken') || undefined,
            }).unwrap().then(() => {
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('refreshToken');
                navigate('/login');
            });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }, [logout, navigate]);

    return handleLogout;
};

export default useLogout;
