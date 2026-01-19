export function buildRoutesQueries(api) {
    return {
        list: (filters, token) => api.listRoutes(filters, token),
        get: (id, token) => api.getRoute(id, token),
        track: (id, token) => api.getRouteTrack(id, token),
    };
}
