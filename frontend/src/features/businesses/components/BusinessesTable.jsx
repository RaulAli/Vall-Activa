import { Link } from "react-router-dom";

export default function BusinessesTable({ items }) {
    if (!items?.length) return <p>No hay negocios.</p>;

    return (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
                <tr>
                    <th align="left">Nombre</th>
                    <th align="left">Categoría</th>
                    <th align="left">Región</th>
                    <th align="left">Ciudad</th>
                </tr>
            </thead>
            <tbody>
                {items.map((b) => (
                    <tr key={b.id} style={{ borderTop: "1px solid #eee" }}>
                        <td>
                            <Link to={`/businesses/${b.id}`}>{b.name}</Link>
                        </td>
                        <td>{b.category}</td>
                        <td>{b.region}</td>
                        <td>{b.city || "-"}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
