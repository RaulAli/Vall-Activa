export function buildBusinessesQueries(api) {
    return {
        list: (filters, token) => api.listBusinesses(filters, token),
        get: (id, token) => api.getBusiness(id, token),
    };
}
