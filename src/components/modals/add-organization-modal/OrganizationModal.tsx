import {Button, Col, Form, Input, Modal, Select} from 'antd';
import {Formik, FormikHelpers, FormikProps} from 'formik';
import {useAddOrganizationMutation} from "../../../services/organizationApi.tsx";
import {validationSchema} from "./utils/validationSchema.tsx";
import styles from './organization-modal.module.scss';
import {OrganizationInitialValues} from "../../../interfaces/OrganizationInitialValues.tsx";
import {Industry} from "../../../interfaces/enums/IndustryInterfaces.tsx";
import {useCallback, useMemo, useRef, useState} from "react";
import {transformData} from "../../../interfaces/TransformData.tsx";

const {Option} = Select;

interface OrganizationModalProps {
    visible: boolean;
    onCancel: () => void;
    refetch: () => void;
}

const OrganizationModal: React.FC<OrganizationModalProps> = ({visible, onCancel, refetch}) => {
    const [addOrganization] = useAddOrganizationMutation();
    const formikRef = useRef<FormikProps<OrganizationInitialValues> | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);

    const initialValues = useMemo((): OrganizationInitialValues => ({
        organizationCode: '',
        name: '',
        yearOfEstablishment: '',
        industry: '',
    }), []);

    const handleAddOrganization = useCallback(
        async (values: OrganizationInitialValues, actions: FormikHelpers<OrganizationInitialValues>) => {
            setServerError(null);
            try {
                await addOrganization(values).unwrap();
                refetch();
                onCancel();
                actions.resetForm({values: initialValues});
            } catch (error) {
                console.error("Error adding organization:", error);
                setServerError("Error adding organization, unique organization code needed");
            }
        },
        [addOrganization, onCancel, refetch]
    );

    const industryOptions = useMemo(() => (
        Object.values(Industry).map((industry) => (
            <Option key={industry} value={industry}>
                {transformData(industry)}
            </Option>
        ))
    ), []);

    const handleClose = useCallback(() => {
        if (formikRef.current) {
            formikRef.current.resetForm();
        }
        onCancel();
        setServerError(null);
    }, [onCancel, initialValues]);


    return (
        <Modal
            key={visible ? "open" : "closed"}
            title="Add New Organization"
            open={visible}
            onCancel={handleClose}
            footer={null}
            className={styles.modal}
        >
            <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleAddOrganization}
            >
                {({values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue}) => (
                    <Form layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            label="Organization Code"
                            validateStatus={touched.organizationCode && errors.organizationCode ? 'error' : ''}
                            help={touched.organizationCode && errors.organizationCode}
                        >
                            <Input
                                name="organizationCode"
                                placeholder="Enter organization code"
                                value={values.organizationCode}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Organization Name"
                            validateStatus={touched.name && errors.name ? 'error' : ''}
                            help={touched.name && errors.name}
                        >
                            <Input
                                name="name"
                                placeholder="Enter organization name"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Year of Establishment"
                            validateStatus={touched.yearOfEstablishment && errors.yearOfEstablishment ? 'error' : ''}
                            help={touched.yearOfEstablishment && errors.yearOfEstablishment}
                        >
                            <Input
                                name="yearOfEstablishment"
                                placeholder="Enter year of establishment"
                                value={values.yearOfEstablishment}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Industry"
                            validateStatus={touched.industry && errors.industry ? 'error' : ''}
                            help={touched.industry && errors.industry}
                            name="industry"
                        >
                            <Select
                                placeholder="Select an industry"
                                value={values.industry}
                                onChange={(value) => setFieldValue("industry", value)}
                                allowClear
                            >
                                {industryOptions}
                            </Select>
                        </Form.Item>

                        <Col className={styles.errorColumn}>
                            {serverError && <div className={styles.error}>{serverError}</div>}
                        </Col>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Add Organization
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default OrganizationModal;
