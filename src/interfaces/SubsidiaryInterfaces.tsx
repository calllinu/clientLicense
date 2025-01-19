import {Employee} from "./EmployeeInterfaces.tsx";

export interface SubsidiaryRequest {
    subsidiaryCode: string;
    country: string;
    city: string;
    address: string;
    organizationId: number | undefined;
}

export interface SubsidiaryResponse {
    subsidiaryId: number;
    subsidiaryCode: string;
    country: string;
    city: string;
    address: string;
    organizationId: number;
}

export interface Subsidiary {
    subsidiaryId: number;
    subsidiaryCode: string;
    country: string;
    city: string;
    address: string;
    organizationId: number;
    employees: Employee[];
}

export interface SubsidiaryUpdateRequest {
    country: string;
    city: string;
    address: string;
    subsidiaryCode?: string;
    subsidiaryId?: number;
}