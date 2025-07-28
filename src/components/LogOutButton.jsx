import { useNavigate } from "react-router-dom";
import { useToken } from "../store/AuthContext";
import {logout} from "../util"

export default function LogOutButton() {
    const {setToken} = useToken();
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout(setToken);
        navigate("/");
    };

    return (
        <button onClick={handleLogout} className="hover:cursor-pointer">
            Logout
        </button>
    )
}