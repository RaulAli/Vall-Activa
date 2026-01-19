import { Navigate, useLocation } from "react-router-dom";
import { readSession } from "../hooks/useSession";

export default function RequireAuth({ children, redirectTo = "/athlete/login" }) {
    const loc = useLocation();
    const s = readSession();
    if (!s?.token) return <Navigate to={redirectTo} replace state={{ from: loc.pathname }} />;
    return children;
}
