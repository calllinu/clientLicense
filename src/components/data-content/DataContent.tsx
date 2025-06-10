import {Table} from "antd";
import {useState} from "react";
import styles from "./data-content.module.scss";
import {FeedbackInterface} from "../../interfaces/FeedbackInterfaces";
import {transformData} from "../../interfaces/TransformData";
import {getDepartmentDisplayName} from "../statistics/utils/chartUtils.tsx";
import {formatBoolean} from "../statistics/utils/fieldConfigs.tsx";

interface TableContentProps {
    data: FeedbackInterface[];
    isLoading: boolean;
}

const TableContent = ({data, isLoading}: TableContentProps) => {
    const [pagination, setPagination] = useState({current: 1, pageSize: 20});

    const transformedData = data.map((entry) => ({
        key: entry.feedbackId,
        feedbackId: entry.feedbackId,
        satisfactionLevel: entry.satisfactionLevel?.toFixed(2) ?? "N/A",
        lastEvaluation: entry.lastEvaluation?.toFixed(2) ?? "N/A",
        numberProject: entry.numberProject ?? "N/A",
        averageMonthlyHours: entry.averageMonthlyHours ?? "N/A",
        timeSpendCompany: entry.timeSpendCompany ?? "N/A",
        workAccident: formatBoolean(entry.workAccident),
        promotionLast5years: formatBoolean(entry.promotionLast5years),
        department: entry.department ? getDepartmentDisplayName(entry.department) : "Unknown",
        salary: entry.salary ? transformData(entry.salary) : "Unknown",
        index: (pagination.current - 1) * pagination.pageSize + data.indexOf(entry) + 1,
    }));

    const columns = [
        {
            title: "Nr.",
            dataIndex: "index",
            key: "index",
        },
        {
            title: "How satisfied are you with your job?",
            dataIndex: "satisfactionLevel",
            key: "satisfactionLevel",
        },
        {
            title: "What was your score on your last performance evaluation?",
            dataIndex: "lastEvaluation",
            key: "lastEvaluation",
        },
        {
            title: "How many projects are you currently working on?",
            dataIndex: "numberProject",
            key: "numberProject",
        },
        {
            title: "How many hours do you work per month on average?",
            dataIndex: "averageMonthlyHours",
            key: "averageMonthlyHours",
        },
        {
            title: "How many years have you been with the company?",
            dataIndex: "timeSpendCompany",
            key: "timeSpendCompany",
        },
        {
            title: "Have you ever had a work-related accident?",
            dataIndex: "workAccident",
            key: "workAccident",
        },
        {
            title: "Have you been promoted in the last 5 years?",
            dataIndex: "promotionLast5years",
            key: "promotionLast5years",
        },
        {
            title: "Which department do you work in?",
            dataIndex: "department",
            key: "department",
        },
        {
            title: "How would you describe your salary level?",
            dataIndex: "salary",
            key: "salary",
        },
    ];

    return (
        <div className={styles.tableContent}>
            <Table
                columns={columns}
                dataSource={transformedData}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    onChange: (page, pageSize) => setPagination({current: page, pageSize}),
                }}
                loading={isLoading}
                className={styles.table}
            />
        </div>
    );
};

export default TableContent;
