import {Table, Tooltip} from 'antd';
import styles from './data-content.module.scss';
import {TransformedEntry} from "../../interfaces/TableFeedbacksInterface.tsx";
import {transformData} from "../../interfaces/TransformData.tsx";
import {SubsidiariesFeedbacks} from "../../interfaces/FeedbackInterfaces.tsx";

const TableContent = ({data}: { data: SubsidiariesFeedbacks[] }) => {

    const transformedData: TransformedEntry[] = data.map((entry) => ({
        subsidiaryCode: entry.subsidiaryCode,
        country: entry.country,
        city: entry.city,
        fullName: entry.fullName,
        dateOfBirth: entry.dateOfBirth,
        dateOfHiring: entry.dateOfHiring,
        personalNumber: entry.personalNumber,
        confirmationEquipmentAdequate: transformData(entry.feedback.confirmationEquipmentAdequate),
        confirmationOvertime: transformData(entry.feedback.confirmationOvertime),
        confirmationProtectionMeasures: transformData(entry.feedback.confirmationProtectionMeasures),
        confirmationSafetyMeasures: transformData(entry.feedback.confirmationSafetyMeasures),
        confirmationSalary: transformData(entry.feedback.confirmationSalary),
        dangerType: transformData(entry.feedback.dangerType),
        engagement: transformData(entry.feedback.engagement),
        factorsWorkplaceSafety: transformData(entry.feedback.factorsWorkplaceSafety),
        workTime: transformData(entry.feedback.workTime),
    }));

    const columns = [
        {
            title: 'Nr.',
            dataIndex: 'index',
            render: (_: unknown, __: TransformedEntry, index: number) => index + 1,
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            render: (_: unknown, record: TransformedEntry) => (
                <Tooltip
                    title={
                        <div className={styles.tooltipContent}>
                            <div><span>Subsidiary Code:</span> {record.subsidiaryCode}</div>
                            <div><span>Country:</span> {record.country}</div>
                            <div><span>City:</span> {record.city}</div>
                            <div>
                                <span>Date of Birth:</span> {record.dateOfBirth ? new Date(record.dateOfBirth).toLocaleDateString() : '-'}
                            </div>
                            <div>
                                <span>Date of Hiring:</span> {record.dateOfHiring ? new Date(record.dateOfHiring).toLocaleDateString() : '-'}
                            </div>
                            <div><span>Personal Number:</span> {record.personalNumber}</div>
                        </div>
                    }
                    overlayClassName={styles.customTooltip}
                >
                    <span className={styles.fullName}>{record.fullName}</span>
                </Tooltip>
            ),
        },
        {
            title: 'Satisfy Salary',
            dataIndex: 'confirmationSalary',
        },
        {
            title: 'Type of Engagement',
            dataIndex: 'engagement',
        },
        {
            title: 'Do you work overtime?',
            dataIndex: 'confirmationOvertime',
        },
        {
            title: 'Protective equipment is adequate?',
            dataIndex: 'confirmationEquipmentAdequate',
        },
        {
            title: 'Safety measures are clear?',
            dataIndex: 'confirmationSafetyMeasures',
        },
        {
            title: 'Protection measures were applied?',
            dataIndex: 'confirmationProtectionMeasures',
        },
        {
            title: 'What type of danger are you most exposed to?',
            dataIndex: 'dangerType',
        },
        {
            title: 'Who is responsible for workplace safety?',
            dataIndex: 'factorsWorkplaceSafety',
        },
        {
            title: 'How much time are you exposed to unsafe conditions?',
            dataIndex: 'workTime',
        },
    ];

    return (
        <div className={styles.tableContent}>
            <Table
                columns={columns}
                dataSource={transformedData}
                rowKey="subsidiaryCode"
                pagination={{pageSize: 20}}
                className={styles.table}
            />
        </div>
    );
};

export default TableContent;
