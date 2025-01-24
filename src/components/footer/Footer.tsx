import {Col, Row} from "antd";
import {EnvironmentOutlined, MailOutlined, PhoneOutlined} from "@ant-design/icons";
import styles from "./Footer.module.scss";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <Row justify="space-around" align="top" gutter={[16, 16]} style={{width: "100%"}}>
                <Col xs={24} sm={12} md={8} lg={6}>
                    <h3 className={styles.sectionTitle}>About SafetyNet AI</h3>
                    <p className={styles.sectionText}>
                        SafetyNet AI is dedicated to providing advanced solutions to ensure safety and security across
                        industries. Our mission is to use technology for a safer future.
                    </p>
                </Col>

                <Col xs={24} sm={12} md={8} lg={6}>
                    <h3 className={styles.sectionTitle}>Contact Us</h3>
                    <p className={styles.contact}>
                        <PhoneOutlined/> +1 (555) 123-4567
                    </p>
                    <p className={styles.contact}>
                        <MailOutlined/> support@safetynetai.com
                    </p>
                    <p className={styles.contact}>
                        <EnvironmentOutlined/> 123 Innovation Blvd, Tech City, USA
                    </p>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8}>
                    <h3 className={styles.sectionTitle}>Find Us</h3>
                    <div className={styles.map}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019243269411!2d144.96439251531995!3d-37.80823247975195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0x5045675218ce840!2s123%20Innovation%20Blvd!5e0!3m2!1sen!2sus!4v1643884166000!5m2!1sen!2sus"
                            width="100%"
                            style={{border: 0}}
                            allowFullScreen={true}
                            loading="lazy"
                        ></iframe>
                    </div>
                </Col>
            </Row>
            <div className={styles.footerBottom}>
                <span>2025 SafetyNet AI. All Rights Reserved</span>
            </div>
        </footer>
    );
};

export default Footer;
