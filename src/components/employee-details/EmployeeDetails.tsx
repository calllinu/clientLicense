import {DeleteOutlined, EditOutlined, SolutionOutlined, UserOutlined} from "@ant-design/icons";
import {Button, List} from "antd";
import {useLocation} from "react-router-dom";
import styles from './employee-details.module.scss';
import {Employee} from "../../interfaces/EmployeeInterfaces.tsx";
import {Qualification} from "../../interfaces/Qualification";

// Utility function to format qualification
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

    return (
        <div className={styles.employeeContainer}>
            <h2>Employees at {subsidiary.subsidiaryCode}</h2>
            {subsidiary.employees && subsidiary.employees.length ? (
                <List
                    dataSource={subsidiary.employees}
                    renderItem={(emp: Employee) => (
                        <List.Item className={styles.employeeCard}>
                            <div className={styles.employeeInfo}>
                                <div>
                                    <UserOutlined/> <strong>Full Name:</strong> {emp.fullName}
                                </div>
                                <div>
                                    <SolutionOutlined/> <strong>Date of Birth:</strong> {emp.dateOfBirth?.toString()}
                                </div>
                                <div>
                                    <strong>Personal ID:</strong> {emp.employeeCNP}
                                </div>
                                <div>
                                    <strong>Qualification:</strong>{" "}
                                    {emp.qualification ? formatQualification(emp.qualification) : "Not specified"}
                                </div>
                                <div>
                                    <strong>Years of Experience:</strong> {emp.yearsOfExperience}
                                </div>
                                <div className={styles.actions}>
                                    <div>
                                        <Button
                                            icon={<EditOutlined/>}
                                        />
                                    </div>
                                    <div>
                                        <Button
                                            icon={<DeleteOutlined/>}
                                            className={styles.delete}
                                        />
                                    </div>
                                </div>
                            </div>
                        </List.Item>
                    )}
                />
            ) : (
                <p>No employees found for this subsidiary.</p>
            )}
        </div>
    );
};

export default EmployeeDetails;
