import React from "react";
import { useAthleteProfile } from "../queries/useAthleteProfile";

export function VacHeaderBadge() {
    const { data: profile, loading } = useAthleteProfile();

    if (loading || !profile) return null;

    return (
        <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-3 py-1.5 rounded-full shadow-md shadow-indigo-100 border border-indigo-400/20">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-100">VAC</span>
            <span className="font-bold text-sm">{profile.total_vac_points}</span>
        </div>
    );
}
