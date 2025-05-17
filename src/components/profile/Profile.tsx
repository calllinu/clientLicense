import {useCallback, useMemo, useState} from "react";
import {Avatar, Button, Card, Col, DatePicker, Divider, Input, Row, Select} from "antd";
import {Formik} from "formik";
import dayjs from "dayjs";
import styles from "./Profile.module.scss";
import {validationSchema} from "./utils/validationSchema";
import {Qualification} from "../../interfaces/enums/Qualification.tsx";
import useInitialValues from "./utils/useInitialValues";
import {formatQualification} from "./utils/qualificationUtils";
import useOrgAdminRole from "../../hooks/useOrgAdminRole";
import {ProfileValues} from "../../interfaces/ProfileValues.tsx";
import {useGetEmployeeByUserIdQuery, useUpdateEmployeeMutation} from "../../services/employeeApi.tsx";
import {UserOutlined} from "@ant-design/icons";

const {Option} = Select;

const Profile = () => {
    const userId = parseInt(sessionStorage.getItem("userId") || "0", 10);
    const {data: employeeData, refetch} = useGetEmployeeByUserIdQuery(userId);
    const initialValues = useInitialValues(employeeData?.employee);
    const isAdmin = useOrgAdminRole();

    const [updateEmployee, {isLoading: isUpdating}] = useUpdateEmployeeMutation();
    const [updateSuccess, setUpdateSuccess] = useState(false);

    const qualificationOptions = useMemo(
        () =>
            Object.values(Qualification).map((qualification) => ({
                key: qualification,
                label: formatQualification(qualification),
            })),
        []
    );

    const handleSubmit = useCallback(
        async (values: ProfileValues) => {
            const {fullName, dateOfBirth, dateOfHiring, employeeCNP, qualification} = values;
            const employee = {fullName, dateOfBirth, dateOfHiring, employeeCNP, qualification};
            try {
                await updateEmployee({userId: userId, employee}).unwrap();
                refetch();
                setUpdateSuccess(true);
                setTimeout(() => setUpdateSuccess(false), 3000);
            } catch (error) {
                console.error("Error updating profile:", error);
            }
        },
        [updateEmployee, userId]
    );

    return (
        <div className={styles.profileLayout}>
            <Card className={styles.profileCard} variant={"borderless"}>
                <Avatar size={120} icon={<UserOutlined/>} className={styles.avatar}/>
                <h2 className={styles.name}>{initialValues.fullName}</h2>
                <Divider/>
                <p><strong>Organization:</strong> {initialValues.organization}</p>
                <p><strong>Subsidiary:</strong> {initialValues.subsidiary}</p>
                <p><strong>Qualification:</strong> {formatQualification(initialValues.qualification ?? null)}</p>
                <p><strong>Experience:</strong> {initialValues.yearsOfExperience} years</p>
            </Card>

            <div className={styles.formContainer}>
                <h1 className={styles.formTitle}>Update Profile</h1>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({values, handleChange, handleSubmit, setFieldValue, touched, errors}) => (
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <label>Full Name</label>
                                    <Input name="fullName" value={values.fullName} onChange={handleChange}
                                           size="large"/>
                                    {errors.fullName && touched.fullName &&
                                        <div className={styles.error}>{errors.fullName}</div>}
                                </Col>
                                <Col span={24}>
                                    <label>Personal ID Number</label>
                                    <Input name="employeeCNP" value={values.employeeCNP} onChange={handleChange}
                                           size="large"/>
                                    {errors.employeeCNP && touched.employeeCNP &&
                                        <div className={styles.error}>{errors.employeeCNP}</div>}
                                </Col>
                                <Col span={12}>
                                    <label>Date of Birth</label>
                                    <DatePicker
                                        value={values.dateOfBirth ? dayjs(values.dateOfBirth) : null}
                                        onChange={(date) => setFieldValue("dateOfBirth", date)}
                                        format="DD-MM-YYYY"
                                        size="large"
                                        disabledDate={(current) => current && current > dayjs().endOf("day")}
                                        style={{width: "100%"}}
                                    />
                                    {errors.dateOfBirth && touched.dateOfBirth &&
                                        <div className={styles.error}>{errors.dateOfBirth}</div>}
                                </Col>
                                <Col span={12}>
                                    <label>Date of Hiring</label>
                                    <DatePicker
                                        value={values.dateOfHiring ? dayjs(values.dateOfHiring) : null}
                                        onChange={(date) => setFieldValue("dateOfHiring", date)}
                                        format="DD-MM-YYYY"
                                        size="large"
                                        disabled={!isAdmin}
                                        disabledDate={(current) => current && current > dayjs().endOf("day")}
                                        style={{width: "100%"}}
                                    />
                                    {errors.dateOfHiring && touched.dateOfHiring &&
                                        <div className={styles.error}>{errors.dateOfHiring}</div>}
                                </Col>
                                <Col span={24}>
                                    <label>Qualification</label>
                                    <Select
                                        value={values.qualification || undefined}
                                        onChange={(value) => setFieldValue("qualification", value)}
                                        size="large"
                                        disabled={!isAdmin}
                                        style={{width: "100%"}}
                                    >
                                        {qualificationOptions.map((option) => (
                                            <Option key={option.key} value={option.key}>{option.label}</Option>
                                        ))}
                                    </Select>
                                    {errors.qualification && touched.qualification &&
                                        <div className={styles.error}>{errors.qualification}</div>}
                                </Col>
                                <Col>
                                    {updateSuccess && (
                                        <div className={styles.successMessage}
                                             style={{marginBottom: 16, color: "green"}}>
                                            Your profile has been successfully updated!
                                        </div>
                                    )}
                                </Col>
                                <Col span={24}>
                                    <Button type="primary" htmlType="submit" loading={isUpdating}
                                            className={styles.submitButton}>
                                        Save Changes
                                    </Button>
                                </Col>
                            </Row>
                        </form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default Profile;