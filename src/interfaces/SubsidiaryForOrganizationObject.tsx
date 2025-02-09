import {Subsidiary} from "./SubsidiaryInterfaces.tsx";

export interface SubsidiaryForOrganizationObject {
    organizationId: number;
    subsidiaries: Subsidiary[];
}