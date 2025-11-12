import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() { 
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="dashboard-central">
            <h1>Welcome, {user?.name || "Guest"}</h1>
            <p>Role: {user?.role?.name || "N/A"}</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
}
