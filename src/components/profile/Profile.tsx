import {Button} from "antd";
import useLogout from "../../auth/authHooks/useLogOut.tsx";

const Profile = () => {
  const handleLogout = useLogout()

  return (
    <div>
      <h1>Profile</h1>
        <Button
        onClick={handleLogout}>
            Logout
        </Button>
    </div>
  );
}

export default Profile;
