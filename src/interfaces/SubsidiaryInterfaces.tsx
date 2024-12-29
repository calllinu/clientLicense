export interface SubsidiaryRequest {
    subsidiaryCode: string;
    country: string;
    city: string;
    address: string;
    organizationId: number;
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
    employeeIds: number[];
}

export interface SubsidiaryUpdateRequest {
    updatedFields: Partial<Subsidiary>;
    subsidiaryId: number;
    subsidiaryCode?: string;
    country?: string;
    city?: string;
    address?: string;
    organizationId?: number;
}
