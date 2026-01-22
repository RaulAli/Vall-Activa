import React from "react";

export function AthleteProfileCard({ profile }) {
    return (
        <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
            <h3 style={{ margin: 0, marginBottom: 8 }}>Perfil del atleta</h3>

            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>VAC total</div>
                    <div style={{ fontSize: 28, fontWeight: 700 }}>
                        {profile.total_vac_points}
                    </div>
                </div>

                <div style={{ marginLeft: "auto", fontSize: 12 }}>
                    Estado:{" "}
                    <span style={{ fontWeight: 600 }}>
                        {profile.is_active ? "Activo" : "Inactivo"}
                    </span>
                </div>
            </div>
        </div>
    );
}
