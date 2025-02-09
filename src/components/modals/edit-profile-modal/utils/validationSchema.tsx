import * as Yup from 'yup';

export const validationSchema = Yup.object({
    fullName: Yup.string()
        .required('Full name is required')
        .min(3, 'Full name must be at least 3 characters long'),
    employeeCNP: Yup.string()
        .required('CNP is required'),
    dateOfBirth: Yup.date()
        .required('Date of birth is required')
        .max(new Date(), 'Date of birth cannot be in the future'),
    dateOfHiring: Yup.date()
        .required('Date of birth is required')
        .max(new Date(), 'Date of birth cannot be in the future'),
    qualification: Yup.string()
        .required('Qualification is required')
});
