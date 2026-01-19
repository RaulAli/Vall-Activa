export function buildOffersQueries(api) {
    return {
        list: (filters, token) => api.listOffers(filters, token),
        get: (id, token) => api.getOffer(id, token),
    };
}
