import * as Yup from 'yup';
import {Industry} from "../../../interfaces/IndustryInterfaces.tsx";

export const validationSchema = Yup.object({
    organizationCode: Yup.string().required('Organization Code is required'),
    name: Yup.string().required('Organization Name is required'),
    yearOfEstablishment: Yup.number().required('Year of Establishment is required'),
    adminEmail: Yup.string().email('Invalid email format').required('Admin Email is required'),
    industry: Yup.mixed().oneOf(Object.values(Industry)).required('Industry is required'),
});
