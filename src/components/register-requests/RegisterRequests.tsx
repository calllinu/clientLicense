import { Row, Col } from 'antd';
import styles from './register-requests.module.scss'

const StatisticsContent = () => {
    return (
        <Row className={styles.statisticsContent}>
            <Col span={24}>
                <h2>Registers Content</h2>
                <p>Registers content goes here...</p>
            </Col>
        </Row>
    );
};

export default StatisticsContent;
