import {Button, DatePicker, Form, Input, Modal, Select} from 'antd';
import {Formik, FormikProps} from 'formik';
import {useUpdateEmployeeMutation} from "../../../services/employeeApi.tsx";
import {useCallback, useMemo, useRef} from "react";
import {validationSchema} from "./utils/validationSchema.tsx";
import {ProfileValues} from "../../../interfaces/ProfileValues.tsx";
import useInitialValuesUpdateProfile from "./utils/useInitialValuesUpdateProfile.tsx";
import {Employee} from "../../../interfaces/EmployeeInterfaces.tsx";
import {Qualification} from "../../../interfaces/Qualification.tsx";
import {formatQualification} from "../../profile/utils/qualificationUtils.tsx";
import dayjs from "dayjs";

interface EmployeeModalProps {
    visible: boolean;
    onCancel: () => void;
    refetch: () => void;
    employee: Employee | null;
    employeeId: number;
}

const EditEmployeeModal: React.FC<EmployeeModalProps> = ({visible, onCancel, refetch, employee, employeeId}) => {
    const [updateEmployee] = useUpdateEmployeeMutation();
    const formikRef = useRef<FormikProps<ProfileValues> | null>(null);
    const initialValues = useInitialValuesUpdateProfile(employee);

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

            const employee = {
                fullName,
                dateOfBirth,
                dateOfHiring,
                employeeCNP,
                qualification,
            };

            try {
                await updateEmployee({userId: employeeId, employee}).unwrap();
                refetch();
                onCancel();
            } catch (error) {
                console.error("Error updating profile:", error);
            }
        },
        [updateEmployee, employeeId]
    );

    const handleClose = useCallback(() => {
        if (formikRef.current) {
            formikRef.current.resetForm();
        }
        onCancel();
    }, [onCancel]);

    return (
        <Modal
            title="Edit Employee Info"
            open={visible}
            onCancel={handleClose}
            footer={null}
        >
            <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
            >
                {({values, errors, touched, handleChange, handleBlur, setFieldValue, handleSubmit}) => (
                    <Form layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            label="Full Name"
                            validateStatus={touched.fullName && errors.fullName ? 'error' : ''}
                            help={touched.fullName && errors.fullName}
                        >
                            <Input
                                name="fullName"
                                placeholder="Enter full name"
                                value={values.fullName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Employee CNP"
                            validateStatus={touched.employeeCNP && errors.employeeCNP ? 'error' : ''}
                            help={touched.employeeCNP && errors.employeeCNP}
                        >
                            <Input
                                name="employeeCNP"
                                placeholder="Enter employee CNP"
                                value={values.employeeCNP}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Date of Birth"
                            validateStatus={touched.dateOfBirth && errors.dateOfBirth ? 'error' : ''}
                            help={touched.dateOfBirth && errors.dateOfBirth}
                        >
                            <DatePicker
                                name="dateOfBirth"
                                value={values.dateOfBirth ? dayjs(values.dateOfBirth) : null}
                                onChange={(date) => setFieldValue("dateOfBirth", date)}
                                format="DD-MM-YYYY"
                                style={{width: '100%'}}
                                disabledDate={(current) => current && current > dayjs().endOf("day")}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Date of Hiring"
                            validateStatus={touched.dateOfHiring && errors.dateOfHiring ? 'error' : ''}
                            help={touched.dateOfHiring && errors.dateOfHiring}
                        >
                            <DatePicker
                                name="dateOfHiring"
                                value={values.dateOfHiring ? dayjs(values.dateOfHiring) : null}
                                onChange={(date) => setFieldValue("dateOfHiring", date)}
                                format="DD-MM-YYYY"
                                style={{width: '100%'}}
                                disabledDate={(current) => current && current > dayjs().endOf("day")}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Qualification"
                            validateStatus={touched.qualification && errors.qualification ? 'error' : ''}
                            help={touched.qualification && errors.qualification}
                        >
                            <Select
                                id="qualification"
                                placeholder="Select qualification"
                                value={values.qualification}
                                onChange={(value) => setFieldValue("qualification", value)}
                            >
                                {qualificationOptions.map((option) => (
                                    <Select.Option key={option.key} value={option.key}>
                                        {option.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>


                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Edit Employee
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default EditEmployeeModal;
