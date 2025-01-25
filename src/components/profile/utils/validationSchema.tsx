import * as Yup from 'yup';
import {Qualification} from "../../../interfaces/Qualification";

export const validationSchema = Yup.object({
    fullName: Yup.string().required('Full Name is required'),
    employeeCNP: Yup.string().required('Personal ID Number is required'),
    qualification: Yup.mixed().oneOf(Object.values(Qualification)).required('Qualification is required'),
    dateOfBirth: Yup.string().required('Date of Birth is required'),
    yearsOfExperience: Yup.number().nullable().positive('Years of experience must be a positive number').integer('Years of experience must be an integer'),
});
