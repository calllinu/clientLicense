import {Row, Select, Spin} from 'antd';
import {useCallback, useEffect, useState} from 'react';
import {useGetFeedbacksForOrganizationQuery} from "../../../services/feedbackApi.tsx";
import {useGetAllOrganizationsCodeQuery} from "../../../services/organizationApi.tsx";
import styles from './../utils/statistics.module.scss';
import ChartRow from "../utils/ChartRow.tsx";

const {Option} = Select;


const StatisticsContentOwner = () => {
    const {data: organizationsCodes, isLoading: orgLoading} = useGetAllOrganizationsCodeQuery();
    const [selectedOrgCode, setSelectedOrgCode] = useState<string | null>(organizationsCodes ? organizationsCodes[0] : null);

    useEffect(() => {
        if (organizationsCodes?.length && !selectedOrgCode) {
            setSelectedOrgCode(organizationsCodes[0]);
        }
    }, [organizationsCodes, selectedOrgCode]);

    const handleOrgChange = useCallback((orgCode: string) => {
        setSelectedOrgCode(orgCode);
    }, []);

    const {data: feedbacksForOrganization, isLoading: feedbackLoading, error: feedbackError} =
        useGetFeedbacksForOrganizationQuery({organizationCode: selectedOrgCode || ""}, {skip: !selectedOrgCode});

    if (orgLoading || feedbackLoading) return <Spin className={styles.spinner}/>;
    if (feedbackError) return <div>Error fetching feedbacks</div>;

    return (
        <div className={styles.mainContainer}>
            <Row className={styles.firstRow}>
                <Select value={selectedOrgCode} style={{width: 200}} onChange={handleOrgChange}>
                    {organizationsCodes?.map(orgCode => (
                        <Option key={orgCode} value={orgCode}>
                            {orgCode}
                        </Option>
                    ))}
                </Select>
            </Row>

            <ChartRow feedbacks={feedbacksForOrganization}/>
        </div>
    );
};

export default StatisticsContentOwner;
