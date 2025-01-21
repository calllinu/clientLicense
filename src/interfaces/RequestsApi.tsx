import {Subsidiary} from "./SubsidiaryInterfaces.tsx";

export interface RegistrationRequest {
    requestId: number;
    username: string;
    email: string;
    fullName: string;
    adminId: number;
    subsidiary: Subsidiary;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
}
