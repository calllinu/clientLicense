import {Row, Col, Dropdown,  MenuProps} from "antd";
import { UserOutlined, CommentOutlined, MenuOutlined } from "@ant-design/icons";
import styles from "./Navbar.module.scss";

type MenuItem = Required<MenuProps>['items'][number];

const Navbar = () => {

    const menuItems: MenuItem[] = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Profile',
            className: styles.menuItem,
        },
        {
            key: 'feedback',
            icon: <CommentOutlined />,
            label: 'Feedback',
            className: styles.menuItem,
        },
    ];

    const menu: MenuProps = {
        items: menuItems,
    };

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
                    <Dropdown menu={menu} trigger={["click"]}>
                        <MenuOutlined className={styles.menuIcon} />
                    </Dropdown>
                </Col>
            </Row>
        </header>
    );
};

export default Navbar;
