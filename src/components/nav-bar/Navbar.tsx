import {Button, Col, Drawer, Menu, Row} from 'antd';
import {
    ArrowLeftOutlined,
    BarChartOutlined,
    CloseOutlined,
    CommentOutlined,
    DatabaseOutlined,
    LogoutOutlined,
    MenuOutlined,
    ShopOutlined,
    UsergroupAddOutlined,
    UserOutlined,
} from '@ant-design/icons';
import styles from './Navbar.module.scss';
import {useCallback, useMemo, useState} from 'react';
import {useMediaQuery} from 'react-responsive';
import {useNavigate} from 'react-router-dom';
import useOrgAdminRole from '../../hooks/useOrgAdminRole.tsx';
import useOwnerRole from '../../hooks/useOwnerRole.tsx';

interface NavbarProps {
    handleContentSwitch: (contentType: string) => void;
    handleLogout: () => void;
    isDashboard?: boolean;
}

const Navbar = ({
                    handleContentSwitch,
                    handleLogout,
                    isDashboard = true,
                }: NavbarProps) => {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [dashboardSubMenuVisible, setDashboardSubMenuVisible] = useState(false);
    const isMobile = useMediaQuery({query: '(max-width: 768px)'});
    const isOrgAdmin = useOrgAdminRole();
    const isOwner = useOwnerRole();
    const navigate = useNavigate();

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

    const dashboardMenuItems = useMemo(() => {
        const items = [
            {
                key: 'data',
                icon: <DatabaseOutlined/>,
                label: 'Data',
                onClick: () => {
                    handleContentSwitch('data');
                    closeDrawer();
                },
            },
            {
                key: 'statistics',
                icon: <BarChartOutlined/>,
                label: 'Statistics',
                onClick: () => {
                    handleContentSwitch('statistics');
                    closeDrawer();
                },
            },
        ];

        if (isOwner) {
            items.push({
                key: 'organizations',
                icon: <ShopOutlined/>,
                label: 'Organizations',
                onClick: () => {
                    handleContentSwitch('organizations');
                    closeDrawer();
                },
            });
        }

        if (isOrgAdmin) {
            items.push(
                {
                    key: 'requests',
                    icon: <UsergroupAddOutlined/>,
                    label: 'Requests',
                    onClick: () => {
                        handleContentSwitch('requests');
                        closeDrawer();
                    },
                },
                {
                    key: 'subsidiaries',
                    icon: <ShopOutlined/>,
                    label: 'Subsidiaries',
                    onClick: () => {
                        handleContentSwitch('subsidiaries');
                        closeDrawer();
                    },
                }
            );
        }

        return items;
    }, [handleContentSwitch, closeDrawer, isOwner, isOrgAdmin]);

    const simpleMenuItems = useMemo(() => [
        {
            key: 'back',
            icon: <ArrowLeftOutlined/>,
            label: 'Back to Dashboard',
            onClick: () => {
                navigate('/dashboard');
                closeDrawer();
            },
        },
        {
            key: 'logout',
            icon: <LogoutOutlined/>,
            label: 'Logout',
            onClick: () => {
                handleLogout();
                closeDrawer();
            },
        },
    ], [navigate, handleLogout, closeDrawer]);

    return (
        <header className={styles.navbar}>
            <Row align="middle" justify="space-between" style={{width: '100%'}}>
                <Col>
                    <div className={styles.logo}>
                        <span>SafetyNet AI</span>
                    </div>
                </Col>

                <Col className={styles.navItems}>
                    <Row align="middle" gutter={20}>
                        {isDashboard && (isOrgAdmin || isOwner) && (
                            <Col>
                                <Button
                                    className={`${styles.navButton} ${styles.dashboardButton}`}
                                    icon={<MenuOutlined/>}
                                    onClick={openDrawer}
                                >
                                    Dashboard
                                </Button>
                            </Col>
                        )}
                        {!isDashboard && (
                            <Col>
                                <Button
                                    className={`${styles.navButton}`}
                                    icon={<ArrowLeftOutlined/>}
                                    onClick={() => navigate('/dashboard')}
                                >
                                    Back to Dashboard
                                </Button>
                            </Col>
                        )}
                        {isDashboard && (
                            <Col>
                                <Button
                                    className={`${styles.navButton} ${styles.feedbackButton}`}
                                    icon={<CommentOutlined/>}
                                    onClick={() => handleContentSwitch('feedback')}
                                >
                                    Feedback
                                </Button>
                            </Col>
                        )}
                        {isDashboard && (
                            <Col>
                                <Button
                                    className={`${styles.navButton} ${styles.profileButton}`}
                                    icon={<UserOutlined/>}
                                    onClick={() => handleContentSwitch('profile')}
                                >
                                    Profile
                                </Button>
                            </Col>
                        )}
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
                placement={isMobile ? 'top' : 'left'}
                open={drawerVisible}
                onClose={closeDrawer}
                width="400px"
                height="250px"
                closable={false}
                maskClosable
            >
                {isMobile ? (
                    <div>
                        {isDashboard && (isOrgAdmin || isOwner) && (
                            <Button
                                className={`${styles.navButton} ${styles.drawerButton}`}
                                icon={<MenuOutlined/>}
                                onClick={openDashboardSubMenu}
                            >
                                Dashboard
                            </Button>
                        )}
                        {!isDashboard && (
                            <Button
                                className={`${styles.navButton} ${styles.drawerButton}`}
                                icon={<ArrowLeftOutlined/>}
                                onClick={() => {
                                    navigate('/dashboard');
                                    closeDrawer();
                                }}
                            >
                                Back to Dashboard
                            </Button>
                        )}
                        {dashboardSubMenuVisible && isDashboard && (
                            <Menu
                                items={dashboardMenuItems}
                                onClick={(e) => handleContentSwitch(e.key)}
                                mode="vertical"
                            />
                        )}
                        {isDashboard && (
                            <Button
                                className={`${styles.navButton} ${styles.drawerButton}`}
                                icon={<CommentOutlined/>}
                                onClick={() => {
                                    handleContentSwitch('feedback');
                                    closeDrawer();
                                }}
                            >
                                Feedback
                            </Button>
                        )}
                        {isDashboard && (
                            <Button
                                className={`${styles.navButton} ${styles.drawerButton}`}
                                icon={<UserOutlined/>}
                                onClick={() => {
                                    handleContentSwitch('profile');
                                    closeDrawer();
                                }}
                            >
                                Profile
                            </Button>
                        )}
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
                        items={isDashboard ? dashboardMenuItems : simpleMenuItems}
                        onClick={(e) => {
                            if (isDashboard) handleContentSwitch(e.key);
                        }}
                        mode="vertical"
                    />
                )}
            </Drawer>
        </header>
    );
};

export default Navbar;