import {DeleteOutlined, EditOutlined, SolutionOutlined, UserOutlined} from "@ant-design/icons";
import {Button, Table} from "antd";
import {useLocation} from "react-router-dom";
import styles from './employee-details.module.scss';
import {Employee} from "../../interfaces/EmployeeInterfaces.tsx";
import {Qualification} from "../../interfaces/Qualification";

const formatQualification = (qualification: Qualification): string => {
    return qualification
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

const EmployeeDetails = () => {
    const location = useLocation();
    const {subsidiary} = location.state || {};

    if (!subsidiary) return <p>No subsidiary data found.</p>;

    const columns = [
        {
            title: <><UserOutlined/> Full Name</>,
            dataIndex: 'fullName',
            key: 'fullName',
            render: (text: string) => text || "Not completed",
        },
        {
            title: <><SolutionOutlined/> Date of Birth</>,
            dataIndex: 'dateOfBirth',
            key: 'dateOfBirth',
            render: (date: string) => date?.toString() || "Not completed",
        },
        {
            title: 'Personal ID',
            dataIndex: 'employeeCNP',
            key: 'employeeCNP',
            render: (text: string) => text || "Not completed",
        },
        {
            title: 'Qualification',
            dataIndex: 'qualification',
            key: 'qualification',
            render: (qualification: Qualification) =>
                qualification ? formatQualification(qualification) : "Not completed",
        },
        {
            title: 'Years of Experience',
            dataIndex: 'yearsOfExperience',
            key: 'yearsOfExperience',
            render: (text: number) => (text != undefined ? text : "Not completed"),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: () => (
                <div className={styles.actions}>
                    <Button icon={<EditOutlined/>}/>
                    <Button icon={<DeleteOutlined/>} className={styles.delete}/>
                </div>
            ),
        },
    ];

    return (
        <div className={styles.employeeContainer}>
            <h2>Employees at {subsidiary.subsidiaryCode}</h2>
            {subsidiary.employees && subsidiary.employees.length ? (
                <Table
                    dataSource={subsidiary.employees}
                    columns={columns}
                    rowKey={(record: Employee) => record?.employeeId || "unknown"}
                    pagination={{pageSize: 20}}
                    scroll={{x: true}}
                />
            ) : (
                <p>No employees found for this subsidiary.</p>
            )}
        </div>
    );
};

export default EmployeeDetails;