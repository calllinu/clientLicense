import {FeedbackInterface} from "../../../interfaces/FeedbackInterfaces.tsx";
import {Spin} from "antd";
import styles from './../utils/statistics.module.scss';
import ChartRow from "../utils/ChartRow.tsx";

interface StatisticsContentOrgAdminProps {
    feedbacks: FeedbackInterface[];
    isLoading: boolean;
}

const StatisticsContentOrgAdmin = ({feedbacks, isLoading}: StatisticsContentOrgAdminProps) => {

    if (isLoading) return <Spin className={styles.spinner} size="large"/>;

    return (
        <div className={styles.mainContainer}>
            <ChartRow feedbacks={feedbacks}/>
        </div>
    );
};

export default StatisticsContentOrgAdmin;
