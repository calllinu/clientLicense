import { Row, Col, Dropdown, Menu } from "antd";
import { UserOutlined, CommentOutlined, MenuOutlined } from "@ant-design/icons";
import styles from "./Navbar.module.scss";

const Navbar = () => {

    const menu = (
        <Menu className={styles.dropdownMenu}>
            <Menu.Item key="profile" icon={<UserOutlined />} className={styles.menuItem}>
                Profile
            </Menu.Item>
            <Menu.Item key="feedback" icon={<CommentOutlined />} className={styles.menuItem}>
                Feedback
            </Menu.Item>
        </Menu>
    );

    return (
        <header className={styles.navbar}>
            <Row align="middle" justify="space-between" style={{ width: "100%" }}>
                <Col>
                    <div className={styles.logo}>
                        <span>SafetyNet AI</span>
                    </div>
                </Col>

                <Col className={styles.navItems}>
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

                <Col className={styles.hamburgerMenu}>
                    <Dropdown overlay={menu} trigger={["click"]}>
                        <MenuOutlined className={styles.menuIcon} />
                    </Dropdown>
                </Col>
            </Row>
        </header>
    );
};

export default Navbar;
