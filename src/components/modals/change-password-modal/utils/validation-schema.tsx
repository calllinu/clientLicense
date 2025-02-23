import * as Yup from "yup";

export const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    otp: Yup.string().length(6, "OTP must be 6 digits").matches(/^[0-9]{6}$/, "Invalid OTP").required("OTP is required"),
    password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
});