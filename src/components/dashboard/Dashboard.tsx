import {useCallback, useState} from 'react';
import {Layout} from 'antd';
import Statistics from "../statistics/Statistics.tsx";
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
import {useGetAllFeedbacksPageableQuery} from "../../services/feedbackApi.tsx";
import OwnerFeedbacks from "../ownerFeedbacks/OwnerFeedbacks.tsx";


const {Content} = Layout;

const Dashboard = () => {
    const isOrgAdmin = useOrgAdminRole();
    const isOwner = useOwnerRole();
    const handleLogout = useLogout();
    const [activeContent, setActiveContent] = useState(isOrgAdmin || isOwner ? 'data' : 'feedback');
    const [pagination, setPagination] = useState({current: 1, pageSize: 20});
    const userId = Number(sessionStorage.getItem("userId"));
    const {data: subsidiariesForOrganization, refetch} = useGetSubsidiariesForOrganizationQuery(userId);
    const {data: surveyContent, isLoading: isLoadingFeedbacks} = useGetAllFeedbacksPageableQuery({
        page: pagination.current - 1,
        size: pagination.pageSize,
    });

    const validFeedbacks = getValidFeedbacks(subsidiariesForOrganization?.subsidiaries ?? []);

    const handlePageChange = useCallback((page: number, pageSize: number) => {
        setPagination({current: page, pageSize});
    }, []);


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
                    fullName: employee.fullName,
                    dateOfBirth: employee.dateOfBirth,
                    dateOfHiring: employee.dateOfHiring,
                    personalNumber: employee.employeeCNP,
                    feedback: employee.feedback as FeedbackInterface
                }))
        );
    }

    console.log(surveyContent?.feedbacks);

    return (
        <Layout className={styles.dashboardLayout}>
            <Navbar handleContentSwitch={handleContentSwitch} handleLogout={handleLogout}/>

            <Layout className={styles.tableContent}>
                <Content key={activeContent}>
                    {activeContent === 'data' && (!isOwner ? <DataContent data={validFeedbacks}/> :
                            <OwnerFeedbacks
                                content={{
                                    feedbacks: surveyContent?.feedbacks ?? [],
                                    currentPage: surveyContent?.currentPage ?? 0,
                                    totalItems: surveyContent?.totalItems ?? 0,
                                    totalPages: surveyContent?.totalPages ?? 0
                                }}
                                isLoading={isLoadingFeedbacks}
                                onHandlePageChange={handlePageChange}
                            />

                    )}
                    {activeContent === 'statistics' && <Statistics/>}
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
