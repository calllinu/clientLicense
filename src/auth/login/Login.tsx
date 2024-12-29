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
                }
                navigate("/");
            } catch (error: unknown) {
                console.log(error)
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
            <Col className={styles.mainContainer} span={24}>
                <Row>
                    <Col className={styles.logIn}>Welcome Back</Col>
                    <Formik
                        initialValues={memoizedInitialValues}  // Use memoized initial values
                        validationSchema={memoizedValidationSchema}  // Use memoized validation schema
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched }) => (
                            <Form className={styles.formContainer}>
                                <Col className={styles.imageContainer}>
                                    <UserOutlined className={styles.iconUser} />
                                </Col>
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

                                <Col className={styles.button}>
                                    <Button type="primary" htmlType="submit" className={styles.submitButton} disabled={loading}>
                                        {loading ? <Spin /> : "Log in"}
                                    </Button>
                                </Col>

                                <Col className={styles.content} span={32}>
                                    - or -
                                </Col>
                                <Col className={styles.alreadyAccount}>
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
