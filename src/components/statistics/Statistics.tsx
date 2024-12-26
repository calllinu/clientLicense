import { Row, Col } from 'antd';
import styles from './statistics.module.scss'

const StatisticsContent = () => {
    return (
        <Row className={styles.statisticsContent}>
            <Col span={24}>
                <h2>Statistics Content</h2>
                <p>Statistics content goes here...</p>
            </Col>
        </Row>
    );
};

export default StatisticsContent;
