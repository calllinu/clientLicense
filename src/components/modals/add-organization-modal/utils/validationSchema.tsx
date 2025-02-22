import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
    organizationCode: Yup.string().required('Organization code is required'),
    name: Yup.string().required('Organization name is required'),
    yearOfEstablishment: Yup.string()
        .matches(/^\d{4}$/, 'Year of establishment must be a valid year')
        .required('Year of establishment is required'),
    industry: Yup.mixed().required('Industry is required'),
});
