import {Button, Col, Drawer, Menu, Row} from "antd";
import {
    BarChartOutlined,
    CloseOutlined,
    CommentOutlined,
    DatabaseOutlined,
    LogoutOutlined,
    MenuOutlined,
    ShopOutlined,
    UsergroupAddOutlined,
    UserOutlined,
} from "@ant-design/icons";
import styles from "./Navbar.module.scss";
import {useCallback, useMemo, useState} from "react";
import {useMediaQuery} from "react-responsive";

const Navbar = ({
                    handleContentSwitch,
                    handleLogout,
                }: {
    handleContentSwitch: (contentType: string) => void;
    handleLogout: () => void;
}) => {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [dashboardSubMenuVisible, setDashboardSubMenuVisible] = useState(false);
    const isMobile = useMediaQuery({query: "(max-width: 768px)"});

    const openDrawer = useCallback(() => {
        setDrawerVisible(true);
    }, []);

    const closeDrawer = useCallback(() => {
        setDrawerVisible(false);
        setDashboardSubMenuVisible(false);
    }, []);

    const openDashboardSubMenu = useCallback(() => {
        setDashboardSubMenuVisible(true);
    }, []);

    const dashboardMenuItems = useMemo(() => [
        {
            key: "data",
            icon: <DatabaseOutlined/>,
            label: "Data",
            onClick: () => {
                handleContentSwitch("data");
                closeDrawer();
            },
        },
        {
            key: "statistics",
            icon: <BarChartOutlined/>,
            label: "Statistics",
            onClick: () => {
                handleContentSwitch("statistics");
                closeDrawer();
            },
        },
        {
            key: "requests",
            icon: <UsergroupAddOutlined/>,
            label: "Requests",
            onClick: () => {
                handleContentSwitch("requests");
                closeDrawer();
            },
        },
        {
            key: "organizations",
            icon: <ShopOutlined/>,
            label: "Organizations",
            onClick: () => {
                handleContentSwitch("organizations");
                closeDrawer();
            },
        },
    ], [handleContentSwitch, closeDrawer]);

    return (
        <header className={styles.navbar}>
            <Row align="middle" justify="space-between" style={{width: "100%"}}>
                <Col>
                    <div className={styles.logo}>
                        <span>SafetyNet AI</span>
                    </div>
                </Col>

                <Col className={styles.navItems}>
                    <Row align="middle" gutter={20}>
                        <Col>
                            <Button
                                className={`${styles.navButton} ${styles.dashboardButton}`}
                                icon={<MenuOutlined/>}
                                onClick={openDrawer}
                            >
                                Dashboard
                            </Button>
                        </Col>

                        <Col>
                            <Button
                                className={`${styles.navButton} ${styles.feedbackButton}`}
                                icon={<CommentOutlined/>}
                                onClick={() => handleContentSwitch("feedback")}
                            >
                                Feedback
                            </Button>
                        </Col>

                        <Col>
                            <Button
                                className={`${styles.navButton} ${styles.profileButton}`}
                                icon={<UserOutlined/>}
                                onClick={() => handleContentSwitch("profile")}
                            >
                                Profile
                            </Button>
                        </Col>

                        <Col>
                            <Button
                                className={`${styles.navButton} ${styles.logoutButton}`}
                                icon={<LogoutOutlined/>}
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </Col>
                    </Row>
                </Col>

                <Col className={styles.hamburgerMenu}>
                    <MenuOutlined className={styles.menuIcon} onClick={openDrawer}/>
                </Col>
            </Row>

            <Drawer
                title={
                    <div className={styles.drawerHeader}>
                        <span>Menu</span>
                        <CloseOutlined className={styles.closeIcon} onClick={closeDrawer}/>
                    </div>
                }
                placement="top"
                open={drawerVisible}
                onClose={closeDrawer}
                width="100%"
                closable={false}
                maskClosable
            >
                {isMobile ? (
                    <div>
                        <Button
                            className={`${styles.navButton} ${styles.drawerButton}`}
                            icon={<MenuOutlined/>}
                            onClick={openDashboardSubMenu}
                        >
                            Dashboard
                        </Button>

                        {dashboardSubMenuVisible && (
                            <Menu
                                items={dashboardMenuItems}
                                onClick={(e) => handleContentSwitch(e.key)}
                                mode="vertical"
                            />
                        )}

                        <Button
                            className={`${styles.navButton} ${styles.drawerButton}`}
                            icon={<CommentOutlined/>}
                            onClick={() => {
                                handleContentSwitch("feedback");
                                closeDrawer();
                            }}
                        >
                            Feedback
                        </Button>

                        <Button
                            className={`${styles.navButton} ${styles.drawerButton}`}
                            icon={<UserOutlined/>}
                            onClick={() => {
                                handleContentSwitch("profile");
                                closeDrawer();
                            }}
                        >
                            Profile
                        </Button>

                        <Button
                            className={`${styles.navButton} ${styles.drawerButton}`}
                            icon={<LogoutOutlined/>}
                            onClick={() => {
                                handleLogout();
                                closeDrawer();
                            }}
                        >
                            Logout
                        </Button>
                    </div>
                ) : (
                    <Menu
                        items={dashboardMenuItems}
                        onClick={(e) => handleContentSwitch(e.key)}
                        mode="vertical"
                    />
                )}
            </Drawer>
        </header>
    );
};

export default Navbar;
