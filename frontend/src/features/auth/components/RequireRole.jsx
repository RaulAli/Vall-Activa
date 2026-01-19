import { Navigate } from "react-router-dom";
import { useSession } from "../hooks/useSession";

export default function RequireRole({ allow = [], redirectTo = "/", children }) {
    const { session: s } = useSession();
    if (!s?.token) return <Navigate to={redirectTo} replace />;
    if (allow.length && !allow.includes(s.role)) return <Navigate to="/" replace />;
    return children;
}
