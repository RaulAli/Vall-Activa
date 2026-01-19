import { useEffect, useState } from "react";
import { useApp } from "../../../context/Provider";
import { readSession } from "../../auth/hooks/useSession";

export function useOffer(id) {
    const { queries } = useApp();
    const s = readSession();
    const token = s?.token;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;
        let alive = true;
        setLoading(true);
        setError(null);

        queries.offers.get(id, token)
            .then((item) => {
                if (alive) setData(item);
            })
            .catch((e) => {
                if (alive) setError(e);
            })
            .finally(() => {
                if (alive) setLoading(false);
            });

        return () => {
            alive = false;
        };
    }, [id, queries.offers, token]);

    return { data, loading, error };
}
