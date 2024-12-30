import { Row, Col } from "antd";
import { UserOutlined, CommentOutlined } from "@ant-design/icons";
import styles from "./Navbar.module.scss";

const Navbar = () => {
    return (
        <header className={styles.navbar}>
            <Row align="middle" justify="space-between" style={{ width: "100%" }}>
                <Col>
                    <div className={styles.logo}>
                        <span>SafetyNet AI</span>
                    </div>
                </Col>

                <Col>
                    <Row align="middle" gutter={20}>
                        <Col>
                            <div className={`${styles.navItem} ${styles.active}`}>
                                <UserOutlined className={styles.icon} />
                                <span>Profile</span>
                            </div>
                        </Col>
                        <Col>
                            <div className={styles.navItem}>
                                <CommentOutlined className={styles.icon} />
                                <span>Feedback</span>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </header>
    );
};

export default Navbar;
