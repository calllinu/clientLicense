import styles from "./Navbar.module.scss";
import { UserOutlined, CommentOutlined, FundOutlined } from "@ant-design/icons";

const Navbar = () => {
    return (
        <header className={styles.navbar}>
            <div className={styles.logo}>
                <FundOutlined />
                <span>Company Name</span>
            </div>
            <div className={styles.navItems}>
                <div className={styles.navItem}>
                    <UserOutlined className={styles.icon} />
                    <span>Profile</span>
                </div>
                <div className={styles.navItem}>
                    <CommentOutlined className={styles.icon} />
                    <span>Feedback</span>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
