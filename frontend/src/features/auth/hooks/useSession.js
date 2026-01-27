import { useApp } from "../../../context/Provider";
export { readSession, writeSession, clearSession } from "../utils/sessionStore";

export function useSession() {
    const { session, setSession, me, refreshDashboard } = useApp();
    return { session, setSession, me, refreshDashboard };
}
