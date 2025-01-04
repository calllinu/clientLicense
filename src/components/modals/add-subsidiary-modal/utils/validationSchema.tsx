import * as Yup from 'yup';

export const subsidiaryValidationSchema = Yup.object().shape({
    address: Yup.string()
        .required('Address is required')
        .min(5, 'Address must be at least 5 characters')
        .max(100, 'Address cannot exceed 100 characters'),
    city: Yup.string()
        .required('City is required')
        .max(50, 'City cannot exceed 50 characters'),
    country: Yup.string()
        .required('Country is required')
        .max(50, 'Country cannot exceed 50 characters'),
    subsidiaryCode: Yup.string()
        .required('Subsidiary Code is required')
        .max(20, 'Subsidiary Code cannot exceed 20 characters'),
});

export default subsidiaryValidationSchema;
