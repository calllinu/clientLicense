import {useEffect, useState} from 'react';
import {OrganizationUpdateRequest} from "../../../../interfaces/OrganizationInterfaces.tsx";

interface UseInitialValuesProps {
    organization: OrganizationUpdateRequest | null;
}

const useInitialValuesEditOrganizationModal = ({ organization }: UseInitialValuesProps) => {
    const [initialValues, setInitialValues] = useState<OrganizationUpdateRequest>({
        organizationCode: '',
        name: '',
        yearOfEstablishment: 0,
        industry: undefined,
    });

    useEffect(() => {
        if (organization) {
            setInitialValues({
                organizationId: organization.organizationId,
                name: organization.name,
                yearOfEstablishment: organization.yearOfEstablishment,
                industry: organization.industry,
            });
        }
    }, [organization]);

    return initialValues;
};

export default useInitialValuesEditOrganizationModal;
