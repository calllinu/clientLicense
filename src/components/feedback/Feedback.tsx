import React from "react";
import {Field, Form, Formik} from "formik";
import {Button, Card, Col, Radio, Row, Select, Tooltip} from "antd";
import {motion} from "framer-motion";
import styles from "./feedback.module.scss";
import {Feedback} from "../../interfaces/FeedbackInterfaces.tsx";
import {Confirmation} from "../../interfaces/ConfirmationEnum.tsx";
import {Engagement} from "../../interfaces/EngagementEnum.tsx";
import {initialValues} from "./utils/initialValues.tsx";
import {validationSchema} from "./utils/validationSchema.tsx";
import {WorkTime} from "../../interfaces/WorktimeEnum.tsx";
import {useCheckNullFieldsQuery} from "../../services/employeeApi.tsx";

const SurveyForm: React.FC = () => {
    const handleSubmit = (values: Feedback) => {
        console.log("Form Values:", values);
    };

    const hasNullFields = useCheckNullFieldsQuery(sessionStorage.getItem('userId') as unknown as number);

    return (
        <div className={styles.surveyForm}>
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
                        {({handleSubmit, errors, touched}) => (
                            <Form onSubmit={handleSubmit} className={styles.form}>
                                <Row gutter={[16, 24]}>
                                    <Col span={24}>
                                        <div className={styles.formItem}>
                                            <label>Is the salary satisfactory for you?</label>
                                            <Field as={Radio.Group} name="confirmationSalary">
                                                <Radio value={Confirmation.YES}>{Confirmation.YES}</Radio>
                                                <Radio value={Confirmation.NO}>{Confirmation.NO}</Radio>
                                            </Field>
                                            {touched.confirmationSalary && errors.confirmationSalary && (
                                                <div className={styles.error}>{errors.confirmationSalary}</div>
                                            )}
                                        </div>
                                    </Col>

                                    <Col span={24}>
                                        <div className={styles.formItem}>
                                            <label>What type of engagement is required?</label>
                                            <Field as={Select} name="engagement">
                                                {Object.values(Engagement).map((value) => (
                                                    <Select.Option key={value} value={value}>
                                                        {value}
                                                    </Select.Option>
                                                ))}
                                            </Field>
                                            {touched.engagement && errors.engagement && (
                                                <div className={styles.error}>{errors.engagement}</div>
                                            )}
                                        </div>
                                    </Col>

                                    <Col span={24}>
                                        <div className={styles.formItem}>
                                            <label>Do you work overtime?</label>
                                            <Field as={Radio.Group} name="confirmationOvertime">
                                                <Radio value={Confirmation.YES}>{Confirmation.YES}</Radio>
                                                <Radio value={Confirmation.NO}>{Confirmation.NO}</Radio>
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
                                                <Radio value={Confirmation.YES}>{Confirmation.YES}</Radio>
                                                <Radio value={Confirmation.NO}>{Confirmation.NO}</Radio>
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
                                                <Radio value={Confirmation.YES}>{Confirmation.YES}</Radio>
                                                <Radio value={Confirmation.NO}>{Confirmation.NO}</Radio>
                                            </Field>
                                            {touched.confirmationSafetyMeasures && errors.confirmationSafetyMeasures && (
                                                <div className={styles.error}>{errors.confirmationSafetyMeasures}</div>
                                            )}
                                        </div>
                                    </Col>

                                    <Col span={24}>
                                        <div className={styles.formItem}>
                                            <label>Are protection measures clear?</label>
                                            <Field as={Radio.Group} name="confirmationProtectionMeasures">
                                                <Radio value={Confirmation.YES}>{Confirmation.YES}</Radio>
                                                <Radio value={Confirmation.NO}>{Confirmation.NO}</Radio>
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
                                            <Field as={Select} name="timeExposeDanger">
                                                {Object.values(WorkTime).map((value) => (
                                                    <Select.Option key={value} value={value}>
                                                        {value}
                                                    </Select.Option>
                                                ))}
                                            </Field>
                                            {touched.timeExposeDanger && errors.timeExposeDanger && (
                                                <div className={styles.error}>{errors.timeExposeDanger}</div>
                                            )}
                                        </div>
                                    </Col>
                                </Row>

                                <Tooltip
                                    title={hasNullFields.data ? "Please fill in your profile data, or wait that other details to be filled by your Organization's Admin." : ""}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className={styles.submitButton}
                                        disabled={hasNullFields.data}
                                    >
                                        Submit
                                    </Button>
                                </Tooltip>
                            </Form>
                        )}
                    </Formik>
                </Card>
            </motion.div>
        </div>
    );
};

export default SurveyForm;
