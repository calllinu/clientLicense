import { useState } from "react";
import { Button, Input, Select, DatePicker, Row, Col } from "antd";
import dayjs from "dayjs";
import { Formik } from "formik";
import useLogout from "../../auth/authHooks/useLogOut.tsx";
import Navbar from "../nav-bar/Navbar.tsx";
import Footer from "../footer/Footer.tsx";
import styles from './Profile.module.scss';
import { initialValues } from "./utils/initialValues.tsx";
import { validationSchema } from "./utils/validationSchema.tsx";
import {Qualification} from "../../interfaces/Qualification.tsx";


const { Option } = Select;

const Profile = () => {
    const handleLogout = useLogout();
    const [yearsOfExperience] = useState<number>(5);

    const formatQualification = (qualification: Qualification): string => {
        switch (qualification) {
            case Qualification.FACULTY_DEGREE:
                return 'Faculty Degree';
            case Qualification.HIGH_SCHOOL:
                return 'High School';
            case Qualification.PROFESSIONAL_QUALIFICATION:
                return 'Professional Qualification';
            case Qualification.SEMI_QUALIFIED_WORKER:
                return 'Semi Qualified Worker';
            case Qualification.WITHOUT_PROFESSIONAL_QUALIFICATION:
                return 'Without Professional Qualification';
            default:
                return qualification;
        }
    };

    const handleSubmit = (values: typeof initialValues) => {
        console.log("Profile Data Submitted:", values);
    };

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
                            <Row gutter={16}>
                                <Col span={24}>
                                    <div className={styles.formItem}>
                                        <label htmlFor="fullName" className={styles.label}>Full Name</label>
                                        <Input
                                            id="fullName"
                                            name="fullName"
                                            size={"large"}
                                            onChange={handleChange}
                                            value={values.fullName}
                                            placeholder="Enter your full name"
                                        />
                                        {errors.fullName && touched.fullName &&
                                            <div className={styles.error}>{errors.fullName}</div>}
                                    </div>
                                </Col>

                                <Col span={12}>
                                    <div className={styles.formItem}>
                                        <label htmlFor="qualification" className={styles.label}>Qualification</label>
                                        <Select
                                            className={styles.select}
                                            id="qualification"
                                            size={"large"}
                                            value={values.qualification || ""}
                                            onChange={(value) => setFieldValue('qualification', value)}
                                            placeholder="Select your qualification"
                                        >
                                            {Object.values(Qualification).map((qualification) => (
                                                <Option key={qualification} value={qualification}>
                                                    {formatQualification(qualification)}
                                                </Option>
                                            ))}
                                        </Select>
                                        {errors.qualification && touched.qualification &&
                                            <div className={styles.error}>{errors.qualification}</div>}
                                    </div>
                                </Col>

                                <Col span={12}>
                                    <div className={styles.formItem}>
                                        <label htmlFor="yearsOfExperience" className={styles.label}>Years of
                                            Experience</label>
                                        <Input
                                            id="yearsOfExperience"
                                            name="yearsOfExperience"
                                            value={yearsOfExperience}
                                            disabled
                                            size={"large"}
                                        />
                                    </div>
                                </Col>

                                <Col span={24}>
                                    <div className={styles.formItem}>
                                        <label htmlFor="dateOfBirth" className={styles.label}>Date of Birth</label>
                                        <DatePicker
                                            id="dateOfBirth"
                                            name="dateOfBirth"
                                            value={values.dateOfBirth ? dayjs(values.dateOfBirth) : null}
                                            onChange={(date) => setFieldValue('dateOfBirth', date ? date.format("YYYY-MM-DD") : '')}
                                            className={styles.input}
                                            format="DD-MM-YYYY"
                                            size={"large"}
                                            disabledDate={(current) => current && current > dayjs().endOf("day")}
                                        />
                                        {errors.dateOfBirth && touched.dateOfBirth &&
                                            <div className={styles.error}>{errors.dateOfBirth}</div>}
                                    </div>
                                </Col>

                                <Col span={24}>
                                    <div className={styles.formItem}>
                                        <label htmlFor="personalId" className={styles.label}>Personal ID Number</label>
                                        <Input
                                            id="personalId"
                                            name="personalId"
                                            size={"large"}
                                            onChange={handleChange}
                                            value={values.personalId}
                                            placeholder="Enter your personal ID number"
                                        />
                                        {errors.personalId && touched.personalId &&
                                            <div className={styles.error}>{errors.personalId}</div>}
                                    </div>
                                </Col>
                            </Row>
                            <div className={styles.buttonsContainer}>
                                <Button type="primary" className={styles.submitButton}>
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
            <Footer/>
        </>
    );
};

export default Profile;
