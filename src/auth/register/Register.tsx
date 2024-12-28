import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Col, Row, Input, Button, Spin, Select } from "antd";
import { EyeOutlined, EyeInvisibleOutlined, UserOutlined } from "@ant-design/icons";
import styles from './register.module.scss';
import { Link, useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "../../services/userApi.tsx";
import { useGetAllOrganizationsQuery } from "../../services/organizationApi";
import {Organization, Subsidiary} from "../../interfaces/OrganizationInterfaces";

interface FormValues {
    email: string;
    username: string;
    fullName: string;
    password: string;
    confirmPassword: string;
    selectedOrganization: string;
    selectedSubsidiary: number | null;
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
    selectedOrganization: Yup.string().required("Please select an organization"),
    selectedSubsidiary: Yup.string().required("Please select a subsidiary"),
});

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [createUser] = useCreateUserMutation();
    const { data: organizations, isError } = useGetAllOrganizationsQuery();

    const [selectedOrganization, setSelectedOrganization] = useState<string>("");
    const [selectedSubsidiary, setSelectedSubsidiary] = useState<number | null>(null);
    const [subsidiaries, setSubsidiaries] = useState<Subsidiary[]>([]);

    const handleSubmit = async (values: FormValues, { resetForm }: { resetForm: () => void }) => {
        setLoading(true);
        try {
            await createUser({
                username: values.username,
                email: values.email,
                fullName: values.fullName,
                password: values.password,
                subsidiaryId: values.selectedSubsidiary,
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
        selectedOrganization: "",
        selectedSubsidiary: null,
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
                        {({ errors, touched, setFieldValue }) => (
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
                                        iconRender={(visible: boolean) => visible ? <EyeOutlined onClick={togglePasswordVisibility} /> : <EyeInvisibleOutlined onClick={togglePasswordVisibility} />}
                                    />
                                    <ErrorMessage name="confirmPassword" component="div" className={styles.error} />
                                </Col>

                                <Col className={styles.inputContainer}>
                                    <label htmlFor="selectedOrganization" className={styles.label}>
                                        Select Organization
                                    </label>
                                    <Select
                                        id="selectedOrganization"
                                        style={{
                                            width: "100%"
                                        }}
                                        placeholder={<span style={{ fontSize: "1.2rem" }}>Select an organization</span>}
                                        className={`${errors.selectedOrganization && touched.selectedOrganization ? styles.errorBorder : ""}`}
                                        onChange={(value: string) => {
                                            setFieldValue("selectedOrganization", value).then(() => {
                                                setSelectedOrganization(value);
                                                setSubsidiaries(organizations?.find((org: Organization) => org.name === value)?.subsidiaries || []);
                                            });
                                        }}
                                        value={selectedOrganization || null}
                                        variant="borderless"
                                    >
                                        {isError ? (
                                            <Select.Option value="" disabled>
                                                Error fetching organizations
                                            </Select.Option>
                                        ) : (
                                            organizations?.map((org: Organization) => (
                                                <Select.Option key={org.id} value={org.name}>
                                                    {org.name}
                                                </Select.Option>
                                            ))
                                        )}
                                    </Select>
                                    {errors.selectedOrganization && touched.selectedOrganization && (
                                        <div className={styles.error}>{errors.selectedOrganization}</div>
                                    )}
                                </Col>

                                <Col className={styles.inputContainer}>
                                    <label htmlFor="selectedSubsidiary" className={styles.label}>
                                        Select Subsidiary
                                    </label>
                                    <Select
                                        id="selectedSubsidiary"
                                        style={{
                                            width: "100%"
                                        }}
                                        placeholder={<span style={{ fontSize: "1.2rem" }}>Select an subsidiary</span>}
                                        className={`${errors.selectedSubsidiary && touched.selectedSubsidiary ? styles.errorBorder : ""}`}
                                        onChange={(value: number) => {
                                            setFieldValue("selectedSubsidiary", value).then(() => {
                                                setSelectedSubsidiary(value);
                                            });
                                        }}
                                        value={selectedSubsidiary || null}
                                        variant="borderless"
                                    >
                                        {isError ? (
                                            <Select.Option value="" disabled>
                                                Error fetching organizations
                                            </Select.Option>
                                        ) : (
                                            subsidiaries.map((subsidiary: Subsidiary) => (
                                                <Select.Option key={subsidiary.id} value={subsidiary.id}>
                                                    {subsidiary.address}, {subsidiary.city}, {subsidiary.country}
                                                </Select.Option>

                                            ))
                                        )}
                                    </Select>
                                    {errors.selectedOrganization && touched.selectedOrganization && (
                                        <div className={styles.error}>{errors.selectedOrganization}</div>
                                    )}
                                </Col>

                                <Col className={styles.button}>
                                    <Button type="primary" htmlType="submit" className={styles.submitButton}>
                                        {loading ? <Spin /> : "Create Account"}
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
