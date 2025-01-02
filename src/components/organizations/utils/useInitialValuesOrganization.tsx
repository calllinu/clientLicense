import { OrganizationInitialValues } from "../../../interfaces/OrganizationInitialValues.tsx";

export const useInitialValuesOrganization = (): OrganizationInitialValues => {
    return {
        organizationCode: "",
        name: "",
        yearOfEstablishment: undefined,
        adminEmail: "",
        industry: "",
    };
};

export default useInitialValuesOrganization;
