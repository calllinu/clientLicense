import { Button, Space } from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    EnvironmentOutlined,
    HomeOutlined,
    GlobalOutlined,
    BarcodeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState } from 'react';
import styles from './subsidiary.module.scss';
import { Subsidiary } from '../../interfaces/SubsidiaryInterfaces.tsx';
import { useRemoveSubsidiaryMutation } from '../../services/subsidiaryApi.tsx';
import ConfirmDeleteModal from '../modals/confirm-delete-modal/ConfirmDeleteModal.tsx';

interface SubsidiariesSectionProps {
    subsidiaries: Subsidiary[];
    refetch: () => void;
}

const SubsidiariesSection = ({ subsidiaries, refetch }: SubsidiariesSectionProps) => {
    const navigate = useNavigate();
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [subsidiaryToDelete, setSubsidiaryToDelete] = useState<Subsidiary | null>(null);
    const [removeSubsidiary] = useRemoveSubsidiaryMutation();

    const navigateToSubsidiary = useCallback((sub: Subsidiary) => {
        navigate(`/dashboard/${sub.subsidiaryId}`, { state: { subsidiary: sub } });
    }, [navigate]);

    const editSubsidiary = useCallback((id: number) => {
        console.log(`Edit subsidiary ${id}`);
    }, []);

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

    return (
        <div className={styles.subsidiariesContainer}>
            {subsidiaries.map((sub: Subsidiary) => (
                <div
                    key={sub.subsidiaryId}
                    className={styles.subsidiaryCard}
                    onClick={() => navigateToSubsidiary(sub)}
                >
                    <div className={styles.cardContent}>
                        <div className={styles.subItem}>
                            <BarcodeOutlined /> <strong>Subsidiary Code:</strong> {sub.subsidiaryCode}
                        </div>
                        <div className={styles.subItem}>
                            <EnvironmentOutlined /> <strong>City:</strong> {sub.city}
                        </div>
                        <div className={styles.subItem}>
                            <HomeOutlined /> <strong>Street:</strong> {sub.address}
                        </div>
                        <div className={styles.subItem}>
                            <GlobalOutlined /> <strong>Country:</strong> {sub.country}
                        </div>
                        <Space className={styles.cardActions}>
                            <Button
                                icon={<EditOutlined />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    editSubsidiary(sub.subsidiaryId);
                                }}
                            />
                            <Button
                                icon={<DeleteOutlined />}
                                danger
                                onClick={(e) => {
                                    e.stopPropagation();
                                    showDeleteModal(sub);
                                }}
                            />
                        </Space>
                    </div>
                </div>
            ))}

            <ConfirmDeleteModal
                isVisible={isDeleteModalVisible}
                onCancel={hideDeleteModal}
                onConfirm={confirmDelete}
                messageText={`Are you sure you want to delete subsidiary: ${subsidiaryToDelete?.subsidiaryCode}?`}
                titleText="Delete Subsidiary"
            />
        </div>
    );
};

export default SubsidiariesSection;
