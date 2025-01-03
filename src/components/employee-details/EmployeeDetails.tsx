import { UserOutlined, SolutionOutlined } from "@ant-design/icons";
import { List } from "antd";
import { useLocation } from "react-router-dom";
import styles from './employee-details.module.scss'
import {Employee} from "../../interfaces/EmployeeInterfaces.tsx";

const EmployeeDetails = () => {
    const location = useLocation();
    const { subsidiary } = location.state || {};

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
                                    <strong>Qualification:</strong> {emp.qualification}
                                </div>
                                <div>
                                    <strong>Years of Experience:</strong> {emp.yearsOfExperience}
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
