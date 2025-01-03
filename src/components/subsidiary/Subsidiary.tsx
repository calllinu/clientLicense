import { Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined, EnvironmentOutlined, HomeOutlined, GlobalOutlined, BarcodeOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import styles from './subsidiary.module.scss'
import {Subsidiary} from "../../interfaces/SubsidiaryInterfaces.tsx";

const SubsidiariesSection = ({ subsidiaries }: { subsidiaries: Subsidiary[] }) => {
    const navigate = useNavigate();

    const handleCardClick = (sub: Subsidiary) => {
        navigate(`/dashboard/${sub.subsidiaryId}`, {state: {subsidiary: sub}});
    };

    const handleEdit = (id: number) => {
        console.log(`Edit subsidiary ${id}`);
    };

    const handleDelete = (id: number) => {
        console.log(`Delete subsidiary ${id}`);
    };

    return (
        <div className={styles.subsidiariesContainer}>
            {subsidiaries.map((sub: Subsidiary) => (
                <div
                    key={sub.subsidiaryId}
                    className={styles.subsidiaryCard}
                    onClick={() => handleCardClick(sub)}
                >
                    <div className={styles.cardContent}>
                        <div className={styles.cardContent}>
                            <div className={styles.subItem}>
                                <BarcodeOutlined/> <strong>Subsidiary Code:</strong> {sub.subsidiaryCode}
                            </div>
                            <div className={styles.subItem}>
                                <EnvironmentOutlined/> <strong>City:</strong> {sub.city}
                            </div>
                            <div className={styles.subItem}>
                                <HomeOutlined/> <strong>Street:</strong> {sub.address}
                            </div>
                            <div className={styles.subItem}>
                                <GlobalOutlined/> <strong>Country:</strong> {sub.country}
                            </div>
                        </div>
                        <Space className={styles.cardActions}>
                            <Button
                                icon={<EditOutlined/>}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(sub.subsidiaryId);
                                }}
                            />
                            <Button
                                icon={<DeleteOutlined/>}
                                danger
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(sub.subsidiaryId);
                                }}
                            />
                        </Space>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SubsidiariesSection;
