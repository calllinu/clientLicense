import {useCallback, useMemo, useState} from 'react';
import {Layout} from 'antd';
import DataContent from "../data-content/DataContent.tsx";
import Statistics from "../statistics/Statistics.tsx";
import useLogout from "../../auth/authHooks/useLogOut.tsx";
import RegisterRequests from "../register-requests/RegisterRequests.tsx";
import Organizations from "../organizations/Organizations.tsx";
import Navbar from "../nav-bar/Navbar.tsx";
import Footer from "../footer/Footer.tsx";
import styles from './dasboard.module.scss';

const {Content} = Layout;

const Dashboard = () => {
    const [activeContent, setActiveContent] = useState('data');
    const handleLogout = useLogout();

    const dummyEntries = useMemo(() => [
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
    ], []);

    const handleContentSwitch = useCallback((contentType: string) => {
        setActiveContent(contentType);
    }, []);

    return (
        <Layout className={styles.dashboardLayout}>
            <Navbar handleContentSwitch={handleContentSwitch} handleLogout={handleLogout}/>

            <Layout className={styles.tableContent}>
                <Content>
                    {activeContent === 'data' && <DataContent dummyEntries={dummyEntries}/>}
                    {activeContent === 'statistics' && <Statistics/>}
                    {activeContent === 'requests' && <RegisterRequests/>}
                    {activeContent === 'organizations' && <Organizations/>}
                </Content>
            </Layout>
            <Footer/>
        </Layout>

    );
};

export default Dashboard;
