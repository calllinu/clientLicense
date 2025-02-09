import * as Yup from "yup";

export const SignupSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    username: Yup.string().min(3, "Too Short!").required("Required"),
    fullName: Yup.string().min(2, "Too Short!").required("Required"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
        .required("Required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Required"),
    selectedOrganization: Yup.number().required("Please select an organization"),
    selectedSubsidiary: Yup.number().required("Please select a subsidiary-section"),
});
