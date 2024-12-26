import { useState} from 'react';
import { Layout, Row, Col, Dropdown, Button } from 'antd';
import { DatabaseOutlined, BarChartOutlined, LogoutOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import styles from './dasboard.module.scss';
import DataContent from "../data-content/DataContent.tsx";
import Statistics from ".././statistics/Statistics.tsx";
import { useNavigate } from 'react-router-dom';
import {useLogoutUserMutation} from "../../services/userApi.tsx";

// import {useLogoutMutation} from "../../services/userApi.tsx";

const { Sider, Content } = Layout;

const Dashboard = () => {
    const [collapsed, setCollapsed] = useState(true); // Sidebar collapse state
    const [activeContent, setActiveContent] = useState('data'); // State to track active content ("data" or "statistics")
    const navigate = useNavigate();
    const dummyEntries = [
        {
            id: 1,
            organization: 'Organization A',
            cnp: '1234567890123',
            salary: 'Yes',
            engagement: 'PHYSICALLY',
            overtime: 'Yes',
            equipment: 'Yes',
            safety: 'Yes',
            protection: 'Yes',
            dangerTimes: '>1'
        },
        {
            id: 2,
            organization: 'Organization B',
            cnp: '2345678901234',
            salary: 'No',
            engagement: 'MENTALLY',
            overtime: 'No',
            equipment: 'No',
            safety: 'Yes',
            protection: 'No',
            dangerTimes: '1-2'
        },
        {
            id: 3,
            organization: 'Organization C',
            cnp: '3456789012345',
            salary: 'Yes',
            engagement: 'PHYSICALLY_AND_MENTALLY',
            overtime: 'Yes',
            equipment: 'Yes',
            safety: 'Yes',
            protection: 'Yes',
            dangerTimes: '2-4'
        },
        {
            id: 4,
            organization: 'Organization D',
            cnp: '4567890123456',
            salary: 'No',
            engagement: 'PHYSICALLY',
            overtime: 'No',
            equipment: 'No',
            safety: 'No',
            protection: 'Yes',
            dangerTimes: '4-6'
        },
        {
            id: 5,
            organization: 'Organization E',
            cnp: '5678901234567',
            salary: 'Yes',
            engagement: 'MENTALLY',
            overtime: 'Yes',
            equipment: 'Yes',
            safety: 'Yes',
            protection: 'No',
            dangerTimes: 'FULL_TIME'
        },
        {
            id: 6,
            organization: 'Organization F',
            cnp: '6789012345678',
            salary: 'Yes',
            engagement: 'PHYSICALLY_AND_MENTALLY',
            overtime: 'No',
            equipment: 'Yes',
            safety: 'No',
            protection: 'Yes',
            dangerTimes: '2-4'
        },
        {
            id: 7,
            organization: 'Organization G',
            cnp: '7890123456789',
            salary: 'No',
            engagement: 'PHYSICALLY',
            overtime: 'Yes',
            equipment: 'No',
            safety: 'Yes',
            protection: 'No',
            dangerTimes: '>1'
        },
        {
            id: 8,
            organization: 'Organization H',
            cnp: '8901234567890',
            salary: 'Yes',
            engagement: 'MENTALLY',
            overtime: 'Yes',
            equipment: 'Yes',
            safety: 'Yes',
            protection: 'Yes',
            dangerTimes: '1-2'
        },
        {
            id: 9,
            organization: 'Organization I',
            cnp: '9012345678901',
            salary: 'No',
            engagement: 'PHYSICALLY_AND_MENTALLY',
            overtime: 'No',
            equipment: 'No',
            safety: 'Yes',
            protection: 'Yes',
            dangerTimes: '4-6'
        },
        {
            id: 10,
            organization: 'Organization J',
            cnp: '0123456789012',
            salary: 'Yes',
            engagement: 'PHYSICALLY',
            overtime: 'No',
            equipment: 'Yes',
            safety: 'No',
            protection: 'No',
            dangerTimes: 'FULL_TIME'
        },
    ];

    const menuItems = [
        { key: '1', label: 'Custom Action 1' },
        { key: '2', label: 'Custom Action 2' },
        { key: '3', label: 'Custom Action 3' },
    ];

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const [logout] = useLogoutUserMutation();

    const handleLogout = async () => {
        try {
            await logout({
                accessToken: sessionStorage.getItem('accessToken') || undefined,
                refreshToken: sessionStorage.getItem('refreshToken') || undefined,
            }).unwrap().then(() => {
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('refreshToken');

                navigate('/login');
            })
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };


    return (
        <Layout className={styles.dashboardLayout}>
            <Sider className={`${styles.sidebar} ${collapsed ? styles.collapsedSidebar : ''}`} collapsible collapsed={collapsed} trigger={null}>
                <Col className={styles.sidebarContent}>
                    <Col className={styles.navigation}>
                        <Button
                            className={styles.sidebarButton}
                            icon={<DatabaseOutlined />}
                            onClick={() => setActiveContent('data')}
                        >
                            Data
                        </Button>
                        <Button
                            className={styles.sidebarButton}
                            icon={<BarChartOutlined />}
                            onClick={() => setActiveContent('statistics')}
                        >
                            Statistics
                        </Button>
                    </Col>
                    <Button
                        className={`${styles.sidebarButton} ${styles.logoutButton}`}
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Col>
            </Sider>

            <Col className={styles.sidebarToggle} onClick={toggleSidebar}>
                {collapsed ? <RightOutlined /> : <LeftOutlined />}
            </Col>

            <Layout>
                <Row className={styles.navbar}>
                    <Col span={24} className={styles.actions}>
                        <Dropdown menu={{ items: menuItems }} placement="bottomRight">
                            <Button className={styles.customActionButton}>Actions</Button>
                        </Dropdown>
                    </Col>
                </Row>

                <Content className={styles.tableContent}>
                    {activeContent === 'data' && <DataContent dummyEntries={dummyEntries} />}
                    {activeContent === 'statistics' && <Statistics />}
                </Content>
            </Layout>
        </Layout>
    );
};

export default Dashboard;
