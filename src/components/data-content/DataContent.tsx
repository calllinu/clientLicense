import {Table, Tooltip} from "antd";
import {useState} from "react";
import styles from "./data-content.module.scss";
import {TransformedEntry} from "../../interfaces/TableFeedbacksInterface.tsx";
import {transformData, transformWorktime} from "../../interfaces/TransformData.tsx";
import {SubsidiariesFeedbacks} from "../../interfaces/FeedbackInterfaces.tsx";

const TableContent = ({data}: { data: SubsidiariesFeedbacks[] }) => {
    const [pagination, setPagination] = useState({current: 1, pageSize: 20});

    const transformedData: TransformedEntry[] = data.map((entry) => ({
        feedbackId: entry.feedback.feedbackId,
        subsidiaryCode: entry.subsidiaryCode,
        country: entry.country,
        city: entry.city,
        confirmationEquipmentAdequate: transformData(entry.feedback.confirmationEquipmentAdequate),
        confirmationOvertime: transformData(entry.feedback.confirmationOvertime),
        confirmationProtectionMeasures: transformData(entry.feedback.confirmationProtectionMeasures),
        confirmationSafetyMeasures: transformData(entry.feedback.confirmationSafetyMeasures),
        confirmationSalary: transformData(entry.feedback.confirmationSalary),
        dangerType: transformData(entry.feedback.dangerType),
        engagement: transformData(entry.feedback.engagement),
        factorsWorkplaceSafety: transformData(entry.feedback.factorsWorkplaceSafety),
        workTime: transformWorktime(entry.feedback.workTime),
    }));

    const columns = [
        {
            title: "Nr.",
            dataIndex: "index",
            render: (_: unknown, __: TransformedEntry, index: number) =>
                index + 1 + (pagination.current - 1) * pagination.pageSize,
        },
        {
            title: "Subsidiary Code",
            dataIndex: "subsidiaryCode",
            render: (_: unknown, record: TransformedEntry) => (
                <Tooltip
                    title={
                        <div className={styles.tooltipContent}>
                            <div>
                                <span>Country:</span> {record.country}
                            </div>
                            <div>
                                <span>City:</span> {record.city}
                            </div>
                        </div>
                    }
                    overlayClassName={styles.customTooltip}
                >
                    <span className={styles.fullName}>{record.subsidiaryCode}</span>
                </Tooltip>
            ),
        },
        {
            title: "Satisfy Salary",
            dataIndex: "confirmationSalary",
        },
        {
            title: "Type of Engagement",
            dataIndex: "engagement",
        },
        {
            title: "Do you work overtime?",
            dataIndex: "confirmationOvertime",
        },
        {
            title: "Protective equipment is adequate?",
            dataIndex: "confirmationEquipmentAdequate",
        },
        {
            title: "Safety measures are clear?",
            dataIndex: "confirmationSafetyMeasures",
        },
        {
            title: "Protection measures were applied?",
            dataIndex: "confirmationProtectionMeasures",
        },
        {
            title: "What type of danger are you most exposed to?",
            dataIndex: "dangerType",
        },
        {
            title: "Who is responsible for workplace safety?",
            dataIndex: "factorsWorkplaceSafety",
        },
        {
            title: "How much time are you exposed to unsafe conditions?",
            dataIndex: "workTime",
        },
    ];

    return (
        <div className={styles.tableContent}>
            <Table
                columns={columns}
                dataSource={transformedData}
                rowKey={(record: TransformedEntry) => record.feedbackId}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    onChange: (page, pageSize) => setPagination({current: page, pageSize}),
                }}
                className={styles.table}
            />
        </div>
    );
};

export default TableContent;
