export function buildOffersMutations(api) {
    return {
        create: (payload, token) => api.createOffer(payload, token),
        update: (id, payload, token) => api.updateOffer(id, payload, token),
        remove: (id, token) => api.deleteOffer(id, token),
        purchase: (id, token) => api.purchaseOffer(id, token),
    };
}
