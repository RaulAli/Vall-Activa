export function buildAuthMutations(api) {
    return {
        login: (payload) => api.login(payload),
        registerAthlete: (payload) => api.registerAthlete(payload),
        registerBusiness: (payload) => api.registerBusiness(payload),
    };
}
