import { Button } from "antd";
import useLogout from "../../auth/authHooks/useLogOut.tsx";
import Navbar from "../nav-bar/Navbar.tsx";

const Profile = () => {
    const handleLogout = useLogout();

    return (
        <>
            <Navbar />
            <div>
                <h1>Profile</h1>
                <Button onClick={handleLogout}>Logout</Button>
            </div>
        </>
    );
};

export default Profile;
