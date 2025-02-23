import React, {useCallback, useState} from "react";
import {Button, Input, Modal, Spin} from "antd";
import {Field, Form, Formik} from "formik";
import styles from './change-password.module.scss';
import {useChangePasswordMutation, useSendOtpMutation, useVerifyOtpMutation} from "../../../services/userApi.tsx";
import {OTPRequest, OTPVerification, PasswordReset} from "../../../interfaces/authOTP.tsx";
import {validationSchema} from "./utils/validation-schema.tsx";
import OtpInput from "./utils/OtpInput.tsx";

const ChangePasswordModal = ({visible, onCancel}: { visible: boolean; onCancel: () => void }) => {
    const [email, setEmail] = useState<string>("");
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [newPassword, setNewPassword] = useState<string>("");
    const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
    const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [sendOtp] = useSendOtpMutation();
    const [verifyOtp] = useVerifyOtpMutation();
    const [changePassword] = useChangePasswordMutation();

    const handleSendOtp = useCallback(async () => {
        setLoading(true);
        setErrorMessage("");
        try {
            const request: OTPRequest = {email};
            await sendOtp(request).unwrap();
            setIsOtpSent(true);
        } catch (e) {
            console.error("Error sending OTP", e);
            setErrorMessage("User not found !");
        } finally {
            setLoading(false);
        }
    }, [email, sendOtp]);

    const handleVerifyOtp = useCallback(async () => {
        setLoading(true);
        setErrorMessage("");
        try {
            const otpString = otp.join("");
            const request: OTPVerification = {email, otp: otpString};
            await verifyOtp(request).unwrap();
            setIsOtpVerified(true);
        } catch (e) {
            console.error("Error verifying OTP", e);
            setErrorMessage("Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [email, otp, verifyOtp]);

    const handleChangePassword = useCallback(async () => {
        setLoading(true);
        setErrorMessage("");
        try {
            const request: PasswordReset = {email, otp: otp.join(""), newPassword: newPassword};
            await changePassword(request).unwrap();
            onCancel();
        } catch (e) {
            console.error("Error changing password", e);
            setErrorMessage("Failed to reset password. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [email, otp, newPassword, changePassword, onCancel]);

    const handleOtpChange = (newOtp: string[]) => {
        setOtp(newOtp);
    };

    return (
        <Modal
            title="Reset Password"
            open={visible}
            onCancel={onCancel}
            footer={null}
        >
            {!isOtpSent ? (
                <div>
                    <Formik
                        initialValues={{email}}
                        validationSchema={validationSchema}
                        onSubmit={handleSendOtp}
                    >
                        {({setFieldValue, errors, touched}) => (
                            <Form>
                                <div>
                                    <Field
                                        name="email"
                                        type="email"
                                        as={Input}
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            setFieldValue("email", e.target.value);
                                            setEmail(e.target.value);
                                        }}
                                    />
                                    {errors.email && touched.email && (
                                        <div className={styles.error}>{errors.email}</div>
                                    )}
                                </div>
                                {errorMessage && <div className={styles.error}>{errorMessage}</div>}
                                <Button
                                    type="primary"
                                    onClick={handleSendOtp}
                                    style={{marginTop: "10px"}}
                                >
                                    {loading ? <Spin/> : "Send email"}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </div>
            ) : !isOtpVerified ? (
                <div>
                    <OtpInput otp={otp} onOtpChange={handleOtpChange}/>
                    {otp.some((digit) => digit === "") && (
                        <div className={styles.error}>Please enter the security code.</div>
                    )}
                    {errorMessage && <div className={styles.error}>{errorMessage}</div>}
                    <Button
                        type="primary"
                        onClick={handleVerifyOtp}
                        style={{marginTop: "10px"}}
                    >
                        {loading ? <Spin/> : "Verify code"}
                    </Button>
                </div>
            ) : (
                <div>
                    <Formik
                        initialValues={{password: newPassword}}
                        validationSchema={validationSchema}
                        onSubmit={handleChangePassword}
                    >
                        {({setFieldValue, errors, touched}) => (
                            <Form>
                                <div>
                                    <Field
                                        name="password"
                                        type="password"
                                        as={Input.Password}
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            setFieldValue("password", e.target.value);
                                            setNewPassword(e.target.value);
                                        }}
                                    />
                                    {errors.password && touched.password && (
                                        <div className={styles.error}>{errors.password}</div>
                                    )}
                                </div>
                                {errorMessage && <div className={styles.error}>{errorMessage}</div>}
                                <Button
                                    type="primary"
                                    onClick={handleChangePassword}
                                    style={{marginTop: "10px"}}
                                >
                                    {loading ? <Spin/> : "Reset Password"}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </div>
            )}
        </Modal>
    );
};

export default ChangePasswordModal;
