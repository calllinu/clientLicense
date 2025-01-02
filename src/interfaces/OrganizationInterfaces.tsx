import {Industry} from "./IndustryInterfaces.tsx";
import {Subsidiary} from "./SubsidiaryInterfaces.tsx";

export interface OrganizationUpdateRequest {
    updatedFields: Partial<Organization>;
    registerCode: string;
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
    adminEmail: string;
    industry: string;
}


