import {Button, Col, Collapse, notification, Pagination, Row, Space, Spin} from 'antd';
import {useCallback, useMemo, useState} from 'react';
import {
    DeleteOutlined,
    EditOutlined,
    MailOutlined,
    NodeIndexOutlined,
    PartitionOutlined,
    PlusOutlined,
    RadarChartOutlined,
    UserOutlined
} from '@ant-design/icons';
import {useGetAllOrganizationsPageableQuery, useRemoveOrganizationMutation} from "../../services/organizationApi.tsx";
import OrganizationModal from "../modals/add-organization-modal/OrganizationModal.tsx";
import SubsidiaryModal from "../modals/add-subsidiary-modal/SubsidiaryModal.tsx";
import {OrganizationResponse, OrganizationUpdateRequest} from "../../interfaces/OrganizationInterfaces.tsx";
import SubsidiariesSection from "../subsidiary-section/SubsidiarySection.tsx";
import styles from './organization.module.scss';
import ConfirmDeleteModal from "../modals/confirm-delete-modal/ConfirmDeleteModal.tsx";
import EditOrganizationModal from "../modals/edit-organization-info-modal/EditOrganizationModal.tsx";
import Search from "antd/es/input/Search";
import {transformData} from "../../interfaces/TransformData.tsx";
import {usePredictWorkAccidentMutation} from "../../services/predictionApi.tsx";

const Organizations = () => {
    const [pagination, setPagination] = useState({current: 1, pageSize: 20});
    const [searchText, setSearchText] = useState('');
    const [searchSubsidiary, setSearchSubsidiary] = useState('');

    const {data: organizationData, refetch, isLoading} = useGetAllOrganizationsPageableQuery({
        page: pagination.current - 1,
        size: pagination.pageSize,
        search: searchText,
    });

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
        (organizationId: number) => {
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

    const [predictWorkAccident] = usePredictWorkAccidentMutation();

    const handlePredictRiskForOrganization = useCallback(async (org: OrganizationResponse) => {
        const feedbacks = org.subsidiaries.flatMap(sub =>
            sub.employees
                ?.filter(emp => emp.feedback && emp.employeeId !== undefined)
                .map(emp => {
                    const fb = emp.feedback!;
                    return [
                        emp.employeeId,
                        fb.satisfactionLevel,
                        fb.lastEvaluation,
                        fb.numberProject,
                        fb.averageMonthlyHours,
                        fb.timeSpendCompany,
                        fb.workAccident,
                        fb.promotionLast5years,
                        fb.department,
                        fb.salary
                    ];
                }) ?? []
        );

        if (feedbacks.length === 0) {
            notification.warning({message: `No feedback data available for ${org.name}`});
            return;
        }

        try {
            const result = await predictWorkAccident({features: feedbacks}).unwrap();
            notification.success({
                message: `Prediction for ${org.name}`,
                description: `Risk Score: ${(result.risk_score * 100).toFixed(2)}%`
            });
        } catch (error) {
            console.error('Prediction failed:', error);
            notification.error({
                message: 'Prediction Error',
                description: `Failed to predict for ${org.name}`
            });
        }
    }, [predictWorkAccident]);


    const organizationCollapseItems = useMemo(() => {
        return organizationData?.data?.slice()
            .sort((a: OrganizationResponse, b: OrganizationResponse) => a.name.localeCompare(b.name))
            .map((org: OrganizationResponse, index: number) => ({
                key: org.organizationId,
                label: (
                    <div className={styles.panelHeader}>
                        <span>{`${org.organizationCode} - ${org.name}`}</span>
                        <Space className={styles.actions}>
                            <Row>
                                <Button
                                    icon={<RadarChartOutlined/>}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePredictRiskForOrganization(org);
                                    }}
                                >
                                    Predict Risk
                                </Button>
                            </Row>
                            <Row className={styles.edit}>
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
                            </Row>
                        </Space>
                    </div>
                ),
                children: (
                    <div className={styles.industry}>
                        <div className={styles.industryInfo}>
                            <PartitionOutlined/>
                            <strong>Industry: </strong> {transformData(org.industry)}
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
                            <>
                                <div className={styles.container}>
                                    <Search
                                        placeholder="Search by country, city or code"
                                        onChange={(e) => setSearchSubsidiary(e.target.value)}
                                        value={searchSubsidiary}
                                        enterButton
                                        className={styles.searchSubsidiary}
                                    />
                                </div>
                                <div className={styles.subsidiariesContainer}>
                                    <SubsidiariesSection
                                        subsidiaries={org.subsidiaries.filter((subsidiary) => {
                                            const searchText = searchSubsidiary.toLowerCase();
                                            return (
                                                subsidiary.country?.toLowerCase().includes(searchText) ||
                                                subsidiary.city?.toLowerCase().includes(searchText) ||
                                                subsidiary.subsidiaryCode?.toLowerCase().includes(searchText)
                                            );
                                        })}
                                        refetch={refetch}
                                    />
                                </div>
                            </>
                        ) : (
                            <p>No subsidiaries found.</p>
                        )}
                    </div>
                ),
                className: index % 2 === 0 ? styles.oddCollapse : styles.evenCollapse,
            }));
    }, [organizationData, searchSubsidiary, showSubsidiaryModal, showEditOrgModal, handleDeleteClick]);

    return (
        <Row className={styles.statisticsContent}>
            <Col span={24}>
                <Col span={24} className={styles.header}>
                    <Col><h2>Organizations SafetyNet AI</h2></Col>
                    <Col className={styles.rightActions}>
                        <Search
                            placeholder="Search by name, code, or industry"
                            onChange={(e) => setSearchText(e.target.value)}
                            value={searchText}
                            enterButton
                            className={styles.searchAction}
                        />
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
                ) : isLoading ? (
                    <Spin size="large" className={styles.spinner}/>
                ) : (
                    <p>No organizations found</p>
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
                onConfirm={() => organizationToDelete && handleDeleteOrganization(organizationToDelete.organizationId)}
                messageText={`Are you sure you want to delete organization: ${organizationToDelete?.name}?`}
                titleText="Delete Organization"
            />
        </Row>
    );
};

export default Organizations;
