import { useEffect, useMemo, useState } from "react";

const REQUIRED = ["name", "date", "region", "difficulty"];

export default function RouteForm({ initialValues, onSubmit, submitting, submitText }) {
    // These fields will be read-only if they were provided (e.g. from GPX)
    const autoFields = useMemo(() => {
        const fields = [];
        if (initialValues?.distance_km !== undefined && initialValues?.distance_km !== "") fields.push("distance_km");
        if (initialValues?.elevation_gain_m !== undefined && initialValues?.elevation_gain_m !== "") fields.push("elevation_gain_m");
        if (initialValues?.total_time_min !== undefined && initialValues?.total_time_min !== "") fields.push("total_time_min");
        if (initialValues?.start_lat !== undefined && initialValues?.start_lat !== "") fields.push("start_lat", "start_lng");
        if (initialValues?.end_lat !== undefined && initialValues?.end_lat !== "") fields.push("end_lat", "end_lng");
        if (initialValues?.is_circular !== undefined) fields.push("is_circular");
        if (initialValues?.date !== undefined && initialValues?.date !== "") fields.push("date");
        return fields;
    }, [initialValues]);

    const initial = useMemo(
        () => ({
            name: initialValues?.name ?? "",
            date: initialValues?.date ?? "",
            region: initialValues?.region ?? "",
            notes: initialValues?.notes ?? "",
            distance_km: initialValues?.distance_km ?? "",
            elevation_gain_m: initialValues?.elevation_gain_m ?? "",
            total_time_min: initialValues?.total_time_min ?? "",
            difficulty: initialValues?.difficulty ?? "3",
            start_lat: initialValues?.start_lat ?? "",
            start_lng: initialValues?.start_lng ?? "",
            end_lat: initialValues?.end_lat ?? "",
            end_lng: initialValues?.end_lng ?? "",
            is_circular: initialValues?.is_circular ?? false,
        }),
        [initialValues]
    );

    const [values, setValues] = useState(initial);
    const [touched, setTouched] = useState({});

    // Sync state if initialValues changes (important for auto-fill)
    useEffect(() => {
        setValues(initial);
    }, [initial]);

    const errors = {};
    for (const k of REQUIRED) {
        if (!String(values[k] ?? "").trim()) errors[k] = "Obligatorio";
    }

    const isValid = Object.keys(errors).length === 0;

    function setField(name, value) {
        if (autoFields.includes(name)) return;
        setValues((v) => ({ ...v, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        const touchAll = {};
        REQUIRED.forEach((k) => (touchAll[k] = true));
        setTouched((t) => ({ ...t, ...touchAll }));
        if (!isValid) return;

        onSubmit({
            ...values,
            distance_km: Number(values.distance_km),
            elevation_gain_m: Number(values.elevation_gain_m),
            total_time_min: Number(values.total_time_min),
            difficulty: Number(values.difficulty),
            start_lat: Number(values.start_lat),
            start_lng: Number(values.start_lng),
            end_lat: Number(values.end_lat),
            end_lng: Number(values.end_lng),
        });
    }

    const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium text-sm disabled:opacity-60 disabled:bg-slate-100 disabled:cursor-not-allowed";
    const labelClass = "block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-widest";
    const errorClass = "text-xs font-bold text-red-500 mt-1";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="md:col-span-2">
                    <label className={labelClass}>Nombre de la Ruta*</label>
                    <input
                        className={inputClass}
                        value={values.name}
                        onChange={(e) => setField("name", e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                        placeholder="Ej: Ascensión al Benicadell"
                    />
                    {touched.name && errors.name && <p className={errorClass}>{errors.name}</p>}
                </div>

                <div>
                    <label className={labelClass}>Fecha de Realización*</label>
                    <input
                        type="date"
                        className={inputClass}
                        value={values.date}
                        disabled={autoFields.includes("date")}
                        onChange={(e) => setField("date", e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, date: true }))}
                    />
                    {touched.date && errors.date && <p className={errorClass}>{errors.date}</p>}
                </div>

                <div>
                    <label className={labelClass}>Región / Zona*</label>
                    <input
                        className={inputClass}
                        value={values.region}
                        onChange={(e) => setField("region", e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, region: true }))}
                        placeholder="Ej: Vall d'Albaida"
                    />
                    {touched.region && errors.region && <p className={errorClass}>{errors.region}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Km</label>
                        <input
                            className={inputClass}
                            value={values.distance_km}
                            disabled={autoFields.includes("distance_km")}
                            onChange={(e) => setField("distance_km", e.target.value)}
                            placeholder="Automatizado"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Desnivel + (m)</label>
                        <input
                            className={inputClass}
                            value={values.elevation_gain_m}
                            disabled={autoFields.includes("elevation_gain_m")}
                            onChange={(e) => setField("elevation_gain_m", e.target.value)}
                            placeholder="Automatizado"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Minutos</label>
                        <input
                            className={inputClass}
                            value={values.total_time_min}
                            disabled={autoFields.includes("total_time_min")}
                            onChange={(e) => setField("total_time_min", e.target.value)}
                            placeholder="Automatizado"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Dificultad (1-5)*</label>
                        <select
                            className={inputClass}
                            value={values.difficulty}
                            onChange={(e) => setField("difficulty", e.target.value)}
                        >
                            <option value="1">1 - Muy Fácil</option>
                            <option value="2">2 - Fácil</option>
                            <option value="3">3 - Moderada</option>
                            <option value="4">4 - Difícil</option>
                            <option value="5">5 - Muy Difícil</option>
                        </select>
                    </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="space-y-4">
                        <label className={labelClass}>Punto de Inicio (Lat/Lng)</label>
                        <div className="flex gap-2">
                            <input
                                className={inputClass}
                                value={values.start_lat}
                                disabled={autoFields.includes("start_lat")}
                                onChange={(e) => setField("start_lat", e.target.value)}
                                placeholder="Lat"
                            />
                            <input
                                className={inputClass}
                                value={values.start_lng}
                                disabled={autoFields.includes("start_lng")}
                                onChange={(e) => setField("start_lng", e.target.value)}
                                placeholder="Lng"
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className={labelClass}>Punto Final (Lat/Lng)</label>
                        <div className="flex gap-2">
                            <input
                                className={inputClass}
                                value={values.end_lat}
                                disabled={autoFields.includes("end_lat")}
                                onChange={(e) => setField("end_lat", e.target.value)}
                                placeholder="Lat"
                            />
                            <input
                                className={inputClass}
                                value={values.end_lng}
                                disabled={autoFields.includes("end_lng")}
                                onChange={(e) => setField("end_lng", e.target.value)}
                                placeholder="Lng"
                            />
                        </div>
                    </div>
                    <div className="md:col-span-2 flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is_circular"
                            disabled={autoFields.includes("is_circular")}
                            className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
                            checked={values.is_circular}
                            onChange={(e) => setField("is_circular", e.target.checked)}
                        />
                        <label htmlFor="is_circular" className="text-sm font-bold text-slate-700 cursor-pointer">
                            Esta ruta es circular
                        </label>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <label className={labelClass}>Notas y Descripción</label>
                    <textarea
                        className={`${inputClass} min-h-[100px] resize-y`}
                        value={values.notes}
                        onChange={(e) => setField("notes", e.target.value)}
                        rows={3}
                        placeholder="Comparte detalles sobre el terreno, fuentes, puntos de interés..."
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={!isValid || submitting}
                className={`w-full py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 ${!isValid || submitting
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"
                    }`}
            >
                {submitting ? "Guardando..." : (submitText || "Crear Ruta")}
            </button>
        </form>
    );
}
