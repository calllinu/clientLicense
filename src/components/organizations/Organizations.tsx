import { Row, Col, Button, Collapse, Space } from 'antd';
import { useState, useCallback, useMemo } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useGetAllOrganizationsQuery } from "../../services/organizationApi.tsx";
import OrganizationModal from "../modals/add-organization-modal/OrganizationModal.tsx";
import SubsidiaryModal from "../modals/add-subsidiary-modal/SubsidiaryModal.tsx";
import { OrganizationResponse } from "../../interfaces/OrganizationInterfaces.tsx";
import { formatIndustry } from "../modals/add-organization-modal/utils/industryUtils.tsx";
import SubsidiariesSection from "../subsidiary/Subsidiary.tsx";
import styles from './organization.module.scss';

const Organizations = () => {
    const { data: organizationData, refetch } = useGetAllOrganizationsQuery();
    const [isOrgModalVisible, setIsOrgModalVisible] = useState(false);
    const [isSubsidiaryModalVisible, setIsSubsidiaryModalVisible] = useState(false);
    const [currentOrganizationId, setCurrentOrganizationId] = useState<number | null>(null);

    const showOrgModal = useCallback(() => {
        setIsOrgModalVisible(true);
    }, []);

    const handleOrgCancel = useCallback(() => {
        setIsOrgModalVisible(false);
    }, []);

    const showSubsidiaryModal = useCallback((organizationId: number) => {
        setCurrentOrganizationId(organizationId);
        setIsSubsidiaryModalVisible(true);
    }, []);

    const handleSubsidiaryCancel = useCallback(() => {
        setIsSubsidiaryModalVisible(false);
        setCurrentOrganizationId(null);
    }, []);

    const organizationCollapseItems = useMemo(() => {
        return organizationData?.map((org: OrganizationResponse, index: number) => ({
            key: org.organizationId,
            label: (
                <div className={styles.panelHeader}>
                    <span>{`${org.organizationCode} - ${org.name}`}</span>
                    <Space>
                        <Button
                            icon={<PlusOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                showSubsidiaryModal(org.organizationId);
                            }}
                        />
                        <Button
                            icon={<EditOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log('Edit organization');
                            }}
                        />
                        <Button
                            icon={<DeleteOutlined />}
                            danger
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log('Delete organization');
                            }}
                        />
                    </Space>
                </div>
            ),
            children: (
                <div className={styles.industry}>
                    <div className={styles.industryInfo}>
                        <strong>Industry: </strong> {formatIndustry(org.industry)}
                    </div>
                    <div className={styles.industryInfo}>
                        <strong>Admin Name: </strong> {org.admin?.fullName}
                    </div>
                    <div className={styles.industryInfo}>
                        <strong>Admin Email: </strong> {org.admin?.email}
                    </div>

                    <h3>Subsidiaries</h3>
                    {org.subsidiaries.length ? (
                        <SubsidiariesSection subsidiaries={org.subsidiaries} />
                    ) : (
                        <p>No subsidiaries found.</p>
                    )}
                </div>
            ),
            className: index % 2 === 0 ? styles.oddCollapse : styles.evenCollapse,
        }));
    }, [organizationData, showSubsidiaryModal]);

    return (
        <Row className={styles.statisticsContent}>
            <Col span={24}>
                <Col span={24} className={styles.header}>
                    <Col><h2>Organizations SafetyNet AI</h2></Col>
                    <Col>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={showOrgModal}
                            style={{ float: 'right' }}
                        >
                            Add Organization
                        </Button>
                    </Col>
                </Col>

                {organizationData?.length ? (
                    <Collapse items={organizationCollapseItems} />
                ) : (
                    <p>No organizations found.</p>
                )}
            </Col>

            <OrganizationModal
                visible={isOrgModalVisible}
                onCancel={handleOrgCancel}
                refetch={refetch}
            />

            <SubsidiaryModal
                isVisible={isSubsidiaryModalVisible}
                onClose={handleSubsidiaryCancel}
                refetch={refetch}
                organizationId={currentOrganizationId}
            />
        </Row>
    );
};

export default Organizations;
