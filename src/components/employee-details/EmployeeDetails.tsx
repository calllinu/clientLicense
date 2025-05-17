import {DeleteOutlined, EditOutlined, SolutionOutlined, UserOutlined} from '@ant-design/icons';
import {Button, Table} from 'antd';
import {useLocation, useNavigate} from 'react-router-dom';
import styles from './employee-details.module.scss';
import {Employee} from '../../interfaces/EmployeeInterfaces.tsx';
import {Qualification} from '../../interfaces/enums/Qualification.tsx';
import {useDeleteEmployeeMutation, useGetEmployeeAtSubsidiaryQuery} from '../../services/employeeApi.tsx';
import {useCallback, useState} from 'react';
import ConfirmDeleteModal from '../modals/confirm-delete-modal/ConfirmDeleteModal.tsx';
import EditEmployeeModal from '../modals/edit-profile-modal/EditEmployeeModal.tsx';
import Footer from '../footer/Footer.tsx';
import Navbar from '../nav-bar/Navbar.tsx';

const EmployeeDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {subsidiaryId, subsidiaryCode} = location.state || {};
    const [deleteEmployee] = useDeleteEmployeeMutation();
    const {data: employees, refetch} = useGetEmployeeAtSubsidiaryQuery(subsidiaryId);

    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);

    const formatQualification = (qualification: Qualification): string => {
        return qualification
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const deleteEmployeeHandle = useCallback(
        async (employeeId: number) => {
            await deleteEmployee(employeeId).unwrap();
            refetch();
            setIsDeleteModalVisible(false);
        },
        [deleteEmployee, refetch]
    );

    const showDeleteModal = useCallback((employee: Employee) => {
        setEmployeeToDelete(employee);
        setIsDeleteModalVisible(true);
    }, []);

    const showEditModal = useCallback((employee: Employee) => {
        setEmployeeToEdit(employee);
        setIsEditModalVisible(true);
    }, []);

    const handleLogout = useCallback(() => {
        sessionStorage.clear();
        navigate('/login');
    }, [navigate]);

    if (!subsidiaryId) return <p>No subsidiary data found.</p>;

    const columns = [
        {
            title: (
                <>
                    <UserOutlined/> Full Name
                </>
            ),
            dataIndex: 'fullName',
            key: 'fullName',
            render: (text: string) => (
                <span className={text ? '' : styles.notCompleted}>{text || 'Not completed'}</span>
            ),
        },
        {
            title: (
                <>
                    <SolutionOutlined/> Date of Birth
                </>
            ),
            dataIndex: 'dateOfBirth',
            key: 'dateOfBirth',
            render: (date: string) => (
                <span className={date ? '' : styles.notCompleted}>{date?.toString() || 'Not completed'}</span>
            ),
        },
        {
            title: (
                <>
                    <SolutionOutlined/> Date of Hiring
                </>
            ),
            dataIndex: 'dateOfHiring',
            key: 'dateOfHiring',
            render: (text: string) => (
                <span className={text ? '' : styles.notCompleted}>{text || 'Not completed'}</span>
            ),
        },
        {
            title: 'Personal ID',
            dataIndex: 'employeeCNP',
            key: 'employeeCNP',
            render: (text: string) => (
                <span className={text ? '' : styles.notCompleted}>{text || 'Not completed'}</span>
            ),
        },
        {
            title: 'Qualification',
            dataIndex: 'qualification',
            key: 'qualification',
            render: (qualification: Qualification) => (
                <span className={qualification ? '' : styles.notCompleted}>
          {qualification ? formatQualification(qualification) : 'Not completed'}
        </span>
            ),
        },
        {
            title: 'Years of Experience',
            dataIndex: 'yearsOfExperience',
            key: 'yearsOfExperience',
            render: (text: number) => (
                <span className={text !== undefined ? '' : styles.notCompleted}>
                  {text != undefined ? text : 'Not completed'}
                </span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (employee: Employee) => (
                <div className={styles.actions}>
                    <Button icon={<EditOutlined/>} onClick={() => showEditModal(employee)}/>
                    <Button
                        icon={<DeleteOutlined/>}
                        className={styles.delete}
                        onClick={() => showDeleteModal(employee)}
                    />
                </div>
            ),
        },
    ];

    return (
        <div>
            <Navbar
                handleContentSwitch={() => {
                }}
                handleLogout={handleLogout}
                isDashboard={false}
            />
            <div className={styles.employeeContainer}>
                <h2>Employees at {subsidiaryCode}</h2>
                {employees && employees.length ? (
                    <Table
                        dataSource={employees}
                        columns={columns}
                        rowKey={(employee: Employee) => employee?.employeeId || 'unknown'}
                        pagination={{pageSize: 20}}
                        scroll={{x: true}}
                    />
                ) : (
                    <p style={{height: "100vh"}}>No employees found for this subsidiary.</p>
                )}

                <ConfirmDeleteModal
                    isVisible={isDeleteModalVisible}
                    onCancel={() => setIsDeleteModalVisible(false)}
                    onConfirm={() =>
                        employeeToDelete && deleteEmployeeHandle(employeeToDelete.employeeId as number)
                    }
                    messageText={`Are you sure you want to delete employee: ${employeeToDelete?.fullName}?`}
                    titleText="Delete Employee"
                />

                <EditEmployeeModal
                    visible={isEditModalVisible}
                    onCancel={() => setIsEditModalVisible(false)}
                    refetch={refetch}
                    employee={employeeToEdit}
                    employeeId={employeeToEdit?.employeeId as number}
                />
            </div>
            <Footer/>
        </div>
    );
};

export default EmployeeDetails;