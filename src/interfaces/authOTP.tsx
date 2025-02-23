export interface OTPRequest {
    email: string;
}

export interface OTPVerification {
    email: string;
    otp: string;
}

export interface PasswordReset {
    email: string;
    otp: string
    newPassword: string;
}