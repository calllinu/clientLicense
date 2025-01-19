import {Button, Col, Collapse, Pagination, Row, Space} from 'antd';
import {useCallback, useMemo, useState} from 'react';
import {
    DeleteOutlined,
    EditOutlined,
    MailOutlined,
    NodeIndexOutlined,
    PartitionOutlined,
    PlusOutlined,
    UserOutlined
} from '@ant-design/icons';
import {useGetAllOrganizationsQuery, useRemoveOrganizationMutation} from "../../services/organizationApi.tsx";
import OrganizationModal from "../modals/add-organization-modal/OrganizationModal.tsx";
import SubsidiaryModal from "../modals/add-subsidiary-modal/SubsidiaryModal.tsx";
import {OrganizationResponse, OrganizationUpdateRequest} from "../../interfaces/OrganizationInterfaces.tsx";
import {formatIndustry} from "../modals/add-organization-modal/utils/industryUtils.tsx";
import SubsidiariesSection from "../subsidiary/Subsidiary.tsx";
import styles from './organization.module.scss';
import ConfirmDeleteModal from "../modals/confirm-delete-modal/ConfirmDeleteModal.tsx";
import EditOrganizationModal from "../modals/edit-organization-info-modal/EditOrganizationModal.tsx";

const Organizations = () => {
    const [pagination, setPagination] = useState({current: 1, pageSize: 20});

    const {data: organizationData, refetch} = useGetAllOrganizationsQuery({
        page: pagination.current - 1,
        size: pagination.pageSize,
    });

    console.log(organizationData)

    const [removeOrganization] = useRemoveOrganizationMutation();
    const [isOrgModalVisible, setIsOrgModalVisible] = useState(false);
    const [isSubsidiaryModalVisible, setIsSubsidiaryModalVisible] = useState(false);
    const [isEditOrganizationModalVisible, setIsEditOrganizationModalVisible] = useState(false);
    const [currentOrganizationId, setCurrentOrganizationId] = useState<number | null>(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [organizationToDelete, setOrganizationToDelete] = useState<OrganizationResponse | null>(null);
    const [organizationToEdit, setOrganizationToEdit] = useState<OrganizationUpdateRequest | null>(null);

    const showOrgModal = useCallback(() => {
        setIsOrgModalVisible(true);
    }, []);

    const mapToOrganizationUpdateRequest = (organization: OrganizationResponse): OrganizationUpdateRequest => ({
        organizationId: organization.organizationId,
        name: organization.name,
        yearOfEstablishment: organization.yearOfEstablishment,
        industry: organization.industry,
    });

    const showEditOrgModal = useCallback(
        (organization: OrganizationResponse) => {
            const organizationToEdit = mapToOrganizationUpdateRequest(organization);
            setOrganizationToEdit(organizationToEdit);
            setIsEditOrganizationModalVisible(true);
        },
        []
    );

    const handleOrgCancel = useCallback(() => {
        setIsOrgModalVisible(false);
        setIsEditOrganizationModalVisible(false);
    }, []);

    const showSubsidiaryModal = useCallback((organizationId: number) => {
        setCurrentOrganizationId(organizationId);
        setIsSubsidiaryModalVisible(true);
    }, []);

    const handleSubsidiaryCancel = useCallback(() => {
        setIsSubsidiaryModalVisible(false);
        setCurrentOrganizationId(null);
    }, []);

    const handleDeleteOrganization = useCallback(
        (organizationId: string) => {
            removeOrganization(organizationId)
                .unwrap()
                .then(() => {
                    refetch();
                    setIsDeleteModalVisible(false);
                });
        },
        [removeOrganization, refetch]
    );

    const handleDeleteClick = useCallback(
        (organization: OrganizationResponse) => {
            setOrganizationToDelete(organization);
            setIsDeleteModalVisible(true);
        },
        []
    );

    const organizationCollapseItems = useMemo(() => {
        return organizationData?.data?.map((org: OrganizationResponse, index: number) => ({
            key: org.organizationId,
            label: (
                <div className={styles.panelHeader}>
                    <span>{`${org.organizationCode} - ${org.name}`}</span>
                    <Space>
                        <Button
                            icon={<PlusOutlined/>}
                            onClick={(e) => {
                                e.stopPropagation();
                                showSubsidiaryModal(org.organizationId);
                            }}
                        />
                        <Button
                            icon={<EditOutlined/>}
                            onClick={(e) => {
                                e.stopPropagation();
                                showEditOrgModal(org);
                            }}
                        />
                        <Button
                            icon={<DeleteOutlined/>}
                            danger
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(org);
                            }}
                        />
                    </Space>
                </div>
            ),
            children: (
                <div className={styles.industry}>
                    <div className={styles.industryInfo}>
                        <PartitionOutlined/>
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
                    <div className={styles.industryInfo}>
                        <NodeIndexOutlined/>
                        <strong>Year of establishment: </strong> {org.yearOfEstablishment}
                    </div>

                    <div className={styles.subsidiaryTitle}>
                        Subsidiaries
                    </div>
                    {org.subsidiaries.length ? (
                        <SubsidiariesSection
                            subsidiaries={org.subsidiaries}
                            refetch={refetch}
                        />
                    ) : (
                        <p>No subsidiaries found.</p>
                    )}
                </div>
            ),
            className: index % 2 === 0 ? styles.oddCollapse : styles.evenCollapse,
        }));
    }, [organizationData, showSubsidiaryModal, showEditOrgModal, handleDeleteClick]);

    return (
        <Row className={styles.statisticsContent}>
            <Col span={24}>
                <Col span={24} className={styles.header}>
                    <Col><h2>Organizations SafetyNet AI</h2></Col>
                    <Col>
                        <Button
                            type="primary"
                            icon={<PlusOutlined/>}
                            onClick={showOrgModal}
                            style={{float: 'right'}}
                        >
                            Add Organization
                        </Button>
                    </Col>
                </Col>

                {organizationData?.data?.length ? (
                    <Collapse items={organizationCollapseItems}/>
                ) : (
                    <p>No organizations found.</p>
                )}

                <Pagination
                    className={styles.pagination}
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={organizationData?.total}
                    onChange={(page, pageSize) => {
                        setPagination({current: page, pageSize});
                        refetch();
                    }}
                    showSizeChanger
                    onShowSizeChange={(current, size) => {
                        setPagination({current, pageSize: size});
                        refetch();
                    }}
                />
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

            <EditOrganizationModal
                visible={isEditOrganizationModalVisible}
                onCancel={handleOrgCancel}
                refetch={refetch}
                organization={organizationToEdit}
            />

            <ConfirmDeleteModal
                isVisible={isDeleteModalVisible}
                onCancel={() => setIsDeleteModalVisible(false)}
                onConfirm={() => organizationToDelete && handleDeleteOrganization(organizationToDelete.organizationId.toString())}
                messageText={`Are you sure you want to delete organization: ${organizationToDelete?.name}?`}
                titleText="Delete Organization"
            />
        </Row>
    );
};

export default Organizations;
