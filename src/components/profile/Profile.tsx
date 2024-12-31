import { useMemo, useCallback } from "react";
import Navbar from "../nav-bar/Navbar";
import { Button, Input, Select, DatePicker, Row, Col } from "antd";
import {Formik, FormikHelpers} from "formik";
import dayjs, { Dayjs } from "dayjs";
import useLogout from "../../auth/authHooks/useLogOut";
import Footer from "../footer/Footer";
import styles from "./Profile.module.scss";
import { validationSchema } from "./utils/validationSchema";
import { Qualification } from "../../interfaces/Qualification";
import useInitialValues from "./utils/useInitialValues";
import { formatQualification } from "./utils/qualificationUtils";
import useOrgAdminRole from "../../hooks/useOrgAdminRole";
import {ProfileValues} from "../../interfaces/ProfileValues.tsx";
import {useUpdateEmployeeMutation} from "../../services/employeeApi.tsx";

const { Option } = Select;

const Profile = () => {
    const handleLogout = useLogout();
    const initialValues = useInitialValues();
   const isAdmin = useOrgAdminRole();

    const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();

    const qualificationOptions = useMemo(
        () =>
            Object.values(Qualification).map((qualification) => ({
                key: qualification,
                label: formatQualification(qualification),
            })),
        []
    );

    const userId = parseInt(sessionStorage.getItem("userId") || "0", 10);

    const handleSubmit = useCallback(
        async (values: ProfileValues, helpers: FormikHelpers<ProfileValues>) => {
            const { fullName, dateOfBirth, employeeCNP } = values;

            const employee = {
                fullName,
                dateOfBirth,
                employeeCNP,
            };

            try {
                await updateEmployee({ userId: userId, employee }).unwrap().then(() => {
                    console.log("Profile updated successfully");
                    helpers.resetForm();
                });
            } catch (error) {
                console.error("Error updating profile:", error);
            }
        },
        [updateEmployee, userId]
    );


    const formatDate = useCallback((date: Dayjs) => {
        return dayjs(date).format("DD-MM-YYYY");
    }, []);

    console.log(initialValues);

    return (
        <>
            <Navbar />
            <div className={styles.profileContainer}>
                <h1 className={styles.profileTitle}>Profile</h1>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, helpers) => handleSubmit(values, helpers)}
                    enableReinitialize
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

                                <Col span={24}>
                                    <div className={styles.formItem}>
                                        <label htmlFor="employeeCNP" className={styles.label}>
                                            Personal ID Number
                                        </label>
                                        <Input
                                            id="employeeCNP"
                                            name="employeeCNP"
                                            size="large"
                                            onChange={handleChange}
                                            value={values.employeeCNP}
                                            placeholder="Enter your personal ID number"
                                        />
                                        {errors.employeeCNP && touched.employeeCNP && (
                                            <div className={styles.error}>{errors.employeeCNP}</div>
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
                                            disabled={!isAdmin}
                                        >
                                            {qualificationOptions.map((option) => (
                                                <Option key={option.key} value={option.key}>
                                                    {option.label}
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
                                                setFieldValue("dateOfBirth", date ? formatDate(date) : "")
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
                                            value={values.yearsOfExperience}
                                            disabled
                                            size="large"
                                        />
                                    </div>
                                    {errors.yearsOfExperience && (
                                        <div className={styles.error}>{errors.yearsOfExperience}</div>
                                    )}
                                </Col>

                                <Col xs={24} md={12}>
                                    <div className={styles.formItem}>
                                        <label htmlFor="selectedOrganization" className={styles.label}>
                                            Organization
                                        </label>
                                        <Input
                                            id="selectedOrganization"
                                            name="selectedOrganization"
                                            value={values.organization}
                                            size="large"
                                            disabled
                                            placeholder="Organization name"
                                        />
                                    </div>
                                </Col>

                                <Col xs={24} md={12}>
                                    <div className={styles.formItem}>
                                        <label htmlFor="selectedSubsidiary" className={styles.label}>
                                            Subsidiary
                                        </label>
                                        <Input
                                            id="selectedSubsidiary"
                                            name="selectedSubsidiary"
                                            value={values.subsidiary}
                                            size="large"
                                            disabled
                                            placeholder="Subsidiary name"
                                        />
                                    </div>
                                </Col>
                            </Row>

                            <div className={styles.buttonsContainer}>
                                <Button
                                    type="primary"
                                    htmlType={"submit"}
                                    className={styles.submitButton}
                                    loading={isUpdating}
                                >
                                    Save Changes
                                </Button>
                                <Button
                                    type="default"
                                    onClick={handleLogout}
                                    className={styles.logoutButton}
                                >
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
