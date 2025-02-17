import React, {useCallback} from "react";
import {Field, Form, Formik} from "formik";
import {Button, Card, Col, Radio, Row, Select, Spin, Tooltip} from "antd";
import {motion} from "framer-motion";
import styles from "./survey-form.module.scss";
import {FeedbackInterface} from "../../interfaces/FeedbackInterfaces.tsx";
import {Confirmation} from "../../interfaces/enums/ConfirmationEnum.tsx";
import {Engagement} from "../../interfaces/enums/EngagementEnum.tsx";
import {initialValues} from "./utils/initialValues.tsx";
import {validationSchema} from "./utils/validationSchema.tsx";
import {WorkTime} from "../../interfaces/enums/WorktimeEnum.tsx";
import {useGetEmployeeByUserIdQuery} from "../../services/employeeApi.tsx";
import {FactorsWorkplaceSafetyInterface} from "../../interfaces/enums/FactorsWorkplaceSafetyInterface.tsx";
import {DangerTypeInterface} from "../../interfaces/enums/DangerTypeInterface.tsx";
import {useAddEmployeeFeedbackMutation} from "../../services/feedbackApi.tsx";

const SurveyForm: React.FC = () => {
    const [addEmployeeFeedback] = useAddEmployeeFeedbackMutation();

    const formatValue = (value: string): string => {
        return value
            .split('_')
            .map((word, index) => {
                if (index === 0) {
                    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                }
                return word.toLowerCase();
            })
            .join(' ');
    };

    const workTimeMap: Record<string, string> = {
        'MORE_THAN_ONE_HOUR': '>1h',
        'ONE_TWO_HOURS': '1-2h',
        'TWO_FOUR_HOURS': '2-4h',
        'FOUR_SIX_HOURS': '4-6h',
        'FULL_TIME': 'Full time',
    };

    const {
        data: employee,
        refetch,
        isLoading: isEmployeeLoading
    } = useGetEmployeeByUserIdQuery(sessionStorage.getItem('userId') as unknown as number);

    const handleSubmit = useCallback(
        async (values: FeedbackInterface) => {
            try {
                if (employee) {
                    const timeExposeDangerFormatted = (Object.keys(workTimeMap).find(key => workTimeMap[key] === values.workTime) || values.workTime) as WorkTime;
                    const formattedValues = {
                        ...values,
                        workTime: timeExposeDangerFormatted
                    };
                    await addEmployeeFeedback({
                        employeeId: employee.employee.employeeId,
                        feedback: formattedValues,
                    }).unwrap().then(() => {
                        refetch();
                    });
                }

            } catch (error) {
                console.error("Error adding feedback:", error);
            }
        },
        [addEmployeeFeedback, employee]
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
                        <Card
                            title="Thank You!"
                            bordered={false}
                            className={styles.card}
                        >
                            <p className={styles.message}>You have already completed the survey. Thank you for your
                                feedback!</p>
                        </Card>
                    </motion.div>
                </div>
            ) : (
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                >
                    <Card
                        title="Employee Safety & Satisfaction Survey"
                        bordered={false}
                        className={styles.card}
                    >
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({handleSubmit, setFieldValue, errors, touched}) => (
                                <Form onSubmit={handleSubmit} className={styles.form}>
                                    <Row gutter={[16, 24]}>
                                        <Col span={24}>
                                            <div className={styles.formItem}>
                                                <label>Is the salary satisfactory for you?</label>
                                                <Field as={Radio.Group} name="confirmationSalary">
                                                    <Radio value={Confirmation.YES}>Yes</Radio>
                                                    <Radio value={Confirmation.NO}>No</Radio>
                                                </Field>
                                                {touched.confirmationSalary && errors.confirmationSalary && (
                                                    <div className={styles.error}>{errors.confirmationSalary}</div>
                                                )}
                                            </div>
                                        </Col>

                                        <Col span={24}>
                                            <div className={styles.formItem}>
                                                <label>What type of engagement is required?</label>
                                                <Select
                                                    id="engagement"
                                                    onChange={(value) => setFieldValue("engagement", value)}
                                                >
                                                    {Object.values(Engagement).map((value) => (
                                                        <Select.Option key={value} value={value}>
                                                            {formatValue(value)}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                                {touched.engagement && errors.engagement && (
                                                    <div className={styles.error}>{errors.engagement}</div>
                                                )}
                                            </div>
                                        </Col>

                                        <Col span={24}>
                                            <div className={styles.formItem}>
                                                <label>What type of risk factors do you consider you are most exposed to
                                                    for
                                                    your activity?</label>
                                                <Select
                                                    id="dangerType"
                                                    onChange={(value) => setFieldValue("dangerType", value)}
                                                >
                                                    {Object.values(DangerTypeInterface).map((value) => (
                                                        <Select.Option key={value} value={value}>
                                                            {formatValue(value)}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                                {touched.dangerType && errors.dangerType && (
                                                    <div className={styles.error}>{errors.dangerType}</div>
                                                )}
                                            </div>
                                        </Col>

                                        <Col span={24}>
                                            <div className={styles.formItem}>
                                                <label>Do you work overtime?</label>
                                                <Field as={Radio.Group} name="confirmationOvertime">
                                                    <Radio value={Confirmation.YES}>Yes</Radio>
                                                    <Radio value={Confirmation.NO}>No</Radio>
                                                </Field>
                                                {touched.confirmationOvertime && errors.confirmationOvertime && (
                                                    <div className={styles.error}>{errors.confirmationOvertime}</div>
                                                )}
                                            </div>
                                        </Col>

                                        <Col span={24}>
                                            <div className={styles.formItem}>
                                                <label>Is the protective equipment adequate?</label>
                                                <Field as={Radio.Group} name="confirmationEquipmentAdequate">
                                                    <Radio value={Confirmation.YES}>Yes</Radio>
                                                    <Radio value={Confirmation.NO}>No</Radio>
                                                </Field>
                                                {touched.confirmationEquipmentAdequate && errors.confirmationEquipmentAdequate && (
                                                    <div
                                                        className={styles.error}>{errors.confirmationEquipmentAdequate}</div>
                                                )}
                                            </div>
                                        </Col>

                                        <Col span={24}>
                                            <div className={styles.formItem}>
                                                <label>Were safety measures applied?</label>
                                                <Field as={Radio.Group} name="confirmationSafetyMeasures">
                                                    <Radio value={Confirmation.YES}>Yes</Radio>
                                                    <Radio value={Confirmation.NO}>No</Radio>
                                                </Field>
                                                {touched.confirmationSafetyMeasures && errors.confirmationSafetyMeasures && (
                                                    <div
                                                        className={styles.error}>{errors.confirmationSafetyMeasures}</div>
                                                )}
                                            </div>
                                        </Col>

                                        <Col span={24}>
                                            <div className={styles.formItem}>
                                                <label>Are protection measures clear?</label>
                                                <Field as={Radio.Group} name="confirmationProtectionMeasures">
                                                    <Radio value={Confirmation.YES}>Yes</Radio>
                                                    <Radio value={Confirmation.NO}>No</Radio>
                                                </Field>
                                                {touched.confirmationProtectionMeasures && errors.confirmationProtectionMeasures && (
                                                    <div
                                                        className={styles.error}>{errors.confirmationProtectionMeasures}</div>
                                                )}
                                            </div>
                                        </Col>

                                        <Col span={24}>
                                            <div className={styles.formItem}>
                                                <label>How much time are you exposed to danger?</label>
                                                <Select
                                                    id="workTime"
                                                    onChange={(value) => setFieldValue("workTime", value)}
                                                >
                                                    {Object.values(WorkTime).map((value) => (
                                                        <Select.Option key={value} value={value}>
                                                            {value}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                                {touched.workTime && errors.workTime && (
                                                    <div className={styles.error}>{errors.workTime}</div>
                                                )}
                                            </div>
                                        </Col>

                                        <Col span={24}>
                                            <div className={styles.formItem}>
                                                <label>What factors do you consider to influence compliance with
                                                    workplace
                                                    safety measures?</label>
                                                <Select
                                                    id="factorsWorkplaceSafety"
                                                    onChange={(value) => setFieldValue("factorsWorkplaceSafety", value)}
                                                >
                                                    {Object.values(FactorsWorkplaceSafetyInterface).map((value) => (
                                                        <Select.Option key={value} value={value}>
                                                            {formatValue(value)}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                                {touched.factorsWorkplaceSafety && errors.factorsWorkplaceSafety && (
                                                    <div className={styles.error}>{errors.factorsWorkplaceSafety}</div>
                                                )}
                                            </div>
                                        </Col>
                                    </Row>

                                    <Tooltip
                                        title={employee?.hasNullFields && "Please fill in your profile data, or wait that other details to be filled by your Organization's Admin."}>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            className={styles.submitButton}
                                            disabled={employee?.hasNullFields}
                                        >
                                            Submit
                                        </Button>
                                    </Tooltip>
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
