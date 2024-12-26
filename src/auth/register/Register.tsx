import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {Col, Row, Input, Button, Spin} from "antd";
import {EyeOutlined, EyeInvisibleOutlined, UserOutlined} from "@ant-design/icons";
import styles from './register.module.scss';
import {Link, useNavigate} from "react-router-dom";
import { useCreateUserMutation } from "../../services/userApi.tsx";

interface FormValues {
    email: string;
    username: string;
    fullName: string;
    password: string;
    confirmPassword: string;
}

const SignupSchema = Yup.object().shape({
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
});

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [createUser] = useCreateUserMutation();

    const handleSubmit = async (values: FormValues, { resetForm }: { resetForm: () => void }) => {
        setLoading(true)
        try {
            await createUser({
                username: values.username,
                email: values.email,
                fullName: values.fullName,
                password: values.password,
            }).unwrap();
            resetForm();
            navigate("/login");
        } catch (error) {
            console.error("Failed to create account:", error);
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const initialValues: FormValues = {
        email: "",
        username: "",
        fullName: "",
        password: "",
        confirmPassword: "",
    };

    return (
        <Row className={styles.container}>
            <Col className={styles.mainContainer} span={24}>
                <Row>
                    <Col className={styles.createAccount}>Create Account</Col>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={SignupSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched }) => (
                            <Form className={styles.formContainer}>
                                <Col className={styles.imageContainer}><UserOutlined className={styles.iconUser}/></Col>
                                <Col className={styles.inputContainer}>
                                    <label htmlFor="email" className={styles.label}>Email</label>
                                    <Field
                                        name="email"
                                        type="email"
                                        as={Input}
                                        placeholder="Enter your email"
                                        className={errors.email && touched.email ? styles.errorBorder : ""}
                                    />
                                    <ErrorMessage name="email" component="div" className={styles.error} />
                                </Col>

                                <Col className={styles.inputContainer}>
                                    <label htmlFor="username" className={styles.label}>Username</label>
                                    <Field
                                        name="username"
                                        as={Input}
                                        placeholder="Enter your username"
                                        className={errors.username && touched.username ? styles.errorBorder : ""}
                                    />
                                    <ErrorMessage name="username" component="div" className={styles.error} />
                                </Col>

                                <Col className={styles.inputContainer}>
                                    <label htmlFor="fullName" className={styles.label}>Full Name</label>
                                    <Field
                                        name="fullName"
                                        as={Input}
                                        placeholder="Enter your full name"
                                        className={errors.fullName && touched.fullName ? styles.errorBorder : ""}
                                    />
                                    <ErrorMessage name="fullName" component="div" className={styles.error} />
                                </Col>

                                <Col className={styles.inputContainer}>
                                    <label htmlFor="password" className={styles.label}>Password</label>
                                    <Field
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        as={Input.Password}
                                        placeholder="Enter your password"
                                        className={`${errors.password && touched.password ? styles.errorBorder : ""} ${styles.noBorder}`}
                                        iconRender={(visible: boolean) => visible ? <EyeOutlined onClick={togglePasswordVisibility} /> : <EyeInvisibleOutlined onClick={togglePasswordVisibility} />}
                                    />
                                    <ErrorMessage name="password" component="div" className={styles.error} />
                                </Col>


                                <Col className={styles.inputContainer}>
                                    <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
                                    <Field
                                        name="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        as={Input.Password}
                                        placeholder="Confirm your password"
                                        className={`${errors.confirmPassword && touched.confirmPassword ? styles.errorBorder : ""} ${styles.noBorder}`}
                                        iconRender={(visible:boolean) => visible ? <EyeOutlined onClick={togglePasswordVisibility} /> : <EyeInvisibleOutlined onClick={togglePasswordVisibility} />}
                                    />
                                    <ErrorMessage name="confirmPassword" component="div" className={styles.error} />
                                </Col>

                                <Col className={styles.button}>
                                    <Button type="primary" htmlType="submit" className={styles.submitButton}>
                                        {loading ? <Spin/> : "Create Account"}
                                    </Button>
                                </Col>

                                <Col className={styles.content} span={32}>
                                    - or -
                                </Col>
                                <Col className={styles.alreadyAccount}>
                                    Already have an account?
                                    <Link to="/login" className={styles.navLink}>
                                        <div className={styles.title}>Log in</div>
                                    </Link>
                                </Col>
                            </Form>
                        )}
                    </Formik>
                </Row>
            </Col>
        </Row>
    );
};

export default Register;
