import { useEffect, useState } from "react";
import { getAthleteProfile } from "../../../services/athleteApi";
import { useApp } from "../../../context/Provider";

export function useAthleteProfile() {
    const { refreshTrigger } = useApp();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function reload() {
        setLoading(true);
        setError(null);
        try {
            const res = await getAthleteProfile();
            console.log("VAC Debug: Athlete Profile Response", res);
            setData(res);
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        reload();
    }, [refreshTrigger]);

    return { data, loading, error, reload };
}
