import { Link } from "react-router-dom";
import { useApp } from "../../../context/Provider";

export default function BusinessesTable({ items }) {
    const { me, session, mutations } = useApp();
    const isAdmin = me?.role === "ADMIN";

    const handleAction = async (ownerId, action) => {
        if (!window.confirm(`¿Seguro que quieres ${action === "approve" ? "aprobar" : "rechazar"} este negocio?`)) return;
        try {
            if (action === "approve") {
                await mutations.admin.approveBusiness(ownerId, session.token);
            } else {
                await mutations.admin.rejectBusiness(ownerId, session.token);
            }
            window.location.reload(); // Simple way to refresh after action
        } catch (e) {
            alert("Error: " + e.message);
        }
    };

    if (!items?.length) return <p>No hay negocios.</p>;

    return (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
                <tr>
                    <th align="left">Logo</th>
                    <th align="left">Nombre</th>
                    <th align="left">Categoría</th>
                    <th align="left">Región</th>
                    <th align="left">Ciudad</th>
                    <th align="left">Estado</th>
                    {isAdmin && <th align="left">Acciones</th>}
                </tr>
            </thead>
            <tbody>
                {items.map((b) => (
                    <tr key={b.id} style={{ borderTop: "1px solid #eee" }}>
                        <td>
                            {b.logo_url ? (
                                <img src={b.logo_url} alt={b.name} style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
                            ) : (
                                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#eee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem" }}>
                                    🏢
                                </div>
                            )}
                        </td>
                        <td>
                            <Link to={`/businesses/${b.id}`}>{b.name}</Link>
                        </td>
                        <td>{b.category}</td>
                        <td>{b.region}</td>
                        <td>{b.city || "-"}</td>
                        <td>
                            <span style={{
                                padding: "4px 8px",
                                borderRadius: 4,
                                fontSize: "0.8rem",
                                background: b.status === "APPROVED" ? "#e6fffa" : b.status === "PENDING" ? "#fffaf0" : "#fff5f5",
                                color: b.status === "APPROVED" ? "#2c7a7b" : b.status === "PENDING" ? "#b7791f" : "#c53030",
                                fontWeight: "bold"
                            }}>
                                {b.status || "UNKNOWN"}
                            </span>
                        </td>
                        {isAdmin && (
                            <td style={{ display: "flex", gap: 8, padding: "8px 0" }}>
                                {b.status !== "APPROVED" && (
                                    <button
                                        onClick={() => handleAction(b.owner_id, "approve")}
                                        style={{ background: "#38a169", color: "white", border: "none", padding: "4px 8px", borderRadius: 4, cursor: "pointer", fontSize: "0.75rem" }}
                                    >
                                        Aprobar
                                    </button>
                                )}
                                {b.status !== "REJECTED" && (
                                    <button
                                        onClick={() => handleAction(b.owner_id, "reject")}
                                        style={{ background: "#e53e3e", color: "white", border: "none", padding: "4px 8px", borderRadius: 4, cursor: "pointer", fontSize: "0.75rem" }}
                                    >
                                        Rechazar
                                    </button>
                                )}
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
