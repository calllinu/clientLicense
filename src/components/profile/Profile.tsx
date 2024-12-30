import Navbar from "../nav-bar/Navbar"; // Using updated Navbar component
import { Button, Input, Select, DatePicker, Row, Col } from "antd";
import {ErrorMessage, Formik} from "formik";
import dayjs from "dayjs";
import useLogout from "../../auth/authHooks/useLogOut.tsx";
import Footer from "../footer/Footer";
import styles from "./Profile.module.scss";
import { initialValues } from "./utils/initialValues";
import { validationSchema } from "./utils/validationSchema";
import { Qualification } from "../../interfaces/Qualification";
import {useCallback, useMemo, useState} from "react";
import {Organization} from "../../interfaces/OrganizationInterfaces.tsx";
import {useGetAllOrganizationsQuery} from "../../services/organizationApi.tsx";
import {Subsidiary} from "../../interfaces/SubsidiaryInterfaces.tsx";
import useOrgAdminRole from "../../hooks/useOrgAdminRole.tsx";

const { Option } = Select;

const Profile = () => {
    const handleLogout = useLogout();
    const [yearsOfExperience] = useState<number>(5);
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

    const formatQualification = (qualification: Qualification): string => {
        switch (qualification) {
            case Qualification.FACULTY_DEGREE:
                return "Faculty Degree";
            case Qualification.HIGH_SCHOOL:
                return "High School";
            case Qualification.PROFESSIONAL_QUALIFICATION:
                return "Professional Qualification";
            case Qualification.SEMI_QUALIFIED_WORKER:
                return "Semi Qualified Worker";
            case Qualification.WITHOUT_PROFESSIONAL_QUALIFICATION:
                return "Without Professional Qualification";
            default:
                return qualification;
        }
    };

    const handleSubmit = (values: typeof initialValues) => {
        console.log("Profile Data Submitted:", values);
    };

    const isAdmin = useOrgAdminRole();

    return (
        <>
            <Navbar />
            <div className={styles.profileContainer}>
                <h1 className={styles.profileTitle}>Profile</h1>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, handleChange, handleSubmit, setFieldValue, touched, errors }) => (
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <div className={styles.formItem}>
                                        <label htmlFor="fullName" className={styles.label}>
                                            Full Name
                                        </label>
                                        <Input
                                            id="fullName"
                                            name="fullName"
                                            size="large"
                                            onChange={handleChange}
                                            value={values.fullName}
                                            placeholder="Enter your full name"
                                        />
                                        {errors.fullName && touched.fullName && (
                                            <div className={styles.error}>{errors.fullName}</div>
                                        )}
                                    </div>
                                </Col>

                                <Col xs={24} md={24}>
                                    <div className={styles.formItem}>
                                        <label htmlFor="qualification" className={styles.label}>
                                            Qualification
                                        </label>
                                        <Select
                                            id="qualification"
                                            size="large"
                                            style={{ width: "100%" }}
                                            value={values.qualification || undefined}
                                            onChange={(value) => setFieldValue("qualification", value)}
                                            placeholder="Select your qualification"
                                        >
                                            {Object.values(Qualification).map((qualification) => (
                                                <Option key={qualification} value={qualification}>
                                                    {formatQualification(qualification)}
                                                </Option>
                                            ))}
                                        </Select>
                                        {errors.qualification && touched.qualification && (
                                            <div className={styles.error}>{errors.qualification}</div>
                                        )}
                                    </div>
                                </Col>

                                <Col xs={24} md={12}>
                                    <div className={styles.formItem}>
                                        <label htmlFor="dateOfBirth" className={styles.label}>
                                            Date of Birth
                                        </label>
                                        <DatePicker
                                            id="dateOfBirth"
                                            name="dateOfBirth"
                                            value={values.dateOfBirth ? dayjs(values.dateOfBirth) : null}
                                            onChange={(date) =>
                                                setFieldValue("dateOfBirth", date ? date.format("YYYY-MM-DD") : "")
                                            }
                                            className={styles.input}
                                            format="DD-MM-YYYY"
                                            size="large"
                                            disabledDate={(current) => current && current > dayjs().endOf("day")}
                                        />
                                        {errors.dateOfBirth && touched.dateOfBirth && (
                                            <div className={styles.error}>{errors.dateOfBirth}</div>
                                        )}
                                    </div>
                                </Col>

                                <Col xs={24} md={12}>
                                    <div className={styles.formItem}>
                                        <label htmlFor="yearsOfExperience" className={styles.label}>
                                            Years of Experience
                                        </label>
                                        <Input
                                            id="yearsOfExperience"
                                            name="yearsOfExperience"
                                            value={yearsOfExperience}
                                            disabled
                                            size="large"
                                        />
                                    </div>
                                </Col>

                                <Col xs={24} md={12}>
                                    <label htmlFor="selectedOrganization" className={styles.label}>Select Organization</label>
                                    <Select
                                        id="selectedOrganization"
                                        size="large"
                                        style={{ width: "100%" }}
                                        placeholder={<span style={{ fontSize: "1.2rem" }}>Select an organization</span>}
                                        className={`${errors.selectedOrganization && touched.selectedOrganization ? styles.errorBorder : ""} ${styles.noBorder}`}
                                        onChange={(value) => {
                                            setFieldValue("selectedOrganization", value);
                                            handleOrganizationChange(value);
                                        }}
                                        value={selectedOrganization || null}
                                        disabled={!isAdmin}
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

                                <Col xs={24} md={12}>
                                    <label htmlFor="selectedSubsidiary" className={styles.label}>Select Subsidiary</label>
                                    <Select
                                        id="selectedSubsidiary"
                                        style={{ width: "100%" }}
                                        size="large"
                                        placeholder={<span style={{ fontSize: "1.2rem" }}>Select a subsidiary</span>}
                                        className={`${errors.selectedSubsidiary && touched.selectedSubsidiary ? styles.errorBorder : ""} ${styles.noBorder}`}
                                        onChange={(value) => {
                                            setFieldValue("selectedSubsidiary", value);
                                            setSelectedSubsidiary(value);
                                        }}
                                        value={selectedSubsidiary || null}
                                        disabled={!isAdmin}
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

                                <Col span={24}>
                                    <div className={styles.formItem}>
                                        <label htmlFor="personalId" className={styles.label}>
                                            Personal ID Number
                                        </label>
                                        <Input
                                            id="personalId"
                                            name="personalId"
                                            size="large"
                                            onChange={handleChange}
                                            value={values.personalId}
                                            placeholder="Enter your personal ID number"
                                        />
                                        {errors.personalId && touched.personalId && (
                                            <div className={styles.error}>{errors.personalId}</div>
                                        )}
                                    </div>
                                </Col>
                            </Row>

                            <div className={styles.buttonsContainer}>
                                <Button type="primary" htmlType="submit" className={styles.submitButton}>
                                    Save Changes
                                </Button>
                                <Button type="default" onClick={handleLogout} className={styles.logoutButton}>
                                    Logout
                                </Button>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
            <Footer />
        </>
    );
};

export default Profile;