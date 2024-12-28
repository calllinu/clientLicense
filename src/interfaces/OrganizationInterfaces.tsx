export interface OrganizationUpdateRequest {
    updatedFields: Partial<Organization>;
    registerCode: string;
}

export interface Organization {
    id: number;
    registerCode: string;
    name: string;
    yearOfEstablishment: number;
    industry: string;
    subsidiaries: Subsidiary[];
}

export interface OrganizationResponse {
    id: number;
    registerCode: string;
    name: string;
    yearOfEstablishment: number;
    industry: string;
    subsidiaries: Subsidiary[];
}

export interface OrganizationAddRequest {
    registerCode: string;
    name: string;
    yearOfEstablishment: number;
    industry: string;
}

export interface Subsidiary {
    subsidiaryCode: number;
    country: string;
    city: string;
    address: string;
    organization: Organization;
}
