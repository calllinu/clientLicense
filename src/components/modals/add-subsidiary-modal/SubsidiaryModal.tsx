import {Button, Form, Input, Modal} from 'antd';
import {Formik, FormikHelpers, FormikProps} from 'formik';
import {useAddSubsidiaryMutation} from "../../../services/subsidiaryApi.tsx";
import {SubsidiaryRequest} from "../../../interfaces/SubsidiaryInterfaces.tsx";
import validationSchema from "./utils/validationSchema.tsx";
import {useCallback, useRef} from "react";

interface SubsidiaryModalProps {
    isVisible: boolean;
    onClose: () => void;
    refetch: () => void;
    organizationId?: number | null;
}

const SubsidiaryModal: React.FC<SubsidiaryModalProps> = ({isVisible, onClose, refetch, organizationId}) => {
    const [addSubsidiary] = useAddSubsidiaryMutation();
    const formikRef = useRef<FormikProps<Omit<SubsidiaryRequest, 'organizationId'>> | null>(null);

    const initialValues: Omit<SubsidiaryRequest, 'organizationId'> = {
        subsidiaryCode: '',
        country: '',
        city: '',
        address: '',
    };

    const handleAddSubsidiary = useCallback(async (
        values: Omit<SubsidiaryRequest, 'organizationId'>,
        actions: FormikHelpers<Omit<SubsidiaryRequest, 'organizationId'>>) => {
        if (!organizationId) return;
        try {
            await addSubsidiary({...values, organizationId}).unwrap();
            refetch();
            onClose();
            actions.resetForm();
        } catch (error) {
            console.error("Error adding subsidiary-section:", error);
        }
    }, [addSubsidiary, organizationId, refetch, onClose]);

    const handleClose = useCallback(() => {
        if (formikRef.current) {
            formikRef.current.resetForm();
        }
        onClose();
    }, []);


    return (
        <Modal
            title="Add Subsidiary"
            open={isVisible}
            onCancel={handleClose}
            footer={null}
        >
            <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleAddSubsidiary}
            >
                {({values, errors, touched, handleChange, handleBlur, handleSubmit}) => (
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
