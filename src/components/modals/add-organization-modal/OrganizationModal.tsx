import { Modal, Form, Input, Button, Select } from 'antd';
import {Formik, FormikHelpers} from 'formik';
import { useAddOrganizationMutation } from "../../../services/organizationApi.tsx";
import { validationSchema } from "./utils/validationSchema.tsx";
import styles from './organization-modal.module.scss';
import { OrganizationInitialValues } from "../../../interfaces/OrganizationInitialValues.tsx";
import { Industry } from "../../../interfaces/IndustryInterfaces.tsx";
import { formatIndustry } from "./utils/industryUtils.tsx";

const { Option } = Select;

interface OrganizationModalProps {
    visible: boolean;
    onCancel: () => void;
    refetch: () => void;
}

const OrganizationModal: React.FC<OrganizationModalProps> = ({ visible, onCancel, refetch }) => {
    const [addOrganization] = useAddOrganizationMutation();
    const initialValues: OrganizationInitialValues = {
        organizationCode: '',
        name: '',
        yearOfEstablishment: '',
        industry: '',
    };

    const handleAddOrganization = async (values: OrganizationInitialValues, actions: FormikHelpers<OrganizationInitialValues>) => {
        try {
            await addOrganization(values).unwrap();
            refetch();
            onCancel();
            actions.resetForm();
        } catch (error) {
            console.error("Error adding organization:", error);
        }
    };

    return (
        <Modal
            title="Add New Organization"
            open={visible}
            onCancel={onCancel}
            footer={null}
            className={styles.modal}
        >
            <Formik
                initialValues={initialValues as OrganizationInitialValues}
                validationSchema={validationSchema}
                onSubmit={handleAddOrganization}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
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
                                onChange={(value: string) => handleChange({ target: { name: 'industry', value } })}
                            >
                                {Object.values(Industry).map((industry) => (
                                    <Option key={industry} value={industry}>
                                        {formatIndustry(industry)}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

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
