import * as yup from "yup";
import dayjs from "dayjs";

export const validationSchema = yup.object({
    fullName: yup.string().required("Please enter your full name"),
    qualification: yup.string().required("Please select your qualification"),
    yearsOfExperience: yup.number().required().positive().integer(),
    dateOfBirth: yup.date().required("Please select your date of birth").max(dayjs().toDate(), "Date of birth cannot be in the future"),
    personalId: yup.string().required("Please enter your personal ID number"),
});
