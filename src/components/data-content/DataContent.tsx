import {Table} from 'antd';
import styles from './data-content.module.scss';
import {TransformedEntry} from "../../interfaces/DataInterfaces.tsx";
import {FeedbackInterface} from "../../interfaces/FeedbackInterfaces.tsx";

interface DataContentProps {
    subsidiaryCode: string;
    country: string;
    city: string;
    address: string;
    fullName: string;
    dateOfBirth?: Date;
    dateOfHiring?: Date;
    personalNumber?: string;
    feedback: FeedbackInterface;
}

const TableContent = ({data}: { data: DataContentProps[] }) => {

    function transformUnderscoreText(value: string | undefined): string | undefined {
        if (!value) return undefined;
        return value
            .split('_')
            .map((word, index) => index === 0 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word.toLowerCase())
            .join(' ');
    }

    const transformedData: TransformedEntry[] = data.map((entry) => ({
        subsidiaryCode: entry.subsidiaryCode,
        country: entry.country,
        city: entry.city,
        fullName: entry.fullName,
        dateOfBirth: entry.dateOfBirth,
        dateOfHiring: entry.dateOfHiring,
        personalNumber: entry.personalNumber,
        confirmationEquipmentAdequate: transformUnderscoreText(entry.feedback.confirmationEquipmentAdequate),
        confirmationOvertime: transformUnderscoreText(entry.feedback.confirmationOvertime),
        confirmationProtectionMeasures: transformUnderscoreText(entry.feedback.confirmationProtectionMeasures),
        confirmationSafetyMeasures: transformUnderscoreText(entry.feedback.confirmationSafetyMeasures),
        confirmationSalary: transformUnderscoreText(entry.feedback.confirmationSalary),
        dangerType: transformUnderscoreText(entry.feedback.dangerType),
        engagement: transformUnderscoreText(entry.feedback.engagement),
        factorsWorkplaceSafety: transformUnderscoreText(entry.feedback.factorsWorkplaceSafety),
        workTime: transformUnderscoreText(entry.feedback.workTime),
    }));

    const columns = [
        {
            title: 'Nr.',
            dataIndex: 'index',
            render: (_: unknown, __: TransformedEntry, index: number) => index + 1,
        },
        {
            title: 'Subsidiary Code',
            dataIndex: 'subsidiaryCode',
        },
        {
            title: 'Country',
            dataIndex: 'country',
        },
        {
            title: 'City',
            dataIndex: 'city',
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
        },
        {
            title: 'Date of Birth',
            dataIndex: 'dateOfBirth',
            render: (date: string | undefined) => date ? new Date(date).toLocaleDateString() : '-',
        },
        {
            title: 'Date of Hiring',
            dataIndex: 'dateOfHiring',
            render: (date: string | undefined) => date ? new Date(date).toLocaleDateString() : '-',
        },
        {
            title: 'Personal Number',
            dataIndex: 'personalNumber',
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
            title: 'Working Overtime',
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
            title: 'Danger Type',
            dataIndex: 'dangerType',
        },
        {
            title: 'Factors Workplace Safety',
            dataIndex: 'factorsWorkplaceSafety',
        },
        {
            title: 'Work Time',
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
