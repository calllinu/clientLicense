import { Row, Col, Collapse,Button, Space, Modal, Input, Select, Form } from 'antd';
import { useState } from 'react';
import {EditOutlined, DeleteOutlined, PlusOutlined, SolutionOutlined, UserOutlined, MailOutlined} from '@ant-design/icons';
import {useAddOrganizationMutation, useGetAllOrganizationsQuery} from "../../services/organizationApi.tsx";
import {OrganizationAddRequest, OrganizationResponse} from "../../interfaces/OrganizationInterfaces.tsx";
import { Formik } from 'formik';
import styles from './organization.module.scss'
import { validationSchema } from "./utils/validationSchema.tsx";
import { Industry } from "../../interfaces/IndustryInterfaces.tsx";
import { useInitialValuesOrganization } from "./utils/useInitialValuesOrganization.tsx";
import { OrganizationInitialValues } from "../../interfaces/OrganizationInitialValues.tsx";
import { formatIndustry } from "./utils/industryUtils.tsx";
import SubsidiariesSection from "../subsidiary/Subsidiary.tsx";

const { Option } = Select;

const Organizations = () => {
    const { data: organizationData, refetch } = useGetAllOrganizationsQuery();
    const [isModalVisible, setIsModalVisible] = useState(false);

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
            refetch();
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
                    <Collapse
                        items={organizationData?.map((org: OrganizationResponse, index: number) => {
                            return {
                                key: org.organizationId,
                                label: (
                                    <div className={styles.panelHeader}>
                                        <span>
                                            {`${org.organizationCode} - ${org.name}`}
                                        </span>
                                        <Space>
                                            <Button icon={<PlusOutlined />} onClick={() => console.log('Add subsidiary')} />
                                            <Button icon={<EditOutlined />} onClick={() => console.log('Edit organization')} />
                                            <Button icon={<DeleteOutlined />} danger onClick={() => console.log('Delete organization')} />
                                        </Space>
                                    </div>
                                ),
                                children: (
                                    <div className={styles.industry}>
                                        <div className={styles.industryInfo}>
                                            <SolutionOutlined/>
                                            <strong>Industry: </strong> {formatIndustry(org.industry)}
                                        </div>
                                        <div className={styles.industryInfo}>
                                            <UserOutlined/>
                                            <strong>Admin Name: </strong> {org.admin?.fullName}
                                        </div>
                                        <div className={styles.industryInfo}>
                                            <MailOutlined/>
                                            <strong>Admin Email: </strong> {org.admin?.email}
                                        </div>

                                        <h3>Subsidiaries</h3>
                                        {org.subsidiaries.length ? (
                                            <SubsidiariesSection subsidiaries={org.subsidiaries}/>
                                        ) : (
                                            <p>No subsidiaries found.</p>
                                        )}
                                    </div>
                                ),
                                className: index % 2 === 0 ? styles.oddCollapse : styles.evenCollapse,
                            };
                        })}
                    />


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
                    initialValues={initialValues as OrganizationInitialValues & OrganizationResponse}
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
