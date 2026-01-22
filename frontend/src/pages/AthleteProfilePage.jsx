import React from "react";
import { useAthleteProfile } from "../features/athlete/queries/useAthleteProfile";
import { AthleteProfileCard } from "../features/athlete/ui/AthleteProfileCard";

export default function AthleteProfilePage() {
    const { data, loading, error, reload } = useAthleteProfile();

    if (loading) return <div>Cargando perfil...</div>;
    if (error) return (
        <div>
            Error cargando perfil.
            <button onClick={reload}>Reintentar</button>
        </div>
    );

    return (
        <div style={{ maxWidth: 720, margin: "24px auto" }}>
            <AthleteProfileCard profile={data} />
        </div>
    );
}
