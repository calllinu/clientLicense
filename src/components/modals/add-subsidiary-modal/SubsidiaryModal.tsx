import { Modal, Form, Input, Button } from 'antd';
import {Formik, FormikHelpers} from 'formik';
import { useAddSubsidiaryMutation } from "../../../services/subsidiaryApi.tsx";
import { SubsidiaryRequest } from "../../../interfaces/SubsidiaryInterfaces.tsx";
import validationSchema from "./utils/validationSchema.tsx";

interface SubsidiaryModalProps {
    isVisible: boolean;
    onClose: () => void;
    refetch: () => void;
    organizationId: number | null;
}

const SubsidiaryModal: React.FC<SubsidiaryModalProps> = ({ isVisible, onClose, refetch, organizationId }) => {
    const [addSubsidiary] = useAddSubsidiaryMutation();

    const initialValues: Omit<SubsidiaryRequest, 'organizationId'> = {
        subsidiaryCode: '',
        country: '',
        city: '',
        address: '',
    };

    const handleAddSubsidiary = async (values: Omit<SubsidiaryRequest, 'organizationId'>, actions: FormikHelpers<Omit<SubsidiaryRequest, 'organizationId'>>) => {
        if (!organizationId) return;
        try {
            await addSubsidiary({ ...values, organizationId }).unwrap();
            refetch();
            onClose();
            actions.resetForm();
        } catch (error) {
            console.error("Error adding subsidiary:", error);
        }
    };

    return (
        <Modal
            title="Add Subsidiary"
            open={isVisible}
            onCancel={onClose}
            footer={null}
        >
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleAddSubsidiary}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit}) => (
                    <Form layout="vertical" onFinish={handleSubmit}>
                        <Form.Item label="Organization ID">
                            <Input
                                name="organizationId"
                                value={organizationId ?? ''}
                                disabled
                            />
                        </Form.Item>

                        <Form.Item
                            label="Subsidiary Code"
                            validateStatus={touched.subsidiaryCode && errors.subsidiaryCode ? 'error' : ''}
                            help={touched.subsidiaryCode && errors.subsidiaryCode ? errors.subsidiaryCode : ''}
                        >
                            <Input
                                name="subsidiaryCode"
                                placeholder="Enter subsidiary code"
                                value={values.subsidiaryCode}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Country"
                            validateStatus={touched.country && errors.country ? 'error' : ''}
                            help={touched.country && errors.country ? errors.country : ''}
                        >
                            <Input
                                name="country"
                                placeholder="Enter country"
                                value={values.country}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Form.Item>

                        <Form.Item
                            label="City"
                            validateStatus={touched.city && errors.city ? 'error' : ''}
                            help={touched.city && errors.city ? errors.city : ''}
                        >
                            <Input
                                name="city"
                                placeholder="Enter city"
                                value={values.city}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Address"
                            validateStatus={touched.address && errors.address ? 'error' : ''}
                            help={touched.address && errors.address ? errors.address : ''}
                        >
                            <Input
                                name="address"
                                placeholder="Enter address"
                                value={values.address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Add Subsidiary
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default SubsidiaryModal;
