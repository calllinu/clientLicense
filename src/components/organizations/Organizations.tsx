import { Row, Col, Collapse, List, Button, Space, Modal, Input, Select, Form } from 'antd';
import { useState } from 'react';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {useAddOrganizationMutation, useGetAllOrganizationsQuery} from "../../services/organizationApi.tsx";
import {Organization, OrganizationAddRequest} from "../../interfaces/OrganizationInterfaces.tsx";
import { Subsidiary } from "../../interfaces/SubsidiaryInterfaces.tsx";
import { Employee } from "../../interfaces/EmployeeInterfaces.tsx";
import { Formik } from 'formik';
import styles from './organization.module.scss';
import { validationSchema } from "./utils/validationSchema.tsx";
import { Industry } from "../../interfaces/IndustryInterfaces.tsx";
import { useInitialValuesOrganization } from "./utils/useInitialValuesOrganization.tsx";
import { OrganizationInitialValues } from "../../interfaces/OrganizationInitialValues.tsx";
import { formatIndustry } from "./utils/industryUtils.tsx";

const { Panel } = Collapse;
const { Option } = Select;

const Organizations = () => {
    const { data: organizationData } = useGetAllOrganizationsQuery();
    const [expandedSubsidiaries, setExpandedSubsidiaries] = useState<number[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const toggleSubsidiary = (id: number) => {
        setExpandedSubsidiaries((prevState) =>
            prevState.includes(id)
                ? prevState.filter((subId) => subId !== id)
                : [...prevState, id]
        );
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const [addOrganization] = useAddOrganizationMutation();

    const handleAddOrganization = async (values: OrganizationAddRequest) => {
        try {
            await addOrganization(values).unwrap();
            setIsModalVisible(false);
        } catch (error) {
            console.error("Error adding organization:", error);
        }
    };

    const initialValues = useInitialValuesOrganization();

    return (
        <Row className={styles.statisticsContent}>
            <Col span={24}>
                <Col span={24} className={styles.header}>
                    <Col><h2>Organizations SafetyNet AI</h2></Col>
                    <Col>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={showModal}
                            style={{ float: 'right' }}
                        >
                            Add Organization
                        </Button>
                    </Col>
                </Col>

                {organizationData?.length ? (
                    <Collapse>
                        {organizationData.map((org: Organization) => (
                            <Panel
                                header={
                                    <div className={styles.panelHeader}>
                                        <span>{`${org.organizationCode} - ${org.name}`}</span>
                                        <Space>
                                            <Button icon={<PlusOutlined />} onClick={() => console.log('Add subsidiary')} />
                                            <Button icon={<EditOutlined />} onClick={() => console.log('Edit organization')} />
                                            <Button icon={<DeleteOutlined />} danger onClick={() => console.log('Delete organization')} />
                                        </Space>
                                    </div>
                                }
                                key={org.organizationId}
                                className={org.organizationId % 2 === 0 ? styles.panelContent : styles.panelContentOdd}
                            >
                                <p><strong>Industry: </strong> {formatIndustry(org.industry)}</p> {/* Display formatted industry */}
                                <p><strong>Admin Email: </strong> {org.adminEmail}</p>

                                <h3>Subsidiaries</h3>
                                {org.subsidiaries.length ? (
                                    <List
                                        dataSource={org.subsidiaries}
                                        renderItem={(sub: Subsidiary) => (
                                            <List.Item
                                                className={
                                                    expandedSubsidiaries.includes(sub.subsidiaryId)
                                                        ? styles.subsidiaryExpanded
                                                        : styles.subsidiaryCollapsed
                                                }
                                            >
                                                <div className={styles.subsidiaryItem}>
                                                    <div className={styles.subsidiaryHeader}>
                                                        <div>
                                                            <p><strong>Subsidiary Code:</strong> {sub.subsidiaryCode}</p>
                                                            <p><strong>City:</strong> {sub.city}</p>
                                                            <p><strong>Street:</strong> {sub.address}</p>
                                                            <p><strong>Country:</strong> {sub.country}</p>
                                                        </div>
                                                        <Space>
                                                            <Button icon={<EditOutlined />} onClick={() => console.log('Edit subsidiary')} />
                                                            <Button icon={<DeleteOutlined />} danger onClick={() => console.log('Delete subsidiary')} />
                                                        </Space>
                                                    </div>

                                                    {expandedSubsidiaries.includes(sub.subsidiaryId) ? (
                                                        <div>
                                                            <h4>Employees</h4>
                                                            {sub.employees?.length ? (
                                                                <List
                                                                    dataSource={sub.employees}
                                                                    renderItem={(emp: Employee) => (
                                                                        <List.Item>
                                                                            <p><strong>Full Name:</strong> {emp.fullName}</p>
                                                                            <p><strong>Date of Birth:</strong> {emp.dateOfBirth?.toLocaleString()}</p>
                                                                            <p><strong>Personal ID:</strong>{emp.employeeCNP}</p>
                                                                            <p><strong>Qualification:</strong> {emp.qualification}</p>
                                                                            <p><strong>Years of Experience:</strong> {emp.yearsOfExperience}</p>
                                                                        </List.Item>
                                                                    )}
                                                                />
                                                            ) : (
                                                                <p>No employees found.</p>
                                                            )}
                                                            <Button
                                                                type="link"
                                                                onClick={() => toggleSubsidiary(sub.subsidiaryId)}
                                                            >
                                                                Hide Employees
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <Button
                                                            type="link"
                                                            onClick={() => toggleSubsidiary(sub.subsidiaryId)}
                                                        >
                                                            Show Employees
                                                        </Button>
                                                    )}
                                                </div>
                                            </List.Item>
                                        )}
                                    />
                                ) : (
                                    <p>No subsidiaries found.</p>
                                )}
                            </Panel>
                        ))}
                    </Collapse>
                ) : (
                    <p>No organizations found.</p>
                )}
            </Col>

            <Modal
                title="Add New Organization"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Formik
                    initialValues={initialValues as OrganizationInitialValues & Organization}
                    validationSchema={validationSchema}
                    onSubmit={handleAddOrganization}
                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                        <Form layout="vertical" onFinish={handleSubmit}>
                            <Form.Item
                                label="Organization Code"
                                name="organizationCode"
                                validateStatus={touched.organizationCode && errors.organizationCode ? 'error' : ''}
                                help={touched.organizationCode && errors.organizationCode}
                            >
                                <Input
                                    name="organizationCode"
                                    placeholder="Enter the organization code"
                                    value={values.organizationCode}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Organization Name"
                                name="name"
                                validateStatus={touched.name && errors.name ? 'error' : ''}
                                help={touched.name && errors.name}
                            >
                                <Input
                                    name="name"
                                    placeholder="Enter the organization name"
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Year of Establishment"
                                name="yearOfEstablishment"
                                validateStatus={touched.yearOfEstablishment && errors.yearOfEstablishment ? 'error' : ''}
                                help={touched.yearOfEstablishment && errors.yearOfEstablishment}
                            >
                                <Input
                                    name="yearOfEstablishment"
                                    placeholder="Enter the year of establishment"
                                    value={values.yearOfEstablishment}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Admin Email"
                                name="adminEmail"
                                validateStatus={touched.adminEmail && errors.adminEmail ? 'error' : ''}
                                help={touched.adminEmail && errors.adminEmail}
                            >
                                <Input
                                    name="adminEmail"
                                    placeholder="Enter the admin email"
                                    value={values.adminEmail}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Industry"
                                name="industry"
                                validateStatus={touched.industry && errors.industry ? 'error' : ''}
                                help={touched.industry && errors.industry}
                            >
                                <Select
                                    value={values.industry}
                                    onChange={(value) => handleChange({ target: { name: 'industry', value } })}
                                    onBlur={handleBlur}
                                    placeholder="Select an Industry"
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
        </Row>
    );
};

export default Organizations;
