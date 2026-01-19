export function buildBusinessesMutations(api) {
    return {
        create: (payload, token) => api.createBusiness(payload, token),
        update: (id, payload, token) => api.updateBusiness(id, payload, token),
        remove: (id, token) => api.deleteBusiness(id, token),
    };
}
