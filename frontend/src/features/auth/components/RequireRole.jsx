import { Navigate } from "react-router-dom";
import { useSession } from "../hooks/useSession";

export default function RequireRole({ allow = [], redirectTo = "/", children }) {
    const { session, me } = useSession();

    // If we have a token but 'me' hasn't loaded yet, we might want to wait
    // to avoid flickering or incorrect redirects if the session is stale.
    if (session?.token && !me) {
        return <div className="p-20 text-center text-slate-400 font-medium">Verificando acceso...</div>;
    }

    if (!session?.token) {
        return <Navigate to={redirectTo} replace />;
    }

    // Prefer 'me.role' as it's the source of truth from the server
    const currentRole = me?.role || session.role;

    if (allow.length && !allow.includes(currentRole)) {
        return <Navigate to="/" replace />;
    }

    return children;
}
