import {Industry} from "./IndustryInterfaces.tsx";
import {Subsidiary} from "./SubsidiaryInterfaces.tsx";

export interface OrganizationUpdateRequest {
    updatedFields: Partial<Organization>;
    registerCode: string;
}

export interface Organization {
    organizationId: number;
    organizationCode: string;
    name: string;
    yearOfEstablishment: number;
    industry: Industry;
    subsidiaries: Subsidiary[];
}

export interface OrganizationResponse {
    organizationId: number;
    organizationCode: string;
    name: string;
    yearOfEstablishment: number;
    industry: Industry;
    subsidiaries: Subsidiary[];
}

export interface OrganizationAddRequest {
    registerCode: string;
    name: string;
    yearOfEstablishment: number;
    industry: Industry;
}

export interface Employee {
    employeeId: number;
    name: string;
    position: string;
    department: string;
    subsidiary: Subsidiary;
}
