import * as Yup from 'yup';
import {Industry} from "../../../../interfaces/enums/IndustryInterfaces.tsx";

export const validationSchema = Yup.object().shape({
    organizationCode: Yup.string().required('Organization code is required'),
    name: Yup.string().required('Organization name is required'),
    yearOfEstablishment: Yup.string()
        .matches(/^\d{4}$/, 'Year of establishment must be a valid year')
        .required('Year of establishment is required'),
    industry: Yup.mixed().oneOf(
        Object.values(Industry),
        'Please select a valid industry'
    ).required('Industry is required'),
});
