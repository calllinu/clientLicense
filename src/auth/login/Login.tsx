import { useState, useCallback, useMemo } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { Col, Row, Input, Button, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import styles from './login.module.scss';
import { Link, useNavigate } from "react-router-dom";
import { useAuthenticateUserMutation } from "../../services/userApi.tsx";
import { LoginSchema } from "./utils/validationSchema.tsx";
import { initialValues } from "./utils/initialValues.tsx";
import { Role } from "../../interfaces/Role.tsx";

interface FormValues {
    email: string;
    password: string;
}

const Login = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const [authenticateUser] = useAuthenticateUserMutation();

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    }, []);

    const memoizedInitialValues = useMemo(() => initialValues, []);
    const memoizedValidationSchema = useMemo(() => LoginSchema, []);

    const handleSubmit = useCallback(
        async (values: FormValues, { setErrors }: FormikHelpers<FormValues>) => {
            setLoading(true);
            try {
                const response = await authenticateUser({
                    email: values.email,
                    password: values.password,
                }).unwrap();
                if (response.accessToken && response.refreshToken) {
                    sessionStorage.setItem('accessToken', response.accessToken);
                    sessionStorage.setItem('refreshToken', response.refreshToken);
                    sessionStorage.setItem('role', response.role);
                    sessionStorage.setItem('userId', response.userId.toString());
                }
                if (response.role === Role.ORG_ADMIN || response.role === Role.OWNER) {
                    navigate("/dashboard");
                } else {
                    navigate("/profile");
                }
            } catch (error: unknown) {
                console.log(error);
                if (error instanceof Error) {
                    if (error.message === "User not found") {
                        setErrors({ email: "User not found. Please register." });
                    } else if (error.message === "Invalid credentials") {
                        setErrors({ password: "Invalid password. Please try again." });
                    } else {
                        console.error("Login failed:", error);
                    }
                } else {
                    console.error("Unknown error:", error);
                }
            } finally {
                setLoading(false);
            }
        },
        [authenticateUser, navigate]
    );

    return (
        <Row className={styles.container}>
            <Col
                className={styles.leftPanel}
                span={14}
                xs={0}
                sm={0}
                md={14}
                lg={14}
                xl={14}
            >
                <div className={styles.welcomeText}>Welcome Back</div>
                <div className={styles.companyText}>SafetyNet AI</div>
            </Col>
            <Col
                className={styles.rightPanel}
                span={10}
                xs={24}
                sm={24}
                md={10}
                lg={10}
                xl={10}
            >
                <Row className={styles.login} justify="center">
                    <Formik
                        initialValues={memoizedInitialValues}
                        validationSchema={memoizedValidationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched }) => (
                            <Form className={styles.formContainer}>
                                <Col className={styles.imageContainer} span={24}>
                                    <UserOutlined className={styles.iconUser} />
                                </Col>
                                <Col className={styles.inputContainer} span={24}>
                                    <label htmlFor="email" className={styles.label}>Email</label>
                                    <Field
                                        name="email"
                                        type="email"
                                        as={Input}
                                        placeholder="Enter your email"
                                        variant="borderless"
                                        className={errors.email && touched.email ? styles.errorBorder : ""}
                                    />
                                    <ErrorMessage name="email" component="div" className={styles.error} />
                                </Col>

                                <Col className={styles.inputContainer} span={24}>
                                    <label htmlFor="password" className={styles.label}>Password</label>
                                    <Field
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        as={Input.Password}
                                        placeholder="Enter your password"
                                        className={`${errors.password && touched.password ? styles.errorBorder : ""} ${styles.noBorder}`}
                                        iconRender={(visible: boolean) => visible ? <EyeOutlined onClick={togglePasswordVisibility} /> : <EyeInvisibleOutlined onClick={togglePasswordVisibility} />}
                                        variant="borderless"
                                    />
                                    <ErrorMessage name="password" component="div" className={styles.error} />
                                </Col>

                                <Col className={styles.button} span={24}>
                                    <Button type="primary" htmlType="submit" className={styles.submitButton} disabled={loading}>
                                        {loading ? <Spin /> : "Log in"}
                                    </Button>
                                </Col>

                                <Col className={styles.content} span={24}>
                                    - or -
                                </Col>
                                <Col className={styles.alreadyAccount} span={24}>
                                    Don't have an account?
                                    <Link to="/register" className={styles.navLink}>
                                        <div className={styles.title}>Sign Up</div>
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

export default Login;
