import {useCallback, useMemo, useState} from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Button, Col, Input, Row, Spin} from "antd";
import {EyeInvisibleOutlined, EyeOutlined, UserOutlined} from "@ant-design/icons";
import styles from './login.module.scss';
import {Link, useNavigate} from "react-router-dom";
import {useAuthenticateUserMutation} from "../../services/userApi.tsx";
import {LoginSchema} from "./utils/validationSchema.tsx";
import {initialValues} from "./utils/initialValues.tsx";
import {Role} from "../../interfaces/enums/RoleEnum.tsx";

interface FormValues {
    email: string;
    password: string;
}

const Login = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const [authenticateUser] = useAuthenticateUserMutation();
    const [serverError, setServerError] = useState<string | null>(null);
    const togglePasswordVisibility = useCallback(() => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    }, []);

    const memoizedInitialValues = useMemo(() => initialValues, []);
    const memoizedValidationSchema = useMemo(() => LoginSchema, []);

    const handleSubmit = useCallback(
        async (values: FormValues) => {
            setLoading(true);
            setServerError(null);
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
                if (response.role === Role.ORG_ADMIN || response.role === Role.OWNER || response.role === Role.EMPLOYEE) {
                    navigate("/dashboard");
                }
            } catch (error) {
                console.log(error);
                setServerError("Invalid email or password");
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
                        {({errors, touched}) => (
                            <Form className={styles.formContainer}>
                                <Col className={styles.imageContainer} span={24}>
                                    <UserOutlined className={styles.iconUser}/>
                                </Col>
                                <Col className={styles.inputContainer} span={24}>
                                    <label htmlFor="email" className={styles.label}>Email</label>
                                    <Field
                                        name="email"
                                        type="email"
                                        as={Input}
                                        placeholder="Enter your email"
                                        variant="borderless"
                                        size="large"
                                        className={errors.email && touched.email ? styles.errorBorder : ""}
                                    />
                                    <ErrorMessage name="email" component="div" className={styles.error}/>
                                </Col>

                                <Col className={styles.inputContainer} span={24}>
                                    <label htmlFor="password" className={styles.label}>Password</label>
                                    <Field
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        as={Input.Password}
                                        size="large"
                                        placeholder="Enter your password"
                                        className={`${errors.password && touched.password ? styles.errorBorder : ""} ${styles.noBorder}`}
                                        iconRender={(visible: boolean) => visible ?
                                            <EyeOutlined onClick={togglePasswordVisibility}/> :
                                            <EyeInvisibleOutlined onClick={togglePasswordVisibility}/>}
                                        variant="borderless"
                                    />
                                    <ErrorMessage name="password" component="div" className={styles.error}/>
                                </Col>

                                <Col className={styles.errorColumn}>
                                    {serverError && <div className={styles.error}>{serverError}</div>}
                                </Col>

                                <Col className={styles.button} span={24}>
                                    <Button type="primary" htmlType="submit" className={styles.submitButton}
                                            disabled={loading}>
                                        {loading ? <Spin/> : "Log in"}
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
