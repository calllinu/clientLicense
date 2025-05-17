import {Pagination, Table, Tooltip} from 'antd';
import styles from './../data-content/data-content.module.scss';
import {OwnerFeedbacksTransformedEntry} from "../../interfaces/TableFeedbacksInterface.tsx";
import {transformData} from "../../interfaces/TransformData.tsx";
import {useGetAllFeedbacksPageableQuery} from "../../services/feedbackApi.tsx";
import {useCallback, useState} from "react";
import {formatBoolean} from "../statistics/utils/fieldConfigs.tsx";
import {getDepartmentDisplayName} from "../statistics/utils/chartUtils.tsx";

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
        satisfactionLevel: entry.feedback.satisfactionLevel ? parseFloat(entry.feedback.satisfactionLevel.toFixed(2)) : undefined,
        lastEvaluation: entry.feedback.lastEvaluation ? parseFloat(entry.feedback.lastEvaluation.toFixed(2)) : undefined,
        numberProject: entry.feedback.numberProject,
        averageMonthlyHours: entry.feedback.averageMonthlyHours,
        timeSpendCompany: entry.feedback.timeSpendCompany,
        workAccident: formatBoolean(entry.feedback.workAccident),
        promotionLast5years: formatBoolean(entry.feedback.promotionLast5years),
        department: entry.feedback.department ? getDepartmentDisplayName(entry.feedback.department) : "Unknown",
        salary: entry.feedback.salary ? transformData(entry.feedback.salary) : "Unknown",
        index: (pagination.current - 1) * pagination.pageSize + index + 1,
    }));

    const columns = [
        {title: 'Nr.', dataIndex: 'index', key: 'index'},
        {
            title: 'Organization Code',
            dataIndex: 'organizationCode',
            key: 'organizationCode',
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
        {title: 'How satisfied are you with your job?', dataIndex: 'satisfactionLevel', key: 'satisfactionLevel'},
        {
            title: 'What was your score on your last performance evaluation?',
            dataIndex: 'lastEvaluation',
            key: 'lastEvaluation'
        },
        {title: 'How many projects are you currently working on?', dataIndex: 'numberProject', key: 'numberProject'},
        {
            title: 'How many hours do you work per month on average?',
            dataIndex: 'averageMonthlyHours',
            key: 'averageMonthlyHours'
        },
        {
            title: 'How many years have you been with the company?',
            dataIndex: 'timeSpendCompany',
            key: 'timeSpendCompany'
        },
        {title: 'Have you ever had a work-related accident?', dataIndex: 'workAccident', key: 'workAccident'},
        {
            title: 'Have you been promoted in the last 5 years?',
            dataIndex: 'promotionLast5years',
            key: 'promotionLast5years'
        },
        {title: 'Which department do you work in?', dataIndex: 'department', key: 'department'},
        {title: 'How would you describe your salary level?', dataIndex: 'salary', key: 'salary'},
    ];

    return (
        <div className={styles.tableContent}>
            <Table
                columns={columns}
                dataSource={transformedData}
                rowKey="feedbackId"
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