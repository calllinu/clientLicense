
import { Row, Col, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './data-content.module.scss';
import {DataFeedback, TransformedEntry, transformEntries} from "../../interfaces/DataInterfaces.tsx";



const TableContent = ({ dummyEntries }: { dummyEntries: DataFeedback[] }) => {

    const transformedEntries: TransformedEntry[] = transformEntries(dummyEntries);

    return (
        <div className={styles.tableContent}>
            <Row className={`${styles.tableHeader} ${styles.transparentRow}`}>
                <Col className={styles.tableCell}>Nr.</Col>
                <Col className={styles.tableCell}>Organization</Col>
                <Col className={styles.tableCell}>Employee CNP</Col>
                <Col className={styles.tableCell}>Satisfy Salary</Col>
                <Col className={styles.tableCell}>Type of Engagement</Col>
                <Col className={styles.tableCell}>Working Overtime</Col>
                <Col className={styles.tableCell}>Protective equipment is adequate?</Col>
                <Col className={styles.tableCell}>Safety measures are clear?</Col>
                <Col className={styles.tableCell}>Protection measures were applied?</Col>
                <Col className={styles.tableCell}>Times Exposed to Danger (hours)</Col>
                <Col className={styles.tableCell}>Actions</Col>
            </Row>
            {transformedEntries.map((entry, index) => (
                <Row key={entry.id} className={`${styles.tableRow} ${index % 2 === 0 ? styles.evenRow : ''}`}>
                    <Col className={styles.tableCell}>{index + 1}</Col>
                    <Col className={styles.tableCell}>{entry.organization}</Col>
                    <Col className={styles.tableCell}>{entry.cnp}</Col>
                    <Col className={styles.tableCell}>{entry.salary}</Col>
                    <Col className={styles.tableCell}>{entry.engagement}</Col>
                    <Col className={styles.tableCell}>{entry.overtime}</Col>
                    <Col className={styles.tableCell}>{entry.equipment}</Col>
                    <Col className={styles.tableCell}>{entry.safety}</Col>
                    <Col className={styles.tableCell}>{entry.protection}</Col>
                    <Col className={styles.tableCell}>{entry.dangerTimes}</Col>
                    <Col className={styles.tableCell}>
                        <Space>
                            <Button type="text" icon={<EditOutlined />} className={styles.actionIcon} title="Edit" />
                            <Button type="text" icon={<DeleteOutlined />} className={styles.actionIcon} title="Delete" />
                        </Space>
                    </Col>
                </Row>
            ))}
        </div>
    );
};

export default TableContent;
