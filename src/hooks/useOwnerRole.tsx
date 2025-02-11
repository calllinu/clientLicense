import {useMemo} from "react";
import {Role} from "../interfaces/enums/RoleEnum.tsx";

const useOwnerRole = () => {
    return useMemo(() => {
        const role = sessionStorage.getItem('role');
        return role === Role.OWNER;
    }, [])
};

export default useOwnerRole;