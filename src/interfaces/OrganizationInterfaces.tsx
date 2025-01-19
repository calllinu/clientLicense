import {Industry} from "./IndustryInterfaces.tsx";
import {Subsidiary} from "./SubsidiaryInterfaces.tsx";
import {UserResponse} from "./UserInterfaces.tsx";

export interface OrganizationUpdateRequest {
    organizationCode?: string;
    name: string;
    yearOfEstablishment: number;
    industry?: Industry | undefined;
    organizationId?: number;
}

export interface Organization {
    organizationId: number;
    adminEmail: string;
    organizationCode: string;
    name: string;
    yearOfEstablishment: number;
    industry: Industry;
    subsidiaries: Subsidiary[];
}

export interface OrganizationAddRequest {
    organizationCode: string;
    name: string;
    yearOfEstablishment: string;
    industry: string;
}

export interface OrganizationResponse {
    organizationId: number;
    organizationCode: string;
    name: string;
    yearOfEstablishment: number;
    admin: UserResponse;
    industry: Industry;
    subsidiaries: Subsidiary[];
}


