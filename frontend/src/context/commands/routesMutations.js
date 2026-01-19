export function buildRoutesMutations(api) {
    return {
        create: (payload, token) => api.createRoute(payload, token),
        update: (id, payload, token) => api.updateRoute(id, payload, token),
        remove: (id, token) => api.deleteRoute(id, token),
        uploadGpx: (id, file, token) => api.uploadRouteGpx(id, file, token),
    };
}
