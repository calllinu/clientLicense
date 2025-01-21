import React from 'react';
import {Button, Space, Table} from 'antd';
import {CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import styles from './register-requests.module.scss'
import {
    useAcceptRequestMutation,
    useDeclineRequestMutation,
    useGetRequestsByAdminQuery
} from "../../services/requestsApi.tsx";
import {RegistrationRequest} from "../../interfaces/RequestsApi.tsx";
import {ColumnsType} from 'antd/es/table';
import {Subsidiary} from "../../interfaces/SubsidiaryInterfaces.tsx";

const RegistrationRequests: React.FC = () => {
    const adminId = sessionStorage.getItem('userId');
    const {data, isLoading, isError} = useGetRequestsByAdminQuery(Number(adminId));
    const [acceptRequest] = useAcceptRequestMutation();
    const [declineRequest] = useDeclineRequestMutation();

    const handleAccept = (requestId: number) => {
        acceptRequest(requestId);
    };

    const handleDecline = (requestId: number) => {
        declineRequest(requestId);
    };

    const columns: ColumnsType<RegistrationRequest> = [
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
            key: 'subsidiary',
            render: (subsidiary: Subsidiary) => <span>{subsidiary.subsidiaryCode}</span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => <span>{status}</span>,
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
                        icon={<CloseCircleOutlined/>}
                        onClick={() => handleDecline(record.requestId)}
                        disabled={record.status !== 'PENDING'}
                    >
                        Decline
                    </Button>
                </Space>
            ),
        },
    ];

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading requests</div>;
    }

    return (
        <div className={styles.employeeContainer}>
            <h2>Registration Requests</h2>
            <Table
                columns={columns}
                dataSource={data}
                rowKey="requestId"
                pagination={false}
            />
        </div>
    );
};

export default RegistrationRequests;
