import { Row, Col } from "antd";
import { CopyrightOutlined } from "@ant-design/icons";
import styles from "./Footer.module.scss";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <Row justify="center" align="middle" style={{ width: "100%" }}>
                <Col>
                    <div className={styles.footerContent}>
                        <CopyrightOutlined className={styles.icon} />
                        <span>2025 SafetyNet AI. All Rights Reserved</span>
                    </div>
                </Col>
            </Row>
        </footer>
    );
};

export default Footer;
