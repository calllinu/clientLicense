import { OrganizationInitialValues } from "../../../../interfaces/OrganizationInitialValues.tsx";

export const useInitialValuesOrganization = (): OrganizationInitialValues => {
    return {
        organizationCode: "",
        name: "",
        yearOfEstablishment: undefined,
        industry: "",
    };
};

export default useInitialValuesOrganization;
