import {useCallback, useState} from 'react';
import {Layout} from 'antd';
import useLogout from "../../auth/authHooks/useLogOut.tsx";
import RegisterRequests from "../register-requests/RegisterRequests.tsx";
import Organizations from "../organizations/Organizations.tsx";
import Navbar from "../nav-bar/Navbar.tsx";
import Footer from "../footer/Footer.tsx";
import styles from './dasboard.module.scss';
import Profile from "../profile/Profile.tsx";
import useOrgAdminRole from "../../hooks/useOrgAdminRole.tsx";
import useOwnerRole from "../../hooks/useOwnerRole.tsx";
import {useGetSubsidiariesForOrganizationQuery} from "../../services/organizationApi.tsx";
import SubsidiaryForOrganization from "../subsidiaries/SubsidiaryForOrganization.tsx";
import SurveyForm from "../feedback/SurveyForm.tsx";
import {Subsidiary} from "../../interfaces/SubsidiaryInterfaces.tsx";
import {FeedbackInterface} from "../../interfaces/FeedbackInterfaces.tsx";
import DataContent from "../data-content/DataContent.tsx";
import OwnerFeedbacks from "../ownerFeedbacks/OwnerFeedbacks.tsx";
import StatisticsContentOwner from "../statistics/owner-stats/StatisticsContentOwner.tsx";
import StatisticsContentOrgAdmin from "../statistics/org-admin-stats/StatisticsContentOrgAdmin.tsx";


const {Content} = Layout;

const Dashboard = () => {
    const isOrgAdmin = useOrgAdminRole();
    const isOwner = useOwnerRole();
    const handleLogout = useLogout();
    const [activeContent, setActiveContent] = useState(isOrgAdmin || isOwner ? 'data' : 'feedback');
    const userId = Number(sessionStorage.getItem("userId"));
    const {
        data: subsidiariesForOrganization,
        refetch,
        isLoading: isLoadingData
    } = useGetSubsidiariesForOrganizationQuery(userId);
    const validFeedbacks = getValidFeedbacks(subsidiariesForOrganization?.subsidiaries ?? []);
    const feedbacksForOrgAdmin = getValidFeedbacksForOrgAdmin(subsidiariesForOrganization?.subsidiaries ?? []);

    const handleContentSwitch = useCallback((contentType: string) => {
        setActiveContent(contentType);
    }, []);

    function getValidFeedbacks(subsidiaries: Subsidiary[]) {
        return subsidiaries.flatMap(subsidiary =>
            subsidiary.employees
                .filter(employee => employee.feedback !== null && employee.employeeId !== undefined)
                .map(employee => ({
                    subsidiaryId: subsidiary.subsidiaryId,
                    subsidiaryCode: subsidiary.subsidiaryCode,
                    country: subsidiary.country,
                    city: subsidiary.city,
                    address: subsidiary.address,
                    feedback: employee.feedback as FeedbackInterface
                }))
        );
    }

    function getValidFeedbacksForOrgAdmin(subsidiaries: Subsidiary[]): FeedbackInterface[] {
        return subsidiaries.flatMap(subsidiary =>
            subsidiary.employees
                .filter(employee => employee.feedback !== null && employee.employeeId !== undefined)
                .map(employee => employee.feedback as FeedbackInterface)
        );
    }


    return (
        <Layout className={styles.dashboardLayout}>
            <Navbar handleContentSwitch={handleContentSwitch} handleLogout={handleLogout}/>

            <Layout className={styles.tableContent}>
                <Content key={activeContent}>
                    {activeContent === 'data' && (!isOwner ? <OwnerFeedbacks/> :
                            <DataContent
                                data={validFeedbacks}
                                isLoading={isLoadingData}
                            />
                    )}
                    {activeContent === 'statistics' && (isOwner ? <StatisticsContentOwner/> :
                            <StatisticsContentOrgAdmin
                                feedbacks={feedbacksForOrgAdmin}
                                isLoading={isLoadingData}
                            />
                    )}
                    {activeContent === 'requests' && <RegisterRequests/>}
                    {activeContent === 'organizations' && <Organizations/>}
                    {activeContent === 'profile' && <Profile/>}
                    {activeContent === 'feedback' && <SurveyForm/>}
                    {
                        activeContent === 'subsidiaries' && (
                            <SubsidiaryForOrganization
                                subsidiaries={subsidiariesForOrganization?.subsidiaries}
                                organizationId={subsidiariesForOrganization?.organizationId}
                                refetch={refetch}
                            />
                        )
                    }

                </Content>
            </Layout>
            <Footer/>
        </Layout>
    );
};

export default Dashboard;
