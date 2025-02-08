import * as Yup from 'yup';

export const validationSchema = Yup.object({
    fullName: Yup.string().required('Full Name is required'),
    employeeCNP: Yup.string().required('Personal ID Number is required'),
    dateOfBirth: Yup.string(),
    dateOfHiring: Yup.string(),
    yearsOfExperience: Yup.number().nullable().positive('Years of experience must be a positive number').integer('Years of experience must be an integer'),
});
