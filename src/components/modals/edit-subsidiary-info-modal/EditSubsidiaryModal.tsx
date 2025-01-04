import { Modal, Form, Input, Button } from 'antd';
import { Formik } from 'formik';
import { Subsidiary, SubsidiaryUpdateRequest } from "../../../interfaces/SubsidiaryInterfaces.tsx";
import useInitialValues from "./utils/useInitialValues.tsx";
import validationSchema from "./utils/validationSchema.tsx";
import { useUpdateSubsidiaryMutation } from "../../../services/subsidiaryApi.tsx";
import { useCallback } from "react";

interface EditSubsidiaryModalProps {
    isVisible: boolean;
    onClose: () => void;
    refetch: () => void;
    subsidiary: Subsidiary | null;
}

const EditSubsidiaryModal: React.FC<EditSubsidiaryModalProps> = ({ isVisible, onClose, refetch, subsidiary }) => {
    const initialValues = useInitialValues({ subsidiary });
    const [updateSubsidiary] = useUpdateSubsidiaryMutation();

    const updateOrganization = useCallback(async (values: SubsidiaryUpdateRequest) => {
        console.log("Form Values:", values);
        if (subsidiary) {
            try {
                await updateSubsidiary({
                    values,
                    subsidiaryId: subsidiary.subsidiaryId
                }).unwrap();

                refetch();
                onClose();
            } catch (error) {
                console.error("Error updating subsidiary:", error);
            }
        }
    }, [subsidiary, updateSubsidiary, refetch, onClose]);

    return (
        <Modal
            title="Edit Subsidiary"
            open={isVisible}
            onCancel={onClose}
            footer={null}
        >
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={updateOrganization}
                validateOnBlur={true}
                validateOnChange={true}
                enableReinitialize={true}
            >
                {({ values, handleChange, handleBlur, handleSubmit, touched, errors }) => {
                    // Log errors for debugging
                    console.log("Formik Errors:", errors);

                    return (
                        <Form layout="vertical" onFinish={handleSubmit}>
                            <Form.Item label="Subsidiary Code">
                                <Input value={values.subsidiaryCode} disabled />
                            </Form.Item>

                            <Form.Item
                                label="Country"
                                help={touched.country && errors.country ? errors.country : ''}
                            >
                                <Input
                                    name="country"
                                    value={values.country}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Form.Item>

                            <Form.Item
                                label="City"
                                help={touched.city && errors.city ? errors.city : ''}
                            >
                                <Input
                                    name="city"
                                    value={values.city}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Address"
                                help={touched.address && errors.address ? errors.address : ''}
                            >
                                <Input
                                    name="address"
                                    value={values.address}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Update Subsidiary
                                </Button>
                            </Form.Item>
                        </Form>
                    );
                }}
            </Formik>
        </Modal>
    );
};

export default EditSubsidiaryModal;
