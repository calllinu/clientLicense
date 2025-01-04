import { SubsidiaryRequest} from "../../../../interfaces/SubsidiaryInterfaces.tsx";

export const useInitialValueSubsidiary = (): Omit<SubsidiaryRequest, 'organizationId'> => {
    return {
        subsidiaryCode: "",
        country: "",
        city: "",
        address: "",
    };
};

export default useInitialValueSubsidiary;



