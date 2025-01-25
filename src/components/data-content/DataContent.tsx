import {Button, Space, Table} from 'antd';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import styles from './data-content.module.scss';
import {DataFeedback, TransformedEntry, transformEntries} from "../../interfaces/DataInterfaces.tsx";

const TableContent = ({dummyEntries}: { dummyEntries: DataFeedback[] }) => {
    const transformedEntries: TransformedEntry[] = transformEntries(dummyEntries);

    const columns = [
        {
            title: 'Nr.',
            dataIndex: 'index',
            render: (_: unknown, __: TransformedEntry, index: number) => index + 1,
        },
        {
            title: 'Organization',
            dataIndex: 'organization',
        },
        {
            title: 'Employee CNP',
            dataIndex: 'cnp',
        },
        {
            title: 'Satisfy Salary',
            dataIndex: 'salary',
        },
        {
            title: 'Type of Engagement',
            dataIndex: 'engagement',
        },
        {
            title: 'Working Overtime',
            dataIndex: 'overtime',
        },
        {
            title: 'Protective equipment is adequate?',
            dataIndex: 'equipment',
        },
        {
            title: 'Safety measures are clear?',
            dataIndex: 'safety',
        },
        {
            title: 'Protection measures were applied?',
            dataIndex: 'protection',
        },
        {
            title: 'Times Exposed to Danger (hours)',
            dataIndex: 'dangerTimes',
        },
        {
            title: 'Actions',
            render: () => (
                <Space>
                    <Button type="text" icon={<EditOutlined/>} className={styles.actionIcon} title="Edit"/>
                    <Button type="text" icon={<DeleteOutlined/>} className={styles.actionIcon} title="Delete"/>
                </Space>
            ),
        },
    ];

    return (
        <div className={styles.tableContent}>
            <Table
                columns={columns}
                dataSource={transformedEntries}
                rowKey="id"
                pagination={{pageSize: 20}}
                className={styles.table}
            />
        </div>
    );
};

export default TableContent;