import React, {useCallback} from "react";
import {Form, Formik} from "formik";
import {Button, Card, Col, InputNumber, Row, Select, Slider, Spin, Tooltip,} from "antd";
import {motion} from "framer-motion";
import styles from "./survey-form.module.scss";
import {FeedbackInterface} from "../../interfaces/FeedbackInterfaces.tsx";
import {useGetEmployeeByUserIdQuery} from "../../services/employeeApi.tsx";
import {useAddEmployeeFeedbackMutation} from "../../services/feedbackApi.tsx";
import {
    departmentDisplayMap,
    Departments,
    transformDepartmentValue,
} from "../../interfaces/enums/DepartmentsInterface.tsx";
import {Salary} from "../../interfaces/enums/SalaryInterface.tsx";
import {validationSchema} from "./utils/validationSchema.tsx";

const SurveyForm: React.FC = () => {
    const [addEmployeeFeedback] = useAddEmployeeFeedbackMutation();
    const {
        data: employee,
        refetch,
        isLoading: isEmployeeLoading,
    } = useGetEmployeeByUserIdQuery(
        sessionStorage.getItem("userId") as unknown as number
    );

    const handleSubmit = useCallback(
        async (values: FeedbackInterface) => {
            try {
                if (employee) {
                    const formattedValues = {
                        ...values,
                        satisfactionLevel: values.satisfactionLevel
                            ? Number((values.satisfactionLevel / 10).toFixed(2))
                            : undefined,
                        lastEvaluation: values.lastEvaluation
                            ? Number((values.lastEvaluation / 10).toFixed(2))
                            : undefined,
                        promotionLast5years: values.promotionLast5years === 1 ? 1 : 0,
                        workAccident: values.workAccident === 1 ? 1 : 0,
                        department: transformDepartmentValue(
                            values.department as Departments
                        ),
                        salary: values.salary?.toLowerCase(),
                    };

                    await addEmployeeFeedback({
                        employeeId: employee.employee.employeeId,
                        feedback: formattedValues,
                    })
                        .unwrap()
                        .then(() => {
                            refetch();
                        });
                }
            } catch (error) {
                console.error("Error adding feedback:", error);
            }
        },
        [addEmployeeFeedback, employee, refetch]
    );

    if (isEmployeeLoading) {
        return (
            <div className={styles.surveyForm}>
                <Spin size="large" className={styles.spinner}/>
            </div>
        );
    }

    return (
        <div className={styles.surveyForm}>
            {employee?.employee.feedback ? (
                <div className={styles.thankYouMessage}>
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5}}
                    >
                        <Card title="Thank You!" className={styles.card}>
                            <p className={styles.message}>
                                You have already completed the survey. Thank you for your
                                feedback!
                            </p>
                        </Card>
                    </motion.div>
                </div>
            ) : (
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                >
                    <Card title="Employee Feedback Survey" variant={"borderless"} className={styles.card}>
                        <Formik
                            initialValues={{} as FeedbackInterface}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                            validateOnChange={true}
                            validateOnBlur={true}
                            validateOnMount={true}
                        >
                            {({handleSubmit, setFieldValue, values, errors, touched, isValid}) => (
                                <Form onSubmit={handleSubmit} className={styles.form}>
                                    <Row gutter={[16, 24]}>
                                        <Col span={24}>
                                            <label>How satisfied are you with your job?</label>
                                            <Slider
                                                min={0}
                                                max={10}
                                                step={0.1}
                                                value={values.satisfactionLevel}
                                                onChange={(val) => setFieldValue("satisfactionLevel", val)}
                                            />
                                            <InputNumber
                                                min={0}
                                                max={10}
                                                step={0.1}
                                                value={values.satisfactionLevel}
                                                name="satisfactionLevel"
                                                onChange={(val) => setFieldValue("satisfactionLevel", val)}
                                                style={{marginLeft: 16}}
                                                type={"number"}
                                            />
                                            {touched.satisfactionLevel && errors.satisfactionLevel && (
                                                <div className={styles.error}>{errors.satisfactionLevel}</div>
                                            )}
                                        </Col>

                                        <Col span={24}>
                                            <label>What was your score on your last performance evaluation?</label>
                                            <Slider
                                                min={0}
                                                max={10}
                                                step={0.1}
                                                value={values.lastEvaluation}
                                                onChange={(val) => setFieldValue("lastEvaluation", val)}
                                            />
                                            <InputNumber
                                                min={0}
                                                max={10}
                                                step={0.1}
                                                value={values.lastEvaluation}
                                                onChange={(val) => setFieldValue("lastEvaluation", val)}
                                                style={{marginLeft: 16}}
                                                type={"number"}
                                            />
                                            {touched.lastEvaluation && errors.lastEvaluation && (
                                                <div className={styles.error}>{errors.lastEvaluation}</div>
                                            )}
                                        </Col>

                                        <Col span={24}>
                                            <label>How many projects are you currently working on?</label>
                                            <InputNumber
                                                min={0}
                                                value={values.numberProject}
                                                name={"numberProject"}
                                                onChange={(val) => setFieldValue("numberProject", val)}
                                                style={{width: "100%"}}
                                                type={"number"}
                                            />
                                            {touched.numberProject && errors.numberProject && (
                                                <div className={styles.error}>{errors.numberProject}</div>
                                            )}
                                        </Col>

                                        <Col span={24}>
                                            <label>How many hours do you work per month on average?</label>
                                            <InputNumber
                                                min={0}
                                                value={values.averageMonthlyHours}
                                                onChange={(val) => setFieldValue("averageMonthlyHours", val)}
                                                style={{width: "100%"}}
                                                type={"number"}
                                            />
                                            {touched.averageMonthlyHours && errors.averageMonthlyHours && (
                                                <div className={styles.error}>{errors.averageMonthlyHours}</div>
                                            )}
                                        </Col>

                                        <Col span={24}>
                                            <label>How many years have you been with the company?</label>
                                            <InputNumber
                                                min={0}
                                                value={values.timeSpendCompany}
                                                onChange={(val) => setFieldValue("timeSpendCompany", val)}
                                                style={{width: "100%"}}
                                                type={"number"}
                                            />
                                            {touched.timeSpendCompany && errors.timeSpendCompany && (
                                                <div className={styles.error}>{errors.timeSpendCompany}</div>
                                            )}
                                        </Col>
                                    </Row>

                                    <Row gutter={[16, 24]} style={{marginTop: 24}}>
                                        <Col span={24}>
                                            <label>Have you been promoted in the last 5 years?</label>
                                            <Select
                                                onChange={(val) =>
                                                    setFieldValue("promotionLast5years", parseInt(val))
                                                }
                                                style={{width: "100%"}}
                                                value={values.promotionLast5years?.toString()}
                                            >
                                                <Select.Option value="1">Yes</Select.Option>
                                                <Select.Option value="0">No</Select.Option>
                                            </Select>
                                            {touched.promotionLast5years && errors.promotionLast5years && (
                                                <div className={styles.error}>{errors.promotionLast5years}</div>
                                            )}
                                        </Col>

                                        <Col span={24}>
                                            <label>Have you ever had a work-related accident?</label>
                                            <Select
                                                onChange={(val) =>
                                                    setFieldValue("workAccident", parseInt(val))
                                                }
                                                style={{width: "100%"}}
                                                value={values.workAccident?.toString()}
                                            >
                                                <Select.Option value="1">Yes</Select.Option>
                                                <Select.Option value="0">No</Select.Option>
                                            </Select>
                                            {touched.workAccident && errors.workAccident && (
                                                <div className={styles.error}>{errors.workAccident}</div>
                                            )}
                                        </Col>

                                        <Col span={24}>
                                            <label>Which department do you work in?</label>
                                            <Row>
                                                <Select
                                                    onChange={(val) => setFieldValue("department", val)}
                                                    value={values.department}
                                                    style={{width: "100%"}}
                                                >
                                                    {Object.keys(departmentDisplayMap).map((key) => (
                                                        <Select.Option key={key} value={key}>
                                                            {departmentDisplayMap[key]}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                                {touched.department && errors.department && (
                                                    <div className={styles.error}>{errors.department}</div>
                                                )}
                                            </Row>
                                        </Col>

                                        <Col span={24}>
                                            <label>How would you describe your salary level?</label>
                                            <Select
                                                onChange={(val) => setFieldValue("salary", val)}
                                                value={values.salary}
                                                style={{width: "100%"}}
                                            >
                                                {Object.values(Salary).map((val) => (
                                                    <Select.Option key={val.toLowerCase()} value={val.toLowerCase()}>
                                                        {val}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                            {touched.salary && errors.salary && (
                                                <div className={styles.error}>{errors.salary}</div>
                                            )}
                                        </Col>
                                    </Row>
                                    <Col className={styles.submitContainer} span={24}>
                                        <Tooltip
                                            title={
                                                !isValid
                                                    ? "Please complete all required fields in the survey."
                                                    : employee?.hasNullFields
                                                        ? "Please fill in your profile data, or wait for it to be filled by your Organization's Admin."
                                                        : ""
                                            }
                                        >
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                className={styles.submitButton}
                                                disabled={!isValid || employee?.hasNullFields}
                                            >
                                                Submit
                                            </Button>
                                        </Tooltip>
                                    </Col>
                                </Form>
                            )}
                        </Formik>
                    </Card>
                </motion.div>
            )}
        </div>
    );
};

export default SurveyForm;
