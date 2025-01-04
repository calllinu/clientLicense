import { useState, useEffect } from 'react';
import {SubsidiaryUpdateRequest} from "../../../../interfaces/SubsidiaryInterfaces.tsx";

interface UseInitialValuesProps {
    subsidiary: SubsidiaryUpdateRequest | null;
}

const useInitialValues = ({ subsidiary }: UseInitialValuesProps) => {
    const [initialValues, setInitialValues] = useState<SubsidiaryUpdateRequest>({
        subsidiaryCode: '',
        country: '',
        city: '',
        address: '',
        subsidiaryId: undefined,
    });

    useEffect(() => {
        if (subsidiary) {
            setInitialValues({
                subsidiaryCode: subsidiary.subsidiaryCode,
                subsidiaryId: subsidiary.subsidiaryId,
                country: subsidiary.country,
                city: subsidiary.city,
                address: subsidiary.address,
            });
        }
    }, [subsidiary]);

    return initialValues;
};

export default useInitialValues;
