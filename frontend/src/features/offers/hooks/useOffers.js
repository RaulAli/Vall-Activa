import { useEffect, useState } from "react";
import { useApp } from "../../../context/Provider";
import { readSession } from "../../auth/hooks/useSession";

export function useOffers(filters) {
    const { queries } = useApp();
    const s = readSession();
    const token = s?.token;

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let alive = true;
        setLoading(true);
        setError(null);

        queries.offers.list(filters, token)
            .then((items) => {
                if (alive) setData(items || []);
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
    }, [JSON.stringify(filters || {}), queries.offers, token]);

    return { data, loading, error };
}
