export function buildAdminMutations(api) {
    return {
        approveBusiness: (userId, token) => api.approveBusiness(userId, token),
        rejectBusiness: (userId, token) => api.rejectBusiness(userId, token),
    };
}
