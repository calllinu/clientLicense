import {Col, Row} from "antd";
import styles from "./Footer.module.scss";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <Row justify="center" align="middle" style={{width: "100%"}}>
                <Col>
                    <div className={styles.footerBottom}>
                        <span>© 2025 SafetyNet AI. All Rights Reserved</span>
                    </div>
                </Col>
            </Row>
        </footer>
    );
};

export default Footer;
