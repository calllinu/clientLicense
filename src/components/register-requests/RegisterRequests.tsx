import React, {useCallback, useMemo} from 'react';
import {Button, Space, Table} from 'antd';
import {CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import styles from './register-requests.module.scss';
import {
    useAcceptRequestMutation,
    useDeclineRequestMutation,
    useGetRequestsByAdminQuery,
} from "../../services/requestsApi.tsx";
import {RegistrationRequest} from "../../interfaces/RegistrationRequest.tsx";
import {ColumnsType} from 'antd/es/table';
import {Subsidiary} from "../../interfaces/SubsidiaryInterfaces.tsx";

const RegistrationRequests: React.FC = () => {
    const adminId = sessionStorage.getItem('userId');
    const {data, isLoading, isError, refetch} = useGetRequestsByAdminQuery(Number(adminId));
    const [acceptRequest] = useAcceptRequestMutation();
    const [declineRequest] = useDeclineRequestMutation();

    const handleAccept = useCallback(
        async (requestId: number) => {
            await acceptRequest(requestId);
            refetch();
        },
        [acceptRequest, refetch]
    );

    const handleDecline = useCallback(
        async (requestId: number) => {
            await declineRequest(requestId);
            refetch();
        },
        [declineRequest, refetch]
    );


    const columns: ColumnsType<RegistrationRequest> = useMemo(() => [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Subsidiary Code',
            dataIndex: 'subsidiary',
            key: 'subsidiaryCode',
            render: (subsidiary: Subsidiary) => <span>{subsidiary.subsidiaryCode}</span>,
        },
        {
            title: 'Subsidiary Location',
            dataIndex: 'subsidiary',
            key: 'subsidiaryLocation',
            render: (subsidiary: Subsidiary) => (
                <span>
                    {subsidiary.address}, {subsidiary.city}, {subsidiary.country}
                </span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <span style={{fontWeight: status === 'PENDING' ? 'bold' : 'normal'}}>
                    {status}
                </span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: RegistrationRequest, record: { status: string; requestId: number }) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<CheckCircleOutlined/>}
                        onClick={() => handleAccept(record.requestId)}
                        disabled={record.status !== 'PENDING'}
                    >
                        Accept
                    </Button>
                    <Button
                        danger
                        icon={<CloseCircleOutlined/>}
                        onClick={() => handleDecline(record.requestId)}
                        disabled={record.status !== 'PENDING'}
                    >
                        Decline
                    </Button>
                </Space>
            ),
        },
    ], [handleAccept, handleDecline]);

    const tableData = useMemo(() => {
        if (!data) return [];
        return [...data].sort((a, b) => (a.status === 'PENDING' ? -1 : b.status === 'PENDING' ? 1 : 0));
    }, [data]);


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading requests</div>;
    }

    return (
        <div className={styles.mainContainer}>
            <div className={styles.employeeContainer}>
                <h2>Registration Requests</h2>
                <Table
                    columns={columns}
                    dataSource={tableData}
                    rowKey="requestId"
                    scroll={{x: true}}
                />
            </div>
        </div>

    );
};

export default RegistrationRequests;
