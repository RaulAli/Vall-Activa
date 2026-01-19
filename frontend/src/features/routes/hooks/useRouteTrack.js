import { useEffect, useState } from "react";
import { useApp } from "../../../context/Provider";
import { readSession } from "../../auth/hooks/useSession";

export function useRouteTrack(id) {
    const { queries } = useApp();
    const { token } = readSession() || {};

    const [data, setData] = useState(null); // geojson
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;
        let mounted = true;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const geo = await queries.routes.track(id, token);
                if (mounted) setData(geo);
            } catch (e) {
                if (mounted) setError(e);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => (mounted = false);
    }, [id, queries.routes, token]);

    return { data, loading, error };
}
