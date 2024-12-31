import { useState, useCallback, useMemo } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Col, Row, Input, Button, Spin, Select } from "antd";
import { EyeOutlined, EyeInvisibleOutlined, UserOutlined } from "@ant-design/icons";
import styles from './register.module.scss';
import { Link, useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "../../services/userApi.tsx";
import { useGetAllOrganizationsQuery } from "../../services/organizationApi";
import { Organization } from "../../interfaces/OrganizationInterfaces";
import { Subsidiary } from "../../interfaces/SubsidiaryInterfaces";
import { SignupSchema } from "./utils/validationSchema.tsx";
import { initialValues } from "./utils/initialValues.tsx";

export interface FormValues {
    email: string;
    username: string;
    fullName: string;
    password: string;
    confirmPassword: string;
    selectedOrganization: number | null;
    selectedSubsidiary: number | null;
}

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [createUser] = useCreateUserMutation();
    const [selectedOrganization, setSelectedOrganization] = useState<number | null>(null);
    const [selectedSubsidiary, setSelectedSubsidiary] = useState<number | null>(null);

    const { data: organizations, isError: isOrgError } = useGetAllOrganizationsQuery();

    const selectedOrganizationSubsidiaries = useMemo(() => {
        const organization = organizations?.find(
            (org: Organization) => org.organizationId === selectedOrganization
        );
        return organization?.subsidiaries || [];
    }, [selectedOrganization, organizations]);

    const handleOrganizationChange = useCallback((value: number) => {
        setSelectedOrganization(value);
        setSelectedSubsidiary(null);
    }, []);

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

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);


    return (
        <Row className={styles.container}>
            <Col xs={24} sm={24} md={10} className={styles.mainContainer}>
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
                                    <label htmlFor="selectedOrganization" className={styles.label}>Select Organization</label>
                                    <Select
                                        id="selectedOrganization"
                                        style={{ width: "100%" }}
                                        placeholder={<span style={{ fontSize: "1.2rem" }}>Select an organization</span>}
                                        className={`${errors.selectedOrganization && touched.selectedOrganization ? styles.errorBorder : ""} ${styles.noBorder}`}
                                        onChange={(value) => {
                                            setFieldValue("selectedOrganization", value);
                                            handleOrganizationChange(value);
                                        }}
                                        value={selectedOrganization || null}
                                        variant="borderless"
                                    >
                                        {isOrgError ? (
                                            <Select.Option value="" disabled>
                                                Error fetching organizations
                                            </Select.Option>
                                        ) : (
                                            organizations?.map((org: Organization) => (
                                                <Select.Option key={org.organizationId} value={org.organizationId}>
                                                    {org.name}
                                                </Select.Option>
                                            ))
                                        )}
                                    </Select>
                                    <ErrorMessage name="selectedOrganization" component="div" className={styles.error} />
                                </Col>

                                <Col className={styles.inputContainer}>
                                    <label htmlFor="selectedSubsidiary" className={styles.label}>Select Subsidiary</label>
                                    <Select
                                        id="selectedSubsidiary"
                                        style={{ width: "100%" }}
                                        placeholder={<span style={{ fontSize: "1.2rem" }}>Select a subsidiary</span>}
                                        className={`${errors.selectedSubsidiary && touched.selectedSubsidiary ? styles.errorBorder : ""} ${styles.noBorder}`}
                                        onChange={(value) => {
                                            setFieldValue("selectedSubsidiary", value);
                                            setSelectedSubsidiary(value);
                                        }}
                                        value={selectedSubsidiary || null}
                                        variant="borderless"
                                    >
                                        {selectedOrganizationSubsidiaries.length === 0 ? (
                                            <Select.Option value="" disabled>
                                                No subsidiaries available
                                            </Select.Option>
                                        ) : (
                                            selectedOrganizationSubsidiaries.map((subsidiary: Subsidiary) => (
                                                <Select.Option key={subsidiary.subsidiaryId} value={subsidiary.subsidiaryId}>
                                                    {subsidiary.address}, {subsidiary.city}, {subsidiary.country}
                                                </Select.Option>
                                            ))
                                        )}
                                    </Select>
                                    <ErrorMessage name="selectedSubsidiary" component="div" className={styles.error} />
                                </Col>

                                <Col className={styles.button}>
                                    <Button type="primary" htmlType="submit" className={styles.submitButton}>
                                        {loading ? <Spin /> : "Create Account"}
                                    </Button>
                                </Col>

                                <Col className={styles.content} span={32}>- or -</Col>
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

            <Col xs={0} sm={0} md={14} className={styles.rightContainer}>
                <Row className={styles.createAccountContainer}>
                    <div className={styles.createAccount}>Create Account</div>
                    <div className={styles.companyText}>SafetyNet AI</div>
                </Row>
            </Col>
        </Row>
    );
};

export default Register;
