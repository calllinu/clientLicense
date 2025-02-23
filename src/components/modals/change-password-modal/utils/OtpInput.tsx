import React from "react";
import {Col, Input, Row} from "antd";
import styles from './../change-password.module.scss';

const OtpInput = ({otp, onOtpChange}: { otp: string[]; onOtpChange: (otp: string[]) => void }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        if (value.length > 1) return;
        otp[index] = value;
        onOtpChange([...otp]);
        if (value) {
            const nextField = document.getElementById(`otp-${index + 1}`);
            if (nextField) {
                nextField.focus();
            }
        }
    };

    return (
        <>
            <Row gutter={[10, 10]} justify="start">
                {otp.map((digit, index) => (
                    <Col key={index}>
                        <Input
                            id={`otp-${index}`}
                            value={digit}
                            maxLength={1}
                            onChange={(e) => handleChange(e, index)}
                            className={styles.otpSquares}
                        />
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default OtpInput;