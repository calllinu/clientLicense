import { Modal, Form, Input, Button } from 'antd';
import {Formik, FormikHelpers, FormikProps} from 'formik';
import {useUpdateOrganizationMutation} from "../../../services/organizationApi.tsx";
import styles from './../add-organization-modal/organization-modal.module.scss'
import {useCallback, useRef} from "react";
import useInitialValuesEditOrganizationModal from "./utils/useInitialValues.tsx";
import {OrganizationUpdateRequest} from "../../../interfaces/OrganizationInterfaces.tsx";
import {formatIndustry} from "../add-organization-modal/utils/industryUtils.tsx";
import {validationSchema} from "./utils/validationSchema.tsx";

interface OrganizationModalProps {
    visible: boolean;
    onCancel: () => void;
    refetch: () => void;
    organization: OrganizationUpdateRequest | null;
}

const EditOrganizationModal: React.FC<OrganizationModalProps> = ({ visible, onCancel, refetch, organization }) => {
    const [updateOrganization] = useUpdateOrganizationMutation();
    const formikRef = useRef<FormikProps<OrganizationUpdateRequest> | null>(null);
    const initialValues = useInitialValuesEditOrganizationModal({ organization });

    const handleUpdateOrganization = useCallback(
        async (values: OrganizationUpdateRequest, actions: FormikHelpers<OrganizationUpdateRequest>) => {
            try {
                await updateOrganization({
                    organizationId: organization?.organizationId,
                    name: values.name,
                    yearOfEstablishment: values.yearOfEstablishment,
                }).unwrap();
                refetch();
                onCancel();
                actions.resetForm();
            } catch (error) {
                console.error("Error updating organization:", error);
            }
        },
        [updateOrganization, organization, onCancel, refetch]
    );

    const handleClose = useCallback(()  => {
        if (formikRef.current) {
            formikRef.current.resetForm();
        }
        onCancel();
    }, []);


    return (
        <Modal
            title="Edit Organization Info"
            open={visible}
            onCancel={handleClose}
            footer={null}
            className={styles.modal}
        >
            <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleUpdateOrganization}
                enableReinitialize={true}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                    <Form layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            label="Organization Id"
                            validateStatus={touched.organizationCode && errors.organizationCode ? 'error' : ''}
                            help={touched.organizationCode && errors.organizationCode}
                        >
                            <Input
                                name="organizationId"
                                placeholder="Enter organization id"
                                value={values.organizationId}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={true}
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
                        >
                            <Input
                                name="industry"
                                placeholder="Select industry"
                                value={formatIndustry(values.industry ?? null)}
                                disabled={true}
                            />
                        </Form.Item>


                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Edit Organization
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default EditOrganizationModal;
