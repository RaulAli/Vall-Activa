import { useEffect, useState } from "react";
import { getAthleteProfile } from "../../../services/athleteApi";

export function useAthleteProfile() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function reload() {
        setLoading(true);
        setError(null);
        try {
            const res = await getAthleteProfile();
            console.log("VAC Debug: Athlete Profile Response", res);
            setData(res); // si http ya devuelve json; si no, res.json()
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        reload();
    }, []);

    return { data, loading, error, reload };
}
