import {DeleteOutlined, EditOutlined, SolutionOutlined, UserOutlined} from "@ant-design/icons";
import {Button, Table} from "antd";
import {useLocation} from "react-router-dom";
import styles from './employee-details.module.scss';
import {Employee} from "../../interfaces/EmployeeInterfaces.tsx";
import {Qualification} from "../../interfaces/Qualification";
import {useDeleteEmployeeMutation} from "../../services/employeeApi.tsx";
import {useCallback} from "react";

const EmployeeDetails = () => {
    const location = useLocation();
    const {subsidiary} = location.state || {};
    const [deleteEmployee] = useDeleteEmployeeMutation();
    console.log(subsidiary)
    const formatQualification = (qualification: Qualification): string => {
        return qualification
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const deleteEmployeeHandle = useCallback(
        async (employeeId: number) => {
            await deleteEmployee(employeeId).unwrap();
        }, [deleteEmployee]);

    if (!subsidiary) return <p>No subsidiary data found.</p>;

    const columns = [
        {
            title: <><UserOutlined/> Full Name</>,
            dataIndex: 'fullName',
            key: 'fullName',
            render: (text: string) => <span
                className={text ? '' : styles.notCompleted}>{text || "Not completed"}</span>,
        },
        {
            title: <><SolutionOutlined/> Date of Birth</>,
            dataIndex: 'dateOfBirth',
            key: 'dateOfBirth',
            render: (date: string) => <span
                className={date ? '' : styles.notCompleted}>{date?.toString() || "Not completed"}</span>,
        },
        {
            title: 'Personal ID',
            dataIndex: 'employeeCNP',
            key: 'employeeCNP',
            render: (text: string) => <span
                className={text ? '' : styles.notCompleted}>{text || "Not completed"}</span>,
        },
        {
            title: 'Qualification',
            dataIndex: 'qualification',
            key: 'qualification',
            render: (qualification: Qualification) =>
                <span
                    className={qualification ? '' : styles.notCompleted}>{qualification ? formatQualification(qualification) : "Not completed"}</span>,
        },
        {
            title: 'Years of Experience',
            dataIndex: 'yearsOfExperience',
            key: 'yearsOfExperience',
            render: (text: number) => <span
                className={text !== undefined ? '' : styles.notCompleted}>{text != undefined ? text : "Not completed"}</span>,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (employee: Employee) => (
                <div className={styles.actions}>
                    <Button icon={<EditOutlined/>}/>
                    <Button
                        icon={<DeleteOutlined/>}
                        className={styles.delete}
                        onClick={() => deleteEmployeeHandle(employee.employeeId)}
                    />
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
                    rowKey={(employee: Employee) => employee?.employeeId || "unknown"}
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
