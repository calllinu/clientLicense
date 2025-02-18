import {Pagination, Table, Tooltip} from 'antd';
import styles from './../data-content/data-content.module.scss';
import {OwnerFeedbacksTransformedEntry} from "../../interfaces/TableFeedbacksInterface.tsx";
import {transformData, transformWorktime} from "../../interfaces/TransformData.tsx";
import {useGetAllFeedbacksPageableQuery} from "../../services/feedbackApi.tsx";
import {useCallback, useState} from "react";

const OwnerFeedbacks = () => {
    const [pagination, setPagination] = useState({current: 1, pageSize: 20});

    const handlePageChange = useCallback((page: number, pageSize: number) => {
        setPagination({current: page, pageSize});
    }, []);

    const {data: surveyContent, isLoading: isLoadingFeedbacks} = useGetAllFeedbacksPageableQuery({
        page: pagination.current - 1,
        size: pagination.pageSize,
    });

    const transformedData: OwnerFeedbacksTransformedEntry[] | undefined = surveyContent?.feedbacks.map((entry, index) => ({
        feedbackId: entry.feedbackId,
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
        workTime: transformWorktime(entry.feedback.workTime),
        index: (pagination.current - 1) * pagination.pageSize + index + 1,
    }));

    const columns = [
        {title: 'Nr.', dataIndex: 'index'},
        {
            title: 'Organization Code',
            dataIndex: 'organizationCode',
            render: (_: unknown, record: OwnerFeedbacksTransformedEntry) => (
                <Tooltip
                    title={
                        <div className={styles.tooltipContent}>
                            <div><span>Organization Name:</span> {record.organizationName}</div>
                            <div><span>Industry:</span> {record.industry}</div>
                            <div><span>Subsidiary Code:</span> {record.subsidiaryCode}</div>
                            <div><span>Subsidiary Country:</span> {record.subsidiaryCountry}</div>
                            <div><span>Subsidiary City:</span> {record.subsidiaryCity}</div>
                            <div><span>Subsidiary Address:</span> {record.subsidiaryAddress}</div>
                        </div>
                    }
                    classNames={{root: styles.customTooltip}}
                >
                    <span className={styles.fullName}>{record.organizationCode}</span>
                </Tooltip>
            ),
        },
        {title: 'Satisfy Salary', dataIndex: 'confirmationSalary'},
        {title: 'Type of Engagement', dataIndex: 'engagement'},
        {title: 'Do you work overtime?', dataIndex: 'confirmationOvertime'},
        {title: 'Protective equipment is adequate?', dataIndex: 'confirmationEquipmentAdequate'},
        {title: 'Safety measures are clear?', dataIndex: 'confirmationSafetyMeasures'},
        {title: 'Protection measures were applied?', dataIndex: 'confirmationProtectionMeasures'},
        {title: 'What type of danger are you most exposed to?', dataIndex: 'dangerType'},
        {title: 'Who is responsible for workplace safety?', dataIndex: 'factorsWorkplaceSafety'},
        {title: 'How much time are you exposed to unsafe conditions?', dataIndex: 'workTime'},
    ];

    return (
        <div className={styles.tableContent}>
            <Table
                columns={columns}
                dataSource={transformedData}
                rowKey={(record: OwnerFeedbacksTransformedEntry) => `${record.feedbackId}`}
                className={styles.table}
                loading={isLoadingFeedbacks}
                pagination={false}
            />
            <Pagination
                current={pagination.current}
                total={surveyContent?.totalItems}
                pageSize={pagination.pageSize}
                onChange={handlePageChange}
                className={styles.pagination}
            />
        </div>
    );
};

export default OwnerFeedbacks;
