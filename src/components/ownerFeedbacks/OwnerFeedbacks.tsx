import {Pagination, Table, Tooltip} from 'antd';
import styles from './../data-content/data-content.module.scss';
import {OwnerFeedbacksTransformedEntry} from "../../interfaces/TableFeedbacksInterface.tsx";
import {FeedbackPageableInterface} from "../../interfaces/FeedbackInterfaces.tsx";
import {transformData} from "../../interfaces/TransformData.tsx";

interface OwnerFeedbacksProps {
    content: FeedbackPageableInterface;
    isLoading: boolean;
    onHandlePageChange: (page: number, pageSize: number) => void;
}

const OwnerFeedbacks = ({
                            content,
                            isLoading,
                            onHandlePageChange
                        }: OwnerFeedbacksProps) => {

    const transformedData: OwnerFeedbacksTransformedEntry[] = content.feedbacks.map((entry) => ({
        organizationCode: entry.employeeDetails.organizationDetails.organizationCode,
        organizationName: entry.employeeDetails.organizationDetails.name,
        industry: transformData(entry.employeeDetails.organizationDetails.industry),
        subsidiaryCode: entry.employeeDetails.subsidiaryDetails.subsidiaryCode,
        subsidiaryCountry: entry.employeeDetails.subsidiaryDetails.country,
        subsidiaryCity: entry.employeeDetails.subsidiaryDetails.city,
        subsidiaryAddress: entry.employeeDetails.subsidiaryDetails.address,
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
            render: (_: unknown, __: OwnerFeedbacksTransformedEntry, index: number) => index + 1,
        },
        {
            title: 'Subsidiary Code',
            dataIndex: 'subsidiaryCode',
            render: (_: unknown, record: OwnerFeedbacksTransformedEntry) => (
                <Tooltip
                    title={
                        <div className={styles.tooltipContent}>
                            <div><span>Organization Code:</span> {record.organizationCode}</div>
                            <div><span>Organization Name:</span> {record.organizationName}</div>
                            <div><span>Industry:</span> {record.industry}</div>
                            <div><span>Subsidiary Country:</span> {record.subsidiaryCountry}</div>
                            <div><span>Subsidiary City:</span> {record.subsidiaryCity}</div>
                            <div><span>Subsidiary Address:</span> {record.subsidiaryAddress}</div>
                        </div>
                    }
                    overlayClassName={styles.customTooltip}
                >
                    <span className={styles.fullName}>{record.subsidiaryCode}</span>
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
                rowKey={(record: OwnerFeedbacksTransformedEntry) => `${record.subsidiaryCode}-${record.organizationCode}`}
                className={styles.table}
                loading={isLoading}
                pagination={false}
            />
            <Pagination
                current={content.currentPage}
                total={content.totalItems}
                pageSize={20}
                onChange={onHandlePageChange}
                className={styles.pagination}
            />
        </div>
    );
};

export default OwnerFeedbacks;
