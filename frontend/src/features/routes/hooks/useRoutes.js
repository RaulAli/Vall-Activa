import { useEffect, useState } from "react";
import { useApp } from "../../../context/Provider";
import { readSession } from "../../auth/hooks/useSession";

export function useRoutes(filters) {
    const { queries, refreshTrigger } = useApp();
    const { token } = readSession() || {};

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const items = await queries.routes.list(filters, token);
                if (mounted) setData(items || []);
            } catch (e) {
                if (mounted) setError(e);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => (mounted = false);
    }, [JSON.stringify(filters || {}), queries.routes, token, refreshTrigger]);

    return { data, loading, error };
}
