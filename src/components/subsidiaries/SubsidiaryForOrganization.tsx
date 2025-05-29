import {Button, Input, notification, Space, Table} from 'antd';
import {ArrowRightOutlined, DeleteOutlined, EditOutlined, PlusOutlined, RadarChartOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import {useCallback, useState} from 'react';
import styles from './subsidiary.module.scss';
import {Subsidiary} from '../../interfaces/SubsidiaryInterfaces.tsx';
import {useRemoveSubsidiaryMutation} from '../../services/subsidiaryApi.tsx';
import ConfirmDeleteModal from '../modals/confirm-delete-modal/ConfirmDeleteModal.tsx';
import EditSubsidiaryModal from "../modals/edit-subsidiary-info-modal/EditSubsidiaryModal.tsx";
import SubsidiaryModal from "../modals/add-subsidiary-modal/SubsidiaryModal.tsx";
import {usePredictWorkAccidentMutation} from "../../services/predictionApi.tsx";

interface SubsidiariesSectionProps {
    subsidiaries?: Subsidiary[];
    organizationId?: number;
    refetch: () => void;
}

const SubsidiaryForOrganization = ({subsidiaries, organizationId, refetch}: SubsidiariesSectionProps) => {
    const navigate = useNavigate();
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [subsidiaryToDelete, setSubsidiaryToDelete] = useState<Subsidiary | null>(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedSubsidiary, setSelectedSubsidiary] = useState<Subsidiary | null>(null);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [searchSubsidiary, setSearchSubsidiary] = useState('');
    const [removeSubsidiary] = useRemoveSubsidiaryMutation();
    const [predictWorkAccident] = usePredictWorkAccidentMutation();

    const handlePredictRisk = useCallback(async () => {
        if (!subsidiaries || subsidiaries.length === 0) {
            notification.warning({message: "No subsidiaries found."});
            return;
        }

        const feedbacks = subsidiaries.flatMap(sub =>
            sub.employees
                ?.filter(emp => emp.feedback && emp.employeeId !== undefined)
                .map(emp => {
                    const feedback = emp.feedback!;
                    return [
                        emp.employeeId,
                        feedback.satisfactionLevel,
                        feedback.lastEvaluation,
                        feedback.numberProject,
                        feedback.averageMonthlyHours,
                        feedback.timeSpendCompany,
                        feedback.workAccident,
                        feedback.promotionLast5years,
                        feedback.department,
                        feedback.salary
                    ];
                }) ?? []
        );

        if (feedbacks.length === 0) {
            notification.warning({message: "No valid employee feedback data available."});
            return;
        }

        try {
            const result = await predictWorkAccident({features: feedbacks}).unwrap();
            notification.success({
                message: 'Prediction Complete',
                description: `Risk Score: ${(result.risk_score * 100).toFixed(2)}%`
            });
        } catch (error) {
            console.error('Prediction failed:', error);
            notification.error({
                message: 'Prediction Error',
                description: 'Unable to complete prediction. Please try again later.'
            });
        }
    }, [subsidiaries, predictWorkAccident]);

    const handlePredictRiskForSubsidiary = useCallback(async (subsidiary: Subsidiary) => {
        const feedbacks =
            subsidiary.employees
                ?.filter(emp => emp.feedback && emp.employeeId !== undefined)
                .map(emp => {
                    const feedback = emp.feedback!;
                    return [
                        emp.employeeId,
                        feedback.satisfactionLevel,
                        feedback.lastEvaluation,
                        feedback.numberProject,
                        feedback.averageMonthlyHours,
                        feedback.timeSpendCompany,
                        feedback.workAccident,
                        feedback.promotionLast5years,
                        feedback.department,
                        feedback.salary
                    ];
                }) ?? [];

        if (feedbacks.length === 0) {
            notification.warning({message: `No feedback data for ${subsidiary.subsidiaryCode}`});
            return;
        }

        try {
            const result = await predictWorkAccident({features: feedbacks}).unwrap();
            notification.success({
                message: `Prediction for ${subsidiary.subsidiaryCode}`,
                description: `Risk Score: ${(result.risk_score * 100).toFixed(2)}%`
            });
        } catch (error) {
            console.error('Prediction failed:', error);
            notification.error({
                message: 'Prediction Error',
                description: `Failed to predict for ${subsidiary.subsidiaryCode}`
            });
        }
    }, [predictWorkAccident]);


    const navigateToSubsidiary = useCallback((sub: Subsidiary) => {
        navigate(`/dashboard/${sub.subsidiaryId}`, {
            state: {subsidiaryId: sub.subsidiaryId, subsidiaryCode: sub.subsidiaryCode}
        });
    }, [navigate]);

    const showDeleteModal = useCallback((sub: Subsidiary) => {
        setSubsidiaryToDelete(sub);
        setIsDeleteModalVisible(true);
    }, []);

    const confirmDelete = useCallback(() => {
        if (subsidiaryToDelete) {
            removeSubsidiary(subsidiaryToDelete.subsidiaryId.toString())
                .unwrap()
                .then(() => {
                    refetch();
                    hideDeleteModal();
                });
        }
    }, [subsidiaryToDelete, removeSubsidiary, refetch]);

    const hideDeleteModal = useCallback(() => {
        setIsDeleteModalVisible(false);
        setSubsidiaryToDelete(null);
    }, []);

    const showEditModal = useCallback((sub: Subsidiary) => {
        setSelectedSubsidiary(sub);
        setIsEditModalVisible(true);
    }, []);

    const hideEditModal = useCallback(() => {
        setIsEditModalVisible(false);
        setSelectedSubsidiary(null);
    }, []);

    const showAddModal = useCallback(() => {
        setIsAddModalVisible(true);
    }, []);

    const hideAddModal = useCallback(() => {
        setIsAddModalVisible(false);
    }, []);

    const columns = [
        {
            title: 'Subsidiary Code',
            dataIndex: 'subsidiaryCode',
            key: 'subsidiaryCode',
            render: (text: string, record: Subsidiary) => (
                <span
                    onClick={() => navigateToSubsidiary(record)}
                    style={{cursor: 'pointer', color: '#1890ff'}}
                >
                    <ArrowRightOutlined style={{marginRight: 8}}/>
                    {text}
                </span>
            )
        },
        {
            title: 'City',
            dataIndex: 'city',
            key: 'city',
            render: (text: string) => text
        },
        {
            title: 'Street',
            dataIndex: 'address',
            key: 'address',
            render: (text: string) => text
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
            render: (text: string) => text
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: undefined, record: Subsidiary) => (
                <Space>
                    <Button
                        icon={<EditOutlined/>}
                        onClick={(e) => {
                            e.stopPropagation();
                            showEditModal(record);
                        }}
                    />
                    <Button
                        icon={<DeleteOutlined/>}
                        danger
                        onClick={(e) => {
                            e.stopPropagation();
                            showDeleteModal(record);
                        }}
                    />
                </Space>
            )
        },
        {
            title: 'Predict Risk',
            key: 'predictRisk',
            width: 300,
            render: (_: undefined, record: Subsidiary) => (
                <Button
                    icon={<RadarChartOutlined/>}
                    type="default"
                    onClick={() => handlePredictRiskForSubsidiary(record)}
                >
                    Predict Risk for {record.subsidiaryCode}
                </Button>
            )
        }
    ];

    return (
        <div className={styles.subsidiariesContainer}>
            <div className={styles.header}>
                <Button
                    icon={<RadarChartOutlined/>}
                    onClick={() => handlePredictRisk()}
                >
                    Predict Risk for Organization
                </Button>
                <Input.Search
                    placeholder="Search by country, city or code"
                    onChange={(e) => setSearchSubsidiary(e.target.value)}
                    value={searchSubsidiary}
                    enterButton
                    className={styles.searchInput}
                />
                <Button
                    type="primary"
                    icon={<PlusOutlined/>}
                    onClick={showAddModal}
                    className={styles.addButton}
                >
                    Add Subsidiary
                </Button>
            </div>

            <Table
                rowKey="subsidiaryId"
                columns={columns}
                dataSource={subsidiaries?.filter((subsidiary) => {
                    const searchText = searchSubsidiary.toLowerCase();
                    return (
                        subsidiary.country?.toLowerCase().includes(searchText) ||
                        subsidiary.city?.toLowerCase().includes(searchText) ||
                        subsidiary.subsidiaryCode?.toLowerCase().includes(searchText)
                    );
                })}
                pagination={{pageSize: 20}}
                scroll={{x: true}}
            />

            <ConfirmDeleteModal
                isVisible={isDeleteModalVisible}
                onCancel={hideDeleteModal}
                onConfirm={confirmDelete}
                messageText={`Are you sure you want to delete subsidiary: ${subsidiaryToDelete?.subsidiaryCode}?`}
                titleText="Delete Subsidiary"
            />

            <EditSubsidiaryModal
                isVisible={isEditModalVisible}
                onClose={hideEditModal}
                refetch={refetch}
                subsidiary={selectedSubsidiary}
            />

            <SubsidiaryModal
                isVisible={isAddModalVisible}
                onClose={hideAddModal}
                refetch={refetch}
                organizationId={organizationId}
            />
        </div>
    );
};

export default SubsidiaryForOrganization;
