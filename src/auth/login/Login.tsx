import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Col, Row, Input, Button, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import styles from './login.module.scss';
import { Link, useNavigate } from "react-router-dom";
import { useAuthenticateUserMutation } from "../../services/userApi.tsx";

interface FormValues {
    email: string;
    password: string;
}

const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Required"),
});

const Login: React.FC = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const [authenticateUser] = useAuthenticateUserMutation();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const initialValues: FormValues = {
        email: "",
        password: "",
    };

    const handleSubmit = async (values: FormValues) => {
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
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <Row className={styles.container}>
            <Col className={styles.mainContainer} span={24}>
                <Row>
                    <Col className={styles.logIn}>Welcome Back</Col>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={LoginSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched }) => (
                            <Form className={styles.formContainer}>
                                <Col className={styles.imageContainer}><UserOutlined className={styles.iconUser} /></Col>
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
